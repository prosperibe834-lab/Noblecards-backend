import { BadRequestException } from '@nestjs/common';
import { DashboardAnalyticsService } from './dashboard-analytics.service';

describe('DashboardAnalyticsService', () => {
  const prisma = {
    $queryRaw: jest.fn(),
    transaction: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    user: { count: jest.fn() },
    giftCardSale: {
      count: jest.fn(),
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
    giftCardPurchase: {
      groupBy: jest.fn(),
    },
    withdrawal: { count: jest.fn() },
  };
  const flutterwave = { checkReadOnlyApiAvailability: jest.fn() };
  let service: DashboardAnalyticsService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
    prisma.transaction.count.mockResolvedValue(0);
    prisma.transaction.findMany.mockResolvedValue([]);
    prisma.giftCardSale.count.mockResolvedValue(0);
    prisma.giftCardSale.groupBy.mockResolvedValue([]);
    prisma.giftCardSale.findMany.mockResolvedValue([]);
    prisma.giftCardPurchase.groupBy.mockResolvedValue([]);
    prisma.withdrawal.count.mockResolvedValue(0);
    prisma.user.count.mockResolvedValue(0);
    flutterwave.checkReadOnlyApiAvailability.mockResolvedValue('API reachable');
    service = new DashboardAnalyticsService(prisma as any, flutterwave as any);
  });

  it('uses inclusive UTC dates and the preceding equal-length period', async () => {
    await service.getAnalytics('2026-10-01', '2026-10-07');

    const transactionRanges = prisma.transaction.count.mock.calls.map(
      ([query]) => query.where.createdAt,
    );
    expect(transactionRanges).toEqual([
      {
        gte: new Date('2026-10-01T00:00:00.000Z'),
        lt: new Date('2026-10-08T00:00:00.000Z'),
      },
      {
        gte: new Date('2026-09-24T00:00:00.000Z'),
        lt: new Date('2026-10-01T00:00:00.000Z'),
      },
    ]);
  });

  it('builds Buy-flow product and destination-country breakdowns from successful purchases in the UTC range', async () => {
    prisma.transaction.count.mockResolvedValueOnce(8).mockResolvedValueOnce(4);
    prisma.giftCardSale.count.mockResolvedValueOnce(3).mockResolvedValueOnce(2);
    prisma.giftCardPurchase.groupBy
      .mockResolvedValueOnce([
        {
          brandNameSnapshot: 'FlixTrain DE',
          productNameSnapshot: 'FlixTrain DE',
          providerProductId: 'IOQ0P74FPCD1',
          _sum: { quantity: 3 },
        },
        {
          brandNameSnapshot: 'Primark DE',
          productNameSnapshot: 'Primark DE',
          providerProductId: 'RVBWMU18NZQY',
          _sum: { quantity: 2 },
        },
      ])
      .mockResolvedValueOnce([
        { countryCode: 'DE', _sum: { quantity: 5 } },
      ]);

    const result = await service.getAnalytics('2026-10-01', '2026-10-16');

    expect(prisma.giftCardSale.count.mock.calls[0][0].where.status.in).toEqual([
      'APPROVED',
      'PAID',
    ]);
    expect(prisma.giftCardPurchase.groupBy).toHaveBeenNthCalledWith(1, {
      by: ['brandNameSnapshot', 'productNameSnapshot', 'providerProductId'],
      where: {
        status: 'SUCCESSFUL',
        completedAt: {
          gte: new Date('2026-10-01T00:00:00.000Z'),
          lt: new Date('2026-10-17T00:00:00.000Z'),
        },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
    });
    expect(prisma.giftCardPurchase.groupBy).toHaveBeenNthCalledWith(2, {
      by: ['countryCode'],
      where: {
        status: 'SUCCESSFUL',
        completedAt: {
          gte: new Date('2026-10-01T00:00:00.000Z'),
          lt: new Date('2026-10-17T00:00:00.000Z'),
        },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });
    expect(prisma.giftCardSale.groupBy).not.toHaveBeenCalled();
    expect(result.overview.completedSales).toEqual({
      value: 3,
      previousValue: 2,
      changePercent: 50,
    });
    expect(result.overview.transactions).toEqual({
      value: 8,
      previousValue: 4,
      changePercent: 100,
    });
    expect(result.salesByGiftCard.data).toEqual([
      {
        name: 'FlixTrain DE',
        value: 3,
        percentage: 60,
        color: '#7C3AED',
      },
      {
        name: 'Primark DE',
        value: 2,
        percentage: 40,
        color: '#2563EB',
      },
    ]);
    expect(result.salesByGiftCard.totalSales).toBe(5);
    expect(
      result.topCountries.map((row) => [row.countryCode, row.count]),
    ).toEqual([['DE', 5]]);
  });

  it('returns honest unavailable money metrics and empty results', async () => {
    const result = await service.getAnalytics('2026-10-01', '2026-10-01');

    expect(result.overview.revenue.available).toBe(false);
    expect(result.overview.profit.available).toBe(false);
    expect(result.revenueOverview).toMatchObject({
      available: false,
      totalRevenue: null,
      series: [],
    });
    expect(result.accountingCoverage).toMatchObject({
      currency: 'USD',
      complete: false,
      revenue: { available: false },
      netGain: { available: false },
    });
    expect(result.accountingCoverage.revenue.missingSources).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Gift-card Buy'),
        expect.stringContaining('Gift-card Sell'),
        expect.stringContaining('Historical'),
      ]),
    );
    expect(result.accountingCoverage.netGain.missingCosts).toEqual([
      expect.stringContaining('Actual provider'),
    ]);
    expect(result.overview.revenue.value).toBeNull();
    expect(result.revenueOverview.totalRevenue).toBeNull();
    expect(result.revenueOverview.series).toEqual([]);
    expect(result.salesByGiftCard).toEqual({ totalSales: 0, data: [] });
    expect(result.recentTransactions).toEqual([]);
    expect(result.overview.completedSales.changePercent).toBe(0);
  });

  it('counts pending KYC and gift-card listings using admin queue statuses', async () => {
    prisma.user.count.mockResolvedValue(6);
    prisma.giftCardSale.count
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(4);

    const result = await service.getAnalytics('2026-10-01', '2026-10-07');
    const approvals = Object.fromEntries(
      result.pendingApprovals.map(({ id, count }) => [id, count]),
    );

    expect(prisma.user.count).toHaveBeenCalledWith({
      where: { isEmailVerified: true, isVerified: false },
    });
    expect(prisma.giftCardSale.count.mock.calls[2][0]).toEqual({
      where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
    });
    expect(approvals).toMatchObject({
      kyc: 6,
      listings: 4,
    });
  });

  it('reports monitoring results from live backend checks', async () => {
    flutterwave.checkReadOnlyApiAvailability.mockResolvedValue('Unavailable');
    jest
      .spyOn(service as any, 'checkStorageAvailability')
      .mockResolvedValue('Unavailable');

    const result = await service.getAnalytics('2026-10-01', '2026-10-01');
    const statuses = Object.fromEntries(
      result.systemStatus.metrics.map((metric) => [metric.name, metric.status]),
    );

    expect(prisma.$queryRaw).toHaveBeenCalled();
    expect(statuses).toMatchObject({
      'Application Server': 'API responding',
      Database: 'Connected',
      'Payment Gateway': 'Unavailable',
      Storage: 'Unavailable',
    });
    expect(result.systemStatus.overall).toBe('Service degradation');
  });

  it('reports all systems operational only when every health check passes', async () => {
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
    flutterwave.checkReadOnlyApiAvailability.mockResolvedValue('API reachable');
    jest
      .spyOn(service as any, 'checkStorageAvailability')
      .mockResolvedValue('Readable and writable');

    const result = await service.getAnalytics('2026-10-01', '2026-10-01');

    expect(result.systemStatus).toEqual({
      overall: 'All systems operational',
      metrics: [
        { name: 'Application Server', status: 'API responding' },
        { name: 'Database', status: 'Connected' },
        { name: 'Payment Gateway', status: 'API reachable' },
        { name: 'Storage', status: 'Readable and writable' },
      ],
    });
  });

  it.each([
    ['empty result', []],
    ['query failure', new Error('sensitive database details')],
  ])('reports the database unavailable for a %s health check', async (_case, result) => {
    if (result instanceof Error) {
      prisma.$queryRaw.mockRejectedValue(result);
    } else {
      prisma.$queryRaw.mockResolvedValue(result);
    }
    flutterwave.checkReadOnlyApiAvailability.mockResolvedValue('API reachable');
    jest
      .spyOn(service as any, 'checkStorageAvailability')
      .mockResolvedValue('Readable and writable');

    const analytics = await service.getAnalytics('2026-10-01', '2026-10-01');
    const statuses = Object.fromEntries(
      analytics.systemStatus.metrics.map((metric) => [metric.name, metric.status]),
    );

    expect(statuses.Database).toBe('Unavailable');
    expect(analytics.systemStatus.overall).toBe('Service degradation');
    expect(JSON.stringify(analytics.systemStatus)).not.toContain(
      'sensitive database details',
    );
  });

  it.each([
    ['', '2026-10-01'],
    ['2026-02-30', '2026-03-01'],
    ['2026-10-02', '2026-10-01'],
  ])('rejects invalid date ranges (%s, %s)', async (start, end) => {
    await expect(service.getAnalytics(start, end)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.transaction.count).not.toHaveBeenCalled();
  });
});
