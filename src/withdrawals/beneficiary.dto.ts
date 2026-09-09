import { BeneficiaryType, PaymentMethod } from '../generated/prisma';
import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ResolveBeneficiaryAccountDto {
  @IsString()
  @Matches(/^[A-Z]{2}$/)
  countryCode!: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/)
  currencyCode!: string;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  institutionCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  institutionName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  routingNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  sortCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  mobileMoneyNumber?: string;
}

export class CreateBeneficiaryDto {
  @IsString()
  @Matches(/^[A-Z]{2}$/)
  countryCode!: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/)
  currencyCode!: string;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsEnum(BeneficiaryType)
  type!: BeneficiaryType;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  institutionName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  institutionCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  accountHolderName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  routingNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  sortCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  mobileMoneyNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  label?: string;
}
