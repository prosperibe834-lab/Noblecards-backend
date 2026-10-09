import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Decimal } from '@prisma/client-runtime-utils';
import { randomUUID } from 'node:crypto';
import { GiftCardPurchaseStatus, PaymentProvider } from '../generated/prisma';
import { BeneficiaryEncryptionService } from '../security/beneficiary-encryption.service';
import { PrismaService } from '../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import type { BuyGiftCardProvider } from './buy-gift-card-provider.interface';
import { BuyGiftCardBaseRateService } from './buy-gift-card-base-rate.service';
import { BuyGiftCardRateService } from './buy-gift-card-rate.service';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { EmailService } from '../email/email.service';
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
    @Inject(BUY_GIFT_CARD_PROVIDER)
    private readonly provider: BuyGiftCardProvider,
    private readonly prisma: PrismaService,
    private readonly wallets: WalletsService,
    private readonly encryption: BeneficiaryEncryptionService,
    private readonly config: ConfigService,
    private readonly buyRates?: BuyGiftCardRateService,
    private readonly baseRates?: BuyGiftCardBaseRateService,
    private readonly exchangeRates?: ExchangeRatesService,
    private readonly email?: EmailService,
  ) {}

  async getCatalog(filters: BuyGiftCardCatalogFilters) {
    const products = await this.provider.getCatalog(filters);
    const normalizedCountry = filters.countryCode?.toUpperCase();
    const normalizedCurrency = filters.currency?.toUpperCase();
    const normalizedProduct = filters.productName?.trim().toLowerCase();
    const filteredProducts = products.filter(
      (product) =>
        (!normalizedCountry ||
          product.countryCode?.toUpperCase() === normalizedCountry) &&
        (!normalizedCurrency ||
          product.currency?.toUpperCase() === normalizedCurrency) &&
        (!normalizedProduct ||
          product.productName.toLowerCase().includes(normalizedProduct) ||
          product.brandName?.toLowerCase().includes(normalizedProduct)),
    );
    const quotedProducts = await Promise.all(
      filteredProducts.map((product) => this.withQuote(product)),
    );
    return {
      provider: products[0]?.provider ?? 'BUY_PROVIDER',
      products: quotedProducts.map((product) => ({
        ...product,
        supportedCountries: quotedProducts
          .filter(
            (candidate) =>
              candidate.providerProductId === product.providerProductId,
          )
          .map((candidate) => ({
            countryCode: candidate.countryCode,
            country: candidate.country,
            currency: candidate.currency,
            denominations: candidate.denominations,
            minimumAmount: candidate.minimumAmount,
            maximumAmount: candidate.maximumAmount,
            customerRatePercent: candidate.customerRatePercent,
          })),
      })),
    };
  }

  async purchase(
    userId: string,
    input: {
      productId: string;
      amount: number;
      quantity: number;
      countryCode?: string;
      currencyCode?: string;
      deliveryEmail?: string;
      idempotencyKey?: string;
    },
  ) {
    const idempotencyKey = input.idempotencyKey ?? `nc-buy-${randomUUID()}`;
    const existing = await (this.prisma as any).giftCardPurchase.findUnique({
      where: { idempotencyKey },
    });
    if (existing) {
      if (existing.userId !== userId)
        throw new ConflictException(
          'This idempotency key belongs to another user.',
        );
      return this.toSafeResponse(existing);
    }

    const product = await this.getPurchasableProduct(
      input.productId,
      input.amount,
      input.countryCode,
      input.currencyCode,
    );
    const pricing = await this.calculatePrice(
      product,
      input.amount,
      input.quantity,
    );
    const user = await (this.prisma as any).user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
      },
    });
    if (!user?.email) throw new NotFoundException('User email not found.');
    const deliveryEmail = input.deliveryEmail ?? user.email;
    const sender =
      user.displayName ||
      `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
      user.email;
    const wallet = await this.wallets.getOrCreateWallet(userId);
    await this.wallets.ensureBalance(wallet.id, pricing.currencyCode);
    const reference = `NC-BUY-${randomUUID()}`;
    const transactionId = randomUUID();
    let purchase;

    try {
      purchase = await (this.prisma as any).$transaction(async (tx: any) => {
        const transaction = await tx.transaction.create({
          data: {
            id: transactionId,
            userId,
            walletId: wallet.id,
            currencyCode: pricing.currencyCode,
            type: 'PURCHASE',
            amount: pricing.customerPrice,
            fee: pricing.fee,
            netAmount: pricing.customerPrice,
            status: 'PENDING',
            provider: PaymentProvider.TREMENDOUS,
            reference: `TX-${reference}`,
            metadata: { giftCardPurchaseReference: reference },
          },
        });
        await this.wallets.holdFunds(
          {
            userId,
            walletId: wallet.id,
            currencyCode: pricing.currencyCode,
            amount: pricing.customerPrice,
            transactionId: transaction.id,
            reference,
          },
          tx,
        );
        return tx.giftCardPurchase.create({
          data: {
            reference,
            idempotencyKey,
            userId,
            walletId: wallet.id,
            transactionId: transaction.id,
            provider: PaymentProvider.TREMENDOUS,
            providerProductId: product.providerProductId,
            brandNameSnapshot: product.brandName,
            productNameSnapshot: product.productName,
            countryCode: product.countryCode ?? 'UNKNOWN',
            currencyCode: pricing.currencyCode,
            denominationType: product.denominationType,
            quantity: input.quantity,
            amount: new Decimal(String(input.amount)),
            providerAmount: pricing.providerAmount,
            fee: pricing.fee,
            baseBuyRatePercent: pricing.baseBuyRatePercent,
            buyAdjustmentPercent: pricing.buyAdjustmentPercent,
            buyAdjustmentAmount: pricing.buyAdjustmentAmount,
            customerRatePercent: pricing.customerRatePercent,
            customerPrice: pricing.customerPrice,
            status: GiftCardPurchaseStatus.PROCESSING,
            providerMetadata: this.sanitizeForStorage(product.providerMetadata),
            metadata: {
              deliveryEmail,
              cardCurrencyCode: product.currency ?? 'USD',
              ...(typeof product.providerMetadata.logoUrl === 'string'
                ? { brandLogoUrl: product.providerMetadata.logoUrl }
                : {}),
            },
          },
        });
      });
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002') {
        const duplicate = await (
          this.prisma as any
        ).giftCardPurchase.findUnique({ where: { idempotencyKey } });
        if (duplicate && duplicate.userId === userId)
          return this.toSafeResponse(duplicate);
      }
      throw error;
    }

    let providerResult: BuyGiftCardProviderPurchase;
    try {
      providerResult = await this.provider.purchase({
        productId: product.providerProductId,
        amount: input.amount,
        currencyCode: product.currency ?? 'USD',
        email: deliveryEmail,
        sender,
        units: input.quantity,
        reference,
      } satisfies BuyGiftCardPurchaseInput);
    } catch (error) {
      return this.handleProviderError(purchase, error);
    }
    const outcome = this.classifyProviderResult(providerResult);
    if (outcome === GiftCardPurchaseStatus.SUCCESSFUL)
      return this.persistProviderOutcome(
        purchase,
        providerResult,
        outcome,
        true,
      );
    if (outcome === GiftCardPurchaseStatus.FAILED)
      return this.failPurchase(
        purchase,
        providerResult.providerMessage ??
          'Gift card provider rejected the purchase.',
      );
    return this.persistProviderOutcome(
      purchase,
      providerResult,
      GiftCardPurchaseStatus.UNDER_REVIEW,
      false,
    );
  }

  async getPurchase(userId: string, id: string) {
    const purchase = await (this.prisma as any).giftCardPurchase.findFirst({
      where: { id, userId },
    });
    if (!purchase) throw new NotFoundException('Gift card purchase not found.');
    return this.toSafeResponse(purchase, true);
  }

  async quote(input: {
    productId: string;
    countryCode: string;
    currencyCode: string;
    amount: number;
    quantity: number;
  }) {
    const product = await this.getPurchasableProduct(
      input.productId,
      input.amount,
      input.countryCode,
      input.currencyCode,
    );
    const pricing = await this.calculatePrice(
      product,
      input.amount,
      input.quantity,
    );
    return {
      productId: product.providerProductId,
      countryCode: product.countryCode,
      currencyCode: product.currency,
      faceValue: input.amount,
      quantity: input.quantity,
      fxRate: pricing.fxRate.toString(),
      usdFaceValue: pricing.usdFaceValue.toString(),
      providerAmount: pricing.providerAmount.toString(),
      baseBuyRatePercent: pricing.baseBuyRatePercent?.toString() ?? null,
      buyAdjustmentPercent: pricing.buyAdjustmentPercent.toString(),
      customerRatePercent: pricing.customerRatePercent?.toString() ?? null,
      fee: pricing.fee.toString(),
      customerPrice: pricing.customerPrice.toString(),
      walletCurrencyCode: pricing.currencyCode,
    };
  }

  async getOrders(userId: string) {
    const purchases = await (this.prisma as any).giftCardPurchase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return purchases.map((purchase: any) => this.toSafeResponse(purchase));
  }

  async retrieveVoucher(userId: string, id: string) {
    const purchase = await (this.prisma as any).giftCardPurchase.findFirst({
      where: { id, userId },
    });
    if (!purchase) throw new NotFoundException('Gift card purchase not found.');
    if (purchase.status !== GiftCardPurchaseStatus.SUCCESSFUL)
      throw new ConflictException(
        'Voucher is not available until the purchase is successful.',
      );
    const providerResult = await this.provider.retrieveVoucher(
      purchase.reference,
    );
    return this.toSafeResponse(
      await this.persistVoucher(purchase, providerResult),
    );
  }

  async getRedemptionLink(userId: string, id: string) {
    const purchase = await (this.prisma as any).giftCardPurchase.findFirst({
      where: { id, userId },
    });
    if (!purchase) throw new NotFoundException('Gift card purchase not found.');
    if (purchase.status !== GiftCardPurchaseStatus.SUCCESSFUL) {
      throw new ConflictException(
        'The gift card is not available to view until the purchase is successful.',
      );
    }
    const delivery =
      this.isRecord(purchase.redeemDetails) &&
      this.isRecord(purchase.redeemDetails.delivery)
        ? this.readString(purchase.redeemDetails.delivery, [
            'method',
          ])?.toUpperCase()
        : undefined;
    if (delivery !== 'LINK') {
      throw new ConflictException(
        'This gift card uses the previous delivery method and cannot be opened in-app.',
      );
    }
    if (!purchase.redeemId)
      throw new ConflictException(
        'The gift-card reward is not available to view yet.',
      );
    if (!this.provider.generateRedemptionLink) {
      throw new ServiceUnavailableException(
        'Secure gift-card viewing is unavailable right now.',
      );
    }
    try {
      return {
        url: await this.provider.generateRedemptionLink(purchase.redeemId),
      };
    } catch {
      throw new ServiceUnavailableException(
        'Unable to open this gift card right now. Please try again.',
      );
    }
  }

  private async getPurchasableProduct(
    productId: string,
    amount: number,
    countryCode?: string,
    currencyCode?: string,
  ) {
    if (!Number.isFinite(amount) || amount <= 0)
      throw new BadRequestException(
        'Gift card amount must be greater than zero.',
      );
    const products = await this.provider.getCatalog({
      productId,
      ...(countryCode ? { countryCode } : {}),
      ...(currencyCode ? { currency: currencyCode } : {}),
    });
    const candidates = products.filter(
      (item) => item.providerProductId === productId,
    );
    const product =
      countryCode || currencyCode
        ? candidates.find(
            (item) =>
              (!countryCode ||
                item.countryCode?.toUpperCase() ===
                  countryCode.toUpperCase()) &&
              (!currencyCode ||
                item.currency?.toUpperCase() === currencyCode.toUpperCase()),
          )
        : candidates.length === 1
          ? candidates[0]
          : undefined;
    if (!product)
      throw new NotFoundException('Gift card product is not available.');
    const denominations = product.denominations
      .map(Number)
      .filter(Number.isFinite);
    const minimum =
      product.minimumAmount == null ? null : Number(product.minimumAmount);
    const maximum =
      product.maximumAmount == null ? null : Number(product.maximumAmount);
    const fixedMatch =
      denominations.length > 0 &&
      denominations.some((value) => value === amount);
    const rangeMatch =
      (minimum == null || amount >= minimum) &&
      (maximum == null || amount <= maximum);
    if (denominations.length > 0 ? !fixedMatch : !rangeMatch)
      throw new BadRequestException(
        'Selected gift card denomination is not supported.',
      );
    return product;
  }

  private async withQuote(product: BuyGiftCardCatalogProduct) {
    if (
      !Array.isArray(product.denominations) ||
      !product.providerMetadata ||
      typeof product.providerMetadata !== 'object'
    ) {
      return {
        ...product,
        productId: product.providerProductId,
        baseBuyRatePercent: null,
        buyMarkupPercent: '0',
        customerRatePercent: null,
        providerBasePrice: null,
        providerAmount: null,
        customerPrice: null,
        walletCurrencyCode: 'USD',
      };
    }
    const amount = this.defaultAmount(product);
    if (amount == null) {
      return {
        ...product,
        productId: product.providerProductId,
        baseBuyRatePercent: null,
        buyMarkupPercent: '0',
        customerRatePercent: null,
        providerAmount: null,
        customerPrice: null,
        walletCurrencyCode: 'USD',
      };
    }
    const pricing = await this.calculatePricing(product, amount, 1, false);
    return {
      ...product,
      productId: product.providerProductId,
      walletCurrencyCode: pricing.currencyCode,
      baseBuyRatePercent: pricing.baseBuyRatePercent?.toString() ?? null,
      buyMarkupPercent: pricing.buyAdjustmentPercent.toString(),
      customerRatePercent: pricing.customerRatePercent?.toString() ?? null,
      providerBasePrice: pricing.providerBasePrice?.toString() ?? null,
      providerAmount: pricing.providerAmount.toString(),
      customerPrice: pricing.customerPrice?.toString() ?? null,
    };
  }

  private async calculatePrice(
    product: BuyGiftCardCatalogProduct,
    amount: number,
    quantity: number,
  ) {
    return this.calculatePricing(product, amount, quantity, true);
  }

  private async calculatePricing(
    product: BuyGiftCardCatalogProduct,
    amount: number,
    quantity: number,
    requireBaseRate: boolean,
  ) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20)
      throw new BadRequestException('Gift card quantity is invalid.');
    let fxRates;
    try {
      if (!this.exchangeRates)
        throw new Error('Exchange-rate service is unavailable.');
      fxRates = await this.exchangeRates.getRates();
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new ServiceUnavailableException(
        `Buy gift-card pricing is unavailable because USD exchange rates could not be loaded: ${detail}`,
      );
    }
    const cardCurrency = product.currency?.toUpperCase() ?? 'USD';
    const fxRate = cardCurrency === 'USD' ? 1 : fxRates.rates[cardCurrency];
    if (!Number.isFinite(fxRate) || fxRate <= 0) {
      throw new ServiceUnavailableException(
        `Buy gift-card pricing is unavailable because no USD exchange rate exists for ${cardCurrency}.`,
      );
    }
    const usdFaceValue = new Decimal(String(amount / fxRate)).toDecimalPlaces(
      2,
    );
    const providerAmount = usdFaceValue.mul(quantity).toDecimalPlaces(2);
    const feePercent = Number(
      this.config.get<string>('BUY_GIFT_CARD_FEE_PERCENT') ??
        this.config.get<string>('TOPUPMATE_NOBLECARDS_FEE_PERCENT') ??
        0,
    );
    if (!Number.isFinite(feePercent) || feePercent < 0 || feePercent > 100)
      throw new BadRequestException(
        'Buy gift card pricing configuration is invalid.',
      );
    const fee = providerAmount.mul(feePercent).div(100).toDecimalPlaces(2);
    const baseAdjustment = this.baseRates
      ? await this.baseRates.resolve(product, amount)
      : null;
    if (requireBaseRate && this.baseRates && !baseAdjustment) {
      throw new BadRequestException(
        'Buy Base Rate is not configured for this product.',
      );
    }
    const baseBuyRatePercent = baseAdjustment?.ratePercent ?? null;
    const adjustment = this.buyRates
      ? await this.buyRates.resolve(product, amount)
      : null;
    const buyAdjustmentPercent =
      adjustment?.adjustmentPercent ?? new Decimal('0');
    const customerRatePercent =
      baseBuyRatePercent?.plus(buyAdjustmentPercent) ?? null;
    const providerBasePrice =
      baseBuyRatePercent == null
        ? null
        : providerAmount.mul(baseBuyRatePercent).div(100).toDecimalPlaces(2);
    const buyAdjustmentAmount = providerAmount
      .mul(buyAdjustmentPercent)
      .div(100)
      .toDecimalPlaces(2);
    const rateAmount =
      providerBasePrice == null
        ? providerAmount.plus(buyAdjustmentAmount)
        : providerBasePrice.plus(buyAdjustmentAmount);
    return {
      currencyCode: 'USD',
      fxRate: new Decimal(String(fxRate)),
      usdFaceValue,
      providerAmount,
      fee,
      baseBuyRatePercent,
      providerBasePrice,
      buyAdjustmentPercent,
      buyAdjustmentAmount,
      customerRatePercent,
      customerPrice: rateAmount.plus(fee).toDecimalPlaces(2),
    };
  }

  private defaultAmount(product: BuyGiftCardCatalogProduct) {
    const denomination = product.denominations
      .map(Number)
      .find(Number.isFinite);
    if (denomination != null) return denomination;
    const minimum =
      product.minimumAmount == null ? null : Number(product.minimumAmount);
    return minimum != null && Number.isFinite(minimum) ? minimum : null;
  }

  private classifyProviderResult(result: BuyGiftCardProviderPurchase) {
    const status = result.providerStatus?.toLowerCase() ?? '';
    if (/(pending|processing|review|unknown)/.test(status))
      return GiftCardPurchaseStatus.UNDER_REVIEW;
    if (/(failed|reject|error|cancel)/.test(status))
      return GiftCardPurchaseStatus.FAILED;
    return GiftCardPurchaseStatus.SUCCESSFUL;
  }

  private async failPurchase(purchase: any, message: string) {
    const updated = await (this.prisma as any).$transaction(async (tx: any) => {
      await this.wallets.releaseHeldFunds(
        {
          userId: purchase.userId,
          walletId: purchase.walletId,
          currencyCode: purchase.currencyCode,
          amount: purchase.customerPrice,
          transactionId: purchase.transactionId,
          reference: purchase.reference,
        },
        tx,
      );
      await tx.transaction.update({
        where: { id: purchase.transactionId },
        data: { status: 'FAILED', provider: PaymentProvider.TREMENDOUS },
      });
      return tx.giftCardPurchase.update({
        where: { id: purchase.id },
        data: {
          status: GiftCardPurchaseStatus.FAILED,
          providerMessage: message,
          errorMessage: message,
        },
      });
    });
    return this.toSafeResponse(updated);
  }

  private async handleProviderError(purchase: any, error: unknown) {
    const response =
      typeof (error as { getResponse?: () => unknown })?.getResponse ===
      'function'
        ? (error as { getResponse: () => unknown }).getResponse()
        : null;
    const message =
      response &&
      typeof response === 'object' &&
      typeof (response as any).message === 'string'
        ? (response as any).message
        : error instanceof Error
          ? error.message
          : 'BUY_GIFT_CARD_PROVIDER_REQUEST_FAILED';
    const ambiguous =
      error instanceof RequestTimeoutException ||
      message === 'TREMENDOUS_REQUEST_UNAVAILABLE';
    if (ambiguous)
      return this.persistProviderOutcome(
        purchase,
        {
          providerReference: null,
          providerStatus: 'unknown',
          providerMessage: 'Gift card provider response was not confirmed.',
          redeemId: null,
          voucherCode: null,
          redeemDetails: null,
          providerAmount: null,
          providerMetadata: {},
        },
        GiftCardPurchaseStatus.UNDER_REVIEW,
        false,
      );
    return this.failPurchase(purchase, message);
  }

  private async persistProviderOutcome(
    purchase: any,
    result: BuyGiftCardProviderPurchase,
    status: GiftCardPurchaseStatus,
    finalize: boolean,
  ) {
    const updated = await (this.prisma as any).$transaction(async (tx: any) => {
      if (finalize)
        await this.wallets.finalizeHeldFunds(
          {
            userId: purchase.userId,
            walletId: purchase.walletId,
            currencyCode: purchase.currencyCode,
            amount: purchase.customerPrice,
            transactionId: purchase.transactionId,
            reference: purchase.reference,
          },
          tx,
        );
      await tx.transaction.update({
        where: { id: purchase.transactionId },
        data: {
          status:
            status === GiftCardPurchaseStatus.SUCCESSFUL
              ? 'SUCCESSFUL'
              : 'UNDER_REVIEW',
          providerReference: result.providerReference,
          provider: PaymentProvider.TREMENDOUS,
        },
      });
      return tx.giftCardPurchase.update({
        where: { id: purchase.id },
        data: {
          status,
          providerReference: result.providerReference,
          providerStatus: result.providerStatus,
          providerMessage: result.providerMessage,
          redeemId: result.redeemId,
          providerAmount: result.providerAmount
            ? new Decimal(result.providerAmount)
            : undefined,
          voucherCiphertext: result.voucherCode
            ? this.encryption.encrypt({ code: result.voucherCode })
            : undefined,
          redeemDetails: result.redeemDetails
            ? this.sanitizeForStorage(result.redeemDetails)
            : undefined,
          providerMetadata: this.sanitizeForStorage(result.providerMetadata),
          completedAt:
            status === GiftCardPurchaseStatus.SUCCESSFUL ? new Date() : null,
        },
      });
    });
    if (status === GiftCardPurchaseStatus.SUCCESSFUL)
      await this.sendPurchaseSuccessEmailOnce(updated);
    return this.toSafeResponse(updated);
  }

  private async persistVoucher(
    purchase: any,
    result: BuyGiftCardProviderPurchase,
  ) {
    return (this.prisma as any).giftCardPurchase.update({
      where: { id: purchase.id },
      data: {
        redeemId: result.redeemId ?? undefined,
        voucherCiphertext: result.voucherCode
          ? this.encryption.encrypt({ code: result.voucherCode })
          : undefined,
        redeemDetails: result.redeemDetails
          ? this.sanitizeForStorage(result.redeemDetails)
          : undefined,
        providerMetadata: this.sanitizeForStorage(result.providerMetadata),
        providerMessage: result.providerMessage ?? undefined,
      },
    });
  }

  private toSafeResponse(purchase: any, includeGiftCardSecrets = false) {
    const voucher =
      includeGiftCardSecrets &&
      purchase.status === GiftCardPurchaseStatus.SUCCESSFUL &&
      typeof purchase.voucherCiphertext === 'string'
        ? (() => {
            try {
              return this.encryption.decrypt<{ code?: string }>(
                purchase.voucherCiphertext,
              );
            } catch {
              return null;
            }
          })()
        : null;
    const fallbackCode = includeGiftCardSecrets
      ? (this.readNestedString(purchase.redeemDetails, [
          'code',
          'voucherCode',
          'redemptionCode',
          'giftCardCode',
          'cardCode',
        ]) ??
        this.readNestedString(purchase.providerMetadata, [
          'code',
          'voucherCode',
          'redemptionCode',
          'giftCardCode',
          'cardCode',
        ]))
      : null;
    return {
      id: purchase.id,
      reference: purchase.reference,
      status: purchase.status,
      provider: purchase.provider,
      providerProductId: purchase.providerProductId,
      providerReference: purchase.providerReference,
      redeemId: purchase.redeemId,
      brandName: purchase.brandNameSnapshot,
      productName: purchase.productNameSnapshot,
      countryCode: purchase.countryCode,
      cardCurrencyCode:
        purchase.metadata?.cardCurrencyCode ?? purchase.currencyCode,
      currencyCode: purchase.currencyCode,
      amount: purchase.amount?.toString(),
      quantity: purchase.quantity,
      providerAmount: purchase.providerAmount?.toString() ?? null,
      fee: purchase.fee?.toString(),
      baseBuyRatePercent: purchase.baseBuyRatePercent?.toString() ?? '0',
      buyAdjustmentPercent: purchase.buyAdjustmentPercent?.toString() ?? '0',
      buyAdjustmentAmount: purchase.buyAdjustmentAmount?.toString() ?? '0',
      customerRatePercent: purchase.customerRatePercent?.toString() ?? '0',
      customerPrice: purchase.customerPrice?.toString(),
      providerStatus: purchase.providerStatus,
      providerMessage: purchase.providerMessage,
      brandLogoUrl: purchase.metadata?.brandLogoUrl ?? null,
      voucherCode: includeGiftCardSecrets
        ? (voucher?.code ?? fallbackCode ?? null)
        : null,
      redeemDetails: this.sanitizeForResponse(
        purchase.redeemDetails,
        includeGiftCardSecrets,
      ),
      createdAt: purchase.createdAt,
      completedAt: purchase.completedAt,
    };
  }

  private sanitizeForResponse(
    value: unknown,
    includePin: boolean,
  ): Record<string, unknown> {
    if (!value || typeof value !== 'object') return {};
    if (Array.isArray(value))
      return {
        items: value.map((item) => this.sanitizeForResponse(item, includePin)),
      };
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).flatMap(
        ([key, child]) => {
          if (/pin/i.test(key) && !includePin) return [];
          if (
            /code|voucher|token|secret|password|authorization|link|url/i.test(
              key,
            )
          )
            return [];
          return [
            [
              key,
              child && typeof child === 'object'
                ? this.sanitizeForResponse(child, includePin)
                : child,
            ],
          ];
        },
      ),
    );
  }

  private sanitizeForStorage(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object') return {};
    if (Array.isArray(value))
      return { items: value.map((item) => this.sanitizeForStorage(item)) };
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).flatMap(
        ([key, child]) => {
          if (/pin/i.test(key))
            return [
              [
                key,
                child && typeof child === 'object'
                  ? this.sanitizeForStorage(child)
                  : child,
              ],
            ];
          if (
            /code|voucher|token|secret|password|authorization|link|url/i.test(
              key,
            )
          )
            return [];
          return [
            [
              key,
              child && typeof child === 'object'
                ? this.sanitizeForStorage(child)
                : child,
            ],
          ];
        },
      ),
    );
  }

  private async sendPurchaseSuccessEmailOnce(purchase: any) {
    if (!this.email) return;
    try {
      const claim = await (this.prisma as any).giftCardPurchase.updateMany({
        where: {
          id: purchase.id,
          successEmailAttemptedAt: null,
          status: GiftCardPurchaseStatus.SUCCESSFUL,
        },
        data: { successEmailAttemptedAt: new Date() },
      });
      if (claim.count !== 1) return;
      const user = await (this.prisma as any).user.findUnique({
        where: { id: purchase.userId },
        select: { email: true, firstName: true },
      });
      if (!user?.email) return;
      await this.email.sendGiftCardPurchaseSuccessEmail(user.email, {
        firstName: user.firstName,
        brand:
          purchase.brandNameSnapshot ??
          purchase.productNameSnapshot ??
          'Gift Card',
        amount: purchase.amount?.toString() ?? '0',
        currency: purchase.metadata?.cardCurrencyCode ?? purchase.currencyCode,
        reference: purchase.reference,
        purchasedAt: purchase.completedAt ?? new Date(),
      });
    } catch {
      // Email failure must not undo a completed wallet/provider purchase.
    }
  }

  private readNestedString(value: unknown, keys: string[]): string | null {
    if (!value || typeof value !== 'object') return null;
    if (Array.isArray(value)) {
      for (const item of value) {
        const nested = this.readNestedString(item, keys);
        if (nested) return nested;
      }
      return null;
    }
    const source = value as Record<string, unknown>;
    for (const key of keys) {
      const current = source[key];
      if (typeof current === 'string' && current.trim()) return current.trim();
    }
    for (const child of Object.values(source)) {
      const nested = this.readNestedString(child, keys);
      if (nested) return nested;
    }
    return null;
  }

  private readString(source: Record<string, unknown>, keys: string[]) {
    for (const key of keys)
      if (typeof source[key] === 'string' && source[key])
        return source[key] as string;
    return null;
  }

  private isRecord(value: unknown): value is Record<string, any> {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
  }

  assertPurchaseDisabled(): never {
    throw new BadRequestException(
      'Topupmate purchase flow is not enabled yet.',
    );
  }
}
