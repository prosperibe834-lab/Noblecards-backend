import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { ConfigService } from '@nestjs/config';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { WithdrawalQuoteService } from './withdrawal-quote.service';

describe('WithdrawalQuoteService', () => {
  const expectMoney = (actual: string, expected: string) => {
    expect(new Decimal(actual).equals(new Decimal(expected))).toBe(true);
  };

  const mockRates = {
    USD: 1,
    NGN: 1500,
    GHS: 12.5,
    GBP: 0.75,
    CAD: 1.35,
  };

  const makeService = () => {
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
      getRates: jest.fn().mockResolvedValue({ rates: mockRates }),
    };

    const config = {
      get: jest.fn((key: string, fallback?: any) => {
        const values: Record<string, any> = {
          WITHDRAWAL_PROVIDER_FEE_PERCENT: 2,
          WITHDRAWAL_NOBLECARDS_FEE_PERCENT: 1,
          WITHDRAWAL_QUOTE_TTL_SECONDS: 300,
        };
        return values[key] ?? fallback;
      }),
    } as unknown as ConfigService;

    const service = new WithdrawalQuoteService(prisma, exchangeRates, config);
    return { service, prisma, exchangeRates };
  };

  it('uses USD-based FX direction and calculates the correct quote math for USD->NGN', async () => {
    const { service, prisma } = makeService();
    prisma.currency.findUnique.mockResolvedValue({ code: 'NGN', enabled: true });
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

  it('uses USD-based FX direction and correct formula for USD->GHS, USD->GBP, USD->USD, and USD->CAD', async () => {
    const { service, prisma } = makeService();
    const cases = [
      { countryCode: 'GH', destinationCurrencyCode: 'GHS', fxRate: '12.5', gross: '1250.00', destinationFee: '37.50', recipient: '1212.50' },
      { countryCode: 'GB', destinationCurrencyCode: 'GBP', fxRate: '0.75', gross: '75.00', destinationFee: '2.25', recipient: '72.75' },
      { countryCode: 'US', destinationCurrencyCode: 'USD', fxRate: '1', gross: '100.00', destinationFee: '3.00', recipient: '97.00' },
      { countryCode: 'CA', destinationCurrencyCode: 'CAD', fxRate: '1.35', gross: '135.00', destinationFee: '4.05', recipient: '130.95' },
    ];

    for (const item of cases) {
      prisma.currency.findUnique.mockResolvedValue({ code: item.destinationCurrencyCode, enabled: true });
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

    await expect(service.createQuote('user-1', {
      sourceAmount: '100',
      countryCode: 'NG',
      destinationCurrencyCode: 'GBP',
      paymentMethod: 'BANK_TRANSFER',
    })).rejects.toBeInstanceOf(BadRequestException);

    await expect(service.createQuote('user-1', {
      sourceAmount: '100',
      countryCode: 'NG',
      destinationCurrencyCode: 'USD',
      paymentMethod: 'BANK_TRANSFER',
    })).rejects.toBeInstanceOf(BadRequestException);

    await expect(service.createQuote('user-1', {
      sourceAmount: '0',
      countryCode: 'US',
      destinationCurrencyCode: 'USD',
      paymentMethod: 'BANK_TRANSFER',
    })).rejects.toBeInstanceOf(BadRequestException);

    await expect(service.createQuote('user-1', {
      sourceAmount: 'abc',
      countryCode: 'US',
      destinationCurrencyCode: 'USD',
      paymentMethod: 'BANK_TRANSFER',
    })).rejects.toBeInstanceOf(BadRequestException);
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

    await expect(service.getQuoteForUser('user-2', 'quote-1')).rejects.toBeInstanceOf(NotFoundException);
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
    expect(prisma.withdrawalQuote.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      data: { status: 'EXPIRED' },
    }));
  });

  it('does not touch wallet balances or ledger entries during quote creation', async () => {
    const { service, prisma } = makeService();
    prisma.currency.findUnique.mockResolvedValue({ code: 'USD', enabled: true });
    prisma.withdrawalQuote.create.mockResolvedValue({
      id: 'quote-wallet-safe',
      userId: 'user-1',
      sourceCurrencyCode: 'USD',
      destinationCurrencyCode: 'USD',
      countryCode: 'US',
      paymentMethod: 'BANK_TRANSFER',
      sourceAmount: new Decimal('100.00'),
      exchangeRate: new Decimal('1'),
      destinationAmount: new Decimal('100.00'),
      destinationFee: new Decimal('3.00'),
      recipientAmount: new Decimal('97.00'),
      providerFee: new Decimal('2.00'),
      nobleCardsFee: new Decimal('1.00'),
      totalFee: new Decimal('3.00'),
      amountReceived: new Decimal('97.00'),
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 300000),
      createdAt: new Date(),
    });

    const result = await service.createQuote('user-1', {
      sourceAmount: '100',
      countryCode: 'US',
      destinationCurrencyCode: 'USD',
      paymentMethod: 'BANK_TRANSFER',
    });

    expectMoney(result.recipientAmount, '97.00');
    expect(prisma.withdrawalQuote.create).toHaveBeenCalled();
    expect(prisma.currency.findUnique).toHaveBeenCalled();
  });

  it('ignores malicious financial override fields in the request payload', async () => {
    const { service, prisma } = makeService();
    prisma.currency.findUnique.mockResolvedValue({ code: 'NGN', enabled: true });
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
