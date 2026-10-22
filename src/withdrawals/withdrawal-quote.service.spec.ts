import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { ConfigService } from '@nestjs/config';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { WithdrawalQuoteService } from './withdrawal-quote.service';

describe('WithdrawalQuoteService', () => {
  const expectMoney = (actual: string, expected: string) => {
    expect(new Decimal(actual).equals(new Decimal(expected))).toBe(true);
  };

  const mockTransferRates: Record<string, number> = {
    GBP: 0.75,
    USD: 1,
    CAD: 1.35,
  };
  const mockRates = {
    USD: 1,
    NGN: 1500,
    GHS: 12.5,
    GBP: 0.75,
    CAD: 1.35,
  };

  const makeService = (configOverrides: Record<string, unknown> = {}) => {
    const prisma: any = {
      withdrawalQuote: {
        findFirst: jest.fn(),
        create: jest.fn(),
        updateMany: jest.fn(),
      },
      currency: {
        findUnique: jest.fn(),
      },
    };

    const exchangeRates: any = {
      getRates: jest.fn().mockResolvedValue({
        rates: mockRates,
        updatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 60_000).toISOString(),
      }),
    };

    const config = {
      get: jest.fn((key: string, fallback?: any) => {
        const values: Record<string, any> = {
          WITHDRAWAL_PROVIDER_FEE_PERCENT: 2,
          WITHDRAWAL_NOBLECARDS_FEE_PERCENT: 1,
          WITHDRAWAL_QUOTE_TTL_SECONDS: 300,
          ...configOverrides,
        };
        return values[key] ?? fallback;
      }),
    } as unknown as ConfigService;

    const payoutClient: any = {
      getTransferFee: jest.fn().mockResolvedValue(null),
      getTransferRates: jest.fn(
        async (_amount: number, _source: string, destination: string) => ({
          rate: mockTransferRates[destination],
          source: { currency: 'USD', amount: 1 },
          destination: {
            currency: destination,
            amount: mockTransferRates[destination],
          },
        }),
      ),
    };
    const service = new WithdrawalQuoteService(
      prisma,
      exchangeRates,
      config,
      payoutClient,
    );
    return { service, prisma, exchangeRates, config, payoutClient };
  };

  it('uses Flutterwave documented GBP 35 indicative fee and calculates defensible recipient amount for UK', async () => {
    const { service, prisma, payoutClient, exchangeRates } = makeService({
      WITHDRAWAL_NOBLECARDS_FEE_PERCENT: 3,
    });
    prisma.currency.findUnique.mockResolvedValue({
      code: 'GBP',
      enabled: true,
    });

    const result = await service.createIndicativePreview({
      sourceAmount: '100',
      countryCode: 'GB',
      destinationCurrencyCode: 'GBP',
      paymentMethod: 'BANK_TRANSFER',
    });

    expect(result).toMatchObject({
      previewContractVersion: 2,
      sourceCurrency: 'USD',
      sourceAmount: '100.00',
      countryCode: 'GB',
      destinationCurrency: 'GBP',
      fxRate: '0.75',
      exchangeRateSource: 'FLUTTERWAVE_V3',
      estimatedGrossDestinationAmount: '75.00',
      estimatedTransferAmount: '72.75',
      estimatedTransferSourceAmountUsd: '97.00',
      nobleCardsFeeUsd: '3.00',
      nobleCardsFeePercent: '3',
      providerFeeAmount: '35.00',
      providerFeeCurrency: 'GBP',
      providerFeeType: 'value',
      providerFeeUsdEquivalent: '46.67',
      providerFeeStatus: 'ESTIMATED',
      estimatedTotalCostsUsd: '49.67',
      estimatedRecipientAmount: '37.75',
      recipientAmount: null,
      payoutEnabled: false,
      isIndicativePreview: true,
    });
    expect(result.providerFeeMessage).toContain('Published indicative fee (GBP 35');
    expect(result.rateRetrievedAt).toBeTruthy();
    expect(payoutClient.getTransferRates).toHaveBeenCalledWith(1, 'USD', 'GBP');
    expect(payoutClient.getTransferFee).toHaveBeenCalledWith(73, 'GBP');
    expect(exchangeRates.getRates).not.toHaveBeenCalled();
    expect(prisma.withdrawalQuote.create).not.toHaveBeenCalled();
  });

  it('uses Flutterwave documented USD 40 indicative fee and calculates defensible recipient amount for USA', async () => {
    const { service, prisma, payoutClient, exchangeRates } = makeService({
      WITHDRAWAL_NOBLECARDS_FEE_PERCENT: 3,
    });
    prisma.currency.findUnique.mockResolvedValue({
      code: 'USD',
      enabled: true,
    });

    const result = await service.createIndicativePreview({
      sourceAmount: '100',
      countryCode: 'US',
      destinationCurrencyCode: 'USD',
      paymentMethod: 'BANK_TRANSFER',
    });

    expect(result).toMatchObject({
      previewContractVersion: 2,
      sourceCurrency: 'USD',
      sourceAmount: '100.00',
      countryCode: 'US',
      destinationCurrency: 'USD',
      fxRate: '1',
      exchangeRateSource: 'FLUTTERWAVE_V3',
      estimatedGrossDestinationAmount: '100.00',
      estimatedTransferAmount: '97.00',
      estimatedTransferSourceAmountUsd: '97.00',
      nobleCardsFeeUsd: '3.00',
      nobleCardsFeePercent: '3',
      providerFeeAmount: '40.00',
      providerFeeCurrency: 'USD',
      providerFeeType: 'value',
      providerFeeUsdEquivalent: '40.00',
      providerFeeStatus: 'ESTIMATED',
      estimatedTotalCostsUsd: '43.00',
      estimatedRecipientAmount: '57.00',
      recipientAmount: null,
      payoutEnabled: false,
      isIndicativePreview: true,
    });
    expect(result.providerFeeMessage).toContain('Published indicative fee (USD 40');
    expect(payoutClient.getTransferRates).toHaveBeenCalledWith(97, 'USD', 'USD');
    expect(payoutClient.getTransferFee).toHaveBeenCalledWith(97, 'USD');
    expect(exchangeRates.getRates).not.toHaveBeenCalled();
    expect(prisma.withdrawalQuote.create).not.toHaveBeenCalled();
  });

  it('keeps Canada (CAD) provider fee and recipient amount unconfirmed and live payouts disabled', async () => {
    const { service, prisma, payoutClient } = makeService({
      WITHDRAWAL_NOBLECARDS_FEE_PERCENT: 3,
    });
    prisma.currency.findUnique.mockResolvedValue({
      code: 'CAD',
      enabled: true,
    });

    const result = await service.createIndicativePreview({
      sourceAmount: '100',
      countryCode: 'CA',
      destinationCurrencyCode: 'CAD',
      paymentMethod: 'BANK_TRANSFER',
    });

    expect(result).toMatchObject({
      previewContractVersion: 2,
      sourceCurrency: 'USD',
      sourceAmount: '100.00',
      countryCode: 'CA',
      destinationCurrency: 'CAD',
      fxRate: '1.35',
      exchangeRateSource: 'FLUTTERWAVE_V3',
      estimatedGrossDestinationAmount: '135.00',
      estimatedTransferAmount: '130.95',
      estimatedTransferSourceAmountUsd: '97.00',
      nobleCardsFeeUsd: '3.00',
      nobleCardsFeePercent: '3',
      providerFeeAmount: null,
      providerFeeCurrency: 'CAD',
      providerFeeType: null,
      providerFeeUsdEquivalent: null,
      providerFeeStatus: 'NO_RECORD',
      estimatedTotalCostsUsd: null,
      estimatedRecipientAmount: null,
      recipientAmount: null,
      payoutEnabled: false,
      isIndicativePreview: true,
    });
    expect(result.providerFeeMessage).toContain('Canada (CAD) bank transfers are not currently supported');
    expect(payoutClient.getTransferRates).toHaveBeenCalledWith(1, 'USD', 'CAD');
    expect(prisma.withdrawalQuote.create).not.toHaveBeenCalled();
  });

  it('does not calculate estimated recipient amount if indicative fee exceeds transfer principal', async () => {
    const { service, prisma } = makeService({
      WITHDRAWAL_NOBLECARDS_FEE_PERCENT: 3,
    });
    prisma.currency.findUnique.mockResolvedValue({
      code: 'GBP',
      enabled: true,
    });

    // 20 USD source -> 19.40 USD transfer source -> 14.55 GBP transfer amount < 35 GBP fee
    const result = await service.createIndicativePreview({
      sourceAmount: '20',
      countryCode: 'GB',
      destinationCurrencyCode: 'GBP',
      paymentMethod: 'BANK_TRANSFER',
    });

    expect(result.estimatedRecipientAmount).toBeNull();
    expect(result.providerFeeAmount).toBe('35.00');
  });

  it('rejects an indicative preview when NobleCards fee configuration is missing', async () => {
    const { service, prisma } = makeService({
      WITHDRAWAL_NOBLECARDS_FEE_PERCENT: undefined,
    });
    prisma.currency.findUnique.mockResolvedValue({
      code: 'GBP',
      enabled: true,
    });

    await expect(
      service.createIndicativePreview({
        sourceAmount: '100',
        countryCode: 'GB',
        destinationCurrencyCode: 'GBP',
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toThrow('WITHDRAWAL_NOBLECARDS_FEE_PERCENT');
    expect(prisma.withdrawalQuote.create).not.toHaveBeenCalled();
  });

  it('rejects an unavailable V3 transfer rate instead of using a fallback', async () => {
    const { service, prisma, payoutClient } = makeService();
    prisma.currency.findUnique.mockResolvedValue({
      code: 'GBP',
      enabled: true,
    });
    payoutClient.getTransferRates.mockRejectedValue(
      new Error('rate unavailable'),
    );

    await expect(
      service.createIndicativePreview({
        sourceAmount: '100',
        countryCode: 'GB',
        destinationCurrencyCode: 'GBP',
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toThrow(/Flutterwave transfer rates are unavailable/);
    expect(prisma.withdrawalQuote.create).not.toHaveBeenCalled();
  });

  it('uses USD-based FX direction and calculates the correct quote math for USD->NGN', async () => {
    const { service, prisma } = makeService();
    prisma.currency.findUnique.mockResolvedValue({
      code: 'NGN',
      enabled: true,
    });
    prisma.withdrawalQuote.create.mockImplementation(async ({ data }: any) => ({
      id: 'quote-1',
      userId: 'user-1',
      sourceCurrencyCode: data.sourceCurrencyCode,
      destinationCurrencyCode: data.destinationCurrencyCode,
      countryCode: data.countryCode,
      paymentMethod: data.paymentMethod,
      sourceAmount: data.sourceAmount,
      exchangeRate: data.exchangeRate,
      destinationAmount: data.destinationAmount,
      destinationFee: data.destinationFee,
      recipientAmount: data.recipientAmount,
      providerFee: data.providerFee,
      nobleCardsFee: data.nobleCardsFee,
      totalFee: data.totalFee,
      amountReceived: data.amountReceived,
      status: data.status,
      expiresAt: data.expiresAt,
      createdAt: new Date(),
    }));

    const result = await service.createQuote('user-1', {
      sourceAmount: '100',
      countryCode: 'NG',
      destinationCurrencyCode: 'NGN',
      paymentMethod: 'BANK_TRANSFER',
    });

    expect(result.sourceCurrency).toBe('USD');
    expect(result.destinationCurrency).toBe('NGN');
    expect(result.fxRate).toBe('1500');
    expectMoney(result.grossDestinationAmount, '150000.00');
    expectMoney(result.providerFee, '2.00');
    expectMoney(result.nobleCardsFee, '1.00');
    expectMoney(result.totalFee, '3.00');
    expectMoney(result.destinationFee, '4500.00');
    expectMoney(result.recipientAmount, '145500.00');
  });

  it('applies the configured 3% NobleCards fee exactly once', async () => {
    const { service, prisma } = makeService({
      WITHDRAWAL_PROVIDER_FEE_PERCENT: 1,
      WITHDRAWAL_PROVIDER_FEE_PERCENT_NG_NGN: 3,
      WITHDRAWAL_NOBLECARDS_FEE_PERCENT: 3,
    });
    prisma.currency.findUnique.mockResolvedValue({
      code: 'NGN',
      enabled: true,
    });
    prisma.withdrawalQuote.create.mockImplementation(async ({ data }: any) => ({
      id: 'quote-3-percent',
      sourceCurrencyCode: data.sourceCurrencyCode,
      destinationCurrencyCode: data.destinationCurrencyCode,
      countryCode: data.countryCode,
      paymentMethod: data.paymentMethod,
      sourceAmount: data.sourceAmount,
      exchangeRate: data.exchangeRate,
      destinationAmount: data.destinationAmount,
      destinationFee: data.destinationFee,
      recipientAmount: data.recipientAmount,
      providerFee: data.providerFee,
      nobleCardsFee: data.nobleCardsFee,
      totalFee: data.totalFee,
      status: data.status,
      expiresAt: data.expiresAt,
      createdAt: new Date(),
    }));

    const result = await service.createQuote('user-1', {
      sourceAmount: '100',
      countryCode: 'NG',
      destinationCurrencyCode: 'NGN',
      paymentMethod: 'BANK_TRANSFER',
    });

    expectMoney(result.nobleCardsFee, '3.00');
    expectMoney(result.providerFee, '3.00');
    expectMoney(result.totalFee, '6.00');
    expectMoney(result.destinationFee, '9000.00');
    expectMoney(result.recipientAmount, '141000.00');
  });

  it('uses the verified Ghana provider-fee override separately from NobleCards', async () => {
    const { service, prisma } = makeService({
      WITHDRAWAL_PROVIDER_FEE_PERCENT: 1,
      WITHDRAWAL_PROVIDER_FEE_PERCENT_GH_GHS: 3,
      WITHDRAWAL_NOBLECARDS_FEE_PERCENT: 3,
    });
    prisma.currency.findUnique.mockResolvedValue({
      code: 'GHS',
      enabled: true,
    });
    prisma.withdrawalQuote.create.mockImplementation(async ({ data }: any) => ({
      id: 'quote-gh-3-percent',
      ...data,
      createdAt: new Date(),
    }));

    const result = await service.createQuote('user-1', {
      sourceAmount: '100',
      countryCode: 'GH',
      destinationCurrencyCode: 'GHS',
      paymentMethod: 'BANK_TRANSFER',
    });

    expectMoney(result.providerFee, '3.00');
    expectMoney(result.nobleCardsFee, '3.00');
    expectMoney(result.totalFee, '6.00');
    expectMoney(result.destinationFee, '75.00');
    expectMoney(result.recipientAmount, '1175.00');
  });

  it('uses USD-based FX direction and correct formula for USD->GHS', async () => {
    const { service, prisma } = makeService();
    const cases = [
      {
        countryCode: 'GH',
        destinationCurrencyCode: 'GHS',
        fxRate: '12.5',
        gross: '1250.00',
        destinationFee: '37.50',
        recipient: '1212.50',
      },
    ];

    for (const item of cases) {
      prisma.currency.findUnique.mockResolvedValue({
        code: item.destinationCurrencyCode,
        enabled: true,
      });
      prisma.withdrawalQuote.create.mockResolvedValue({
        id: `quote-${item.destinationCurrencyCode}`,
        userId: 'user-1',
        sourceCurrencyCode: 'USD',
        destinationCurrencyCode: item.destinationCurrencyCode,
        countryCode: item.countryCode,
        paymentMethod: 'BANK_TRANSFER',
        sourceAmount: new Decimal('100.00'),
        exchangeRate: new Decimal(item.fxRate),
        destinationAmount: new Decimal(item.gross),
        destinationFee: new Decimal(item.destinationFee),
        recipientAmount: new Decimal(item.recipient),
        providerFee: new Decimal('2.00'),
        nobleCardsFee: new Decimal('1.00'),
        totalFee: new Decimal('3.00'),
        amountReceived: new Decimal(item.recipient),
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 300000),
        createdAt: new Date(),
      });

      const result = await service.createQuote('user-1', {
        sourceAmount: '100',
        countryCode: item.countryCode,
        destinationCurrencyCode: item.destinationCurrencyCode,
        paymentMethod: 'BANK_TRANSFER',
      });

      expect(result.fxRate).toBe(item.fxRate);
      expectMoney(result.grossDestinationAmount, item.gross);
      expectMoney(result.destinationFee, item.destinationFee);
      expectMoney(result.recipientAmount, item.recipient);
    }
  });

  it('rejects invalid country/currency pair combinations and unsupported inputs', async () => {
    const { service } = makeService();

    await expect(
      service.createQuote('user-1', {
        sourceAmount: '100',
        countryCode: 'NG',
        destinationCurrencyCode: 'GBP',
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      service.createQuote('user-1', {
        sourceAmount: '100',
        countryCode: 'NG',
        destinationCurrencyCode: 'USD',
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      service.createQuote('user-1', {
        sourceAmount: '100',
        countryCode: 'US',
        destinationCurrencyCode: 'CAD',
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      service.createQuote('user-1', {
        sourceAmount: '0',
        countryCode: 'NG',
        destinationCurrencyCode: 'NGN',
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      service.createQuote('user-1', {
        sourceAmount: 'abc',
        countryCode: 'NG',
        destinationCurrencyCode: 'NGN',
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([
    ['GB', 'GBP'],
    ['US', 'USD'],
    ['CA', 'CAD'],
  ])(
    'does not persist a %s quote while its provider fee or payout eligibility is unverified',
    async (countryCode, destinationCurrencyCode) => {
      const { service, prisma } = makeService({
        WITHDRAWAL_PROVIDER_FEE_PERCENT: 3,
      });

      await expect(
        service.createQuote('user-1', {
          sourceAmount: '100',
          countryCode,
          destinationCurrencyCode,
          paymentMethod: 'BANK_TRANSFER',
        }),
      ).rejects.toThrow(/PAYOUT_CORRIDOR_UNVERIFIED/);
      expect(prisma.withdrawalQuote.create).not.toHaveBeenCalled();
      expect(prisma.currency.findUnique).not.toHaveBeenCalled();
    },
  );

  it('does not create a Nigeria quote when its provider fee is missing', async () => {
    const { service, prisma } = makeService({
      WITHDRAWAL_PROVIDER_FEE_PERCENT: undefined,
    });

    await expect(
      service.createQuote('user-1', {
        sourceAmount: '100',
        countryCode: 'NG',
        destinationCurrencyCode: 'NGN',
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toThrow(
      'WITHDRAWAL_FEE_CONFIGURATION_MISSING: WITHDRAWAL_PROVIDER_FEE_PERCENT must be configured.',
    );
    expect(prisma.withdrawalQuote.create).not.toHaveBeenCalled();
  });

  it('rejects a quote when the authoritative FX feed lacks the destination rate', async () => {
    const { service, prisma, exchangeRates } = makeService();
    exchangeRates.getRates.mockResolvedValue({ rates: { USD: 1 } });

    await expect(
      service.createQuote('user-1', {
        sourceAmount: '100',
        countryCode: 'GH',
        destinationCurrencyCode: 'GHS',
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toThrow(
      'Exchange rate is unavailable for the selected currency.',
    );
    expect(prisma.withdrawalQuote.create).not.toHaveBeenCalled();
  });

  it('returns an explicit unavailable error when the authoritative FX source fails', async () => {
    const { service, prisma, exchangeRates } = makeService();
    exchangeRates.getRates.mockRejectedValue(new Error('upstream timeout'));

    await expect(
      service.createQuote('user-1', {
        sourceAmount: '100',
        countryCode: 'GH',
        destinationCurrencyCode: 'GHS',
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toThrow(
      'Exchange rates are temporarily unavailable for this withdrawal quote.',
    );
    expect(prisma.withdrawalQuote.create).not.toHaveBeenCalled();
  });

  it.each([
    ['WITHDRAWAL_PROVIDER_FEE_PERCENT', undefined],
    ['WITHDRAWAL_PROVIDER_FEE_PERCENT', '   '],
    ['WITHDRAWAL_PROVIDER_FEE_PERCENT', 'invalid'],
    ['WITHDRAWAL_PROVIDER_FEE_PERCENT', -0.01],
    ['WITHDRAWAL_PROVIDER_FEE_PERCENT', 100.01],
    ['WITHDRAWAL_NOBLECARDS_FEE_PERCENT', undefined],
    ['WITHDRAWAL_NOBLECARDS_FEE_PERCENT', '   '],
    ['WITHDRAWAL_NOBLECARDS_FEE_PERCENT', 'invalid'],
    ['WITHDRAWAL_NOBLECARDS_FEE_PERCENT', -0.01],
    ['WITHDRAWAL_NOBLECARDS_FEE_PERCENT', 100.01],
  ])(
    'rejects invalid fee configuration %s=%s without creating a quote',
    async (name, value) => {
      const { service, prisma } = makeService({ [name]: value });

      await expect(
        service.createQuote('user-1', {
          sourceAmount: '100',
          countryCode: 'NG',
          destinationCurrencyCode: 'NGN',
          paymentMethod: 'BANK_TRANSFER',
        }),
      ).rejects.toThrow(name);
      expect(prisma.withdrawalQuote.create).not.toHaveBeenCalled();
    },
  );

  it('accepts explicitly configured zero fees without treating missing values as zero', async () => {
    const { service, prisma } = makeService({
      WITHDRAWAL_PROVIDER_FEE_PERCENT: 0,
      WITHDRAWAL_NOBLECARDS_FEE_PERCENT: 0,
    });
    prisma.currency.findUnique.mockResolvedValue({
      code: 'NGN',
      enabled: true,
    });
    prisma.withdrawalQuote.create.mockImplementation(async ({ data }: any) => ({
      id: 'quote-explicit-zero',
      ...data,
      createdAt: new Date(),
    }));

    const result = await service.createQuote('user-1', {
      sourceAmount: '100',
      countryCode: 'NG',
      destinationCurrencyCode: 'NGN',
      paymentMethod: 'BANK_TRANSFER',
    });

    expectMoney(result.providerFee, '0');
    expectMoney(result.nobleCardsFee, '0');
    expectMoney(result.totalFee, '0');
    expectMoney(result.recipientAmount, '150000');
  });

  it('rejects configured fees that leave no amount to receive', async () => {
    const { service, prisma } = makeService({
      WITHDRAWAL_PROVIDER_FEE_PERCENT: 100,
      WITHDRAWAL_NOBLECARDS_FEE_PERCENT: 0,
    });

    await expect(
      service.createQuote('user-1', {
        sourceAmount: '100',
        countryCode: 'NG',
        destinationCurrencyCode: 'NGN',
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toThrow('Fees must be less than the source amount.');
    expect(prisma.withdrawalQuote.create).not.toHaveBeenCalled();
  });

  it('keeps destination fee plus recipient amount reconciled after rounding', async () => {
    const { service, prisma } = makeService();
    prisma.currency.findUnique.mockResolvedValue({
      code: 'NGN',
      enabled: true,
    });
    prisma.withdrawalQuote.create.mockImplementation(async ({ data }: any) => ({
      id: 'quote-rounding',
      ...data,
      createdAt: new Date(),
    }));

    const result = await service.createQuote('user-1', {
      sourceAmount: '0.37',
      countryCode: 'NG',
      destinationCurrencyCode: 'NGN',
      paymentMethod: 'BANK_TRANSFER',
    });

    expectMoney(
      new Decimal(result.destinationFee)
        .plus(result.recipientAmount)
        .toString(),
      result.grossDestinationAmount,
    );
  });

  it('locks historical FX and fee values and does not recalculate them on fetch', async () => {
    const { service, prisma } = makeService();
    const originalQuote = {
      id: 'quote-locked',
      userId: 'user-1',
      sourceCurrencyCode: 'USD',
      destinationCurrencyCode: 'NGN',
      countryCode: 'NG',
      paymentMethod: 'BANK_TRANSFER',
      sourceAmount: new Decimal('100.00'),
      exchangeRate: new Decimal('1500'),
      destinationAmount: new Decimal('150000.00'),
      destinationFee: new Decimal('4500.00'),
      recipientAmount: new Decimal('145500.00'),
      providerFee: new Decimal('2.00'),
      nobleCardsFee: new Decimal('1.00'),
      totalFee: new Decimal('3.00'),
      amountReceived: new Decimal('145500.00'),
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 120000),
      createdAt: new Date(),
    };

    prisma.withdrawalQuote.findFirst.mockResolvedValue(originalQuote);

    const result = await service.getQuoteForUser('user-1', 'quote-locked');

    expect(result.fxRate).toBe('1500');
    expectMoney(result.providerFee, '2.00');
    expectMoney(result.nobleCardsFee, '1.00');
    expectMoney(result.totalFee, '3.00');
    expectMoney(result.recipientAmount, '145500.00');
  });

  it('protects ownership and rejects access to another user quote', async () => {
    const { service, prisma } = makeService();
    prisma.withdrawalQuote.findFirst.mockResolvedValue(null);

    await expect(
      service.getQuoteForUser('user-2', 'quote-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('expires quotes by status transition ACTIVE -> EXPIRED without extending them', async () => {
    const { service, prisma } = makeService();
    prisma.withdrawalQuote.findFirst.mockResolvedValue({
      id: 'quote-2',
      userId: 'user-1',
      sourceCurrencyCode: 'USD',
      destinationCurrencyCode: 'GBP',
      countryCode: 'GB',
      paymentMethod: 'BANK_TRANSFER',
      sourceAmount: new Decimal('100.00'),
      exchangeRate: new Decimal('0.75'),
      destinationAmount: new Decimal('75.00'),
      destinationFee: new Decimal('2.25'),
      recipientAmount: new Decimal('72.75'),
      providerFee: new Decimal('2.00'),
      nobleCardsFee: new Decimal('1.00'),
      totalFee: new Decimal('3.00'),
      amountReceived: new Decimal('72.75'),
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() - 1000),
      createdAt: new Date(),
    });
    prisma.withdrawalQuote.updateMany.mockResolvedValue({ count: 1 });

    const result = await service.getQuoteForUser('user-1', 'quote-2');

    expect(result.status).toBe('EXPIRED');
    expect(result.usable).toBe(false);
    expect(prisma.withdrawalQuote.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { status: 'EXPIRED' },
      }),
    );
  });

  it('does not touch wallet balances or ledger entries during quote creation', async () => {
    const { service, prisma } = makeService();
    prisma.currency.findUnique.mockResolvedValue({
      code: 'NGN',
      enabled: true,
    });
    prisma.withdrawalQuote.create.mockResolvedValue({
      id: 'quote-wallet-safe',
      userId: 'user-1',
      sourceCurrencyCode: 'USD',
      destinationCurrencyCode: 'NGN',
      countryCode: 'NG',
      paymentMethod: 'BANK_TRANSFER',
      sourceAmount: new Decimal('100.00'),
      exchangeRate: new Decimal('1500'),
      destinationAmount: new Decimal('150000.00'),
      destinationFee: new Decimal('4500.00'),
      recipientAmount: new Decimal('145500.00'),
      providerFee: new Decimal('2.00'),
      nobleCardsFee: new Decimal('1.00'),
      totalFee: new Decimal('3.00'),
      amountReceived: new Decimal('145500.00'),
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    });

    const result = await service.createQuote('user-1', {
      sourceAmount: '100',
      countryCode: 'NG',
      destinationCurrencyCode: 'NGN',
      paymentMethod: 'BANK_TRANSFER',
    });

    expectMoney(result.recipientAmount, '145500.00');
    expect(prisma.withdrawalQuote.create).toHaveBeenCalled();
    expect(prisma.currency.findUnique).toHaveBeenCalled();
  });

  it('ignores malicious financial override fields in the request payload', async () => {
    const { service, prisma } = makeService();
    prisma.currency.findUnique.mockResolvedValue({
      code: 'NGN',
      enabled: true,
    });
    prisma.withdrawalQuote.create.mockResolvedValue({
      id: 'quote-malicious',
      userId: 'user-1',
      sourceCurrencyCode: 'USD',
      destinationCurrencyCode: 'NGN',
      countryCode: 'NG',
      paymentMethod: 'BANK_TRANSFER',
      sourceAmount: new Decimal('100.00'),
      exchangeRate: new Decimal('1500'),
      destinationAmount: new Decimal('150000.00'),
      destinationFee: new Decimal('4500.00'),
      recipientAmount: new Decimal('145500.00'),
      providerFee: new Decimal('2.00'),
      nobleCardsFee: new Decimal('1.00'),
      totalFee: new Decimal('3.00'),
      amountReceived: new Decimal('145500.00'),
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    });

    const malicious = {
      sourceAmount: '100',
      countryCode: 'NG',
      destinationCurrencyCode: 'NGN',
      paymentMethod: 'BANK_TRANSFER',
      fxRate: '999999999',
      providerFee: '0',
      nobleCardsFee: '0',
      totalFee: '0',
      recipientAmount: '999999999',
      destinationAmount: '999999999',
      status: 'USED',
      expiresAt: '2099-01-01T00:00:00.000Z',
    } as any;

    const result = await service.createQuote('user-1', malicious);
    expect(result.fxRate).toBe('1500');
    expectMoney(result.providerFee, '2.00');
    expectMoney(result.nobleCardsFee, '1.00');
    expectMoney(result.totalFee, '3.00');
    expectMoney(result.recipientAmount, '145500.00');
  });
});
