import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { PrismaService } from '../prisma/prisma.service';
import { BuyGiftCardCatalogProduct } from './buy-gift-card-provider.interface';
import { CreateBuyGiftCardBaseRateDto, UpdateBuyGiftCardBaseRateDto } from './buy-gift-card.dto';

@Injectable()
export class BuyGiftCardBaseRateService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const rows = await this.model().findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map((row: any) => this.toResponse(row));
  }

  async create(dto: CreateBuyGiftCardBaseRateDto) {
    this.validateRange(dto);
    try {
      const row = await this.model().create({ data: this.toData(dto) });
      return this.toResponse(row);
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002') {
        throw new ConflictException('A Buy Base Rate already exists for this scope.');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateBuyGiftCardBaseRateDto) {
    this.validateRange(dto);
    const existing = await this.model().findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Buy Base Rate not found.');
    try {
      const row = await this.model().update({ where: { id }, data: this.toData(dto) });
      return this.toResponse(row);
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002') {
        throw new ConflictException('A Buy Base Rate already exists for this scope.');
      }
      throw error;
    }
  }

  async reset(id: string) {
    const existing = await this.model().findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Buy Base Rate not found.');
    const row = await this.model().update({ where: { id }, data: { isActive: false } });
    return this.toResponse(row);
  }

  async resolve(product: BuyGiftCardCatalogProduct, amount: number) {
    const rows = await this.model().findMany({ where: { provider: product.provider, isActive: true } });
    const applicable = rows.filter((row: any) => {
      const minimum = row.minimumDenomination == null ? null : Number(row.minimumDenomination);
      const maximum = row.maximumDenomination == null ? null : Number(row.maximumDenomination);
      return (!row.providerProductId || row.providerProductId === product.providerProductId) &&
        (!row.brandName || row.brandName.toLowerCase() === product.brandName?.toLowerCase()) &&
        (!row.countryCode || row.countryCode === product.countryCode?.toUpperCase()) &&
        (!row.currencyCode || row.currencyCode === product.currency?.toUpperCase()) &&
        (minimum == null || amount >= minimum) &&
        (maximum == null || amount <= maximum);
    });

    applicable.sort((left: any, right: any) => {
      const priorityDifference = this.scopePriority(right) - this.scopePriority(left);
      if (priorityDifference !== 0) return priorityDifference;
      return this.rangeWidth(left) - this.rangeWidth(right);
    });
    return applicable[0] ?? null;
  }

  private model() {
    return (this.prisma as any).giftCardBuyBaseRate;
  }

  private validateRange(dto: CreateBuyGiftCardBaseRateDto) {
    if (dto.minimumDenomination != null && dto.maximumDenomination != null && dto.minimumDenomination > dto.maximumDenomination) {
      throw new BadRequestException('Minimum denomination cannot exceed maximum denomination.');
    }
  }

  private toData(dto: CreateBuyGiftCardBaseRateDto) {
    return {
      provider: (dto.provider || 'TREMENDOUS').trim().toUpperCase(),
      providerProductId: dto.providerProductId?.trim() || null,
      brandName: dto.brandName?.trim() || null,
      countryCode: dto.countryCode?.toUpperCase() || null,
      currencyCode: dto.currencyCode?.toUpperCase() || null,
      minimumDenomination: dto.minimumDenomination == null ? null : new Decimal(String(dto.minimumDenomination)),
      maximumDenomination: dto.maximumDenomination == null ? null : new Decimal(String(dto.maximumDenomination)),
      ratePercent: new Decimal(String(dto.ratePercent)),
      combinationKey: this.combinationKey(dto),
      ...(dto.isActive == null ? {} : { isActive: dto.isActive }),
    };
  }

  private combinationKey(dto: CreateBuyGiftCardBaseRateDto) {
    return [
      (dto.provider || 'TREMENDOUS').trim().toUpperCase(),
      dto.providerProductId?.trim() || '*',
      dto.brandName?.trim().toLowerCase() || '*',
      dto.countryCode?.toUpperCase() || '*',
      dto.currencyCode?.toUpperCase() || '*',
      dto.minimumDenomination ?? '*',
      dto.maximumDenomination ?? '*',
    ].join('|');
  }

  private scopePriority(row: any) {
    if (row.providerProductId) return 400 + (row.brandName ? 10 : 0) + (row.countryCode ? 2 : 0) + (row.currencyCode ? 1 : 0);
    if (row.brandName) return 300 + (row.countryCode ? 2 : 0) + (row.currencyCode ? 1 : 0);
    if (row.countryCode && row.currencyCode) return 200;
    return 0;
  }

  private rangeWidth(row: any) {
    if (row.minimumDenomination != null && row.maximumDenomination != null) {
      return Number(row.maximumDenomination) - Number(row.minimumDenomination);
    }
    return Number.MAX_SAFE_INTEGER;
  }

  private toResponse(row: any) {
    return {
      id: row.id,
      provider: row.provider,
      providerProductId: row.providerProductId,
      brandName: row.brandName,
      countryCode: row.countryCode,
      currencyCode: row.currencyCode,
      minimumDenomination: row.minimumDenomination?.toString() ?? null,
      maximumDenomination: row.maximumDenomination?.toString() ?? null,
      ratePercent: row.ratePercent.toString(),
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
