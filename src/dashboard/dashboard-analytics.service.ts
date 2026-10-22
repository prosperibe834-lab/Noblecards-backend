import { BadRequestException, Injectable } from '@nestjs/common';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { FlutterwaveService } from '../flutterwave/flutterwave.service';

const COMPLETED_SALE_STATUSES = ['APPROVED', 'PAID'];
const PENDING_WITHDRAWAL_STATUSES = ['PENDING', 'PROCESSING', 'UNDER_REVIEW'];
const REVENUE_COVERAGE_GAPS = [
  'Gift-card Buy settlement accounting is supported only for executed Tremendous purchases with verified USD settlement data; Topupmate actual costs and other Buy-provider settlements are not reliably available.',
  'Gift-card Sell submissions and quoted payouts do not prove settlement; completed proceeds and actual provider costs are not yet recorded from verified settlement callbacks.',
  'Historical deposit and withdrawal earnings have not been reconciled into the accounting ledger or approved for backfill.',
];
const PROFIT_COVERAGE_GAPS = [
  'Actual provider, processing, and other attributable business costs are not consistently persisted in USD.',
];
const CHART_COLORS = [
  '#7C3AED',
  '#2563EB',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#64748B',
];

type DateRange = {
  start: Date;
  endExclusive: Date;
};

@Injectable()
export class DashboardAnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly flutterwave: FlutterwaveService,
  ) {}

  private async checkStorageAvailability() {
    try {
      await access(
        join(process.cwd(), 'uploads'),
        constants.R_OK | constants.W_OK,
      );
      return 'Readable and writable';
    } catch {
      return 'Unavailable';
    }
  }

  private checkApplicationServerAvailability() {
    return process.pid > 0 && Number.isFinite(process.uptime())
      ? 'API responding'
      : 'Unavailable';
  }

  private async checkDatabaseAvailability() {
    try {
      const result = await this.prisma.$queryRaw`SELECT 1`;
      return Array.isArray(result) && result.length > 0
        ? 'Connected'
        : 'Unavailable';
    } catch {
      return 'Unavailable';
    }
  }

  async getAnalytics(startDateValue: string, endDateValue: string) {
    const range = this.parseRange(startDateValue, endDateValue);
    const duration = range.endExclusive.getTime() - range.start.getTime();
    const previousRange = {
      start: new Date(range.start.getTime() - duration),
      endExclusive: range.start,
    };
    const saleWhere = (period: DateRange) => ({
      status: { in: COMPLETED_SALE_STATUSES as any },
      createdAt: { gte: period.start, lt: period.endExclusive },
    });
    const purchaseWhere = (period: DateRange) => ({
      status: 'SUCCESSFUL',
      completedAt: { gte: period.start, lt: period.endExclusive },
    });
    const transactionWhere = (period: DateRange) => ({
      createdAt: { gte: period.start, lt: period.endExclusive },
    });

    const prisma = this.prisma as any;
    const [
      transactionCount,
      previousTransactionCount,
      completedSaleCount,
      previousCompletedSaleCount,
      purchasesByType,
      purchasesByCountry,
      transactions,
      sales,
      pendingWithdrawals,
      pendingKyc,
      pendingCardListings,
      applicationServerStatus,
      databaseStatus,
      gatewayStatus,
      storageStatus,
    ] = await Promise.all([
      prisma.transaction.count({ where: transactionWhere(range) }),
      prisma.transaction.count({ where: transactionWhere(previousRange) }),
      prisma.giftCardSale.count({ where: saleWhere(range) }),
      prisma.giftCardSale.count({ where: saleWhere(previousRange) }),
      prisma.giftCardPurchase.groupBy({
        by: ['brandNameSnapshot', 'productNameSnapshot', 'providerProductId'],
        where: purchaseWhere(range),
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
      }),
      prisma.giftCardPurchase.groupBy({
        by: ['countryCode'],
        where: purchaseWhere(range),
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
      prisma.transaction.findMany({
        where: transactionWhere(range),
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          type: true,
          status: true,
          amount: true,
          currencyCode: true,
          createdAt: true,
          giftCardSale: {
            select: {
              brandNameSnapshot: true,
              slug: true,
              transactionId: true,
            },
          },
          giftCardPurchase: {
            select: { brandNameSnapshot: true, productNameSnapshot: true },
          },
        },
      }),
      prisma.giftCardSale.findMany({
        where: { createdAt: { gte: range.start, lt: range.endExclusive } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          transactionId: true,
          status: true,
          brandNameSnapshot: true,
          slug: true,
          cardAmount: true,
          cardCurrency: true,
          quotedPayoutAmount: true,
          quotedPayoutCurrency: true,
          createdAt: true,
        },
      }),
      prisma.withdrawal.count({
        where: { status: { in: PENDING_WITHDRAWAL_STATUSES as any } },
      }),
      prisma.user.count({
        where: { isEmailVerified: true, isVerified: false },
      }),
      prisma.giftCardSale.count({
        where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] as any } },
      }),
      this.checkApplicationServerAvailability(),
      this.checkDatabaseAvailability(),
      this.flutterwave.checkReadOnlyApiAvailability(),
      this.checkStorageAvailability(),
    ]);

    const recentTransactions = [
      ...transactions.map((transaction: any) =>
        this.toTransactionSummary(transaction),
      ),
      ...sales
        .filter((sale: any) => !sale.transactionId)
        .map((sale: any) => this.toSaleSummary(sale)),
    ]
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      )
      .slice(0, 5)
      .map(({ createdAt, ...transaction }) => ({
        ...transaction,
        createdAt: createdAt.toISOString(),
      }));

    const totalPurchasedCards = purchasesByType.reduce(
      (total: number, row: any) => total + (row._sum.quantity ?? 0),
      0,
    );
    const healthStatuses = [
      applicationServerStatus,
      databaseStatus,
      gatewayStatus,
      storageStatus,
    ];
    const overallStatus = healthStatuses.every((status) =>
      [
        'API responding',
        'Connected',
        'API reachable',
        'Readable and writable',
      ].includes(status),
    )
      ? 'All systems operational'
      : 'Service degradation';

    return {
      range: {
        startDate: startDateValue,
        endDate: endDateValue,
        timezone: 'UTC',
      },
      overview: {
        revenue: { available: false, value: null, currency: null },
        profit: { available: false, value: null, currency: null },
        completedSales: {
          value: completedSaleCount,
          previousValue: previousCompletedSaleCount,
          changePercent: this.changePercent(
            completedSaleCount,
            previousCompletedSaleCount,
          ),
        },
        transactions: {
          value: transactionCount,
          previousValue: previousTransactionCount,
          changePercent: this.changePercent(
            transactionCount,
            previousTransactionCount,
          ),
        },
      },
      revenueOverview: {
        available: false,
        currency: null,
        totalRevenue: null,
        growthPercent: null,
        series: [],
      },
      accountingCoverage: {
        currency: 'USD',
        complete: false,
        revenue: {
          available: false,
          missingSources: REVENUE_COVERAGE_GAPS,
        },
        netGain: {
          available: false,
          missingCosts: PROFIT_COVERAGE_GAPS,
        },
      },
      salesByGiftCard: {
        totalSales: totalPurchasedCards,
        data: purchasesByType.map((row: any, index: number) => {
          const count = row._sum.quantity ?? 0;
          return {
            name:
              row.brandNameSnapshot ??
              row.productNameSnapshot ??
              row.providerProductId,
            value: count,
            percentage:
              totalPurchasedCards === 0
                ? 0
                : Math.round((count / totalPurchasedCards) * 100),
            color: CHART_COLORS[index % CHART_COLORS.length],
          };
        }),
      },
      topCountries: purchasesByCountry.map((row: any, index: number) => ({
        countryCode: row.countryCode,
        count: row._sum.quantity ?? 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
      })),
      recentTransactions,
      systemStatus: {
        overall: overallStatus,
        metrics: [
          { name: 'Application Server', status: applicationServerStatus },
          { name: 'Database', status: databaseStatus },
          { name: 'Payment Gateway', status: gatewayStatus },
          { name: 'Storage', status: storageStatus },
        ],
      },
      pendingApprovals: [
        {
          id: 'kyc',
          title: 'KYC Verifications',
          count: pendingKyc,
          route: '/kyc',
          bg: 'rgba(124, 58, 237, 0.08)',
          icon: 'bx-id-card',
          color: '#7C3AED',
        },
        {
          id: 'listings',
          title: 'Card Listings',
          count: pendingCardListings,
          route: '/gift-cards',
          bg: 'rgba(245, 158, 11, 0.08)',
          icon: 'bx-store-alt',
          color: '#F59E0B',
        },
        {
          id: 'withdrawals',
          title: 'Withdrawals',
          count: pendingWithdrawals,
          route: '/withdrawals',
          bg: 'rgba(16, 185, 129, 0.08)',
          icon: 'bx-wallet-alt',
          color: '#10B981',
        },
      ],
    };
  }

  private parseRange(startDateValue: string, endDateValue: string): DateRange {
    const start = this.parseDate(startDateValue, 'startDate');
    const end = this.parseDate(endDateValue, 'endDate');
    if (start > end) {
      throw new BadRequestException('startDate must not be after endDate.');
    }
    end.setUTCDate(end.getUTCDate() + 1);
    return { start, endExclusive: end };
  }

  private parseDate(value: string, parameter: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) {
      throw new BadRequestException(`${parameter} must use YYYY-MM-DD format.`);
    }
    const date = new Date(`${value}T00:00:00.000Z`);
    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== value
    ) {
      throw new BadRequestException(
        `${parameter} must be a valid calendar date.`,
      );
    }
    return date;
  }

  private changePercent(current: number, previous: number): number | null {
    if (previous === 0) return current === 0 ? 0 : null;
    return Math.round(((current - previous) / previous) * 10000) / 100;
  }

  private toTransactionSummary(transaction: any) {
    const type = String(transaction.type);
    const brand =
      transaction.giftCardSale?.brandNameSnapshot ??
      transaction.giftCardSale?.slug ??
      transaction.giftCardPurchase?.brandNameSnapshot ??
      transaction.giftCardPurchase?.productNameSnapshot;
    const cardName = brand
      ? `${brand} Gift Card`
      : ({
          DEPOSIT: 'Deposit',
          WITHDRAWAL: 'Withdrawal',
          PURCHASE: 'Gift Card Purchase',
          TRANSFER: 'Transfer',
          FEE: 'Fee',
          REFUND: 'Refund',
          REVERSAL: 'Reversal',
          BONUS: 'Bonus',
          ADJUSTMENT: 'Adjustment',
        }[type] ?? 'Transaction');
    return {
      id: transaction.id,
      cardName,
      user: 'Customer •••',
      amount: `${transaction.currencyCode} ${transaction.amount.toString()}`,
      status: transaction.status,
      type,
      createdAt: transaction.createdAt,
    };
  }

  private toSaleSummary(sale: any) {
    const successful = COMPLETED_SALE_STATUSES.includes(sale.status);
    const amount =
      successful && sale.quotedPayoutAmount != null
        ? sale.quotedPayoutAmount.toString()
        : sale.cardAmount.toString();
    const currency =
      successful && sale.quotedPayoutCurrency
        ? sale.quotedPayoutCurrency
        : sale.cardCurrency;
    return {
      id: sale.id,
      cardName: `${sale.brandNameSnapshot ?? sale.slug} Gift Card`,
      user: 'Customer •••',
      amount: `${currency} ${amount}`,
      status: sale.status,
      type: 'GIFT_CARD_SALE',
      createdAt: sale.createdAt,
    };
  }
}
