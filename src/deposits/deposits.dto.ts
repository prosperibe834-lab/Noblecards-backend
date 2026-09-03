import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Length, Matches, Min, ValidateNested } from 'class-validator';

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

export class CardDetailsDto {
  @IsString()
  @Matches(/^\d{13,19}$/)
  cardNumber!: string;

  @IsString()
  @Matches(/^\d{3,4}$/)
  cvv!: string;

  @IsString()
  @Matches(/^\d{1,2}$/)
  expiryMonth!: string;

  @IsString()
  @Matches(/^\d{2,4}$/)
  expiryYear!: string;

  @IsString()
  @Length(2, 120)
  cardHolderName!: string;
}

export class CreateCardDepositDto {
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0.01)
  amount!: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0.01)
  requestedAmount!: number;

  @IsString()
  @Length(3, 3)
  @Matches(/^(NGN|GHS|GBP)$/)
  currency!: string;

  @ValidateNested()
  @Type(() => CardDetailsDto)
  card!: CardDetailsDto;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
