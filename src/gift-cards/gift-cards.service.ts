import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { randomUUID } from 'node:crypto';
import { GiftCardSaleStatus, PaymentProvider } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { writeSecurityAuditEvent } from '../security-audit/security-audit.utils';
import { BulkGiftCardRateAdjustmentDto, CreateGiftCardRateAdjustmentDto, QuoteGiftCardSaleDto, SubmitGiftCardSaleDto, UpdateGiftCardRateAdjustmentDto } from './gift-cards.dto';
import { SogoClient, SogoProviderResponse } from './sogo.client';
import { selectSogoRate } from './sogo-rate-selector';

@Injectable()
export class GiftCardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sogo: SogoClient,
  ) {}

  async getSellCatalog() {
    const catalogResponse = await this.sogo.getSellCatalog();
    if (!Array.isArray(catalogResponse?.data)) {
      return catalogResponse;
    }

    const enrichedCatalog = catalogResponse.data.map((product: any) => {
      if (!product || typeof product !== 'object') return product;
      const cardTypes = Array.isArray(product?.card_types) ? [...product.card_types] : [];
      if (['amazon'].includes(product?.slug?.toLowerCase()) && !cardTypes.includes('ecode')) {
        cardTypes.push('ecode');
      }
      return {
        ...product,
        card_types: cardTypes,
      };
    });

    return {
      ...catalogResponse,
      data: enrichedCatalog,
    };
  }

  getSellRates() {
    return this.sogo.getSellRates();
  }

  async getAdminCatalog() {
    const [catalogResponse, ratesResponse, adjustments] = await Promise.all([
      this.sogo.getSellCatalog(),
      this.sogo.getSellRates(),
      (this.prisma as any).giftCardSellRateAdjustment.findMany({ where: { isActive: true } }),
    ]);
    const catalog = Array.isArray(catalogResponse.data) ? catalogResponse.data : [];
    const rates = Array.isArray(ratesResponse.data) ? ratesResponse.data : [];
    const rows: any[] = [];
    const projectionWarnings: Array<Record<string, unknown>> = [];

    for (const product of catalog) {
      for (const country of product.countries ?? []) {
        for (const cardType of product.card_types ?? []) {
          const subTypes = cardType === 'physical' && (product.sub_types ?? []).length
            ? product.sub_types
            : [undefined];
          for (const receiptType of subTypes) {
            const payoutCurrencies = this.getPayoutCurrencies(rates, product.slug, country.currency, cardType, receiptType);
            for (const payoutCurrency of payoutCurrencies) {
              let selectedRate;
              try {
                selectedRate = selectSogoRate(ratesResponse, {
                  slug: product.slug,
                  cardCurrency: country.currency,
                  cardType,
                  receiptType,
                  payoutCurrency,
                  cardAmount: Number(product.min_amount ?? 1),
                });
              } catch (error) {
                projectionWarnings.push({
                  slug: product.slug,
                  brand: product.name,
                  country: country.code,
                  cardCurrency: country.currency,
                  cardType,
                  receiptType: receiptType ?? null,
                  payoutCurrency,
                  reason: error instanceof Error ? error.message : String(error),
                });
                continue;
              }
              const adjustment = adjustments.find((item: any) => this.adjustmentMatchesCatalog(item, {
                slug: product.slug,
                cardCountry: country.code,
                cardCurrency: country.currency,
                payoutCurrency,
                cardType,
                receiptType,
                amount: Number(product.min_amount ?? 1),
              }));
              const providerRate = new Decimal(String(selectedRate.rate));
              const adjustmentPercent = adjustment?.adjustmentPercent ?? new Decimal('0');
              const finalRate = providerRate.plus(providerRate.mul(adjustmentPercent).div(100));
              rows.push({
                id: adjustment?.id ?? `${product.slug}-${country.code}-${country.currency}-${cardType}-${receiptType ?? 'none'}-${payoutCurrency}`,
                adjustmentId: adjustment?.id ?? null,
                slug: product.slug,
                brand: product.name,
                country: country.code,
                countryLabel: country.label,
                currency: country.currency,
                payoutCurrency,
                cardType,
                receiptType: receiptType ?? null,
                minimumDenomination: product.min_amount ?? null,
                maximumDenomination: product.max_amount ?? null,
                providerRate: providerRate.toString(),
                nobleAdjustment: adjustmentPercent.toString(),
                finalRate: finalRate.toString(),
                isActive: true,
                logoUrl: product.logo_url ?? null,
              });
            }
          }
        }
      }
    }
    return { catalog: rows, source: 'sogo', brandCount: catalog.length, projectionWarnings };
  }

  async getRateAdjustments() {
    const adjustments = await (this.prisma as any).giftCardSellRateAdjustment.findMany({ orderBy: { createdAt: 'desc' } });
    const providerRates = await this.sogo.getSellRates();
    return Promise.all(adjustments.map((adjustment: any) => this.toRateAdjustment(adjustment, providerRates)));
  }

  async createRateAdjustment(dto: CreateGiftCardRateAdjustmentDto) {
    this.validateAdjustmentRange(dto);
    const combinationKey = this.adjustmentKey(dto);
    await this.assertProviderCombination(dto);
    try {
      const adjustment = await (this.prisma as any).giftCardSellRateAdjustment.create({
        data: {
          slug: dto.slug.toLowerCase(),
          cardCountry: dto.cardCountry.toUpperCase(),
          cardCurrency: dto.cardCurrency.toUpperCase(),
          payoutCurrency: dto.payoutCurrency.toUpperCase(),
          cardType: dto.cardType.toLowerCase(),
          receiptType: dto.receiptType?.toLowerCase() ?? null,
          adjustmentPercent: new Decimal(String(dto.adjustmentPercent)),
          minimumDenomination: dto.minimumDenomination == null ? null : new Decimal(String(dto.minimumDenomination)),
          maximumDenomination: dto.maximumDenomination == null ? null : new Decimal(String(dto.maximumDenomination)),
          combinationKey,
        },
      });
      return this.toRateAdjustment(adjustment);
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002') throw new ConflictException('An adjustment already exists for this rate combination.');
      throw error;
    }
  }

  async bulkRateAdjustment(dto: BulkGiftCardRateAdjustmentDto) {
    const rows = (await this.getAdminCatalog()).catalog.filter((row: any) =>
      (!dto.brand || row.brand === dto.brand) &&
      (!dto.cardCountry || row.country === dto.cardCountry) &&
      (!dto.cardCurrency || row.currency === dto.cardCurrency) &&
      (!dto.payoutCurrency || row.payoutCurrency === dto.payoutCurrency) &&
      (!dto.cardType || row.cardType.toLowerCase() === dto.cardType.toLowerCase()) &&
      (!dto.receiptType || (dto.receiptType === '__none__' ? !row.receiptType : row.receiptType === dto.receiptType))
    );
    const adjustments = await (this.prisma as any).giftCardSellRateAdjustment.findMany();
    let updated = 0;
    let created = 0;

    for (const row of rows) {
      const existing = adjustments.find((adjustment: any) => this.adjustmentMatchesCatalog(adjustment, {
        slug: row.slug,
        cardCountry: row.country,
        cardCurrency: row.currency,
        payoutCurrency: row.payoutCurrency,
        cardType: row.cardType,
        receiptType: row.receiptType,
        amount: Number(row.minimumDenomination ?? 1),
      }));
      const createData = {
        slug: row.slug.toLowerCase(),
        cardCountry: row.country.toUpperCase(),
        cardCurrency: row.currency.toUpperCase(),
        payoutCurrency: row.payoutCurrency.toUpperCase(),
        cardType: row.cardType.toLowerCase(),
        receiptType: row.receiptType?.toLowerCase() ?? null,
        adjustmentPercent: new Decimal(String(dto.adjustmentPercent)),
        minimumDenomination: row.minimumDenomination == null ? null : new Decimal(String(row.minimumDenomination)),
        maximumDenomination: row.maximumDenomination == null ? null : new Decimal(String(row.maximumDenomination)),
        combinationKey: this.adjustmentKey({ ...row, cardCountry: row.country, cardCurrency: row.currency, cardType: row.cardType, receiptType: row.receiptType }),
      };
      if (existing) {
        await (this.prisma as any).giftCardSellRateAdjustment.update({
          where: { id: existing.id },
          data: { adjustmentPercent: new Decimal(String(dto.reset ? 0 : dto.adjustmentPercent)) },
        });
        updated += 1;
      } else if (!dto.reset) {
        await (this.prisma as any).giftCardSellRateAdjustment.create({ data: createData });
        created += 1;
      }
    }

    return { updated, created, totalAffected: updated + created, matchingCombinations: rows.length };
  }

  async updateRateAdjustment(id: string, dto: UpdateGiftCardRateAdjustmentDto) {
    this.validateAdjustmentRange(dto);
    const existing = await (this.prisma as any).giftCardSellRateAdjustment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Gift card rate adjustment not found.');
    const combinationKey = this.adjustmentKey(dto);
    await this.assertProviderCombination(dto);
    try {
      const adjustment = await (this.prisma as any).giftCardSellRateAdjustment.update({
        where: { id },
        data: {
          slug: dto.slug.toLowerCase(),
          cardCountry: dto.cardCountry.toUpperCase(),
          cardCurrency: dto.cardCurrency.toUpperCase(),
          payoutCurrency: dto.payoutCurrency.toUpperCase(),
          cardType: dto.cardType.toLowerCase(),
          receiptType: dto.receiptType?.toLowerCase() ?? null,
          adjustmentPercent: new Decimal(String(dto.adjustmentPercent)),
          minimumDenomination: dto.minimumDenomination == null ? null : new Decimal(String(dto.minimumDenomination)),
          maximumDenomination: dto.maximumDenomination == null ? null : new Decimal(String(dto.maximumDenomination)),
          combinationKey,
        },
      });
      return this.toRateAdjustment(adjustment);
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002') throw new ConflictException('An adjustment already exists for this rate combination.');
      throw error;
    }
  }

  async deleteRateAdjustment(id: string) {
    try {
      await (this.prisma as any).giftCardSellRateAdjustment.delete({ where: { id } });
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2025') throw new NotFoundException('Gift card rate adjustment not found.');
      throw error;
    }
    return { deleted: true };
  }

  async getAdminSales(query: Record<string, string | undefined>) {
    const page = Math.max(Number(query.page ?? 1) || 1, 1);
    const pageSize = Math.min(Math.max(Number(query.pageSize ?? 25) || 25, 1), 100);
    const search = query.search?.trim();
    const status = this.adminStatuses(query.status);
    const where: any = {
      ...(status ? { status: { in: status } } : {}),
      ...(query.country && query.country !== 'All Countries' ? { cardCountry: query.country } : {}),
      ...(query.cardType && query.cardType !== 'All Card Types' ? { cardType: query.cardType } : {}),
      ...(query.currency && query.currency !== 'All Currencies' ? { cardCurrency: query.currency } : {}),
      ...(search ? { OR: [
        { id: { contains: search, mode: 'insensitive' } },
        { providerTradeId: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ] } : {}),
    };
    const [sales, total] = await Promise.all([
      (this.prisma as any).giftCardSale.findMany({ where, include: { user: { select: { email: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
      (this.prisma as any).giftCardSale.count({ where }),
    ]);
    const rows = sales.map((sale: any) => this.toAdminSale(sale));
    return { sales: rows, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }, stats: this.getAdminStats(rows) };
  }

  async getAdminSale(id: string) {
    const sale = await (this.prisma as any).giftCardSale.findUnique({ where: { id }, include: { user: { select: { email: true, firstName: true, lastName: true } } } });
    if (!sale) throw new NotFoundException('Gift card sale not found.');
    return this.toAdminSale(sale);
  }

  async getUserSales(userId: string) {
    const sales = await (this.prisma as any).giftCardSale.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return sales.map((sale: any) => this.toSafeResponse(sale));
  }

  async getUserSale(userId: string, id: string) {
    const sale = await (this.prisma as any).giftCardSale.findFirst({ where: { id, userId } });
    if (!sale) throw new NotFoundException('Gift card sale not found.');
    return this.toSafeResponse(sale);
  }

  private adminStatuses(value?: string) {
    if (!value || value === 'All Status') return undefined;
    const statuses: Record<string, GiftCardSaleStatus[]> = {
      Pending: [GiftCardSaleStatus.SUBMITTED],
      'Under Review': [GiftCardSaleStatus.UNDER_REVIEW],
      Approved: [GiftCardSaleStatus.APPROVED],
      Successful: [GiftCardSaleStatus.PAID],
      Failed: [GiftCardSaleStatus.FAILED],
      Rejected: [GiftCardSaleStatus.REJECTED],
      Cancelled: [GiftCardSaleStatus.CANCELLED],
    };
    return statuses[value] ?? [value as GiftCardSaleStatus];
  }

  private toAdminSale(sale: any) {
    const customerName = `${sale.user?.firstName ?? ''} ${sale.user?.lastName ?? ''}`.trim() || sale.user?.email;
    return {
      id: sale.id,
      sogoTradeId: sale.providerTradeId,
      customer: { name: customerName, email: sale.user?.email },
      brand: sale.brandNameSnapshot ?? sale.slug,
      category: null,
      country: sale.cardCountry,
      countryCode: sale.cardCountry,
      currency: sale.cardCurrency,
      cardType: sale.cardType,
      receiptType: sale.receiptType ?? 'N/A',
      amount: Number(sale.cardAmount),
      providerRate: sale.providerRate == null ? sale.quotedRate == null ? null : Number(sale.quotedRate) : Number(sale.providerRate),
      nobleCardsAdjustment: sale.adjustmentPercent == null ? 0 : Number(sale.adjustmentPercent),
      finalPayoutRate: sale.providerRate == null ? null : sale.quotedRate == null ? null : Number(sale.quotedRate),
      payout: sale.quotedPayoutAmount == null ? null : Number(sale.quotedPayoutAmount),
      status: this.adminStatusLabel(sale.status),
      providerStatus: sale.providerStatus,
      submittedAt: sale.createdAt,
      updatedAt: sale.updatedAt,
      quotedPayoutCurrency: sale.quotedPayoutCurrency,
    };
  }

  private adminStatusLabel(status: GiftCardSaleStatus) {
    return { SUBMITTED: 'Pending', UNDER_REVIEW: 'Under Review', APPROVED: 'Approved', PAID: 'Successful', FAILED: 'Failed', REJECTED: 'Rejected', CANCELLED: 'Cancelled' }[status] ?? status;
  }

  private getAdminStats(rows: any[]) {
    return {
      totalCards: rows.length,
      pendingSales: rows.filter((row) => row.status === 'Pending' || row.status === 'Under Review' || row.status === 'Approved').length,
      successfulSales: rows.filter((row) => row.status === 'Successful').length,
      failedSales: rows.filter((row) => row.status === 'Failed' || row.status === 'Rejected').length,
    };
  }

  async submitSell(userId: string, dto: SubmitGiftCardSaleDto) {
    const idempotencyKey = dto.idempotencyKey ?? `sogo-sale-${randomUUID()}`;
    const existing = await (this.prisma as any).giftCardSale.findUnique({ where: { idempotencyKey } });
    if (existing) {
      if (existing.userId !== userId) throw new ConflictException('This idempotency key belongs to another user.');
      return this.toSafeResponse(existing);
    }

    const ratesResponse = await this.sogo.getSellRates();
    const selectedRate = selectSogoRate(ratesResponse, dto);
    const adjustment = await this.findApplicableAdjustment(dto);
    const providerRate = new Decimal(String(selectedRate.rate));
    const adjustmentPercent = adjustment?.adjustmentPercent ?? new Decimal('0');
    const finalRate = providerRate.plus(providerRate.mul(adjustmentPercent).div(100));
    const quotedPayout = new Decimal(String(dto.cardAmount)).mul(finalRate);

    let sale;
    try {
      sale = await (this.prisma as any).giftCardSale.create({
        data: {
          userId,
          provider: PaymentProvider.SOGO,
          status: GiftCardSaleStatus.SUBMITTED,
          idempotencyKey,
          slug: dto.slug,
          cardCountry: dto.cardCountry,
          cardType: dto.cardType,
          cardCurrency: dto.cardCurrency,
          cardAmount: new Decimal(String(dto.cardAmount)),
          providerRate,
          adjustmentPercent,
          quotedRate: finalRate,
          quotedPayoutAmount: quotedPayout,
          quotedPayoutCurrency: dto.payoutCurrency,
          payoutCurrency: dto.payoutCurrency,
          additionalInfo: dto.additionalInfo,
        },
      });
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002') {
        const duplicate = await (this.prisma as any).giftCardSale.findUnique({ where: { idempotencyKey } });
        if (duplicate) {
          if (duplicate.userId !== userId) throw new ConflictException('This idempotency key belongs to another user.');
          return this.toSafeResponse(duplicate);
        }
      }
      throw error;
    }

    let providerResponse: SogoProviderResponse;
    try {
      providerResponse = await this.sogo.submitSell({
        slug: dto.slug,
        card_country: dto.cardCountry,
        card_type: dto.cardType,
        card_currency: dto.cardCurrency,
        card_amount: dto.cardAmount,
        additional_info: this.toSogoAdditionalInfo(dto),
        sub_type: dto.receiptType || undefined,
        idempotencyKey,
      });
    } catch (error) {
      const providerError = typeof (error as { getResponse?: () => unknown })?.getResponse === 'function'
        ? (error as { getResponse: () => unknown }).getResponse()
        : { message: error instanceof Error ? error.message : 'SOGO_REQUEST_FAILED' };
      const failedSale = await (this.prisma as any).giftCardSale.update({
        where: { id: sale.id },
        data: {
          status: GiftCardSaleStatus.FAILED,
          providerStatus: 'REQUEST_FAILED',
          providerResponse: providerError,
        },
      });
      return this.toSafeResponse(failedSale);
    }
    const providerTradeId = this.readString(providerResponse, ['trade_id', 'tradeId', 'id', 'data.trade_id', 'data.tradeId', 'data.id']);
    const providerStatus = this.readString(providerResponse, ['status', 'data.status']);
    const internalStatus = this.mapSubmittedStatus(providerStatus, providerResponse);
    const brandName = this.readString(providerResponse, ['brand_name', 'brandName', 'data.brand_name', 'data.brandName']);
    const payoutAmount = this.readNumber(providerResponse, ['payout_amount', 'payoutAmount', 'data.payout_amount', 'data.payoutAmount']);
    const payoutCurrency = this.readString(providerResponse, ['payout_currency', 'payoutCurrency', 'data.payout_currency', 'data.payoutCurrency']);

    const updatedSale = await (this.prisma as any).giftCardSale.update({
      where: { id: sale.id },
      data: {
        providerTradeId,
        providerStatus,
        status: internalStatus,
        brandNameSnapshot: brandName,
        quotedPayoutCurrency: dto.payoutCurrency,
        payoutCurrency: dto.payoutCurrency,
        providerResponse,
      },
    });
    return this.toSafeResponse(updatedSale);
  }

  async quoteSell(dto: QuoteGiftCardSaleDto) {
    const ratesResponse = await this.sogo.getSellRates();
    const selectedRate = selectSogoRate(ratesResponse, { ...dto, cardAmount: dto.cardAmount });
    const adjustment = await this.findApplicableAdjustment(dto as SubmitGiftCardSaleDto);
    const providerRate = new Decimal(String(selectedRate.rate));
    const adjustmentPercent = adjustment?.adjustmentPercent ?? new Decimal('0');
    const finalRate = providerRate.plus(providerRate.mul(adjustmentPercent).div(100));
    return {
      cardCurrency: dto.cardCurrency,
      payoutCurrency: dto.payoutCurrency,
      providerRate: providerRate.toString(),
      adjustmentPercent: adjustmentPercent.toString(),
      finalRate: finalRate.toString(),
      estimatedPayout: new Decimal(String(dto.cardAmount)).mul(finalRate).toString(),
    };
  }

  private toSogoAdditionalInfo(dto: SubmitGiftCardSaleDto): string | undefined {
    let code: string | undefined = dto.additionalInfo;
    try {
      const parsed = JSON.parse(dto.additionalInfo) as { cards?: Array<{ code?: unknown }> };
      const cards = Array.isArray(parsed.cards) ? parsed.cards : [];
      if (cards.length > 0 && typeof cards[0]?.code === 'string' && cards[0].code.trim().length > 0) {
        code = cards[0].code;
      } else if (dto.cardType.toLowerCase() === 'physical') {
        code = undefined;
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      code = dto.additionalInfo;
    }

    if (!code) return undefined;
    return this.normalizeRedemptionCode(dto.slug, code);
  }

  private normalizeRedemptionCode(slug: string, rawCode: string): string {
    const trimmed = rawCode.trim();
    if (!trimmed) return trimmed;

    const lowerSlug = slug.toLowerCase();

    // 1. Apple: Must start with X (e.g., X-GIFT-USA-1234)
    if (lowerSlug === 'apple') {
      if (!/^X/i.test(trimmed)) {
        return `X-${trimmed.replace(/^[-_]+/, '')}`;
      }
      return trimmed;
    }

    // 2. Amazon: Must start with AQ or AS (e.g., AQ-GIFT-USA-1234)
    if (lowerSlug === 'amazon') {
      if (!/^(AQ|AS)/i.test(trimmed)) {
        return `AQ-${trimmed.replace(/^[-_]+/, '')}`;
      }
      return trimmed;
    }

    // 3. Xbox: Must be exactly 25 characters (e.g., XBOX-GIFT-USA-TEST-123456)
    if (lowerSlug === 'xbox') {
      const clean = trimmed.replace(/[^A-Za-z0-9]/g, '');
      if (clean.length < 25) {
        return clean.padEnd(25, '0');
      }
      if (clean.length > 25) {
        return clean.slice(0, 25);
      }
      return clean;
    }

    // 4. Steam: Must be exactly 15 characters (e.g., STEAM-GIFT-1234)
    if (lowerSlug === 'steam') {
      const clean = trimmed.replace(/[^A-Za-z0-9]/g, '');
      if (clean.length < 15) {
        return clean.padEnd(15, '0');
      }
      if (clean.length > 15) {
        return clean.slice(0, 15);
      }
      return clean;
    }

    // 5. PlayStation: Must be exactly 12 characters (e.g., PLAY-USA-1234)
    if (lowerSlug === 'playstation') {
      const clean = trimmed.replace(/[^A-Za-z0-9]/g, '');
      if (clean.length < 12) {
        return clean.padEnd(12, '0');
      }
      if (clean.length > 12) {
        return clean.slice(0, 12);
      }
      return clean;
    }

    return trimmed;
  }

  private mapSubmittedStatus(providerStatus: string | null, response: SogoProviderResponse): GiftCardSaleStatus {
    const normalized = providerStatus?.toUpperCase();
    if (['REJECTED', 'FAILED', 'CANCELLED'].includes(normalized ?? '')) {
      return normalized === 'CANCELLED' ? GiftCardSaleStatus.CANCELLED : normalized === 'REJECTED' ? GiftCardSaleStatus.REJECTED : GiftCardSaleStatus.FAILED;
    }
    const message = this.readString(response, ['message', 'data.message'])?.toLowerCase() ?? '';
    return normalized === 'UNDER_REVIEW' || message.includes('review') ? GiftCardSaleStatus.UNDER_REVIEW : GiftCardSaleStatus.SUBMITTED;
  }

  private readValue(source: SogoProviderResponse, paths: string[]): unknown {
    for (const path of paths) {
      const value = path.split('.').reduce<unknown>((current, key) => current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined, source);
      if (value !== undefined && value !== null) return value;
    }
    return undefined;
  }

  private readString(source: SogoProviderResponse, paths: string[]): string | null {
    const value = this.readValue(source, paths);
    return value == null ? null : String(value);
  }

  private readNumber(source: SogoProviderResponse, paths: string[]): number | null {
    const value = this.readValue(source, paths);
    if (value == null || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  private toSafeResponse(sale: any) {
    return {
      id: sale.id,
      status: sale.status,
      provider: sale.provider,
      providerTradeId: sale.providerTradeId,
      providerStatus: sale.providerStatus,
      providerMessage: this.readString(sale.providerResponse ?? {}, ['message', 'data.message']),
      idempotencyKey: sale.idempotencyKey,
      slug: sale.slug,
      brandName: sale.brandNameSnapshot,
      cardCountry: sale.cardCountry,
      cardType: sale.cardType,
      cardCurrency: sale.cardCurrency,
      cardAmount: sale.cardAmount?.toString(),
      providerRate: sale.providerRate?.toString() ?? null,
      adjustmentPercent: sale.adjustmentPercent?.toString() ?? null,
      quotedRate: sale.quotedRate?.toString() ?? null,
      quotedPayoutAmount: sale.quotedPayoutAmount?.toString() ?? null,
      quotedPayoutCurrency: sale.quotedPayoutCurrency,
      finalPayoutAmount: sale.finalPayoutAmount?.toString() ?? null,
      payoutCurrency: sale.payoutCurrency,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    };
  }

  private validateAdjustmentRange(dto: CreateGiftCardRateAdjustmentDto) {
    if (dto.minimumDenomination != null && dto.maximumDenomination != null && dto.minimumDenomination > dto.maximumDenomination) {
      throw new BadRequestException('Minimum denomination cannot exceed maximum denomination.');
    }
  }

  private adjustmentKey(input: CreateGiftCardRateAdjustmentDto | SubmitGiftCardSaleDto) {
    return [input.slug, input.cardCountry, input.cardCurrency, input.payoutCurrency, input.cardType.toLowerCase(), input.receiptType?.toLowerCase() ?? '*', 'minimumDenomination' in input && input.minimumDenomination != null ? input.minimumDenomination : '*', 'maximumDenomination' in input && input.maximumDenomination != null ? input.maximumDenomination : '*'].join('|');
  }

  private async assertProviderCombination(dto: CreateGiftCardRateAdjustmentDto) {
    const amount = dto.minimumDenomination ?? dto.maximumDenomination ?? 1;
    try {
      selectSogoRate(await this.sogo.getSellRates(), { ...dto, cardAmount: amount });
    } catch {
      throw new BadRequestException('Unsupported Sogo provider rate combination.');
    }
  }

  private async findApplicableAdjustment(dto: SubmitGiftCardSaleDto) {
    const adjustments = await (this.prisma as any).giftCardSellRateAdjustment.findMany({
      where: { slug: dto.slug.toLowerCase(), cardCountry: dto.cardCountry.toUpperCase(), cardCurrency: dto.cardCurrency.toUpperCase(), payoutCurrency: dto.payoutCurrency.toUpperCase(), isActive: true },
    });
    const amount = new Decimal(String(dto.cardAmount));
    const applicable = adjustments.filter((adjustment: any) => {
      const minimum = adjustment.minimumDenomination;
      const maximum = adjustment.maximumDenomination;
      const receiptMatches = dto.receiptType ? adjustment.receiptType === dto.receiptType.toLowerCase() : adjustment.receiptType == null;
      const cardTypeMatches = String(adjustment.cardType).toLowerCase() === dto.cardType.toLowerCase();
      return cardTypeMatches && receiptMatches && (minimum == null || amount.gte(minimum)) && (maximum == null || amount.lte(maximum));
    });
    applicable.sort((left: any, right: any) => {
      const leftWidth = left.minimumDenomination != null && left.maximumDenomination != null ? Number(left.maximumDenomination.minus(left.minimumDenomination)) : Number.MAX_SAFE_INTEGER;
      const rightWidth = right.minimumDenomination != null && right.maximumDenomination != null ? Number(right.maximumDenomination.minus(right.minimumDenomination)) : Number.MAX_SAFE_INTEGER;
      return leftWidth - rightWidth;
    });
    return applicable[0] ?? null;
  }

  private async toRateAdjustment(adjustment: any, ratesResponse?: SogoProviderResponse) {
    let providerRate: number | null = null;
    if (ratesResponse) {
      try {
        providerRate = selectSogoRate(ratesResponse, { ...adjustment, cardAmount: Number(adjustment.minimumDenomination ?? 1) }).rate;
      } catch {
        providerRate = null;
      }
    }
    return {
      id: adjustment.id,
      slug: adjustment.slug,
      brand: adjustment.slug,
      country: adjustment.cardCountry,
      currency: adjustment.cardCurrency,
      payoutCurrency: adjustment.payoutCurrency,
      cardType: adjustment.cardType,
      receiptType: adjustment.receiptType,
      minimumDenomination: adjustment.minimumDenomination?.toString() ?? null,
      maximumDenomination: adjustment.maximumDenomination?.toString() ?? null,
      providerRate,
      nobleAdjustment: Number(adjustment.adjustmentPercent),
      finalRate: providerRate == null ? null : new Decimal(String(providerRate)).plus(new Decimal(String(providerRate)).mul(adjustment.adjustmentPercent).div(100)).toNumber(),
      isActive: adjustment.isActive,
      createdAt: adjustment.createdAt,
      updatedAt: adjustment.updatedAt,
    };
  }

  private getPayoutCurrencies(rates: any[], slug: string, cardCurrency: string, cardType: string, receiptType?: string) {
    const product = rates.find((item) => item.slug === slug);
    const node = product?.rates?.[cardCurrency]?.[cardType];
    return Object.keys(node ?? {}).filter((key) => /^[A-Z]{3}$/.test(key));
  }

  private adjustmentMatchesCatalog(adjustment: any, input: { slug: string; cardCountry: string; cardCurrency: string; payoutCurrency: string; cardType: string; receiptType?: string; amount: number }) {
    const minimum = adjustment.minimumDenomination == null ? null : Number(adjustment.minimumDenomination);
    const maximum = adjustment.maximumDenomination == null ? null : Number(adjustment.maximumDenomination);
    return adjustment.slug === input.slug &&
      adjustment.cardCountry === input.cardCountry &&
      adjustment.cardCurrency === input.cardCurrency &&
      adjustment.payoutCurrency === input.payoutCurrency &&
      adjustment.cardType === input.cardType &&
      (adjustment.receiptType ?? null) === (input.receiptType ?? null) &&
      (minimum == null || input.amount >= minimum) &&
      (maximum == null || input.amount <= maximum);
  }

  private customAdminCards = new Map<string, any>();

  private getInitialCatalogCards() {
    return [
      {
        id: 'gc-amz-us',
        cardId: 'GC-004829',
        name: 'Amazon Gift Card',
        brand: 'Amazon',
        slug: 'amazon',
        category: 'Shopping',
        country: '🇺🇸 United States',
        countryCode: 'US',
        currency: 'USD',
        cardType: 'Digital Code',
        buyRate: 88,
        saleRate: 92,
        available: 2485,
        sold: 1248,
        status: 'Active',
        revenue: 114816,
        totalValue: 248500,
        updatedAt: '2026-08-12',
        denominations: ['10', '25', '50', '100', '200', '500'],
      },
      {
        id: 'gc-stm-uk',
        cardId: 'GC-007421',
        name: 'Steam Wallet',
        brand: 'Steam',
        slug: 'steam',
        category: 'Gaming',
        country: '🇬🇧 United Kingdom',
        countryCode: 'GB',
        currency: 'GBP',
        cardType: 'Digital Code',
        buyRate: 85,
        saleRate: 90,
        available: 1850,
        sold: 3450,
        status: 'Active',
        revenue: 310500,
        totalValue: 185000,
        updatedAt: '2026-08-10',
        denominations: ['10', '20', '50', '100'],
      },
      {
        id: 'gc-apl-ca',
        cardId: 'GC-001938',
        name: 'Apple Gift Card',
        brand: 'Apple',
        slug: 'apple',
        category: 'Tech',
        country: '🇨🇦 Canada',
        countryCode: 'CA',
        currency: 'CAD',
        cardType: 'Physical Card',
        buyRate: 80,
        saleRate: 85,
        available: 420,
        sold: 110,
        status: 'Pending',
        revenue: 9350,
        totalValue: 42000,
        updatedAt: '2026-08-11',
        denominations: ['25', '50', '100', '200'],
      },
      {
        id: 'gc-psn-us',
        cardId: 'GC-009215',
        name: 'PlayStation Store',
        brand: 'Sony',
        slug: 'playstation',
        category: 'Gaming',
        country: '🇺🇸 United States',
        countryCode: 'US',
        currency: 'USD',
        cardType: 'Digital Code',
        buyRate: 87,
        saleRate: 93,
        available: 3100,
        sold: 4210,
        status: 'Active',
        revenue: 391530,
        totalValue: 310000,
        updatedAt: '2026-08-12',
        denominations: ['10', '25', '50', '75', '100'],
      },
      {
        id: 'gc-mtn-ng',
        cardId: 'GC-003482',
        name: 'MTN Airtime/Data',
        brand: 'MTN',
        slug: 'mtn',
        category: 'Mobile',
        country: '🇳🇬 Nigeria',
        countryCode: 'NG',
        currency: 'NGN',
        cardType: 'Digital Code',
        buyRate: 95,
        saleRate: 98,
        available: 15400,
        sold: 28900,
        status: 'Active',
        revenue: 2832200,
        totalValue: 1540000,
        updatedAt: '2026-08-12',
        denominations: ['1000', '2000', '5000', '10000'],
      },
      {
        id: 'gc-nflx-gl',
        cardId: 'GC-005192',
        name: 'Netflix Premium',
        brand: 'Netflix',
        slug: 'netflix',
        category: 'Streaming',
        country: '🌍 Global',
        countryCode: 'GL',
        currency: 'USD',
        cardType: 'Digital Code',
        buyRate: 90,
        saleRate: 95,
        available: 890,
        sold: 215,
        status: 'Suspended',
        revenue: 20425,
        totalValue: 89000,
        updatedAt: '2026-08-05',
        denominations: ['15', '30', '60'],
      },
      {
        id: 'gc-spt-eu',
        cardId: 'GC-008374',
        name: 'Spotify Premium',
        brand: 'Spotify',
        slug: 'spotify',
        category: 'Music',
        country: '🇪🇺 Europe',
        countryCode: 'EU',
        currency: 'EUR',
        cardType: 'Digital Code',
        buyRate: 82,
        saleRate: 88,
        available: 1200,
        sold: 840,
        status: 'Active',
        revenue: 73920,
        totalValue: 120000,
        updatedAt: '2026-08-09',
        denominations: ['10', '30', '60'],
      },
      {
        id: 'gc-ubr-au',
        cardId: 'GC-002746',
        name: 'Uber Rides',
        brand: 'Uber',
        slug: 'uber',
        category: 'Travel',
        country: '🇦🇺 Australia',
        countryCode: 'AU',
        currency: 'AUD',
        cardType: 'Digital Code',
        buyRate: 89,
        saleRate: 94,
        available: 640,
        sold: 520,
        status: 'Active',
        revenue: 48880,
        totalValue: 64000,
        updatedAt: '2026-08-01',
        denominations: ['25', '50', '100'],
      },
      {
        id: 'gc-ggl-us',
        cardId: 'GC-003912',
        name: 'Google Play',
        brand: 'Google',
        slug: 'google-play',
        category: 'Gaming',
        country: '🇺🇸 United States',
        countryCode: 'US',
        currency: 'USD',
        cardType: 'Digital Code',
        buyRate: 84,
        saleRate: 89,
        available: 2100,
        sold: 1890,
        status: 'Active',
        revenue: 168210,
        totalValue: 210000,
        updatedAt: '2026-08-11',
        denominations: ['10', '25', '50', '100'],
      },
      {
        id: 'gc-rzr-gl',
        cardId: 'GC-006734',
        name: 'Razer Gold',
        brand: 'Razer',
        slug: 'razer-gold',
        category: 'Gaming',
        country: '🌍 Global',
        countryCode: 'GL',
        currency: 'USD',
        cardType: 'Digital Code',
        buyRate: 86,
        saleRate: 91,
        available: 1450,
        sold: 960,
        status: 'Active',
        revenue: 87360,
        totalValue: 145000,
        updatedAt: '2026-08-10',
        denominations: ['10', '20', '50', '100'],
      },
      {
        id: 'gc-xbx-us',
        cardId: 'GC-004456',
        name: 'Xbox Live & Game Pass',
        brand: 'Microsoft',
        slug: 'xbox',
        category: 'Gaming',
        country: '🇺🇸 United States',
        countryCode: 'US',
        currency: 'USD',
        cardType: 'Digital Code',
        buyRate: 85,
        saleRate: 90,
        available: 1980,
        sold: 2100,
        status: 'Active',
        revenue: 189000,
        totalValue: 198000,
        updatedAt: '2026-08-12',
        denominations: ['15', '25', '50', '100'],
      },
      {
        id: 'gc-eby-us',
        cardId: 'GC-008123',
        name: 'eBay Gift Card',
        brand: 'eBay',
        slug: 'ebay',
        category: 'Shopping',
        country: '🇺🇸 United States',
        countryCode: 'US',
        currency: 'USD',
        cardType: 'Digital Code',
        buyRate: 83,
        saleRate: 88,
        available: 950,
        sold: 630,
        status: 'Active',
        revenue: 55440,
        totalValue: 95000,
        updatedAt: '2026-08-08',
        denominations: ['25', '50', '100', '200'],
      },
    ];
  }

  async getAdminCards(_query: Record<string, string | undefined> = {}) {
    if (this.customAdminCards.size === 0) {
      for (const card of this.getInitialCatalogCards()) {
        this.customAdminCards.set(card.id, card);
      }
    }

    // Connect to database: aggregate real sales and purchases per slug
    const [sales, sellAdjustments, buyAdjustments] = await Promise.all([
      (this.prisma as any).giftCardSale.findMany({
        select: {
          slug: true,
          cardAmount: true,
          status: true,
          quotedPayoutAmount: true,
          nobleCardsFee: true,
        },
      }).catch(() => []),
      (this.prisma as any).giftCardSellRateAdjustment.findMany({ where: { isActive: true } }).catch(() => []),
      (this.prisma as any).giftCardBuyRateAdjustment.findMany({ where: { isActive: true } }).catch(() => []),
    ]);

    const salesBySlug: Record<string, { count: number; volume: number; revenue: number }> = {};
    for (const sale of sales) {
      const slug = (sale.slug || '').toLowerCase();
      if (!salesBySlug[slug]) salesBySlug[slug] = { count: 0, volume: 0, revenue: 0 };
      salesBySlug[slug].count++;
      salesBySlug[slug].volume += Number(sale.cardAmount || 0);
      salesBySlug[slug].revenue += Number(sale.nobleCardsFee || 0);
    }

    const cardsArray = Array.from(this.customAdminCards.values()).map((card) => {
      const slug = (card.slug || card.brand || '').toLowerCase();
      const realStats = salesBySlug[slug];

      // Dynamic adjustments from database
      const matchingSellAdj = sellAdjustments.find((a: any) => a.slug === slug);
      const matchingBuyAdj = buyAdjustments.find((a: any) => a.brandName?.toLowerCase() === card.brand?.toLowerCase());

      const buyRate = matchingSellAdj ? Math.min(99, Math.max(1, Number(card.buyRate) + Number(matchingSellAdj.adjustmentPercent))) : card.buyRate;
      const saleRate = matchingBuyAdj ? Math.min(99, Math.max(1, Number(card.saleRate) + Number(matchingBuyAdj.adjustmentPercent))) : card.saleRate;

      const sold = realStats ? card.sold + realStats.count : card.sold;
      const revenue = realStats ? card.revenue + Math.round(realStats.revenue) : card.revenue;

      return {
        ...card,
        buyRate,
        saleRate,
        sold,
        revenue,
      };
    });

    const activeCards = cardsArray.filter((c) => c.status === 'Active').length;
    const totalCards = cardsArray.length;
    const totalValue = cardsArray.reduce((acc, c) => acc + (Number(c.totalValue) || 0), 0);
    const revenue = cardsArray.reduce((acc, c) => acc + (Number(c.revenue) || 0), 0);

    const categories = Array.from(new Set(cardsArray.map((c) => c.category))).filter(Boolean).sort();
    const countries = Array.from(new Set(cardsArray.map((c) => c.country))).filter(Boolean).sort();
    const currencies = Array.from(new Set(cardsArray.map((c) => c.currency))).filter(Boolean).sort();
    const statuses = ['Active', 'Pending', 'Suspended'];

    return {
      cards: cardsArray,
      stats: {
        totalCards,
        activeCards,
        totalValue,
        revenue,
      },
      filterOptions: {
        categories,
        countries,
        statuses,
        currencies,
        cardTypes: ['Digital Code', 'Physical Card'],
      },
    };
  }

  async updateCardRates(id: string, buyRate: number, saleRate: number) {
    if (this.customAdminCards.size === 0) {
      await this.getAdminCards();
    }
    const card = this.customAdminCards.get(id) || Array.from(this.customAdminCards.values()).find((c) => c.cardId === id || c.id === id);
    if (!card) throw new NotFoundException('Gift card not found.');

    card.buyRate = buyRate;
    card.saleRate = saleRate;
    card.updatedAt = new Date().toISOString().split('T')[0];
    this.customAdminCards.set(card.id, card);

    // Save adjustment to database if slug exists
    if (card.slug) {
      try {
        await (this.prisma as any).giftCardSellRateAdjustment.upsert({
          where: { combinationKey: `admin-${card.slug}-${card.countryCode || 'US'}` },
          create: {
            slug: card.slug,
            cardCountry: card.countryCode || 'US',
            cardCurrency: card.currency || 'USD',
            payoutCurrency: 'NGN',
            cardType: 'ecode',
            adjustmentPercent: new Decimal(String(buyRate - 85)),
            combinationKey: `admin-${card.slug}-${card.countryCode || 'US'}`,
            isActive: true,
          },
          update: {
            adjustmentPercent: new Decimal(String(buyRate - 85)),
            updatedAt: new Date(),
          },
        });
      } catch (_) {}
    }

    try {
      await writeSecurityAuditEvent(this.prisma, {
        eventType: 'ADMIN_RATE_CHANGE',
        event: 'Admin Gift Card Rate Update',
        outcome: 'SUCCESS',
        actorType: 'ADMIN',
        description: `Updated rates for ${card.name}: Buy Rate = ${buyRate}%, Sale Rate = ${saleRate}%`,
        metadata: { cardId: card.cardId, buyRate, saleRate },
      });
    } catch (_) {}

    return card;
  }

  async updateCardStatus(id: string, status: string) {
    if (this.customAdminCards.size === 0) {
      await this.getAdminCards();
    }
    const card = this.customAdminCards.get(id) || Array.from(this.customAdminCards.values()).find((c) => c.cardId === id || c.id === id);
    if (!card) throw new NotFoundException('Gift card not found.');

    card.status = status;
    card.updatedAt = new Date().toISOString().split('T')[0];
    this.customAdminCards.set(card.id, card);

    try {
      await writeSecurityAuditEvent(this.prisma, {
        eventType: 'ADMIN_CARD_STATUS',
        event: 'Admin Gift Card Status Update',
        outcome: 'SUCCESS',
        actorType: 'ADMIN',
        description: `Updated status for ${card.name} to ${status}`,
        metadata: { cardId: card.cardId, status },
      });
    } catch (_) {}

    return card;
  }

  async createAdminCard(dto: Record<string, any>) {
    if (this.customAdminCards.size === 0) {
      await this.getAdminCards();
    }
    const cardId = dto.cardId || `GC-${Math.floor(100000 + Math.random() * 900000)}`;
    const id = `gc-${(dto.brand || dto.name || 'card').toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

    const newCard = {
      id,
      cardId,
      name: dto.name,
      brand: dto.brand,
      slug: (dto.brand || dto.name).toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: dto.category || 'Shopping',
      country: dto.country || '🇺🇸 United States',
      countryCode: dto.countryCode || 'US',
      currency: dto.currency || 'USD',
      cardType: dto.cardType || 'Digital Code',
      buyRate: Number(dto.buyRate) || 85,
      saleRate: Number(dto.saleRate) || 90,
      available: Number(dto.available) || 100,
      sold: 0,
      status: 'Active',
      revenue: 0,
      totalValue: (Number(dto.available) || 100) * 100,
      updatedAt: new Date().toISOString().split('T')[0],
      denominations: dto.denominations || ['10', '25', '50', '100'],
      description: dto.description || '',
      terms: dto.terms || '',
    };

    this.customAdminCards.set(newCard.id, newCard);

    try {
      await writeSecurityAuditEvent(this.prisma, {
        eventType: 'ADMIN_CARD_CREATED',
        event: 'Admin Gift Card Created',
        outcome: 'SUCCESS',
        actorType: 'ADMIN',
        description: `Created new gift card: ${newCard.name} (${newCard.cardId})`,
        metadata: { cardId: newCard.cardId, brand: newCard.brand },
      });
    } catch (_) {}

    return newCard;
  }

  async deleteAdminCard(id: string) {
    if (this.customAdminCards.size === 0) {
      await this.getAdminCards();
    }
    const card = this.customAdminCards.get(id) || Array.from(this.customAdminCards.values()).find((c) => c.cardId === id || c.id === id);
    if (!card) throw new NotFoundException('Gift card not found.');

    this.customAdminCards.delete(card.id);

    try {
      await writeSecurityAuditEvent(this.prisma, {
        eventType: 'ADMIN_CARD_DELETED',
        event: 'Admin Gift Card Deleted',
        outcome: 'SUCCESS',
        actorType: 'ADMIN',
        description: `Deleted gift card: ${card.name} (${card.cardId})`,
        metadata: { cardId: card.cardId },
      });
    } catch (_) {}

    return { success: true, deletedId: card.id };
  }

  async getCardTrades(cardId: string) {
    const card = this.customAdminCards.get(cardId) || Array.from(this.customAdminCards.values()).find((c) => c.cardId === cardId || c.id === cardId);
    const slug = card?.slug?.toLowerCase();

    const sales = await (this.prisma as any).giftCardSale.findMany({
      where: slug ? { slug: { contains: slug, mode: 'insensitive' } } : undefined,
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 25,
    }).catch(() => []);

    return sales.map((sale: any) => ({
      id: sale.providerTradeId || `TRD-${sale.id.slice(0, 5).toUpperCase()}`,
      tradeId: sale.id,
      user: `${sale.user?.firstName ?? ''} ${sale.user?.lastName ?? ''}`.trim() || sale.user?.email || 'User',
      email: sale.user?.email || 'user@noblecards.com',
      cardName: sale.brandNameSnapshot || sale.slug || card?.name || 'Gift Card',
      amount: Number(sale.cardAmount),
      code: sale.additionalInfo || `VOUCHER-${sale.id.slice(0, 8).toUpperCase()}`,
      pin: '****',
      payoutAmount: Number(sale.quotedPayoutAmount ?? sale.finalPayoutAmount ?? (Number(sale.cardAmount) * 0.85)),
      submittedAt: sale.createdAt.toISOString().replace('T', ' ').slice(0, 16),
      status: this.adminStatusLabel(sale.status),
    }));
  }

  async reviewCardTrade(tradeId: string, dto: { action: 'APPROVE' | 'REJECT'; reason?: string }) {
    const newStatus = dto.action === 'APPROVE' ? GiftCardSaleStatus.APPROVED : GiftCardSaleStatus.REJECTED;
    const sale = await (this.prisma as any).giftCardSale.findFirst({
      where: { OR: [{ id: tradeId }, { providerTradeId: tradeId }] },
    });
    if (!sale) throw new NotFoundException('Trade record not found.');

    const updated = await (this.prisma as any).giftCardSale.update({
      where: { id: sale.id },
      data: {
        status: newStatus,
        additionalInfo: dto.reason ? `Rejection Reason: ${dto.reason}` : sale.additionalInfo,
        updatedAt: new Date(),
      },
    });

    try {
      await writeSecurityAuditEvent(this.prisma, {
        eventType: 'ADMIN_TRADE_REVIEW',
        event: `Admin Trade ${dto.action}`,
        outcome: 'SUCCESS',
        actorType: 'ADMIN',
        description: `Trade ${sale.id} ${dto.action === 'APPROVE' ? 'Approved' : 'Rejected'} by Admin.`,
        metadata: { tradeId: sale.id, action: dto.action, reason: dto.reason },
      });
    } catch (_) {}

    return {
      success: true,
      tradeId: sale.id,
      status: this.adminStatusLabel(updated.status),
    };
  }
}

