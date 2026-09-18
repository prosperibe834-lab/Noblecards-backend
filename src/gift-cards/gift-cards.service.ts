import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { randomUUID } from 'node:crypto';
import { GiftCardSaleStatus, PaymentProvider } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { BulkGiftCardRateAdjustmentDto, CreateGiftCardRateAdjustmentDto, QuoteGiftCardSaleDto, SubmitGiftCardSaleDto, UpdateGiftCardRateAdjustmentDto } from './gift-cards.dto';
import { SogoClient, SogoProviderResponse } from './sogo.client';
import { selectSogoRate } from './sogo-rate-selector';

@Injectable()
export class GiftCardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sogo: SogoClient,
  ) {}

  getSellCatalog() {
    return this.sogo.getSellCatalog();
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
      Successful: [GiftCardSaleStatus.APPROVED, GiftCardSaleStatus.PAID],
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
    return { SUBMITTED: 'Pending', UNDER_REVIEW: 'Under Review', APPROVED: 'Successful', PAID: 'Successful', FAILED: 'Failed', REJECTED: 'Rejected', CANCELLED: 'Cancelled' }[status] ?? status;
  }

  private getAdminStats(rows: any[]) {
    return {
      totalCards: rows.length,
      pendingSales: rows.filter((row) => row.status === 'Pending' || row.status === 'Under Review').length,
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

  private toSogoAdditionalInfo(dto: SubmitGiftCardSaleDto) {
    if (dto.cardType.toLowerCase() !== 'ecode') return dto.additionalInfo;

    try {
      const parsed = JSON.parse(dto.additionalInfo) as { cards?: Array<{ code?: unknown }> };
      const cards = Array.isArray(parsed.cards) ? parsed.cards : [];
      if (cards.length !== 1 || typeof cards[0]?.code !== 'string' || cards[0].code.length === 0) {
        throw new BadRequestException('Exactly one eCode redemption code is required for this Sogo submission.');
      }
      return cards[0].code;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      return dto.additionalInfo;
    }
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
}
