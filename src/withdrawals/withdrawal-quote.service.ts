import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Decimal } from '@prisma/client-runtime-utils';
import { PaymentMethod, WithdrawalQuoteStatus } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { CreateWithdrawalQuoteDto } from './withdrawals.dto';

const SOURCE_CURRENCY = 'USD';
const COUNTRY_CURRENCY: Record<string, string> = {
  NG: 'NGN',
  GH: 'GHS',
  GB: 'GBP',
  US: 'USD',
  CA: 'CAD',
};
const SUPPORTED_METHODS = new Set<PaymentMethod>([PaymentMethod.BANK_TRANSFER]);

export type WithdrawalQuoteResult = {
  id: string;
  sourceCurrency: string;
  sourceAmount: string;
  countryCode: string;
  destinationCurrency: string;
  paymentMethod: PaymentMethod;
  fxRate: string;
  grossDestinationAmount: string;
  providerFee: string;
  nobleCardsFee: string;
  totalFee: string;
  destinationFee: string;
  recipientAmount: string;
  status: WithdrawalQuoteStatus;
  createdAt: Date;
  expiresAt: Date;
  usable: boolean;
};

@Injectable()
export class WithdrawalQuoteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exchangeRates: ExchangeRatesService,
    private readonly config: ConfigService,
  ) {}

  async createQuote(userId: string, input: CreateWithdrawalQuoteDto): Promise<WithdrawalQuoteResult> {
    const prisma = this.prisma as any;
    const countryCode = input.countryCode.toUpperCase();
    const destinationCurrencyCode = input.destinationCurrencyCode.toUpperCase();
    const expectedCurrency = COUNTRY_CURRENCY[countryCode];
    if (!expectedCurrency) throw new BadRequestException('Withdrawal destination is not supported.');
    if (destinationCurrencyCode !== expectedCurrency) {
      throw new BadRequestException('Destination currency does not match the selected country.');
    }
    if (!SUPPORTED_METHODS.has(input.paymentMethod)) {
      throw new BadRequestException('Withdrawal method is not currently supported.');
    }

    let sourceAmount: Decimal;
    try {
      sourceAmount = new Decimal(input.sourceAmount);
    } catch {
      throw new BadRequestException('Source amount must be a valid decimal.');
    }
    if (!sourceAmount.isFinite() || sourceAmount.lte(0)) {
      throw new BadRequestException('Source amount must be greater than zero.');
    }
    sourceAmount = sourceAmount.toDecimalPlaces(2);

    if (input.idempotencyKey) {
      const existing = await prisma.withdrawalQuote.findFirst({
        where: { userId, idempotencyKey: input.idempotencyKey },
      });
      if (existing) return this.toResult(existing);
    }

    const fxRate = destinationCurrencyCode === SOURCE_CURRENCY
      ? new Decimal(1)
      : new Decimal(String((await this.exchangeRates.getRates()).rates[destinationCurrencyCode] ?? 0));
    if (fxRate.lte(0)) throw new BadRequestException('Exchange rate is unavailable for the selected currency.');

    const providerPercent = this.getPercent('WITHDRAWAL_PROVIDER_FEE_PERCENT');
    const nobleCardsPercent = this.getPercent('WITHDRAWAL_NOBLECARDS_FEE_PERCENT');
    const providerFee = sourceAmount.mul(providerPercent).div(100).toDecimalPlaces(2);
    const nobleCardsFee = sourceAmount.mul(nobleCardsPercent).div(100).toDecimalPlaces(2);
    const totalFee = providerFee.plus(nobleCardsFee).toDecimalPlaces(2);
    const grossDestinationAmount = sourceAmount.mul(fxRate).toDecimalPlaces(2);
    const destinationFee = totalFee.mul(fxRate).toDecimalPlaces(2);
    const recipientAmount = sourceAmount.minus(totalFee).mul(fxRate).toDecimalPlaces(2);
    if (recipientAmount.lt(0)) throw new BadRequestException('Fees exceed the source amount.');

    const ttlSeconds = this.getPositiveInteger('WITHDRAWAL_QUOTE_TTL_SECONDS', 300);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);
    const currency = await prisma.currency.findUnique({ where: { code: destinationCurrencyCode } });
    if (!currency || !currency.enabled) throw new BadRequestException('Destination currency is unavailable.');

    try {
      const quote = await prisma.withdrawalQuote.create({
        data: {
          userId,
          sourceCurrencyCode: SOURCE_CURRENCY,
          destinationCurrencyCode,
          countryCode,
          paymentMethod: input.paymentMethod,
          sourceAmount,
          exchangeRate: fxRate.toDecimalPlaces(8),
          destinationAmount: grossDestinationAmount,
          destinationFee,
          recipientAmount,
          providerFee,
          nobleCardsFee,
          totalFee,
          amountReceived: recipientAmount,
          status: WithdrawalQuoteStatus.ACTIVE,
          expiresAt,
          ...(input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : {}),
        } as any,
      });
      return this.toResult(quote);
    } catch (error) {
      if (input.idempotencyKey && (error as { code?: string })?.code === 'P2002') {
        const existing = await prisma.withdrawalQuote.findFirst({ where: { userId, idempotencyKey: input.idempotencyKey } });
        if (existing) return this.toResult(existing);
      }
      throw error;
    }
  }

  async getQuoteForUser(userId: string, quoteId: string): Promise<WithdrawalQuoteResult> {
    const prisma = this.prisma as any;
    const quote = await prisma.withdrawalQuote.findFirst({ where: { id: quoteId, userId } });
    if (!quote) throw new NotFoundException('Withdrawal quote not found.');
    if (quote.status === WithdrawalQuoteStatus.ACTIVE && new Date() >= quote.expiresAt) {
      const expired = await prisma.withdrawalQuote.updateMany({
        where: { id: quote.id, userId, status: WithdrawalQuoteStatus.ACTIVE },
        data: { status: WithdrawalQuoteStatus.EXPIRED },
      });
      return this.toResult(expired.count === 1 ? { ...quote, status: WithdrawalQuoteStatus.EXPIRED } : quote);
    }
    return this.toResult(quote);
  }

  private getPercent(name: string) {
    const value = Number(this.config.get<string | number>(name, 0));
    if (!Number.isFinite(value) || value < 0 || value > 100) throw new ConflictException(`${name} is invalid.`);
    return new Decimal(String(value));
  }

  private getPositiveInteger(name: string, fallback: number) {
    const value = Number(this.config.get<string | number>(name, fallback));
    return Number.isInteger(value) && value > 0 ? value : fallback;
  }

  private toResult(quote: any): WithdrawalQuoteResult {
    const usable = quote.status === WithdrawalQuoteStatus.ACTIVE && new Date() < quote.expiresAt;
    return {
      id: quote.id,
      sourceCurrency: quote.sourceCurrencyCode,
      sourceAmount: quote.sourceAmount.toString(),
      countryCode: quote.countryCode,
      destinationCurrency: quote.destinationCurrencyCode,
      paymentMethod: quote.paymentMethod,
      fxRate: quote.exchangeRate.toString(),
      grossDestinationAmount: quote.destinationAmount.toString(),
      providerFee: quote.providerFee.toString(),
      nobleCardsFee: quote.nobleCardsFee.toString(),
      totalFee: quote.totalFee.toString(),
      destinationFee: quote.destinationFee.toString(),
      recipientAmount: quote.recipientAmount.toString(),
      status: quote.status,
      createdAt: quote.createdAt,
      expiresAt: quote.expiresAt,
      usable,
    };
  }
}