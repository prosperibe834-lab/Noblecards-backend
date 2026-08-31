import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Length, Matches, Min } from 'class-validator';

export enum DepositProviderOption {
  FLUTTERWAVE = 'FLUTTERWAVE',
  MANUAL = 'MANUAL',
}

export enum DepositPaymentMethodOption {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD',
  USSD = 'USSD',
  MOBILE_MONEY = 'MOBILE_MONEY',
  WALLET_TRANSFER = 'WALLET_TRANSFER',
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY',
  WISE = 'WISE',
  OTHER = 'OTHER',
}

export class CreateDepositDto {
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0.01)
  amount!: number;

  @IsString()
  @Length(3, 10)
  @Matches(/^[A-Z]{3}$/)
  currency!: string;

  @IsOptional()
  @IsEnum(DepositProviderOption)
  provider?: DepositProviderOption;

  @IsOptional()
  @IsEnum(DepositPaymentMethodOption)
  paymentMethod?: DepositPaymentMethodOption;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
