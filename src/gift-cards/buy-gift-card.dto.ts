import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsIn, IsInt, IsNumber, IsOptional, IsString, Length, Matches, Max, MaxLength, Min } from 'class-validator';

export class BuyGiftCardCatalogQueryDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{2}$/)
  country?: string;

  @IsOptional()
  @IsString()
  @Length(3, 10)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  product?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  subcategory?: string;

  @IsOptional()
  @IsIn(['TOPUPMATE', 'topupmate'])
  provider?: string;
}

export class BuyGiftCardPurchaseDto {
  @IsString()
  @MaxLength(120)
  productId!: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(1)
  @Max(100000)
  amount!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  quantity = 1;

  @IsOptional()
  @IsEmail()
  deliveryEmail?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9._:-]{1,128}$/)
  idempotencyKey?: string;
}

export class CreateBuyGiftCardRateAdjustmentDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  providerProductId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  brandName?: string;

  @IsOptional()
  @Matches(/^[A-Z]{2}$/)
  countryCode?: string;

  @IsOptional()
  @Matches(/^[A-Z]{3}$/)
  currencyCode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  minimumDenomination?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  maximumDenomination?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-100)
  @Max(100)
  adjustmentPercent!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateBuyGiftCardRateAdjustmentDto extends CreateBuyGiftCardRateAdjustmentDto {}

export class CreateBuyGiftCardBaseRateDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  provider?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  providerProductId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  brandName?: string;

  @IsOptional()
  @Matches(/^[A-Z]{2}$/)
  countryCode?: string;

  @IsOptional()
  @Matches(/^[A-Z]{3}$/)
  currencyCode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  minimumDenomination?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  maximumDenomination?: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @Max(100)
  ratePercent!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateBuyGiftCardBaseRateDto extends CreateBuyGiftCardBaseRateDto {}

export class BulkBuyGiftCardRateAdjustmentDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  providerProductId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  brandName?: string;

  @IsOptional()
  @Matches(/^[A-Z]{2}$/)
  countryCode?: string;

  @IsOptional()
  @Matches(/^[A-Z]{3}$/)
  currencyCode?: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-100)
  @Max(100)
  adjustmentPercent!: number;

  @IsOptional()
  @IsBoolean()
  reset?: boolean;
}
