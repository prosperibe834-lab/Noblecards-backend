import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsInt, IsNumber, IsOptional, IsString, Length, Matches, Max, MaxLength, Min } from 'class-validator';

export class AdminGiftCardSandboxTestDto {
  @IsString()
  @MaxLength(120)
  productId!: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0.01)
  @Max(100000)
  amount!: number;

  @IsString()
  @Matches(/^[A-Z]{3}$/)
  currencyCode!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1)
  quantity = 1;

  @IsEmail()
  recipientEmail!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9._:-]{1,128}$/)
  idempotencyKey?: string;
}

export class SubmitGiftCardSaleDto {
  @IsString()
  @Matches(/^[a-z0-9][a-z0-9_-]{1,80}$/i)
  slug!: string;

  @IsString()
  @Matches(/^[A-Z]{2}$/)
  cardCountry!: string;

  @IsString()
  @Length(3, 32)
  cardType!: string;

  @IsOptional()
  @IsString()
  @Length(2, 40)
  receiptType?: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/)
  cardCurrency!: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/)
  payoutCurrency!: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0.01)
  cardAmount!: number;

  @IsString()
  @MaxLength(4000)
  additionalInfo!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9._:-]{1,128}$/)
  idempotencyKey?: string;
}

export class QuoteGiftCardSaleDto {
  @IsString()
  @Matches(/^[a-z0-9][a-z0-9_-]{1,80}$/i)
  slug!: string;

  @IsString()
  @Matches(/^[A-Z]{2}$/)
  cardCountry!: string;

  @IsString()
  @Length(3, 32)
  cardType!: string;

  @IsOptional()
  @IsString()
  @Length(2, 40)
  receiptType?: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/)
  cardCurrency!: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/)
  payoutCurrency!: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0.01)
  cardAmount!: number;
}

export class CreateGiftCardRateAdjustmentDto {
  @IsString()
  @Matches(/^[a-z0-9][a-z0-9_-]{1,80}$/i)
  slug!: string;

  @IsString()
  @Matches(/^[A-Z]{2}$/)
  cardCountry!: string;

  @IsString()
  @Length(3, 32)
  cardType!: string;

  @IsOptional()
  @IsString()
  @Length(2, 40)
  receiptType?: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/)
  cardCurrency!: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/)
  payoutCurrency!: string;

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
  isActive?: boolean;
}

export class UpdateGiftCardRateAdjustmentDto extends CreateGiftCardRateAdjustmentDto {}

export class BulkGiftCardRateAdjustmentDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @Matches(/^[A-Z]{2}$/)
  cardCountry?: string;

  @IsOptional()
  @Matches(/^[A-Z]{3}$/)
  cardCurrency?: string;

  @IsOptional()
  @Matches(/^[A-Z]{3}$/)
  payoutCurrency?: string;

  @IsOptional()
  @IsString()
  @Length(3, 32)
  cardType?: string;

  @IsOptional()
  @IsString()
  @Length(2, 40)
  receiptType?: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-100)
  @Max(100)
  adjustmentPercent!: number;

  @IsOptional()
  @IsBoolean()
  reset?: boolean;
}
