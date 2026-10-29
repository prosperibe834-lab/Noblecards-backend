import { DashboardAnalyticsService } from './dashboard-analytics.service';

describe('DashboardAnalyticsService - Live Dashboard Data & Notifications', () => {
  const prisma = {
    $queryRaw: jest.fn(),
    transaction: {
      count: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
    user: {
      count: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
    giftCardSale: {
      count: jest.fn(),
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
    giftCardPurchase: {
      count: jest.fn(),
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
    deposit: {
      findMany: jest.fn(),
    },
    withdrawal: { count: jest.fn() },
    notification: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };
  const flutterwave = { checkReadOnlyApiAvailability: jest.fn() };
  let service: DashboardAnalyticsService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
    prisma.transaction.count.mockResolvedValue(15);
    prisma.transaction.findMany.mockResolvedValue([]);
    prisma.transaction.aggregate.mockResolvedValue({ _sum: { amount: 5000, fee: 250 } });
    prisma.user.count.mockResolvedValue(3);
    prisma.user.findUnique.mockResolvedValue({
      id: 'admin-1',
      displayName: 'Super Admin Prosper',
      role: 'ADMIN',
    });
    prisma.user.findFirst.mockResolvedValue({
      id: 'admin-1',
      displayName: 'Super Admin Prosper',
      role: 'ADMIN',
    });
    prisma.user.findMany.mockResolvedValue([]);
    prisma.user.groupBy.mockResolvedValue([
      { country: 'Nigeria', _count: { id: 120 } },
      { country: 'Ghana', _count: { id: 85 } },
    ]);
    prisma.giftCardSale.count.mockResolvedValue(5);
    prisma.giftCardSale.groupBy.mockResolvedValue([]);
    prisma.giftCardSale.findMany.mockResolvedValue([
      {
        id: 'sale-1',
        brandNameSnapshot: 'Apple',
        cardAmount: 100,
        cardCurrency: 'USD',
        cardCountry: 'US',
        quotedPayoutAmount: 95,
        status: 'PAID',
        createdAt: new Date(),
        user: { firstName: 'Prosper', username: 'firminofx1' },
      },
    ]);
    prisma.giftCardPurchase.count.mockResolvedValue(8);
    prisma.giftCardPurchase.groupBy.mockResolvedValue([]);
    prisma.giftCardPurchase.findMany.mockResolvedValue([
      {
        id: 'pur-1',
        brandNameSnapshot: 'Amazon',
        quantity: 1,
        amount: 50,
        currencyCode: 'USD',
        countryCode: 'US',
        status: 'SUCCESSFUL',
        createdAt: new Date(),
      },
    ]);
    prisma.deposit.findMany.mockResolvedValue([
      { country: 'Nigeria', countryCode: 'NG' },
      { country: 'United Kingdom', countryCode: 'GB' },
      { country: 'United States', countryCode: 'US' },
      { country: 'Germany', countryCode: 'DE' },
      { country: 'Ghana', countryCode: 'GH' },
    ]);
    prisma.transaction.findMany.mockResolvedValue([
      {
        id: 'tx-1',
        amount: 100,
        currencyCode: 'USD',
        fee: 3.5,
        createdAt: new Date(),
        status: 'COMPLETED',
        user: { firstName: 'Prosper', username: 'firminofx1' },
        giftCardSale: { slug: 'apple-100', brandNameSnapshot: 'Apple' },
      },
      {
        id: 'tx-2',
        amount: 200,
        currencyCode: 'USD',
        fee: 7,
        createdAt: new Date(),
        status: 'COMPLETED',
        user: { firstName: 'Prosper', username: 'firminofx1' },
        giftCardSale: { slug: 'amazon-200', brandNameSnapshot: 'Amazon' },
      },
      {
        id: 'tx-3',
        amount: 50,
        currencyCode: 'USD',
        fee: 1.5,
        createdAt: new Date(),
        status: 'COMPLETED',
        user: { firstName: 'Prosper', username: 'firminofx1' },
      },
      {
        id: 'tx-4',
        amount: 80,
        currencyCode: 'USD',
        fee: 2.5,
        createdAt: new Date(),
        status: 'COMPLETED',
        user: { firstName: 'Prosper', username: 'firminofx1' },
      },
      {
        id: 'tx-5',
        amount: 120,
        currencyCode: 'USD',
        fee: 4.2,
        createdAt: new Date(),
        status: 'COMPLETED',
        user: { firstName: 'Prosper', username: 'firminofx1' },
      },
    ]);
    prisma.withdrawal.count.mockResolvedValue(2);
    prisma.notification.findMany.mockResolvedValue([]);
    flutterwave.checkReadOnlyApiAvailability.mockResolvedValue('API reachable');
    service = new DashboardAnalyticsService(prisma as any, flutterwave as any);
  });

  it('getDashboardData returns complete contract matching frontend UI expectations', async () => {
    const data = await service.getDashboardData('admin-1');

    // 1. Header
    expect(data.header).toBeDefined();
    expect(data.header.adminName).toBe('Super Admin Prosper');
    expect(data.header.adminRole).toBe('Super Admin');
    expect(typeof data.header.unreadNotifications).toBe('number');

    // 2. Overview Stats (4 cards)
    expect(data.overviewStats).toHaveLength(4);
    const [revCard, profitCard, cardsCard, txCard] = data.overviewStats;
    expect(revCard.id).toBe('revenue');
    expect(profitCard.id).toBe('profit');
    expect(cardsCard.id).toBe('cards_sold');
    expect(txCard.id).toBe('transactions');

    // 3. Revenue Overview
    expect(data.revenueOverview).toBeDefined();
    expect(data.revenueOverview.timeframeData['This Week']).toHaveLength(7);
    expect(data.revenueOverview.timeframeData['This Month']).toHaveLength(4);
    expect(data.revenueOverview.timeframeData['This Year']).toHaveLength(4);

    // 4. Sales by Gift Card
    expect(data.salesByGiftCard).toBeDefined();
    expect(data.salesByGiftCard.data.length).toBeGreaterThanOrEqual(1);

    // 5. Top Countries
    expect(data.topCountries).toHaveLength(5);

    // 6. Recent Transactions (EXACTLY 5 ITEMS)
    expect(data.recentTransactions).toHaveLength(5);
    data.recentTransactions.forEach((tx: any) => {
      expect(tx).toHaveProperty('id');
      expect(tx).toHaveProperty('cardName');
      expect(tx).toHaveProperty('user');
      expect(tx).toHaveProperty('amount');
      expect(tx).toHaveProperty('time');
      expect(tx).toHaveProperty('icon');
      expect(tx).toHaveProperty('iconColor');
    });

    // 7. System Status - MUST SHOW PERCENTAGE FOR ALL METRICS
    expect(data.systemStatus).toBeDefined();
    expect(data.systemStatus.overall).toBe('All Systems Operational');
    expect(data.systemStatus.metrics).toHaveLength(4);
    data.systemStatus.metrics.forEach((metric: any) => {
      expect(typeof metric.name).toBe('string');
      expect(typeof metric.percentage).toBe('number');
      expect(metric.percentage).toBeGreaterThanOrEqual(0);
      expect(metric.percentage).toBeLessThanOrEqual(100);
      expect(typeof metric.color).toBe('string');
    });

    // 8. Pending Approvals
    expect(data.pendingApprovals).toHaveLength(3);
    const kycApproval = data.pendingApprovals.find((a: any) => a.id === 'kyc');
    expect(kycApproval.count).toBe(3);
    const withdrawalApproval = data.pendingApprovals.find((a: any) => a.id === 'withdrawals');
    expect(withdrawalApproval.count).toBe(2);
  });

  it('getAdminNotificationFeed returns unread count and categorized notification items', async () => {
    const feed = await service.getAdminNotificationFeed('admin-1');

    expect(feed).toBeDefined();
    expect(typeof feed.unreadCount).toBe('number');
    expect(Array.isArray(feed.notifications)).toBe(true);

    const actionItems = feed.notifications.filter((n: any) => n.category === 'Action Needed');
    expect(actionItems.length).toBeGreaterThanOrEqual(1);

    feed.notifications.forEach((notif: any) => {
      expect(notif).toHaveProperty('id');
      expect(notif).toHaveProperty('title');
      expect(notif).toHaveProperty('description');
      expect(notif).toHaveProperty('category');
      expect(notif).toHaveProperty('route');
      expect(notif).toHaveProperty('icon');
      expect(notif).toHaveProperty('timeAgo');
    });
  });
});
