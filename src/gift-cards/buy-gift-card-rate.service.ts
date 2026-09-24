import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { PrismaService } from '../prisma/prisma.service';
import {
  BulkBuyGiftCardRateAdjustmentDto,
  CreateBuyGiftCardRateAdjustmentDto,
  UpdateBuyGiftCardRateAdjustmentDto,
} from './buy-gift-card.dto';
import { BuyGiftCardCatalogProduct } from './buy-gift-card-provider.interface';

@Injectable()
export class BuyGiftCardRateService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const adjustments = await this.model().findMany({ orderBy: { createdAt: 'desc' } });
    return adjustments.map((adjustment: any) => this.toResponse(adjustment));
  }

  async create(dto: CreateBuyGiftCardRateAdjustmentDto) {
    this.validateRange(dto);
    const data = this.toData(dto);
    try {
      const adjustment = await this.model().create({ data });
      return this.toResponse(adjustment);
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002') {
        throw new ConflictException('An adjustment already exists for this Buy rate combination.');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateBuyGiftCardRateAdjustmentDto) {
    this.validateRange(dto);
    const existing = await this.model().findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Buy gift card rate adjustment not found.');
    try {
      const adjustment = await this.model().update({ where: { id }, data: this.toData(dto) });
      return this.toResponse(adjustment);
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002') {
        throw new ConflictException('An adjustment already exists for this Buy rate combination.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.model().delete({ where: { id } });
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2025') {
        throw new NotFoundException('Buy gift card rate adjustment not found.');
      }
      throw error;
    }
    return { deleted: true };
  }

  async reset(id: string) {
    const existing = await this.model().findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Buy gift card rate adjustment not found.');
    const adjustment = await this.model().update({
      where: { id },
      data: { adjustmentPercent: new Decimal('0'), isActive: true },
    });
    return this.toResponse(adjustment);
  }

  async bulk(dto: BulkBuyGiftCardRateAdjustmentDto) {
    const adjustments = await this.model().findMany();
    const matching = adjustments.filter((adjustment: any) =>
      (!dto.providerProductId || adjustment.providerProductId === dto.providerProductId) &&
      (!dto.brandName || adjustment.brandName === dto.brandName) &&
      (!dto.countryCode || adjustment.countryCode === dto.countryCode) &&
      (!dto.currencyCode || adjustment.currencyCode === dto.currencyCode),
    );

    for (const adjustment of matching) {
      await this.model().update({
        where: { id: adjustment.id },
        data: { adjustmentPercent: new Decimal(String(dto.reset ? 0 : dto.adjustmentPercent)) },
      });
    }

    if (!dto.reset && matching.length === 0) {
      const created = await this.create({
        providerProductId: dto.providerProductId,
        brandName: dto.brandName,
        countryCode: dto.countryCode,
        currencyCode: dto.currencyCode,
        adjustmentPercent: dto.adjustmentPercent,
      });
      return { updated: 0, created: 1, totalAffected: 1, adjustment: created };
    }

    return { updated: matching.length, created: 0, totalAffected: matching.length };
  }

  async resolve(product: BuyGiftCardCatalogProduct, amount: number) {
    const adjustments = await this.model().findMany({ where: { isActive: true } });
    const applicable = adjustments.filter((adjustment: any) => {
      const minimum = adjustment.minimumDenomination == null ? null : Number(adjustment.minimumDenomination);
      const maximum = adjustment.maximumDenomination == null ? null : Number(adjustment.maximumDenomination);
      return (!adjustment.providerProductId || adjustment.providerProductId === product.providerProductId) &&
        (!adjustment.brandName || adjustment.brandName.toLowerCase() === product.brandName?.toLowerCase()) &&
        (!adjustment.countryCode || adjustment.countryCode === product.countryCode?.toUpperCase()) &&
        (!adjustment.currencyCode || adjustment.currencyCode === product.currency?.toUpperCase()) &&
        (minimum == null || amount >= minimum) &&
        (maximum == null || amount <= maximum);
    });

    applicable.sort((left: any, right: any) => {
      const leftSpecificity = this.specificity(left);
      const rightSpecificity = this.specificity(right);
      if (leftSpecificity !== rightSpecificity) return rightSpecificity - leftSpecificity;
      return this.rangeWidth(left) - this.rangeWidth(right);
    });
    return applicable[0] ?? null;
  }

  private model() {
    return (this.prisma as any).giftCardBuyRateAdjustment;
  }

  private validateRange(dto: CreateBuyGiftCardRateAdjustmentDto) {
    if (dto.minimumDenomination != null && dto.maximumDenomination != null && dto.minimumDenomination > dto.maximumDenomination) {
      throw new BadRequestException('Minimum denomination cannot exceed maximum denomination.');
    }
  }

  private toData(dto: CreateBuyGiftCardRateAdjustmentDto) {
    return {
      providerProductId: dto.providerProductId?.trim() || null,
      brandName: dto.brandName?.trim() || null,
      countryCode: dto.countryCode?.toUpperCase() || null,
      currencyCode: dto.currencyCode?.toUpperCase() || null,
      minimumDenomination: dto.minimumDenomination == null ? null : new Decimal(String(dto.minimumDenomination)),
      maximumDenomination: dto.maximumDenomination == null ? null : new Decimal(String(dto.maximumDenomination)),
      adjustmentPercent: new Decimal(String(dto.adjustmentPercent)),
      combinationKey: this.combinationKey(dto),
      ...(dto.isActive == null ? {} : { isActive: dto.isActive }),
    };
  }

  private combinationKey(dto: CreateBuyGiftCardRateAdjustmentDto) {
    return [
      dto.providerProductId?.trim() || '*',
      dto.brandName?.trim().toLowerCase() || '*',
      dto.countryCode?.toUpperCase() || '*',
      dto.currencyCode?.toUpperCase() || '*',
      dto.minimumDenomination ?? '*',
      dto.maximumDenomination ?? '*',
    ].join('|');
  }

  private specificity(adjustment: any) {
    return [adjustment.providerProductId, adjustment.brandName, adjustment.countryCode, adjustment.currencyCode]
      .filter(Boolean).length;
  }

  private rangeWidth(adjustment: any) {
    if (adjustment.minimumDenomination != null && adjustment.maximumDenomination != null) {
      return Number(adjustment.maximumDenomination) - Number(adjustment.minimumDenomination);
    }
    return Number.MAX_SAFE_INTEGER;
  }

  private toResponse(adjustment: any) {
    return {
      id: adjustment.id,
      providerProductId: adjustment.providerProductId,
      brandName: adjustment.brandName,
      countryCode: adjustment.countryCode,
      currencyCode: adjustment.currencyCode,
      minimumDenomination: adjustment.minimumDenomination?.toString() ?? null,
      maximumDenomination: adjustment.maximumDenomination?.toString() ?? null,
      adjustmentPercent: adjustment.adjustmentPercent.toString(),
      isActive: adjustment.isActive,
      createdAt: adjustment.createdAt,
      updatedAt: adjustment.updatedAt,
    };
  }
}
