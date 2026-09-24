import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { randomUUID } from 'node:crypto';
import { BeneficiaryEncryptionService } from '../security/beneficiary-encryption.service';
import { PrismaService } from '../prisma/prisma.service';
import type { BuyGiftCardCatalogProduct, BuyGiftCardProviderPurchase } from './buy-gift-card-provider.interface';
import { TremendousProvider } from './tremendous.provider';
import { AdminGiftCardSandboxTestDto } from './gift-cards.dto';

@Injectable()
export class AdminGiftCardSandboxService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly provider: TremendousProvider,
    private readonly encryption: BeneficiaryEncryptionService,
  ) {}

  async purchase(adminUserId: string, input: AdminGiftCardSandboxTestDto) {
    const idempotencyKey = input.idempotencyKey ?? `admin-tremendous-test-${randomUUID()}`;
    const existing = await (this.prisma as any).adminGiftCardSandboxTest.findUnique({ where: { idempotencyKey } });
    if (existing) {
      if (existing.adminUserId !== adminUserId) throw new ConflictException('This idempotency key belongs to another admin.');
      return this.toSafeResponse(existing);
    }

    const catalog = await this.provider.getCatalog({ productId: input.productId, currency: input.currencyCode });
    const product = catalog.find((item) => item.providerProductId === input.productId && item.currency?.toUpperCase() === input.currencyCode.toUpperCase());
    if (!product) throw new NotFoundException('Tremendous sandbox product or currency is not available.');
    this.assertSupportedAmount(product, input.amount);

    const admin = await (this.prisma as any).user.findUnique({
      where: { id: adminUserId },
      select: { email: true, firstName: true, lastName: true, displayName: true },
    });
    if (!admin?.email) throw new NotFoundException('Admin email not found.');

    const reference = `NC-ADMIN-TREMENDOUS-${randomUUID()}`;
    const test = await (this.prisma as any).adminGiftCardSandboxTest.create({
      data: {
        adminUserId,
        idempotencyKey,
        reference,
        providerProductId: product.providerProductId,
        productName: product.productName,
        countryCode: product.countryCode,
        currencyCode: input.currencyCode.toUpperCase(),
        amount: new Decimal(String(input.amount)),
        quantity: input.quantity,
        recipientEmail: input.recipientEmail,
        status: 'PENDING',
        providerMetadata: this.sanitize(product.providerMetadata),
      },
    });

    const sender = admin.displayName || `${admin.firstName ?? ''} ${admin.lastName ?? ''}`.trim() || admin.email;
    let result: BuyGiftCardProviderPurchase;
    try {
      result = await this.provider.purchase({
        productId: product.providerProductId,
        amount: input.amount,
        currencyCode: input.currencyCode.toUpperCase(),
        email: input.recipientEmail,
        sender,
        units: input.quantity,
        reference,
      });
    } catch (error) {
      const underReview = error instanceof RequestTimeoutException || this.errorMessage(error) === 'TREMENDOUS_REQUEST_UNAVAILABLE';
      await (this.prisma as any).adminGiftCardSandboxTest.update({
        where: { id: test.id },
        data: { status: underReview ? 'UNDER_REVIEW' : 'FAILED', providerMessage: this.errorMessage(error) },
      });
      throw error;
    }

    const status = this.statusFor(result);
    const updated = await (this.prisma as any).adminGiftCardSandboxTest.update({
      where: { id: test.id },
      data: {
        status,
        providerReference: result.providerReference,
        providerStatus: result.providerStatus,
        providerMessage: result.providerMessage,
        redeemId: result.redeemId,
        voucherCiphertext: result.voucherCode ? this.encryption.encrypt({ code: result.voucherCode }) : undefined,
        redeemDetails: result.redeemDetails ? this.sanitize(result.redeemDetails) : undefined,
        providerMetadata: this.sanitize(result.providerMetadata),
        completedAt: status === 'SUCCESSFUL' ? new Date() : null,
      },
    });
    return this.toSafeResponse(updated);
  }

  private assertSupportedAmount(product: BuyGiftCardCatalogProduct, amount: number) {
    const denominations = product.denominations.map(Number).filter(Number.isFinite);
    const minimum = product.minimumAmount == null ? null : Number(product.minimumAmount);
    const maximum = product.maximumAmount == null ? null : Number(product.maximumAmount);
    const fixedMatch = denominations.some((value) => value === amount);
    const rangeMatch = (minimum == null || amount >= minimum) && (maximum == null || amount <= maximum);
    if (denominations.length ? !fixedMatch : !rangeMatch) {
      throw new BadRequestException('Selected Tremendous sandbox denomination is not supported.');
    }
  }

  private statusFor(result: BuyGiftCardProviderPurchase) {
    const status = result.providerStatus?.toLowerCase() ?? '';
    if (/(pending|processing|review|unknown)/.test(status)) return 'UNDER_REVIEW';
    if (/(failed|reject|error|cancel)/.test(status)) return 'FAILED';
    return 'SUCCESSFUL';
  }

  private errorMessage(error: unknown) {
    const response = typeof (error as { getResponse?: () => unknown })?.getResponse === 'function'
      ? (error as { getResponse: () => unknown }).getResponse()
      : null;
    if (response && typeof response === 'object' && typeof (response as any).message === 'string') return (response as any).message;
    return error instanceof Error ? error.message : 'TREMENDOUS_SANDBOX_TEST_FAILED';
  }

  private toSafeResponse(test: any) {
    return {
      id: test.id,
      reference: test.reference,
      status: test.status,
      provider: 'TREMENDOUS',
      providerProductId: test.providerProductId,
      productName: test.productName,
      countryCode: test.countryCode,
      currencyCode: test.currencyCode,
      amount: test.amount?.toString() ?? null,
      quantity: test.quantity,
      recipientEmail: test.recipientEmail,
      providerReference: test.providerReference,
      providerStatus: test.providerStatus,
      providerMessage: test.providerMessage,
      rewardStatus: test.providerStatus,
      redeemId: test.redeemId,
      redeemDetails: test.redeemDetails,
      createdAt: test.createdAt,
      completedAt: test.completedAt,
    };
  }

  private sanitize(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object') return {};
    if (Array.isArray(value)) return { items: value.slice(0, 10).map((item) => this.sanitize(item)) };
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
      if (/code|pin|token|secret|password|authorization/i.test(key)) return [];
      return [[key, child && typeof child === 'object' ? this.sanitize(child) : child]];
    }));
  }
}
