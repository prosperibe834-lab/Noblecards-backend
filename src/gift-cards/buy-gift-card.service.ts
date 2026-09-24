import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Decimal } from '@prisma/client-runtime-utils';
import { randomUUID } from 'node:crypto';
import { GiftCardPurchaseStatus, PaymentProvider } from '../generated/prisma';
import { BeneficiaryEncryptionService } from '../security/beneficiary-encryption.service';
import { PrismaService } from '../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import type { BuyGiftCardProvider } from './buy-gift-card-provider.interface';
import {
  BUY_GIFT_CARD_PROVIDER,
  BuyGiftCardCatalogFilters,
  BuyGiftCardCatalogProduct,
  BuyGiftCardPurchaseInput,
  BuyGiftCardProviderPurchase,
} from './buy-gift-card-provider.interface';

@Injectable()
export class BuyGiftCardService {
  constructor(
    @Inject(BUY_GIFT_CARD_PROVIDER) private readonly provider: BuyGiftCardProvider,
    private readonly prisma: PrismaService,
    private readonly wallets: WalletsService,
    private readonly encryption: BeneficiaryEncryptionService,
    private readonly config: ConfigService,
  ) {}

  async getCatalog(filters: BuyGiftCardCatalogFilters) {
    const products = await this.provider.getCatalog(filters);
    const normalizedCountry = filters.countryCode?.toUpperCase();
    const normalizedCurrency = filters.currency?.toUpperCase();
    const normalizedProduct = filters.productName?.trim().toLowerCase();
    return {
      provider: products[0]?.provider ?? 'BUY_PROVIDER',
      products: products.filter((product) =>
        (!normalizedCountry || product.countryCode?.toUpperCase() === normalizedCountry) &&
        (!normalizedCurrency || product.currency?.toUpperCase() === normalizedCurrency) &&
        (!normalizedProduct || product.productName.toLowerCase().includes(normalizedProduct) || product.brandName?.toLowerCase().includes(normalizedProduct)),
      ),
    };
  }

  async purchase(userId: string, input: { productId: string; amount: number; quantity: number; deliveryEmail?: string; idempotencyKey?: string }) {
    const idempotencyKey = input.idempotencyKey ?? `nc-buy-${randomUUID()}`;
    const existing = await (this.prisma as any).giftCardPurchase.findUnique({ where: { idempotencyKey } });
    if (existing) {
      if (existing.userId !== userId) throw new ConflictException('This idempotency key belongs to another user.');
      return this.toSafeResponse(existing);
    }

    const product = await this.getPurchasableProduct(input.productId, input.amount);
    const pricing = this.calculatePrice(product, input.amount, input.quantity);
    const user = await (this.prisma as any).user.findUnique({ where: { id: userId }, select: { email: true, firstName: true, lastName: true, displayName: true } });
    if (!user?.email) throw new NotFoundException('User email not found.');
    const deliveryEmail = input.deliveryEmail ?? user.email;
    const sender = user.displayName || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
    const wallet = await this.wallets.getOrCreateWallet(userId);
    await this.wallets.ensureBalance(wallet.id, pricing.currencyCode);
    const reference = `NC-BUY-${randomUUID()}`;
    const transactionId = randomUUID();
    let purchase;

    try {
      purchase = await (this.prisma as any).$transaction(async (tx: any) => {
        const transaction = await tx.transaction.create({
          data: {
            id: transactionId, userId, walletId: wallet.id, currencyCode: pricing.currencyCode,
            type: 'PURCHASE', amount: pricing.customerPrice, fee: pricing.fee, netAmount: pricing.customerPrice,
            status: 'PENDING', provider: PaymentProvider.TREMENDOUS, reference: `TX-${reference}`,
            metadata: { giftCardPurchaseReference: reference },
          },
        });
        await this.wallets.holdFunds({ userId, walletId: wallet.id, currencyCode: pricing.currencyCode, amount: pricing.customerPrice, transactionId: transaction.id, reference }, tx);
        return tx.giftCardPurchase.create({
          data: {
            reference, idempotencyKey, userId, walletId: wallet.id, transactionId: transaction.id,
            provider: PaymentProvider.TOPUPMATE, providerProductId: product.providerProductId,
            brandNameSnapshot: product.brandName, productNameSnapshot: product.productName,
            countryCode: product.countryCode ?? 'UNKNOWN', currencyCode: pricing.currencyCode,
            denominationType: product.denominationType, quantity: input.quantity, amount: new Decimal(String(input.amount)),
            providerAmount: pricing.providerAmount, fee: pricing.fee, customerPrice: pricing.customerPrice,
            status: GiftCardPurchaseStatus.PROCESSING, providerMetadata: this.sanitizeForStorage(product.providerMetadata),
            metadata: { deliveryEmail },
          },
        });
      });
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002') {
        const duplicate = await (this.prisma as any).giftCardPurchase.findUnique({ where: { idempotencyKey } });
        if (duplicate && duplicate.userId === userId) return this.toSafeResponse(duplicate);
      }
      throw error;
    }

    let providerResult: BuyGiftCardProviderPurchase;
    try {
      providerResult = await this.provider.purchase({ productId: product.providerProductId, amount: input.amount, currencyCode: pricing.currencyCode, email: deliveryEmail, sender, units: input.quantity, reference } satisfies BuyGiftCardPurchaseInput);
    } catch (error) {
      return this.handleProviderError(purchase, error);
    }
    const outcome = this.classifyProviderResult(providerResult);
    if (outcome === GiftCardPurchaseStatus.SUCCESSFUL) return this.persistProviderOutcome(purchase, providerResult, outcome, true);
    if (outcome === GiftCardPurchaseStatus.FAILED) return this.failPurchase(purchase, providerResult.providerMessage ?? 'Gift card provider rejected the purchase.');
    return this.persistProviderOutcome(purchase, providerResult, GiftCardPurchaseStatus.UNDER_REVIEW, false);
  }

  async getPurchase(userId: string, id: string) {
    const purchase = await (this.prisma as any).giftCardPurchase.findFirst({ where: { id, userId } });
    if (!purchase) throw new NotFoundException('Gift card purchase not found.');
    return this.toSafeResponse(purchase);
  }

  async retrieveVoucher(userId: string, id: string) {
    const purchase = await (this.prisma as any).giftCardPurchase.findFirst({ where: { id, userId } });
    if (!purchase) throw new NotFoundException('Gift card purchase not found.');
    if (purchase.status !== GiftCardPurchaseStatus.SUCCESSFUL) throw new ConflictException('Voucher is not available until the purchase is successful.');
    const providerResult = await this.provider.retrieveVoucher(purchase.reference);
    return this.toSafeResponse(await this.persistVoucher(purchase, providerResult));
  }

  private async getPurchasableProduct(productId: string, amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) throw new BadRequestException('Gift card amount must be greater than zero.');
    const products = await this.provider.getCatalog({});
    const product = products.find((item) => item.providerProductId === productId);
    if (!product) throw new NotFoundException('Gift card product is not available.');
    const denominations = product.denominations.map(Number).filter(Number.isFinite);
    const minimum = product.minimumAmount == null ? null : Number(product.minimumAmount);
    const maximum = product.maximumAmount == null ? null : Number(product.maximumAmount);
    const fixedMatch = denominations.length > 0 && denominations.some((value) => value === amount);
    const rangeMatch = (minimum == null || amount >= minimum) && (maximum == null || amount <= maximum);
    if (denominations.length > 0 ? !fixedMatch : !rangeMatch) throw new BadRequestException('Selected gift card denomination is not supported.');
    return product;
  }

  private calculatePrice(product: BuyGiftCardCatalogProduct, amount: number, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) throw new BadRequestException('Gift card quantity is invalid.');
    const metadata = product.providerMetadata;
    const senderCurrency = this.readString(metadata, ['senderCurrencyCode', 'sender_currency_code']) ?? product.currency ?? 'USD';
    const providerAmount = new Decimal(String(this.senderAmount(metadata, amount) * quantity)).toDecimalPlaces(2);
    const feePercent = Number(this.config.get<string>('BUY_GIFT_CARD_FEE_PERCENT') ?? this.config.get<string>('TOPUPMATE_NOBLECARDS_FEE_PERCENT') ?? 0);
    if (!Number.isFinite(feePercent) || feePercent < 0 || feePercent > 100) throw new BadRequestException('Buy gift card pricing configuration is invalid.');
    const fee = providerAmount.mul(feePercent).div(100).toDecimalPlaces(2);
    return { currencyCode: senderCurrency.toUpperCase(), providerAmount, fee, customerPrice: providerAmount.plus(fee).toDecimalPlaces(2) };
  }

  private senderAmount(metadata: Record<string, unknown>, amount: number) {
    const mapping = metadata.fixedRecipientToSenderDenominationsMap;
    if (mapping && typeof mapping === 'object' && !Array.isArray(mapping)) {
      const entry = Object.entries(mapping as Record<string, unknown>).find(([key]) => Number(key) === amount);
      if (entry) return Number(entry[1]);
    }
    const recipients = Array.isArray(metadata.fixedRecipientDenominations) ? metadata.fixedRecipientDenominations.map(Number) : [];
    const senders = Array.isArray(metadata.fixedSenderDenominations) ? metadata.fixedSenderDenominations.map(Number) : [];
    const index = recipients.findIndex((value) => value === amount);
    if (index >= 0 && Number.isFinite(senders[index])) return senders[index];
    const rate = Number(metadata.recipientCurrencyToSenderCurrencyExchangeRate);
    return Number.isFinite(rate) && rate > 0 ? amount * rate : amount;
  }

  private classifyProviderResult(result: BuyGiftCardProviderPurchase) {
    const status = result.providerStatus?.toLowerCase() ?? '';
    if (/(pending|processing|review|unknown)/.test(status)) return GiftCardPurchaseStatus.UNDER_REVIEW;
    if (/(failed|reject|error|cancel)/.test(status)) return GiftCardPurchaseStatus.FAILED;
    return GiftCardPurchaseStatus.SUCCESSFUL;
  }

  private async failPurchase(purchase: any, message: string) {
    const updated = await (this.prisma as any).$transaction(async (tx: any) => {
      await this.wallets.releaseHeldFunds({ userId: purchase.userId, walletId: purchase.walletId, currencyCode: purchase.currencyCode, amount: purchase.customerPrice, transactionId: purchase.transactionId, reference: purchase.reference }, tx);
      await tx.transaction.update({ where: { id: purchase.transactionId }, data: { status: 'FAILED', provider: PaymentProvider.TREMENDOUS } });
      return tx.giftCardPurchase.update({ where: { id: purchase.id }, data: { status: GiftCardPurchaseStatus.FAILED, providerMessage: message, errorMessage: message } });
    });
    return this.toSafeResponse(updated);
  }

  private async handleProviderError(purchase: any, error: unknown) {
    const response = typeof (error as { getResponse?: () => unknown })?.getResponse === 'function' ? (error as { getResponse: () => unknown }).getResponse() : null;
    const message = response && typeof response === 'object' && typeof (response as any).message === 'string' ? (response as any).message : error instanceof Error ? error.message : 'BUY_GIFT_CARD_PROVIDER_REQUEST_FAILED';
    const ambiguous = error instanceof RequestTimeoutException || message === 'TREMENDOUS_REQUEST_UNAVAILABLE';
    if (ambiguous) return this.persistProviderOutcome(purchase, { providerReference: null, providerStatus: 'unknown', providerMessage: 'Gift card provider response was not confirmed.', redeemId: null, voucherCode: null, redeemDetails: null, providerAmount: null, providerMetadata: {} }, GiftCardPurchaseStatus.UNDER_REVIEW, false);
    return this.failPurchase(purchase, message);
  }

  private async persistProviderOutcome(purchase: any, result: BuyGiftCardProviderPurchase, status: GiftCardPurchaseStatus, finalize: boolean) {
    const updated = await (this.prisma as any).$transaction(async (tx: any) => {
      if (finalize) await this.wallets.finalizeHeldFunds({ userId: purchase.userId, walletId: purchase.walletId, currencyCode: purchase.currencyCode, amount: purchase.customerPrice, transactionId: purchase.transactionId, reference: purchase.reference }, tx);
      await tx.transaction.update({ where: { id: purchase.transactionId }, data: { status: status === GiftCardPurchaseStatus.SUCCESSFUL ? 'SUCCESSFUL' : 'UNDER_REVIEW', providerReference: result.providerReference, provider: PaymentProvider.TREMENDOUS } });
      return tx.giftCardPurchase.update({ where: { id: purchase.id }, data: {
        status, providerReference: result.providerReference, providerStatus: result.providerStatus, providerMessage: result.providerMessage,
        redeemId: result.redeemId, providerAmount: result.providerAmount ? new Decimal(result.providerAmount) : undefined,
        voucherCiphertext: result.voucherCode ? this.encryption.encrypt({ code: result.voucherCode }) : undefined,
        redeemDetails: result.redeemDetails ? this.sanitizeForStorage(result.redeemDetails) : undefined,
        providerMetadata: this.sanitizeForStorage(result.providerMetadata), completedAt: status === GiftCardPurchaseStatus.SUCCESSFUL ? new Date() : null,
      } });
    });
    return this.toSafeResponse(updated);
  }

  private async persistVoucher(purchase: any, result: BuyGiftCardProviderPurchase) {
    return (this.prisma as any).giftCardPurchase.update({ where: { id: purchase.id }, data: {
      redeemId: result.redeemId ?? undefined,
      voucherCiphertext: result.voucherCode ? this.encryption.encrypt({ code: result.voucherCode }) : undefined,
      redeemDetails: result.redeemDetails ? this.sanitizeForStorage(result.redeemDetails) : undefined,
      providerMetadata: this.sanitizeForStorage(result.providerMetadata), providerMessage: result.providerMessage ?? undefined,
    } });
  }

  private toSafeResponse(purchase: any) {
    const voucher = purchase.status === GiftCardPurchaseStatus.SUCCESSFUL && typeof purchase.voucherCiphertext === 'string' ? this.encryption.decrypt<{ code?: string }>(purchase.voucherCiphertext) : null;
    return {
      id: purchase.id, reference: purchase.reference, status: purchase.status, provider: purchase.provider,
      providerProductId: purchase.providerProductId, providerReference: purchase.providerReference, redeemId: purchase.redeemId,
      brandName: purchase.brandNameSnapshot, productName: purchase.productNameSnapshot, countryCode: purchase.countryCode,
      currencyCode: purchase.currencyCode, amount: purchase.amount?.toString(), quantity: purchase.quantity,
      providerAmount: purchase.providerAmount?.toString() ?? null, fee: purchase.fee?.toString(), customerPrice: purchase.customerPrice?.toString(),
      providerStatus: purchase.providerStatus, providerMessage: purchase.providerMessage, voucherCode: voucher?.code ?? null,
      redeemDetails: purchase.redeemDetails, createdAt: purchase.createdAt, completedAt: purchase.completedAt,
    };
  }

  private sanitizeForStorage(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object') return {};
    if (Array.isArray(value)) return { items: value.map((item) => this.sanitizeForStorage(item)) };
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
      if (/code|voucher|token|secret|password|authorization/i.test(key)) return [];
      return [[key, child && typeof child === 'object' ? this.sanitizeForStorage(child) : child]];
    }));
  }

  private readString(source: Record<string, unknown>, keys: string[]) {
    for (const key of keys) if (typeof source[key] === 'string' && source[key]) return source[key] as string;
    return null;
  }

  assertPurchaseDisabled(): never {
    throw new BadRequestException('Topupmate purchase flow is not enabled yet.');
  }
}
