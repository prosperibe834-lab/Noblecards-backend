import { PaymentMethod } from '../generated/prisma';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';

export class CreateWithdrawalQuoteDto {
  @IsString()
  @Matches(/^\d+(\.\d{1,8})?$/)
  sourceAmount!: string;

  @IsString()
  @Matches(/^[A-Z]{2}$/)
  countryCode!: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/)
  destinationCurrencyCode!: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9._:-]{1,100}$/)
  idempotencyKey?: string;
}

export class CreateWithdrawalDto {
  @IsString()
  @Matches(/^[A-Za-z0-9-]{1,128}$/)
  quoteId!: string;

  @IsString()
  @Matches(/^[A-Za-z0-9-]{1,128}$/)
  beneficiaryId!: string;

  @IsString()
  @Matches(/^[A-Za-z0-9._:-]{1,128}$/)
  idempotencyKey!: string;

  @IsString()
  @Matches(/^\d{4}$/)
  pin!: string;
}