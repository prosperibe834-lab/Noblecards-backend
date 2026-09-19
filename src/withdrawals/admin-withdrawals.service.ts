import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionStatus } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';

type AdminWithdrawalQuery = Record<string, string | undefined>;

type AdminWithdrawalRecord = {
  id: string;
  reference: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string | null;
  avatar: string;
  originalAmount: number;
  currency: string;
  usdValue: number;
  grossAmountUsd: number;
  destinationAmount: number;
  destinationCurrency: string;
  destinationCountry: string;
  method: string;
  provider: string | null;
  providerReference: string | null;
  providerTransactionId: string | null;
  status: TransactionStatus;
  failureReason: string | null;
  nobleCardsRate: number;
  rateMarkup: string;
  nobleCardsFee: number;
  providerFee: number;
  netAmountUsd: number;
  walletBefore: number;
  walletAfter: number;
  date: Date;
  updatedDate: Date;
  completedDate: Date | null;
  destination: Record<string, string | null>;
  reconciliation: { status: string; providerAmount: number; ledgerAmount: number; difference: number };
  timeline: Array<{ status: string; date: string; time: string; source: string }>;
  auditTrail: Array<{ event: string; timestamp: Date; actor: string }>;
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER: 'Bank Transfer',
  CARD: 'Card',
  USSD: 'USSD',
  MOBILE_MONEY: 'Mobile Money',
  WALLET_TRANSFER: 'Wallet Transfer',
  APPLE_PAY: 'Apple Pay',
  GOOGLE_PAY: 'Google Pay',
  WISE: 'Wise',
  OTHER: 'Other',
};

const SORT_FIELDS: Record<string, string> = {
  date: 'createdAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  originalAmount: 'destinationAmount',
  amount: 'sourceAmount',
  usdValue: 'sourceAmount',
  status: 'status',
  currency: 'destinationCurrencyCode',
  userName: 'user',
};

const WITHDRAWAL_INCLUDE = {
  user: {
    select: { id: true, firstName: true, lastName: true, displayName: true, email: true, phone: true, username: true, profileImageUrl: true },
  },
  transaction: {
    select: {
      id: true,
      status: true,
      reference: true,
      provider: true,
      providerReference: true,
      providerTransactionId: true,
      ledgerEntries: {
        select: { balanceBefore: true, balanceAfter: true, amount: true, type: true, reason: true, createdAt: true },
        orderBy: { createdAt: 'asc' as const },
      },
    },
  },
  beneficiary: {
    select: { id: true, type: true, institutionName: true, providerBankCode: true, accountHolderName: true, accountLast4: true, mobileMoneyProvider: true },
  },
  payoutAttempts: {
    select: { id: true, provider: true, providerReference: true, providerTransactionId: true, status: true, errorCode: true, errorMessage: true, createdAt: true, updatedAt: true },
    orderBy: { createdAt: 'asc' as const },
  },
  webhookEvents: {
    select: { id: true, eventType: true, status: true, providerReference: true, providerTransactionId: true, receivedAt: true, processedAt: true, errorMessage: true },
    orderBy: { receivedAt: 'asc' as const },
  },
} as const;

@Injectable()
export class AdminWithdrawalsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminWithdrawals(query: AdminWithdrawalQuery) {
    const parsed = this.parseQuery(query);
    const where = this.buildWhere(parsed);
    const orderBy = this.buildOrderBy(parsed.sort, parsed.direction);

    const [records, total, stats, chartData] = await Promise.all([
      (this.prisma as any).withdrawal.findMany({
        where,
        include: WITHDRAWAL_INCLUDE,
        orderBy,
        skip: (parsed.page - 1) * parsed.pageSize,
        take: parsed.pageSize,
      }),
      (this.prisma as any).withdrawal.count({ where }),
      this.getStats(),
      this.getChartData(),
    ]);

    return {
      withdrawals: records.map((record: any) => this.toAdminRecord(record)),
      pagination: { page: parsed.page, pageSize: parsed.pageSize, total, totalPages: Math.ceil(total / parsed.pageSize) },
      stats,
      chartData,
    };
  }

  async getAdminWithdrawal(id: string) {
    const record = await (this.prisma as any).withdrawal.findUnique({ where: { id }, include: WITHDRAWAL_INCLUDE });
    if (!record) throw new NotFoundException('Withdrawal not found.');
    return this.toAdminRecord(record);
  }

  private parseQuery(query: AdminWithdrawalQuery) {
    const page = this.parseInteger(query.page, 1, 1, 1_000_000);
    const pageSize = this.parseInteger(query.pageSize ?? query.limit, 10, 1, 100);
    const status = this.normalizeFilter(query.status);
    if (status && !Object.values(TransactionStatus).includes(status as TransactionStatus)) {
      throw new BadRequestException(`Unsupported withdrawal status: ${status}`);
    }

    const startDate = this.parseDate(query.startDate ?? query.dateFrom);
    const endDate = this.parseDate(query.endDate ?? query.dateTo, true);
    if (startDate && endDate && startDate > endDate) throw new BadRequestException('startDate must be before endDate.');

    return {
      page,
      pageSize,
      search: query.search?.trim() || undefined,
      status: status as TransactionStatus | undefined,
      currency: this.normalizeFilter(query.currency),
      country: this.normalizeFilter(query.country),
      method: this.normalizeFilter(query.method),
      startDate,
      endDate,
      sort: query.sort ?? query.sortBy ?? 'date',
      direction: query.direction === 'asc' ? 'asc' as const : 'desc' as const,
    };
  }

  private buildWhere(parsed: ReturnType<AdminWithdrawalsService['parseQuery']>) {
    const where: any = {};
    if (parsed.status) where.status = parsed.status;
    if (parsed.currency) where.destinationCurrencyCode = parsed.currency.toUpperCase();
    if (parsed.country) where.countryCode = parsed.country.toUpperCase();
    if (parsed.method) where.paymentMethod = parsed.method.toUpperCase();
    if (parsed.startDate || parsed.endDate) where.createdAt = { ...(parsed.startDate ? { gte: parsed.startDate } : {}), ...(parsed.endDate ? { lte: parsed.endDate } : {}) };
    if (parsed.search) {
      where.OR = [
        { id: { contains: parsed.search, mode: 'insensitive' } },
        { reference: { contains: parsed.search, mode: 'insensitive' } },
        { providerReference: { contains: parsed.search, mode: 'insensitive' } },
        { providerTransactionId: { contains: parsed.search, mode: 'insensitive' } },
        { user: { is: { id: { contains: parsed.search, mode: 'insensitive' } } } },
        { user: { is: { firstName: { contains: parsed.search, mode: 'insensitive' } } } },
        { user: { is: { lastName: { contains: parsed.search, mode: 'insensitive' } } } },
        { user: { is: { email: { contains: parsed.search, mode: 'insensitive' } } } },
        { beneficiary: { is: { accountHolderName: { contains: parsed.search, mode: 'insensitive' } } } },
      ];
    }
    return where;
  }

  private buildOrderBy(sort: string, direction: 'asc' | 'desc') {
    const field = SORT_FIELDS[sort] ?? SORT_FIELDS.date;
    if (field === 'user') return { user: { firstName: direction } };
    return { [field]: direction };
  }

  private async getStats() {
    const today = new Date();
    const todayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const [total, todayTotal, groups] = await Promise.all([
      (this.prisma as any).withdrawal.aggregate({ _count: { _all: true }, _sum: { sourceAmount: true, fee: true } }),
      (this.prisma as any).withdrawal.aggregate({ where: { createdAt: { gte: todayStart } }, _sum: { sourceAmount: true } }),
      (this.prisma as any).withdrawal.groupBy({ by: ['status'], _count: { _all: true }, _sum: { sourceAmount: true } }),
    ]);
    const byStatus = new Map<string, any>(groups.map((group: any) => [group.status, group] as [string, any]));
    const getCount = (status: TransactionStatus) => byStatus.get(status)?._count?._all ?? 0;
    const getVolume = (status: TransactionStatus) => this.number(byStatus.get(status)?._sum?.sourceAmount);
    return {
      totalWithdrawals: total._count?._all ?? 0,
      totalWithdrawalVolume: this.number(total._sum?.sourceAmount),
      todaysWithdrawalVolume: this.number(todayTotal._sum?.sourceAmount),
      pendingWithdrawals: getCount(TransactionStatus.PENDING),
      pendingWithdrawalVolume: getVolume(TransactionStatus.PENDING),
      processingWithdrawals: getCount(TransactionStatus.PROCESSING),
      processingWithdrawalVolume: getVolume(TransactionStatus.PROCESSING),
      successfulWithdrawals: getCount(TransactionStatus.SUCCESSFUL),
      successfulWithdrawalVolume: getVolume(TransactionStatus.SUCCESSFUL),
      failedWithdrawals: getCount(TransactionStatus.FAILED),
      failedWithdrawalVolume: getVolume(TransactionStatus.FAILED),
      underReviewWithdrawals: getCount(TransactionStatus.UNDER_REVIEW),
      cancelledWithdrawals: getCount(TransactionStatus.CANCELLED),
      reversedWithdrawals: getCount(TransactionStatus.REVERSED),
      totalFees: this.number(total._sum?.fee),
    };
  }

  private async getChartData() {
    const [volumeOverTime, statusRows, methodRows, countryRows, currencyRows] = await Promise.all([
      (this.prisma as any).$queryRaw`
        SELECT DATE_TRUNC('day', "createdAt") AS date,
          COALESCE(SUM("sourceAmount"), 0)::text AS volume,
          COUNT(*)::int AS count
        FROM "Withdrawal"
        GROUP BY DATE_TRUNC('day', "createdAt")
        ORDER BY date ASC
      `,
      (this.prisma as any).withdrawal.groupBy({ by: ['status'], _count: { _all: true }, _sum: { sourceAmount: true } }),
      (this.prisma as any).withdrawal.groupBy({ by: ['paymentMethod'], _count: { _all: true }, _sum: { sourceAmount: true } }),
      (this.prisma as any).withdrawal.groupBy({ by: ['countryCode'], _count: { _all: true }, _sum: { sourceAmount: true } }),
      (this.prisma as any).withdrawal.groupBy({ by: ['destinationCurrencyCode'], _count: { _all: true }, _sum: { sourceAmount: true } }),
    ]);
    return {
      volumeOverTime: volumeOverTime.map((row: any) => ({ date: row.date, volume: this.number(row.volume), count: Number(row.count) })),
      statusBreakdown: statusRows.map((row: any) => ({ name: row.status, count: row._count?._all ?? 0, volume: this.number(row._sum?.sourceAmount) })),
      methodBreakdown: methodRows.map((row: any) => ({ method: PAYMENT_METHOD_LABELS[row.paymentMethod] ?? row.paymentMethod, count: row._count?._all ?? 0, volume: this.number(row._sum?.sourceAmount) })),
      countryBreakdown: countryRows.map((row: any) => ({ country: row.countryCode, count: row._count?._all ?? 0, volume: this.number(row._sum?.sourceAmount) })),
      currencyBreakdown: currencyRows.map((row: any) => ({ currency: row.destinationCurrencyCode, count: row._count?._all ?? 0, volume: this.number(row._sum?.sourceAmount) })),
    };
  }

  private toAdminRecord(record: any): AdminWithdrawalRecord {
    const user = record.user ?? {};
    const beneficiary = record.beneficiary;
    const transaction = record.transaction;
    const ledgerEntries = transaction?.ledgerEntries ?? [];
    const firstLedger = ledgerEntries[0];
    const lastLedger = ledgerEntries[ledgerEntries.length - 1] ?? firstLedger;
    const sourceAmount = this.number(record.sourceAmount);
    const destinationAmount = this.number(record.destinationAmount);
    const fee = this.number(record.fee);
    const userName = user.displayName || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email || record.userId;
    const timeline = this.buildTimeline(record);
    return {
      id: record.id,
      reference: record.reference,
      userId: record.userId,
      userName,
      userEmail: user.email ?? '',
      userPhone: user.phone ?? null,
      avatar: user.profileImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`,
      originalAmount: destinationAmount,
      currency: record.destinationCurrencyCode,
      usdValue: sourceAmount,
      grossAmountUsd: sourceAmount,
      destinationAmount,
      destinationCurrency: record.destinationCurrencyCode,
      destinationCountry: record.country,
      method: PAYMENT_METHOD_LABELS[record.paymentMethod] ?? record.paymentMethod,
      provider: record.provider ?? null,
      providerReference: record.providerReference ?? transaction?.providerReference ?? null,
      providerTransactionId: record.providerTransactionId ?? transaction?.providerTransactionId ?? null,
      status: record.status,
      failureReason: record.failureReason ?? null,
      nobleCardsRate: this.number(record.exchangeRate),
      rateMarkup: '',
      nobleCardsFee: fee,
      providerFee: 0,
      netAmountUsd: Math.max(sourceAmount - fee, 0),
      walletBefore: this.number(firstLedger?.balanceBefore),
      walletAfter: this.number(lastLedger?.balanceAfter),
      date: record.createdAt,
      updatedDate: record.updatedAt,
      completedDate: record.completedAt ?? null,
      destination: beneficiary ? {
        type: beneficiary.type,
        bankName: beneficiary.institutionName ?? null,
        bankCode: beneficiary.providerBankCode ?? null,
        accountHolder: beneficiary.accountHolderName ?? null,
        accountNumber: beneficiary.accountLast4 ? `******${beneficiary.accountLast4}` : null,
        mobileMoneyProvider: beneficiary.mobileMoneyProvider ?? null,
      } : {},
      reconciliation: this.getReconciliation(record, transaction),
      timeline,
      auditTrail: timeline.map((item) => ({ event: item.status, timestamp: new Date(`${item.date} ${item.time}`), actor: item.source })),
    };
  }

  private getReconciliation(record: any, transaction: any) {
    const providerAmount = record.status === TransactionStatus.SUCCESSFUL ? this.number(record.amountReceived) : 0;
    const ledgerAmount = transaction?.ledgerEntries?.length ? this.number(record.sourceAmount) : 0;
    const difference = Math.abs(providerAmount - ledgerAmount);
    return { status: difference === 0 && record.status === TransactionStatus.SUCCESSFUL ? 'Reconciled' : 'Pending', providerAmount, ledgerAmount, difference };
  }

  private buildTimeline(record: any) {
    const events = [{ status: 'Withdrawal Created', timestamp: record.createdAt, source: 'NobleCards Backend' }];
    for (const attempt of record.payoutAttempts ?? []) events.push({ status: `Payout ${attempt.status}`, timestamp: attempt.createdAt, source: attempt.provider ?? 'Payout Service' });
    for (const webhook of record.webhookEvents ?? []) events.push({ status: `Webhook ${webhook.status}`, timestamp: webhook.receivedAt, source: webhook.eventType });
    if (record.completedAt) events.push({ status: 'Withdrawal Completed', timestamp: record.completedAt, source: 'NobleCards Backend' });
    return events.sort((left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime()).map((event) => {
      const date = new Date(event.timestamp);
      return { status: event.status, date: date.toLocaleDateString('en-US'), time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), source: event.source };
    });
  }

  private normalizeFilter(value?: string) {
    if (!value || value === 'All' || value === 'All Statuses' || value === 'All Methods' || value === 'All Currencies' || value === 'All Countries') return undefined;
    return value.trim() || undefined;
  }

  private parseInteger(value: string | undefined, fallback: number, min: number, max: number) {
    if (value === undefined || value === '') return fallback;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new BadRequestException('Pagination values are invalid.');
    return parsed;
  }

  private parseDate(value?: string, endOfDay = false) {
    if (!value) return undefined;
    const date = /^\d{4}-\d{2}-\d{2}$/.test(value) && endOfDay ? new Date(`${value}T23:59:59.999Z`) : new Date(value);
    if (Number.isNaN(date.getTime())) throw new BadRequestException(`Invalid date: ${value}`);
    return date;
  }

  private number(value: unknown) {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
