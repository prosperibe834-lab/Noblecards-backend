import { BeneficiaryType, PaymentMethod } from '../generated/prisma';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  @MinLength(1)
  @MaxLength(64)
  branchCode?: string;

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
  @MinLength(2)
  @MaxLength(128)
  accountHolderName?: string;
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
  @MinLength(1)
  @MaxLength(64)
  branchCode?: string;

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

  @IsOptional()
  @IsString()
  @MaxLength(16)
  accountType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  institutionNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  transitNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  swiftCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  beneficiaryAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  streetNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  streetName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  postalCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  transferReason?: string;

  @IsOptional()
  @IsBoolean()
  saveAccount?: boolean;
}
