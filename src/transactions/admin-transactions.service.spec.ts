import { BadRequestException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/index.js';
import { PrismaService } from '../prisma/prisma.service';
import { AdminTransactionsService } from './admin-transactions.service';

describe('AdminTransactionsService', () => {
  const prisma = {
    transaction: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    giftCardSale: {
      findMany: jest.fn(),
    },
    $queryRawUnsafe: jest.fn(),
  };
  let service: AdminTransactionsService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.transaction.count.mockResolvedValue(1);
    prisma.giftCardSale.findMany.mockResolvedValue([]);
    prisma.transaction.findMany.mockResolvedValue([
      {
        id: 'transaction-1',
        userId: 'user-1',
        currencyCode: 'USD',
        type: 'DEPOSIT',
        amount: '25.50',
        fee: '1.00',
        netAmount: '24.50',
        status: 'SUCCESSFUL',
        provider: 'FLUTTERWAVE',
        providerReference: 'provider-ref',
        providerTransactionId: 'provider-tx',
        paymentMethod: 'CARD',
        reference: 'NC-REF-1',
        createdAt: new Date('2026-10-16T23:59:59.000Z'),
        user: {
          displayName: null,
          firstName: 'Ari',
          lastName: 'User',
          email: 'ari@example.test',
          phone: null,
          profileImageUrl: null,
        },
        deposit: null,
        withdrawal: null,
        giftCardSale: null,
        giftCardPurchase: null,
        ledgerEntries: [],
      },
    ]);
    prisma.$queryRawUnsafe
      .mockResolvedValueOnce([
        {
          currencyCode: 'USD',
          status: 'SUCCESSFUL',
          amount: '25.50',
          count: 1,
        },
      ])
      .mockResolvedValueOnce([
        {
          currencyCode: 'USD',
          status: 'SUCCESSFUL',
          amount: '25.50',
          count: 1,
        },
      ])
      .mockResolvedValueOnce([
        { label: '2026-10-16', currency: 'USD', value: '25.50' },
      ])
      .mockResolvedValueOnce([
        { name: 'Deposits', currency: 'USD', value: '25.50' },
      ])
      .mockResolvedValueOnce([{ amount: null, count: 0 }]);
    service = new AdminTransactionsService(prisma as unknown as PrismaService);
  });

  it('returns real transaction fields with per-currency volume and chart series', async () => {
    const result = await service.getTransactions({
      page: '1',
      pageSize: '25',
    });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 25,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      }),
    );
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 25,
      total: 1,
      totalPages: 1,
    });
    expect(result.items[0]).toMatchObject({
      id: 'transaction-1',
      userName: 'Ari User',
      originalAmount: 25.5,
      currency: 'USD',
      usdValue: 25.5,
      type: 'Deposit',
      category: 'Deposits',
      status: 'Successful',
      paymentReference: 'provider-ref',
      fee: 1,
      netAmount: 24.5,
    });
    expect(result.metrics).toMatchObject({
      totalVolumeByCurrency: [{ currency: 'USD', amount: 25.5 }],
      todayVolumeByCurrency: [{ currency: 'USD', amount: 25.5 }],
      successfulCount: 1,
      pendingCount: 0,
      failedCount: 0,
      revenueUSD: null,
      revenueCoverage: 'incomplete',
    });
    expect(typeof result.metrics.revenueUnavailableReason).toBe('string');
    expect(result.charts).toEqual({
      volume: {
        available: true,
        currencies: ['USD'],
        series: [{ label: '2026-10-16', USD: 25.5 }],
      },
      category: {
        available: true,
        series: [{ name: 'Deposits (USD)', value: 25.5 }],
      },
    });
    const queryCalls = prisma.$queryRawUnsafe.mock.calls as unknown as Array<
      [string, ...unknown[]]
    >;
    expect(queryCalls[0][0]).toContain(
      'GROUP BY t."currencyCode",\n                 COALESCE(s."status"::text',
    );
  });

  it('combines search, status, type, currency, USD amount, and UTC date filters', async () => {
    await service.getTransactions({
      search: '  user@Example.test ',
      status: 'Processing',
      type: 'Gift Card Purchase',
      category: 'Gift Cards',
      currency: 'USD',
      paymentMethod: 'Gift Card',
      minAmount: '10',
      maxAmount: '99.99',
      startDate: '2026-10-01',
      endDate: '2026-10-16',
    });

    const findManyCalls = prisma.transaction.findMany.mock
      .calls as unknown as Array<[Prisma.TransactionFindManyArgs]>;
    const whereJson = JSON.stringify(findManyCalls[0][0].where);
    expect(whereJson).toContain('user@Example.test');
    expect(whereJson).toContain('"status":{"in":["PROCESSING"]}');
    expect(whereJson).toContain('"giftCardPurchase":{"isNot":null}');
    expect(whereJson).toContain('"currencyCode":"USD"');
    expect(whereJson).toContain('2026-10-01T00:00:00.000Z');
    expect(whereJson).toContain('2026-10-17T00:00:00.000Z');
    const queryCalls = prisma.$queryRawUnsafe.mock.calls as unknown as Array<
      [string, ...Array<string | Date | number>]
    >;
    expect(queryCalls[2][0]).toContain(`t."createdAt" < $2`);
    expect(queryCalls[2]).toContain('%user@Example.test%');
  });

  it('keeps transaction volume separate by currency and never converts an unrecorded amount to USD', async () => {
    prisma.transaction.findMany.mockResolvedValueOnce([
      {
        id: 'transaction-ngn',
        userId: 'user-1',
        currencyCode: 'NGN',
        type: 'WITHDRAWAL',
        amount: '5000',
        fee: '0',
        netAmount: '5000',
        status: 'PENDING',
        provider: null,
        providerReference: null,
        providerTransactionId: null,
        paymentMethod: 'BANK_TRANSFER',
        reference: 'WD-1',
        createdAt: new Date('2026-10-16T10:00:00.000Z'),
        user: {
          displayName: null,
          firstName: 'Ari',
          lastName: 'User',
          email: 'ari@example.test',
          phone: null,
          profileImageUrl: null,
        },
        deposit: null,
        withdrawal: null,
        giftCardSale: null,
        giftCardPurchase: null,
        ledgerEntries: [],
      },
    ]);
    prisma.$queryRawUnsafe
      .mockReset()
      .mockResolvedValueOnce([
        { currencyCode: 'NGN', status: 'PENDING', amount: '5000', count: 1 },
      ])
      .mockResolvedValueOnce([
        { currencyCode: 'NGN', status: 'PENDING', amount: '5000', count: 1 },
      ])
      .mockResolvedValueOnce([
        { label: '2026-10-16', currency: 'NGN', value: '5000' },
      ])
      .mockResolvedValueOnce([
        { name: 'Withdrawals', currency: 'NGN', value: '5000' },
      ])
      .mockResolvedValueOnce([{ amount: null, count: 0 }]);

    const result = await service.getTransactions({});

    expect(result.items[0].usdValue).toBeNull();
    expect(result.metrics.totalVolumeByCurrency).toEqual([
      { currency: 'NGN', amount: 5000 },
    ]);
    expect(result.metrics.pendingCount).toBe(1);
    expect(result.metrics.revenueUSD).toBeNull();
    expect(result.charts.volume).toEqual({
      available: true,
      currencies: ['NGN'],
      series: [{ label: '2026-10-16', NGN: 5000 }],
    });
    expect(result.charts.category).toEqual({
      available: true,
      series: [{ name: 'Withdrawals (NGN)', value: 5000 }],
    });
  });

  it('reports purchase denomination without treating it as provider cost or inventing a USD value', async () => {
    prisma.transaction.findMany.mockResolvedValueOnce([
      {
        id: 'purchase-transaction',
        userId: 'user-1',
        currencyCode: 'USD',
        type: 'PURCHASE',
        amount: '0.31',
        fee: '0',
        netAmount: '0.31',
        status: 'SUCCESSFUL',
        provider: 'TREMENDOUS',
        providerReference: 'provider-purchase-ref',
        providerTransactionId: null,
        paymentMethod: null,
        reference: 'NC-BUY-1',
        createdAt: new Date('2026-10-09T10:36:04.370Z'),
        user: {
          displayName: 'Ari User',
          firstName: 'Ari',
          lastName: 'User',
          email: 'ari@example.test',
          phone: null,
          profileImageUrl: null,
        },
        deposit: null,
        withdrawal: null,
        giftCardSale: null,
        giftCardPurchase: {
          id: 'purchase-1',
          status: 'SUCCESSFUL',
          providerStatus: 'EXECUTED',
          providerReference: 'provider-purchase-ref',
          providerProductId: 'product-1',
          brandNameSnapshot: 'FlixTrain DE',
          productNameSnapshot: 'FlixTrain DE',
          countryCode: 'DE',
          currencyCode: 'USD',
          amount: '20',
          giftCardValueUsd: '0',
          denominationType: 'FIXED',
          quantity: 1,
          customerPrice: '0.31',
          fee: '0',
          baseBuyRatePercent: '0',
          buyAdjustmentPercent: '0',
          customerRatePercent: '0',
          completedAt: new Date('2026-10-09T10:36:05.000Z'),
          provider: 'TREMENDOUS',
        },
        ledgerEntries: [],
      },
    ]);

    const result = await service.getTransactions({});

    expect(result.items[0]).toMatchObject({
      amountSemantics: 'Customer amount charged for the purchase',
      giftCardDetails: {
        cardName: 'FlixTrain DE',
        productName: 'FlixTrain DE',
        country: 'DE',
        cardAmount: 20,
        cardCurrency: 'USD',
        faceValueUsd: null,
        customerPrice: 0.31,
        providerCost: null,
        amountSemantics:
          'Stored gift-card denomination; not actual provider cost',
      },
    });
  });

  it('includes standalone sale submissions once and counts linked and standalone source statuses', async () => {
    const sourceStatuses = [
      'SUCCESSFUL',
      'PAID',
      'PENDING',
      'PROCESSING',
      'UNDER_REVIEW',
      'SUBMITTED',
      'APPROVED',
      'FAILED',
      'REJECTED',
    ];
    prisma.$queryRawUnsafe
      .mockReset()
      .mockResolvedValueOnce(
        sourceStatuses.map((status) => ({
          currencyCode: 'USD',
          status,
          amount: '1',
          count: 1,
        })),
      )
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ amount: '100', count: 4 }]);
    const saleStatuses = [
      'PAID',
      'SUBMITTED',
      'UNDER_REVIEW',
      'APPROVED',
      'REJECTED',
    ];
    prisma.giftCardSale.findMany.mockResolvedValue(
      saleStatuses.map((status, index) => ({
        id: `sale-${index}`,
        userId: 'user-1',
        status,
        provider: 'SOGO',
        providerTradeId: `trade-${index}`,
        providerStatus: status,
        slug: 'flixtrain',
        brandNameSnapshot: 'FlixTrain',
        cardType: 'DIGITAL',
        cardCountry: 'DE',
        cardCurrency: 'EUR',
        cardAmount: '25',
        quotedPayoutAmount: '20',
        quotedPayoutCurrency: 'EUR',
        providerFee: null,
        nobleCardsFee: null,
        finalPayoutAmount: null,
        payoutCurrency: 'EUR',
        createdAt: new Date('2026-10-10T12:00:00.000Z'),
        updatedAt: new Date('2026-10-10T12:00:00.000Z'),
        walletCreditedAt: null,
        user: {
          displayName: null,
          firstName: 'Ari',
          lastName: 'User',
          email: 'ari@example.test',
          phone: null,
          profileImageUrl: null,
        },
      })),
    );

    const result = await service.getTransactions({ pageSize: '10' });

    const saleCalls: unknown = prisma.giftCardSale.findMany.mock.calls;
    expect(JSON.stringify(saleCalls)).toContain('"transactionId":null');
    expect(result.pagination.total).toBe(6);
    expect(result.items).toHaveLength(6);
    expect(
      result.items.filter((item) => item.type === 'Gift Card Sale'),
    ).toHaveLength(5);
    expect(result.items.find((item) => item.id === 'sale-0')).toMatchObject({
      originalAmount: 25,
      currency: 'EUR',
      usdValue: null,
      amountSemantics: 'Gift-card face value submitted; not payout',
    });
    expect(result.metrics.successfulCount).toBe(3);
    expect(result.metrics.pendingCount).toBe(8);
    expect(result.metrics.failedCount).toBe(3);
    expect(result.metrics.revenueUSD).toBeNull();
  });

  it.each([
    [{ startDate: '2026-02-30', endDate: '2026-03-01' }],
    [{ startDate: '2026-10-02', endDate: '2026-10-01' }],
    [{ startDate: '2026-10-01' }],
    [{ page: '0' }],
    [{ pageSize: '101' }],
    [{ minAmount: '-1' }],
    [{ minAmount: '25', maxAmount: '10' }],
    [{ status: 'Unknown' }],
    [{ status: ['Successful'] }],
  ])('rejects invalid filters before querying', async (query) => {
    await expect(service.getTransactions(query)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.transaction.findMany).not.toHaveBeenCalled();
  });
});
