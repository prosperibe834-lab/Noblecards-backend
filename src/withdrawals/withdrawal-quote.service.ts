import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Decimal } from '@prisma/client-runtime-utils';
import { PaymentMethod, WithdrawalQuoteStatus } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { CreateWithdrawalQuoteDto } from './withdrawals.dto';
import {
  FlutterwavePayoutClient,
  FlutterwaveTransferFee,
} from './flutterwave-payout.client';

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

export type IndicativeWithdrawalPreview = {
  previewContractVersion: 2;
  sourceCurrency: string;
  sourceAmount: string;
  countryCode: string;
  destinationCurrency: string;
  paymentMethod: PaymentMethod;
  fxRate: string;
  exchangeRateSource: 'FLUTTERWAVE_V3';
  rateRetrievedAt: string;
  estimatedGrossDestinationAmount: string;
  estimatedTransferAmount: string;
  estimatedTransferSourceAmountUsd: string;
  nobleCardsFeeUsd: string;
  nobleCardsFeePercent: string;
  providerFeeAmount: string | null;
  providerFeeCurrency: string | null;
  providerFeeType: string | null;
  providerFeeUsdEquivalent: string | null;
  providerFeeFundingCurrency: string | null;
  providerFeeStatus:
    | 'CONFIRMED'
    | 'ESTIMATED'
    | 'AMBIGUOUS'
    | 'NO_RECORD'
    | 'UNAVAILABLE';
  providerFeeMessage: string | null;
  estimatedTotalCostsUsd: string | null;
  estimatedRecipientAmount: string | null;
  recipientAmount: null;
  payoutEnabled: false;
  isIndicativePreview: true;
};

@Injectable()
export class WithdrawalQuoteService {
  private readonly logger = new Logger(WithdrawalQuoteService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly exchangeRates: ExchangeRatesService,
    private readonly config: ConfigService,
    private readonly payoutClient: FlutterwavePayoutClient,
  ) {}

  async createIndicativePreview(
    input: CreateWithdrawalQuoteDto,
  ): Promise<IndicativeWithdrawalPreview> {
    const countryCode = input.countryCode.toUpperCase();
    const destinationCurrencyCode = input.destinationCurrencyCode.toUpperCase();
    const expectedCurrency = COUNTRY_CURRENCY[countryCode];
    if (!['GB', 'US', 'CA'].includes(countryCode) || !expectedCurrency) {
      throw new BadRequestException(
        'Indicative previews are only available for GB, US, and CA.',
      );
    }
    if (destinationCurrencyCode !== expectedCurrency) {
      throw new BadRequestException(
        'Destination currency does not match the selected country.',
      );
    }
    if (!SUPPORTED_METHODS.has(input.paymentMethod)) {
      throw new BadRequestException(
        'Withdrawal method is not currently supported.',
      );
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

    const currency = await (this.prisma as any).currency.findUnique({
      where: { code: destinationCurrencyCode },
    });
    if (!currency || !currency.enabled) {
      throw new BadRequestException('Destination currency is unavailable.');
    }

    const nobleCardsPercent = this.getPercent(
      'WITHDRAWAL_NOBLECARDS_FEE_PERCENT',
    );
    const nobleCardsFeeUsd = sourceAmount
      .mul(nobleCardsPercent)
      .div(100)
      .toDecimalPlaces(2);
    const estimatedTransferSourceAmountUsd = sourceAmount
      .minus(nobleCardsFeeUsd)
      .toDecimalPlaces(2);
    if (estimatedTransferSourceAmountUsd.lte(0)) {
      throw new BadRequestException(
        'WITHDRAWAL_FEE_CONFIGURATION_INVALID: NobleCards fee leaves no amount to transfer.',
      );
    }
    let fxRate: Decimal;
    const exchangeRateSource: 'FLUTTERWAVE_V3' = 'FLUTTERWAVE_V3';
    let rateQueryAmount: number;
    let rateRetrievedAt: Date;
    try {
      rateQueryAmount =
        destinationCurrencyCode === SOURCE_CURRENCY
          ? estimatedTransferSourceAmountUsd
              .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
              .toNumber()
          : 1;
      const transferRate = await this.payoutClient.getTransferRates(
        Math.max(1, rateQueryAmount),
        SOURCE_CURRENCY,
        destinationCurrencyCode,
      );
      fxRate = new Decimal(String(transferRate.rate));
      rateRetrievedAt = new Date();
    } catch (error) {
      this.logger.warn(
        `Flutterwave transfer rate unavailable for ${countryCode}/${destinationCurrencyCode}: ${
          error instanceof Error ? error.message : 'provider request failed'
        }`,
      );
      throw new ServiceUnavailableException(
        'Flutterwave transfer rates are unavailable for this estimate.',
      );
    }
    if (!fxRate.isFinite() || fxRate.lte(0)) {
      throw new ServiceUnavailableException(
        'Flutterwave returned an invalid transfer rate for this estimate.',
      );
    }

    const grossDestinationAmount = sourceAmount.mul(fxRate).toDecimalPlaces(2);
    const estimatedTransferAmount = estimatedTransferSourceAmountUsd
      .mul(fxRate)
      .toDecimalPlaces(2);
    const feeLookupAmount = estimatedTransferAmount.toDecimalPlaces(
      0,
      Decimal.ROUND_HALF_UP,
    );
    let providerFeeAmount: Decimal | null = null;
    let providerFeeUsdEquivalent: Decimal | null = null;
    let providerFeeType: string | null = null;
    let providerFeeCurrency: string | null = destinationCurrencyCode;
    let providerFeeFundingCurrency: string | null = destinationCurrencyCode;
    let providerFeeStatus:
      | 'CONFIRMED'
      | 'ESTIMATED'
      | 'AMBIGUOUS'
      | 'NO_RECORD'
      | 'UNAVAILABLE' = 'UNAVAILABLE';
    let providerFeeMessage: string | null = null;

    let liveFee: FlutterwaveTransferFee | null = null;
    if (feeLookupAmount.greaterThanOrEqualTo(1)) {
      try {
        liveFee = await this.payoutClient.getTransferFee(
          feeLookupAmount.toNumber(),
          destinationCurrencyCode,
        );
        this.logger.debug(
          `Flutterwave transfer-fee response for ${countryCode}/${destinationCurrencyCode}: feeType=${liveFee?.feeType}, fee=${liveFee?.fee}, currency=${liveFee?.currency}`,
        );
      } catch (error) {
        this.logger.warn(
          `Flutterwave transfer fee could not be fetched for ${countryCode}/${destinationCurrencyCode}: ${
            error instanceof Error ? error.message : 'provider request failed'
          }`,
        );
      }
    }

    if (countryCode === 'GB' && destinationCurrencyCode === 'GBP') {
      providerFeeStatus = 'ESTIMATED';
      providerFeeType = 'value';
      providerFeeAmount = new Decimal('35.00');
      providerFeeCurrency = 'GBP';
      providerFeeFundingCurrency = 'GBP';
      providerFeeUsdEquivalent = providerFeeAmount
        .div(fxRate)
        .toDecimalPlaces(2);
      providerFeeMessage =
        'Published indicative fee (GBP 35 bank transfer per Flutterwave pricing). Not an API-confirmed fee; live payouts disabled.';
    } else if (countryCode === 'US' && destinationCurrencyCode === 'USD') {
      providerFeeStatus = 'ESTIMATED';
      providerFeeType = 'value';
      providerFeeAmount = new Decimal('40.00');
      providerFeeCurrency = 'USD';
      providerFeeFundingCurrency = 'USD';
      providerFeeUsdEquivalent = providerFeeAmount;
      providerFeeMessage =
        'Published indicative fee (USD 40 bank transfer per Flutterwave pricing). Subject to account confirmation; live payouts disabled.';
    } else if (countryCode === 'CA') {
      providerFeeStatus = 'NO_RECORD';
      providerFeeType = null;
      providerFeeAmount = null;
      providerFeeCurrency = 'CAD';
      providerFeeFundingCurrency = 'CAD';
      providerFeeUsdEquivalent = null;
      providerFeeMessage =
        'Canada (CAD) bank transfers are not currently supported by our payout integration.';
    } else if (
      liveFee &&
      liveFee.feeType === 'value' &&
      liveFee.currency === destinationCurrencyCode
    ) {
      providerFeeStatus = 'CONFIRMED';
      providerFeeType = 'value';
      providerFeeAmount = new Decimal(String(liveFee.fee));
      providerFeeCurrency = destinationCurrencyCode;
      providerFeeFundingCurrency = destinationCurrencyCode;
      providerFeeUsdEquivalent =
        destinationCurrencyCode === SOURCE_CURRENCY
          ? providerFeeAmount
          : providerFeeAmount.div(fxRate).toDecimalPlaces(2);
      providerFeeMessage = null;
    } else {
      providerFeeStatus = liveFee ? 'AMBIGUOUS' : 'NO_RECORD';
      providerFeeType = null;
      providerFeeAmount = null;
      providerFeeCurrency = destinationCurrencyCode;
      providerFeeFundingCurrency = destinationCurrencyCode;
      providerFeeUsdEquivalent = null;
      providerFeeMessage =
        'Flutterwave did not return a verified transfer fee for this currency.';
    }

    const estimatedTotalCostsUsd =
      (providerFeeStatus === 'CONFIRMED' ||
        providerFeeStatus === 'ESTIMATED') &&
      providerFeeUsdEquivalent !== null
        ? providerFeeUsdEquivalent.plus(nobleCardsFeeUsd).toDecimalPlaces(2)
        : null;

    let estimatedRecipientAmount: Decimal | null = null;
    if (
      (providerFeeStatus === 'CONFIRMED' ||
        providerFeeStatus === 'ESTIMATED') &&
      providerFeeAmount !== null
    ) {
      const netDestination = estimatedTransferAmount.minus(providerFeeAmount);
      if (netDestination.greaterThan(0)) {
        estimatedRecipientAmount = netDestination.toDecimalPlaces(2);
      }
    }

    return {
      previewContractVersion: 2,
      sourceCurrency: SOURCE_CURRENCY,
      sourceAmount: sourceAmount.toFixed(2),
      countryCode,
      destinationCurrency: destinationCurrencyCode,
      paymentMethod: input.paymentMethod,
      fxRate: fxRate.toDecimalPlaces(8).toString(),
      exchangeRateSource,
      rateRetrievedAt: rateRetrievedAt.toISOString(),
      estimatedGrossDestinationAmount: grossDestinationAmount.toFixed(2),
      estimatedTransferAmount: estimatedTransferAmount.toFixed(2),
      estimatedTransferSourceAmountUsd:
        estimatedTransferSourceAmountUsd.toFixed(2),
      nobleCardsFeeUsd: nobleCardsFeeUsd.toFixed(2),
      nobleCardsFeePercent: nobleCardsPercent.toString(),
      providerFeeAmount: providerFeeAmount?.toFixed(2) ?? null,
      providerFeeCurrency,
      providerFeeType,
      providerFeeUsdEquivalent: providerFeeUsdEquivalent?.toFixed(2) ?? null,
      providerFeeStatus,
      providerFeeMessage,
      estimatedTotalCostsUsd: estimatedTotalCostsUsd?.toFixed(2) ?? null,
      providerFeeFundingCurrency,
      estimatedRecipientAmount: estimatedRecipientAmount?.toFixed(2) ?? null,
      recipientAmount: null,
      payoutEnabled: false,
      isIndicativePreview: true,
    };
  }

  private get isSandbox(): boolean {
    return (
      this.config?.get<string>('FLUTTERWAVE_PAYOUT_ENVIRONMENT')?.toLowerCase() ===
      'sandbox'
    );
  }

  async createQuote(
    userId: string,
    input: CreateWithdrawalQuoteDto,
  ): Promise<WithdrawalQuoteResult> {
    const prisma = this.prisma as any;
    const countryCode = input.countryCode.toUpperCase();
    const destinationCurrencyCode = input.destinationCurrencyCode.toUpperCase();
    const expectedCurrency = COUNTRY_CURRENCY[countryCode];
    if (!expectedCurrency)
      throw new BadRequestException('Withdrawal destination is not supported.');
    if (destinationCurrencyCode !== expectedCurrency) {
      throw new BadRequestException(
        'Destination currency does not match the selected country.',
      );
    }
    if (!SUPPORTED_METHODS.has(input.paymentMethod)) {
      throw new BadRequestException(
        'Withdrawal method is not currently supported.',
      );
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

    if (!this.isSandbox && ['GB', 'US', 'CA'].includes(countryCode)) {
      throw new BadRequestException(
        'PAYOUT_CORRIDOR_UNVERIFIED: Direct quote creation is not supported for this corridor. Use indicative preview.',
      );
    }

    if (input.idempotencyKey) {
      const existing = await prisma.withdrawalQuote.findFirst({
        where: { userId, idempotencyKey: input.idempotencyKey },
      });
      if (existing) return this.toResult(existing);
    }

    let fxRate: Decimal;
    if (destinationCurrencyCode === SOURCE_CURRENCY) {
      fxRate = new Decimal(1);
    } else {
      let rates: Awaited<ReturnType<ExchangeRatesService['getRates']>>;
      try {
        rates = await this.exchangeRates.getRates();
      } catch {
        throw new ServiceUnavailableException(
          'Exchange rates are temporarily unavailable for this withdrawal quote.',
        );
      }
      fxRate = new Decimal(String(rates.rates[destinationCurrencyCode] ?? 0));
    }
    if (fxRate.lte(0))
      throw new BadRequestException(
        'Exchange rate is unavailable for the selected currency.',
      );

    const providerPercent = this.getPercent(
      `WITHDRAWAL_PROVIDER_FEE_PERCENT_${countryCode}_${destinationCurrencyCode}`,
      'WITHDRAWAL_PROVIDER_FEE_PERCENT',
    );
    const nobleCardsPercent = this.getPercent(
      'WITHDRAWAL_NOBLECARDS_FEE_PERCENT',
    );
    const providerFee = sourceAmount
      .mul(providerPercent)
      .div(100)
      .toDecimalPlaces(2);
    const nobleCardsFee = sourceAmount
      .mul(nobleCardsPercent)
      .div(100)
      .toDecimalPlaces(2);
    const totalFee = providerFee.plus(nobleCardsFee).toDecimalPlaces(2);
    const grossDestinationAmount = sourceAmount.mul(fxRate).toDecimalPlaces(2);
    const destinationFee = totalFee.mul(fxRate).toDecimalPlaces(2);
    const recipientAmount = grossDestinationAmount
      .minus(destinationFee)
      .toDecimalPlaces(2);
    if (recipientAmount.lte(0))
      throw new BadRequestException(
        'Fees must be less than the source amount.',
      );

    const ttlSeconds = this.getPositiveInteger(
      'WITHDRAWAL_QUOTE_TTL_SECONDS',
      300,
    );
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);
    const currency = await prisma.currency.findUnique({
      where: { code: destinationCurrencyCode },
    });
    if (!currency || !currency.enabled)
      throw new BadRequestException('Destination currency is unavailable.');

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
          ...(input.idempotencyKey
            ? { idempotencyKey: input.idempotencyKey }
            : {}),
        } as any,
      });
      return this.toResult(quote);
    } catch (error) {
      if (
        input.idempotencyKey &&
        (error as { code?: string })?.code === 'P2002'
      ) {
        const existing = await prisma.withdrawalQuote.findFirst({
          where: { userId, idempotencyKey: input.idempotencyKey },
        });
        if (existing) return this.toResult(existing);
      }
      throw error;
    }
  }

  async getQuoteForUser(
    userId: string,
    quoteId: string,
  ): Promise<WithdrawalQuoteResult> {
    const prisma = this.prisma as any;
    const quote = await prisma.withdrawalQuote.findFirst({
      where: { id: quoteId, userId },
    });
    if (!quote) throw new NotFoundException('Withdrawal quote not found.');
    if (
      quote.status === WithdrawalQuoteStatus.ACTIVE &&
      new Date() >= quote.expiresAt
    ) {
      const expired = await prisma.withdrawalQuote.updateMany({
        where: { id: quote.id, userId, status: WithdrawalQuoteStatus.ACTIVE },
        data: { status: WithdrawalQuoteStatus.EXPIRED },
      });
      return this.toResult(
        expired.count === 1
          ? { ...quote, status: WithdrawalQuoteStatus.EXPIRED }
          : quote,
      );
    }
    return this.toResult(quote);
  }

  private getPercent(name: string, fallbackName?: string) {
    let configName = name;
    let configured = this.config.get<string | number>(configName);
    if (
      (configured === undefined ||
        configured === null ||
        (typeof configured === 'string' && configured.trim() === '')) &&
      fallbackName
    ) {
      configName = fallbackName;
      configured = this.config.get<string | number>(configName);
    }

    if (
      configured === undefined ||
      configured === null ||
      (typeof configured !== 'string' && typeof configured !== 'number') ||
      String(configured).trim() === ''
    ) {
      throw new ConflictException(
        `WITHDRAWAL_FEE_CONFIGURATION_MISSING: ${configName} must be configured.`,
      );
    }
    const value = Number(configured);
    if (!Number.isFinite(value) || value < 0 || value > 100)
      throw new ConflictException(`${configName} is invalid.`);
    return new Decimal(String(value));
  }

  private getPositiveInteger(name: string, fallback: number) {
    const value = Number(this.config.get<string | number>(name, fallback));
    return Number.isInteger(value) && value > 0 ? value : fallback;
  }

  private toResult(quote: any): WithdrawalQuoteResult {
    const usable =
      quote.status === WithdrawalQuoteStatus.ACTIVE &&
      new Date() < quote.expiresAt;
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
