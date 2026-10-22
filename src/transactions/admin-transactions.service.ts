import { BadRequestException, Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import {
  DepositStatus,
  GiftCardPurchaseStatus,
  GiftCardSaleStatus,
  Prisma,
  TransactionStatus,
  type PaymentMethod,
  type TransactionType,
} from '../generated/prisma/index.js';
import { PrismaService } from '../prisma/prisma.service';

type AdminTransactionQuery = Record<string, string | undefined>;
type TransactionTotalRow = {
  currencyCode: string;
  status: string;
  amount: string | null;
  count: number;
};
type VolumeChartRow = { label: string; currency: string; value: string };
type CategoryChartRow = { name: string; currency: string; value: string };
type RevenueRow = { amount: string | null; count: number };

type TransactionFilters = {
  search?: string;
  status?: string;
  type?: string;
  category?: string;
  currency?: string;
  paymentMethod?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endExclusive?: Date;
};

const transactionListSelect = {
  id: true,
  userId: true,
  currencyCode: true,
  type: true,
  amount: true,
  fee: true,
  netAmount: true,
  status: true,
  provider: true,
  providerTransactionId: true,
  providerReference: true,
  paymentMethod: true,
  reference: true,
  createdAt: true,
  user: {
    select: {
      displayName: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      profileImageUrl: true,
    },
  },
  giftCardSale: {
    select: {
      id: true,
      status: true,
      providerStatus: true,
      providerTradeId: true,
      slug: true,
      brandNameSnapshot: true,
      cardType: true,
      cardCountry: true,
      cardCurrency: true,
      cardAmount: true,
      quotedPayoutAmount: true,
      quotedPayoutCurrency: true,
      providerFee: true,
      nobleCardsFee: true,
      finalPayoutAmount: true,
      payoutCurrency: true,
      walletCreditedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  giftCardPurchase: {
    select: {
      id: true,
      status: true,
      providerStatus: true,
      providerReference: true,
      providerProductId: true,
      brandNameSnapshot: true,
      productNameSnapshot: true,
      countryCode: true,
      currencyCode: true,
      amount: true,
      giftCardValueUsd: true,
      denominationType: true,
      quantity: true,
      customerPrice: true,
      fee: true,
      baseBuyRatePercent: true,
      buyAdjustmentPercent: true,
      customerRatePercent: true,
      completedAt: true,
      provider: true,
    },
  },
  deposit: {
    select: {
      id: true,
      status: true,
      currencyCode: true,
      fee: true,
      nobleCardsFee: true,
      nobleCardsFeeUsd: true,
      exchangeRate: true,
      providerReference: true,
      providerTransactionId: true,
      paymentMethod: true,
      updatedAt: true,
    },
  },
  withdrawal: {
    select: {
      id: true,
      status: true,
      sourceCurrencyCode: true,
      destinationCurrencyCode: true,
      sourceAmount: true,
      destinationAmount: true,
      exchangeRate: true,
      fee: true,
      amountReceived: true,
      providerReference: true,
      providerTransactionId: true,
      paymentMethod: true,
      completedAt: true,
      updatedAt: true,
      quote: {
        select: {
          providerFee: true,
          nobleCardsFee: true,
          totalFee: true,
        },
      },
    },
  },
  ledgerEntries: {
    orderBy: { createdAt: 'asc' },
    select: {
      amount: true,
      currencyCode: true,
      balanceBefore: true,
      balanceAfter: true,
      createdAt: true,
    },
  },
} satisfies Prisma.TransactionSelect;

type TransactionListRecord = Prisma.TransactionGetPayload<{
  select: typeof transactionListSelect;
}>;

const standaloneSaleSelect = {
  id: true,
  userId: true,
  status: true,
  provider: true,
  providerTradeId: true,
  providerStatus: true,
  slug: true,
  brandNameSnapshot: true,
  cardCountry: true,
  cardType: true,
  cardCurrency: true,
  cardAmount: true,
  quotedPayoutAmount: true,
  quotedPayoutCurrency: true,
  providerFee: true,
  nobleCardsFee: true,
  finalPayoutAmount: true,
  payoutCurrency: true,
  createdAt: true,
  updatedAt: true,
  walletCreditedAt: true,
  user: {
    select: {
      displayName: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      profileImageUrl: true,
    },
  },
} satisfies Prisma.GiftCardSaleSelect;

type StandaloneSaleRecord = Prisma.GiftCardSaleGetPayload<{
  select: typeof standaloneSaleSelect;
}>;

const STATUS_FILTERS: Record<string, string[]> = {
  Successful: ['SUCCESSFUL', 'PAID'],
  Pending: ['PENDING', 'PROCESSING', 'UNDER_REVIEW', 'SUBMITTED', 'APPROVED'],
  Processing: ['PROCESSING'],
  Failed: ['FAILED', 'REJECTED'],
  Cancelled: ['CANCELLED'],
  Refunded: ['REFUNDED'],
  Reversed: ['REVERSED'],
  Disputed: [],
  Chargeback: [],
  'Under Review': ['UNDER_REVIEW'],
  Expired: ['EXPIRED'],
  Submitted: ['SUBMITTED'],
  Approved: ['APPROVED'],
  Rejected: ['REJECTED'],
  Paid: ['PAID'],
};

const TYPE_FILTERS: Record<string, TransactionType> = {
  Deposit: 'DEPOSIT',
  Withdrawal: 'WITHDRAWAL',
  Purchase: 'PURCHASE',
  Transfer: 'TRANSFER',
  Fee: 'FEE',
  Refund: 'REFUND',
  Reversal: 'REVERSAL',
  Bonus: 'BONUS',
  Adjustment: 'ADJUSTMENT',
};

const CATEGORIES = [
  'Gift Cards',
  'Deposits',
  'Withdrawals',
  'Fees',
  'Refunds',
  'Other',
];
const PAYMENT_METHODS: Record<string, PaymentMethod> = {
  'Bank Transfer': 'BANK_TRANSFER',
  Card: 'CARD',
  USSD: 'USSD',
  'Mobile Money': 'MOBILE_MONEY',
  'Wallet Transfer': 'WALLET_TRANSFER',
  'Apple Pay': 'APPLE_PAY',
  'Google Pay': 'GOOGLE_PAY',
  Wise: 'WISE',
  Other: 'OTHER',
};

const narrowStatuses = <T extends string>(
  values: string[],
  allowed: readonly T[],
): T[] =>
  values.filter((value): value is T =>
    allowed.some((allowedValue) => allowedValue === value),
  );

const TRANSACTION_STATUSES = Object.values(TransactionStatus);
const DEPOSIT_STATUSES = Object.values(DepositStatus);
const PURCHASE_STATUSES = Object.values(GiftCardPurchaseStatus);
const SALE_STATUSES = Object.values(GiftCardSaleStatus);

@Injectable()
export class AdminTransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTransactions(rawQuery: Record<string, unknown>) {
    const query = this.normalizeQuery(rawQuery);
    const page = this.parseInteger(query.page, 1, 'page');
    const pageSize = this.parseInteger(query.pageSize, 10, 'pageSize');
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      throw new BadRequestException('Invalid pagination parameters.');
    }

    const sortField = query.sortField ?? 'date';
    const sortOrder = query.sortOrder ?? 'desc';
    if (
      !['id', 'userName', 'originalAmount', 'status', 'date'].includes(
        sortField,
      ) ||
      !['asc', 'desc'].includes(sortOrder)
    ) {
      throw new BadRequestException('Invalid sorting parameters.');
    }

    const filters = this.parseFilters(query);
    const where = this.buildPrismaWhere(filters);
    const orderBy = this.buildOrderBy(sortField, sortOrder);
    const standaloneSaleWhere = this.buildStandaloneSaleWhere(filters);
    const candidateTake =
      sortField === 'userName' || sortField === 'status'
        ? undefined
        : page * pageSize;
    const [
      transactionTotal,
      records,
      allTimeTotals,
      todayTotals,
      volumeRows,
      categoryRows,
      standaloneSales,
      revenueRows,
    ] = await Promise.all([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.findMany({
        where,
        orderBy: [orderBy, { id: 'asc' }],
        ...(candidateTake ? { take: candidateTake } : {}),
        select: transactionListSelect,
      }),
      this.groupTotals(filters),
      this.groupTotals(filters, this.utcStartOfToday()),
      this.queryVolumeByDay(filters),
      this.queryVolumeByCategory(filters),
      this.prisma.giftCardSale.findMany({
        where: standaloneSaleWhere,
        orderBy: { createdAt: 'desc' },
        select: standaloneSaleSelect,
      }),
      this.queryRevenue(filters),
    ]);

    const metrics = this.buildMetrics(
      allTimeTotals,
      todayTotals,
      standaloneSales,
      revenueRows[0] ?? { amount: null, count: 0 },
    );
    const volumeChart = this.buildVolumeSeries(volumeRows);
    const categorySeries = this.buildCategorySeries(
      categoryRows,
      standaloneSales,
    );
    const items = [
      ...records.map((record) => this.toAdminTransaction(record)),
      ...standaloneSales.map((sale) => this.toStandaloneSale(sale)),
    ].sort((left, right) =>
      this.compareTransactions(left, right, sortField, sortOrder),
    );
    const total = transactionTotal + standaloneSales.length;

    return {
      items: items.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
      metrics,
      charts: {
        volume: volumeChart,
        category: {
          available: true,
          series: categorySeries,
        },
      },
    };
  }

  private parseFilters(query: AdminTransactionQuery): TransactionFilters {
    const filters: TransactionFilters = {};
    const status = this.filterValue(query.status);
    const type = this.filterValue(query.type);
    const category = this.filterValue(query.category);
    const currency = this.filterValue(query.currency);
    const paymentMethod = this.filterValue(query.paymentMethod);

    const validStatusLabels = Object.keys(STATUS_FILTERS);
    if (status) {
      if (!validStatusLabels.includes(status)) {
        throw new BadRequestException('Invalid transaction status.');
      }
      filters.status = status;
    }

    if (type) {
      if (
        !Object.hasOwn(TYPE_FILTERS, type) &&
        !['Gift Card Sale', 'Gift Card Purchase'].includes(type)
      ) {
        throw new BadRequestException('Invalid transaction type.');
      }
      filters.type = type;
    }

    if (category) {
      if (!CATEGORIES.includes(category)) {
        throw new BadRequestException('Invalid transaction category.');
      }
      filters.category = category;
    }

    if (currency) {
      const normalizedCurrency = currency.toUpperCase();
      if (!/^[A-Z0-9]{3,8}$/.test(normalizedCurrency)) {
        throw new BadRequestException('Invalid currency.');
      }
      filters.currency = normalizedCurrency;
    }

    if (paymentMethod) {
      if (
        ![
          ...Object.keys(PAYMENT_METHODS),
          'USDT',
          'Gift Card',
          'PayPal',
        ].includes(paymentMethod)
      ) {
        throw new BadRequestException('Invalid payment method.');
      }
      filters.paymentMethod = paymentMethod;
    }

    if (query.search?.trim()) filters.search = query.search.trim();

    if (query.minAmount !== undefined && query.minAmount !== '') {
      filters.minAmount = this.parseAmount(query.minAmount, 'minAmount');
    }
    if (query.maxAmount !== undefined && query.maxAmount !== '') {
      filters.maxAmount = this.parseAmount(query.maxAmount, 'maxAmount');
    }
    if (
      filters.minAmount !== undefined &&
      filters.maxAmount !== undefined &&
      filters.minAmount > filters.maxAmount
    ) {
      throw new BadRequestException('Minimum amount cannot exceed maximum.');
    }

    if (Boolean(query.startDate) !== Boolean(query.endDate)) {
      throw new BadRequestException(
        'Both startDate and endDate must be provided.',
      );
    }
    if (query.startDate && query.endDate) {
      const startDate = this.parseUtcDate(query.startDate, 'startDate');
      const endDate = this.parseUtcDate(query.endDate, 'endDate');
      if (startDate > endDate) {
        throw new BadRequestException('startDate cannot be after endDate.');
      }
      filters.startDate = startDate;
      filters.endExclusive = new Date(endDate.getTime() + 86_400_000);
    }

    return filters;
  }

  private buildPrismaWhere(
    filters: TransactionFilters,
  ): Prisma.TransactionWhereInput {
    const and: Prisma.TransactionWhereInput[] = [];
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const typedSearch: Prisma.TransactionWhereInput[] = [
        ...Object.entries(TYPE_FILTERS)
          .filter(([label]) => label.toLowerCase().includes(searchLower))
          .map(([, value]) => ({ type: value })),
        ...('Gift Card Purchase'.toLowerCase().includes(searchLower)
          ? [{ giftCardPurchase: { isNot: null } }]
          : []),
        ...('Gift Card Sale'.toLowerCase().includes(searchLower)
          ? [{ giftCardSale: { isNot: null } }]
          : []),
      ];
      and.push({
        OR: [
          { id: { contains: filters.search, mode: 'insensitive' } },
          { userId: { contains: filters.search, mode: 'insensitive' } },
          { reference: { contains: filters.search, mode: 'insensitive' } },
          {
            providerReference: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
          {
            providerTransactionId: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
          {
            user: {
              is: {
                OR: [
                  {
                    firstName: {
                      contains: filters.search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    lastName: { contains: filters.search, mode: 'insensitive' },
                  },
                  {
                    displayName: {
                      contains: filters.search,
                      mode: 'insensitive',
                    },
                  },
                  { email: { contains: filters.search, mode: 'insensitive' } },
                ],
              },
            },
          },
          ...typedSearch,
        ],
      });
    }
    if (filters.status) {
      const values = STATUS_FILTERS[filters.status];
      const transactionStatuses = narrowStatuses(values, TRANSACTION_STATUSES);
      const depositStatuses = narrowStatuses(values, DEPOSIT_STATUSES);
      const purchaseStatuses = narrowStatuses(values, PURCHASE_STATUSES);
      const saleStatuses = narrowStatuses(values, SALE_STATUSES);
      const statusConditions: Prisma.TransactionWhereInput[] = [];
      if (transactionStatuses.length) {
        statusConditions.push({
          AND: [
            { deposit: { is: null } },
            { withdrawal: { is: null } },
            { giftCardPurchase: { is: null } },
            { giftCardSale: { is: null } },
            { status: { in: transactionStatuses } },
          ],
        });
      }
      if (depositStatuses.length) {
        statusConditions.push({
          deposit: { is: { status: { in: depositStatuses } } },
        });
      }
      if (purchaseStatuses.length) {
        statusConditions.push({
          giftCardPurchase: { is: { status: { in: purchaseStatuses } } },
        });
      }
      if (saleStatuses.length) {
        statusConditions.push({
          giftCardSale: { is: { status: { in: saleStatuses } } },
        });
      }
      and.push(
        statusConditions.length
          ? { OR: statusConditions }
          : { id: '__no_status__' },
      );
    }
    if (filters.type) and.push(this.typeWhere(filters.type));
    if (filters.category) and.push(this.categoryWhere(filters.category));
    if (filters.currency) and.push({ currencyCode: filters.currency });
    if (filters.paymentMethod) {
      and.push(this.paymentMethodWhere(filters.paymentMethod));
    }
    if (filters.startDate || filters.endExclusive) {
      and.push({
        createdAt: {
          ...(filters.startDate ? { gte: filters.startDate } : {}),
          ...(filters.endExclusive ? { lt: filters.endExclusive } : {}),
        },
      });
    }
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      and.push({
        currencyCode: 'USD',
        amount: {
          ...(filters.minAmount !== undefined
            ? { gte: filters.minAmount }
            : {}),
          ...(filters.maxAmount !== undefined
            ? { lte: filters.maxAmount }
            : {}),
        },
      });
    }
    return and.length ? { AND: and } : {};
  }

  private typeWhere(type: string): Prisma.TransactionWhereInput {
    if (type === 'Gift Card Purchase') {
      return { giftCardPurchase: { isNot: null } };
    }
    if (type === 'Gift Card Sale') return { giftCardSale: { isNot: null } };
    if (type === 'Purchase') {
      return {
        type: 'PURCHASE',
        giftCardPurchase: { is: null },
      };
    }
    return { type: TYPE_FILTERS[type] };
  }

  private categoryWhere(category: string): Prisma.TransactionWhereInput {
    switch (category) {
      case 'Gift Cards':
        return {
          OR: [
            { giftCardPurchase: { isNot: null } },
            { giftCardSale: { isNot: null } },
          ],
        };
      case 'Deposits':
        return { type: 'DEPOSIT' };
      case 'Withdrawals':
        return { type: 'WITHDRAWAL' };
      case 'Fees':
        return { type: 'FEE' };
      case 'Refunds':
        return { type: { in: ['REFUND', 'REVERSAL'] } };
      default:
        return {
          AND: [
            {
              type: {
                notIn: ['DEPOSIT', 'WITHDRAWAL', 'FEE', 'REFUND', 'REVERSAL'],
              },
            },
            { giftCardPurchase: { is: null } },
            { giftCardSale: { is: null } },
          ],
        };
    }
  }

  private paymentMethodWhere(method: string): Prisma.TransactionWhereInput {
    if (method === 'USDT') return { currencyCode: 'USDT' };
    if (method === 'Gift Card') {
      return this.categoryWhere('Gift Cards');
    }
    if (method === 'PayPal') return { id: '__no_paypal_payment_method__' };
    const paymentMethod = PAYMENT_METHODS[method];
    return paymentMethod
      ? { paymentMethod }
      : { id: '__unsupported_payment_method__' };
  }

  private buildStandaloneSaleWhere(
    filters: TransactionFilters,
  ): Prisma.GiftCardSaleWhereInput {
    const and: Prisma.GiftCardSaleWhereInput[] = [{ transactionId: null }];
    if (filters.type && filters.type !== 'Gift Card Sale') {
      return { id: '__not_a_gift_card_sale__' };
    }
    if (filters.category && filters.category !== 'Gift Cards') {
      return { id: '__not_a_gift_card_category__' };
    }
    if (filters.status) {
      const statuses = narrowStatuses(
        STATUS_FILTERS[filters.status],
        SALE_STATUSES,
      );
      if (!statuses.length) return { id: '__no_sale_status__' };
      and.push({ status: { in: statuses } });
    }
    if (filters.currency) and.push({ cardCurrency: filters.currency });
    if (filters.paymentMethod && filters.paymentMethod !== 'Gift Card') {
      return { id: '__not_a_gift_card_payment_method__' };
    }
    if (filters.startDate || filters.endExclusive) {
      and.push({
        createdAt: {
          ...(filters.startDate ? { gte: filters.startDate } : {}),
          ...(filters.endExclusive ? { lt: filters.endExclusive } : {}),
        },
      });
    }
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      and.push({
        cardCurrency: 'USD',
        cardAmount: {
          ...(filters.minAmount !== undefined
            ? { gte: filters.minAmount }
            : {}),
          ...(filters.maxAmount !== undefined
            ? { lte: filters.maxAmount }
            : {}),
        },
      });
    }
    if (
      filters.search &&
      !'gift card sale'.includes(filters.search.toLowerCase())
    ) {
      const contains = {
        contains: filters.search,
        mode: 'insensitive' as const,
      };
      and.push({
        OR: [
          { id: contains },
          { providerTradeId: contains },
          { slug: contains },
          { brandNameSnapshot: contains },
          {
            user: {
              is: {
                OR: [
                  { firstName: contains },
                  { lastName: contains },
                  { displayName: contains },
                  { email: contains },
                ],
              },
            },
          },
        ],
      });
    }
    return { AND: and };
  }

  private buildOrderBy(
    field: string,
    order: string,
  ): Prisma.TransactionOrderByWithRelationInput {
    const direction = order as 'asc' | 'desc';
    switch (field) {
      case 'userName':
        return { user: { firstName: direction } };
      case 'originalAmount':
        return { amount: direction };
      case 'status':
        return { status: direction };
      case 'id':
        return { id: direction };
      default:
        return { createdAt: direction };
    }
  }

  private groupTotals(
    filters: TransactionFilters,
    startDate?: Date,
  ): Promise<TransactionTotalRow[]> {
    const { where, values } = this.buildSqlWhere(filters, startDate);
    return this.prisma.$queryRawUnsafe<TransactionTotalRow[]>(
      `SELECT t."currencyCode",
              COALESCE(s."status"::text, p."status"::text, d."status"::text,
                       w."status"::text, t."status"::text) AS status,
              SUM(t."amount")::text AS amount,
              COUNT(*)::int AS count
         FROM "Transaction" t
         JOIN "User" u ON u.id = t."userId"
         LEFT JOIN "Deposit" d ON d."transactionId" = t.id
         LEFT JOIN "Withdrawal" w ON w."transactionId" = t.id
         LEFT JOIN "GiftCardPurchase" p ON p."transactionId" = t.id
         LEFT JOIN "GiftCardSale" s ON s."transactionId" = t.id
        ${where}
        GROUP BY t."currencyCode",
                 COALESCE(s."status"::text, p."status"::text, d."status"::text,
                          w."status"::text, t."status"::text)`,
      ...values,
    );
  }

  private buildMetrics(
    allTimeRows: TransactionTotalRow[],
    todayRows: TransactionTotalRow[],
    standaloneSales: StandaloneSaleRecord[],
    revenueRow: RevenueRow,
  ) {
    const volumeByCurrency = (rows: TransactionTotalRow[]) => {
      const totals = new Map<string, Decimal>();
      for (const row of rows) {
        totals.set(
          row.currencyCode,
          (totals.get(row.currencyCode) ?? new Decimal(0)).plus(
            row.amount ?? '0',
          ),
        );
      }
      return [...totals.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([currency, total]) => ({
          currency,
          amount: total.toNumber(),
        }));
    };

    const countFor = (rows: TransactionTotalRow[], statuses: string[]) =>
      rows
        .filter((row) => statuses.includes(row.status))
        .reduce((total, row) => total + row.count, 0);
    const saleCountFor = (statuses: GiftCardSaleStatus[]) =>
      standaloneSales.filter((sale) => statuses.includes(sale.status)).length;

    return {
      totalVolumeByCurrency: volumeByCurrency(allTimeRows),
      todayVolumeByCurrency: volumeByCurrency(todayRows),
      successfulCount:
        countFor(allTimeRows, ['SUCCESSFUL', 'PAID']) + saleCountFor(['PAID']),
      pendingCount:
        countFor(allTimeRows, [
          'PENDING',
          'PROCESSING',
          'UNDER_REVIEW',
          'SUBMITTED',
          'APPROVED',
        ]) + saleCountFor(['SUBMITTED', 'UNDER_REVIEW', 'APPROVED']),
      failedCount:
        countFor(allTimeRows, ['FAILED', 'REJECTED']) +
        saleCountFor(['FAILED', 'REJECTED']),
      revenueUSD: null,
      revenueCoverage: 'incomplete',
      revenueUnavailableReason:
        revenueRow.count > 0
          ? 'Recorded USD revenue exists, but gift-card purchase margins, settled sale proceeds, and attributable business costs are incomplete.'
          : 'No recognized USD revenue is recorded; gift-card purchase margins, settled sale proceeds, and attributable business costs are incomplete.',
    };
  }

  private buildVolumeSeries(rows: VolumeChartRow[]) {
    const dailyVolumes = new Map<string, Map<string, Decimal>>();
    const add = (label: string, currency: string, amount: string) => {
      const volumes = dailyVolumes.get(label) ?? new Map<string, Decimal>();
      volumes.set(
        currency,
        (volumes.get(currency) ?? new Decimal(0)).plus(amount),
      );
      dailyVolumes.set(label, volumes);
    };
    for (const row of rows) add(row.label, row.currency, row.value);
    const currencies = [
      ...new Set(
        [...dailyVolumes.values()].flatMap((volumes) => [...volumes.keys()]),
      ),
    ].sort();
    return {
      available: true,
      currencies,
      series: [...dailyVolumes.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([label, volumes]) => ({
          label,
          ...Object.fromEntries(
            currencies.map((currency) => [
              currency,
              volumes.get(currency)?.toNumber() ?? 0,
            ]),
          ),
        })),
    };
  }

  private buildCategorySeries(
    rows: CategoryChartRow[],
    standaloneSales: StandaloneSaleRecord[],
  ) {
    const totals = new Map<string, Decimal>();
    for (const row of rows) {
      const key = `${row.name} (${row.currency})`;
      totals.set(key, (totals.get(key) ?? new Decimal(0)).plus(row.value));
    }
    for (const sale of standaloneSales) {
      const key = `Gift Card Sales Face Value (${sale.cardCurrency})`;
      totals.set(
        key,
        (totals.get(key) ?? new Decimal(0)).plus(sale.cardAmount.toString()),
      );
    }
    return [...totals.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, total]) => ({ name, value: total.toNumber() }));
  }

  private queryVolumeByDay(
    filters: TransactionFilters,
  ): Promise<VolumeChartRow[]> {
    const { where, values } = this.buildSqlWhere(filters);
    return this.prisma.$queryRawUnsafe<VolumeChartRow[]>(
      `SELECT to_char(date_trunc('day', t."createdAt" AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS label,
              t."currencyCode" AS currency,
              SUM(t."amount")::text AS value
         FROM "Transaction" t
         JOIN "User" u ON u.id = t."userId"
         LEFT JOIN "Deposit" d ON d."transactionId" = t.id
         LEFT JOIN "Withdrawal" w ON w."transactionId" = t.id
         LEFT JOIN "GiftCardPurchase" p ON p."transactionId" = t.id
         LEFT JOIN "GiftCardSale" s ON s."transactionId" = t.id
        ${where}
        GROUP BY label, t."currencyCode"
        ORDER BY label ASC`,
      ...values,
    );
  }

  private queryVolumeByCategory(
    filters: TransactionFilters,
  ): Promise<CategoryChartRow[]> {
    const { where, values } = this.buildSqlWhere(filters);
    return this.prisma.$queryRawUnsafe<CategoryChartRow[]>(
      `SELECT CASE
                WHEN p.id IS NOT NULL THEN 'Gift Card Purchases'
                WHEN s.id IS NOT NULL THEN 'Gift Card Sales'
                WHEN t."type" = 'DEPOSIT' THEN 'Deposits'
                WHEN t."type" = 'WITHDRAWAL' THEN 'Withdrawals'
                WHEN t."type" = 'FEE' THEN 'Fees'
                WHEN t."type" IN ('REFUND', 'REVERSAL') THEN 'Refunds'
                WHEN t."type" IN ('DEPOSIT', 'WITHDRAWAL') THEN
                  initcap(replace(t."type"::text, '_', ' '))
                ELSE initcap(replace(t."type"::text, '_', ' '))
              END AS name,
              t."currencyCode" AS currency,
              SUM(t."amount")::text AS value
         FROM "Transaction" t
         JOIN "User" u ON u.id = t."userId"
         LEFT JOIN "Deposit" d ON d."transactionId" = t.id
         LEFT JOIN "Withdrawal" w ON w."transactionId" = t.id
         LEFT JOIN "GiftCardPurchase" p ON p."transactionId" = t.id
         LEFT JOIN "GiftCardSale" s ON s."transactionId" = t.id
        ${where}
        GROUP BY name, t."currencyCode"
        ORDER BY name ASC`,
      ...values,
    );
  }

  private queryRevenue(filters: TransactionFilters): Promise<RevenueRow[]> {
    const { where, values } = this.buildSqlWhere(filters);
    const sourceMatch = `(
      (recognized."sourceType" = 'DEPOSIT' AND recognized."sourceId" = d.id) OR
      (recognized."sourceType" = 'WITHDRAWAL' AND recognized."sourceId" = w.id) OR
      (recognized."sourceType" = 'GIFT_CARD_PURCHASE' AND recognized."sourceId" = p.id)
    )`;
    const filteredSourceWhere = where
      ? `${where} AND ${sourceMatch}`
      : `WHERE ${sourceMatch}`;

    return this.prisma.$queryRawUnsafe<RevenueRow[]>(
      `WITH recognized AS (
         SELECT e."sourceType", e."sourceId", e."usdAmount" AS amount
           FROM "PlatformAccountingEntry" e
          WHERE e."currencyCode" = 'USD'
            AND e."entryType" IN ('FEE_REVENUE', 'PLATFORM_MARGIN', 'FEE_REVERSAL')
         UNION ALL
         SELECT 'DEPOSIT', d.id, d."nobleCardsFeeUsd"
           FROM "Deposit" d
          WHERE d."status" = 'SUCCESSFUL'
            AND d."nobleCardsFeeUsd" IS NOT NULL
            AND NOT EXISTS (
              SELECT 1 FROM "PlatformAccountingEntry" e
               WHERE e."sourceType" = 'DEPOSIT'
                 AND e."sourceId" = d.id
                 AND e."entryType" IN ('FEE_REVENUE', 'FEE_REVERSAL')
            )
         UNION ALL
         SELECT 'WITHDRAWAL', w.id, q."nobleCardsFee"
           FROM "Withdrawal" w
           JOIN "WithdrawalQuote" q ON q.id = w."quoteId"
          WHERE w."status" = 'SUCCESSFUL'
            AND q."sourceCurrencyCode" = 'USD'
            AND q."nobleCardsFee" > 0
            AND NOT EXISTS (
              SELECT 1 FROM "PlatformAccountingEntry" e
               WHERE e."sourceType" = 'WITHDRAWAL'
                 AND e."sourceId" = w.id
                 AND e."entryType" IN ('FEE_REVENUE', 'FEE_REVERSAL')
            )
       )
       SELECT SUM(recognized.amount)::text AS amount,
              COUNT(*)::int AS count
         FROM recognized
        WHERE EXISTS (
          SELECT 1
            FROM "Transaction" t
            JOIN "User" u ON u.id = t."userId"
            LEFT JOIN "Deposit" d ON d."transactionId" = t.id
            LEFT JOIN "Withdrawal" w ON w."transactionId" = t.id
            LEFT JOIN "GiftCardPurchase" p ON p."transactionId" = t.id
            LEFT JOIN "GiftCardSale" s ON s."transactionId" = t.id
            ${filteredSourceWhere}
        )`,
      ...values,
    );
  }

  private buildSqlWhere(
    filters: TransactionFilters,
    additionalStartDate?: Date,
  ) {
    const clauses: string[] = [];
    const values: Array<string | Date | number> = [];
    const bind = (value: string | Date | number) => {
      values.push(value);
      return `$${values.length}`;
    };

    if (filters.startDate) {
      clauses.push(`t."createdAt" >= ${bind(filters.startDate)}`);
    }
    if (additionalStartDate) {
      clauses.push(`t."createdAt" >= ${bind(additionalStartDate)}`);
    }
    if (filters.endExclusive) {
      clauses.push(`t."createdAt" < ${bind(filters.endExclusive)}`);
    }
    if (filters.search) {
      const search = `%${filters.search.replace(/[\\%_]/g, '\\$&')}%`;
      const parameter = bind(search);
      clauses.push(
        `(t.id::text ILIKE ${parameter} ESCAPE '\\' OR t."userId"::text ILIKE ${parameter} ESCAPE '\\' OR t."type"::text ILIKE ${parameter} ESCAPE '\\' OR CASE WHEN p.id IS NOT NULL THEN 'Gift Card Purchase' WHEN s.id IS NOT NULL THEN 'Gift Card Sale' ELSE '' END ILIKE ${parameter} ESCAPE '\\' OR t."reference" ILIKE ${parameter} ESCAPE '\\' OR t."providerReference" ILIKE ${parameter} ESCAPE '\\' OR t."providerTransactionId" ILIKE ${parameter} ESCAPE '\\' OR u."firstName" ILIKE ${parameter} ESCAPE '\\' OR u."lastName" ILIKE ${parameter} ESCAPE '\\' OR u."displayName" ILIKE ${parameter} ESCAPE '\\' OR u.email ILIKE ${parameter} ESCAPE '\\')`,
      );
    }
    if (filters.status) {
      const statuses = STATUS_FILTERS[filters.status];
      clauses.push(
        statuses.length
          ? `COALESCE(s."status"::text, p."status"::text, d."status"::text, w."status"::text, t."status"::text) IN (${statuses.map(bind).join(', ')})`
          : 'FALSE',
      );
    }
    if (filters.type === 'Gift Card Sale') clauses.push('s.id IS NOT NULL');
    else if (filters.type === 'Gift Card Purchase')
      clauses.push('p.id IS NOT NULL');
    else if (filters.type === 'Purchase')
      clauses.push(`t."type"::text = 'PURCHASE' AND p.id IS NULL`);
    else if (filters.type) {
      clauses.push(`t."type"::text = ${bind(TYPE_FILTERS[filters.type])}`);
    }
    if (filters.category) {
      const categoryConditions: Record<string, string> = {
        'Gift Cards': '(p.id IS NOT NULL OR s.id IS NOT NULL)',
        Deposits: `t."type" = 'DEPOSIT'`,
        Withdrawals: `t."type" = 'WITHDRAWAL'`,
        Fees: `t."type" = 'FEE'`,
        Refunds: `t."type" IN ('REFUND', 'REVERSAL')`,
        Other: `(p.id IS NULL AND s.id IS NULL AND t."type" NOT IN ('DEPOSIT', 'WITHDRAWAL', 'FEE', 'REFUND', 'REVERSAL'))`,
      };
      clauses.push(categoryConditions[filters.category]);
    }
    if (filters.currency) {
      clauses.push(`t."currencyCode" = ${bind(filters.currency)}`);
    }
    if (filters.paymentMethod) {
      if (filters.paymentMethod === 'Gift Card') {
        clauses.push('(p.id IS NOT NULL OR s.id IS NOT NULL)');
      } else if (filters.paymentMethod === 'USDT') {
        clauses.push(`t."currencyCode" = 'USDT'`);
      } else if (filters.paymentMethod === 'PayPal') {
        clauses.push('FALSE');
      } else {
        clauses.push(
          `t."paymentMethod"::text = ${bind(PAYMENT_METHODS[filters.paymentMethod])}`,
        );
      }
    }
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      clauses.push(`t."currencyCode" = 'USD'`);
      if (filters.minAmount !== undefined) {
        clauses.push(`t."amount" >= ${bind(filters.minAmount)}`);
      }
      if (filters.maxAmount !== undefined) {
        clauses.push(`t."amount" <= ${bind(filters.maxAmount)}`);
      }
    }

    return {
      where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
      values,
    };
  }

  private toAdminTransaction(record: TransactionListRecord) {
    const sale = record.giftCardSale;
    const purchase = record.giftCardPurchase;
    const deposit = record.deposit;
    const withdrawal = record.withdrawal;
    const type = sale
      ? 'Gift Card Sale'
      : purchase
        ? 'Gift Card Purchase'
        : record.type === 'PURCHASE'
          ? 'Purchase'
          : this.label(record.type);
    const category =
      sale || purchase
        ? 'Gift Cards'
        : record.type === 'DEPOSIT'
          ? 'Deposits'
          : record.type === 'WITHDRAWAL'
            ? 'Withdrawals'
            : record.type === 'FEE'
              ? 'Fees'
              : ['REFUND', 'REVERSAL'].includes(record.type)
                ? 'Refunds'
                : 'Other';
    const amount = Number(record.amount);
    const currency = record.currencyCode;
    const sourceStatus =
      sale?.status ??
      purchase?.status ??
      deposit?.status ??
      withdrawal?.status ??
      record.status;
    const paymentMethod =
      record.paymentMethod ??
      deposit?.paymentMethod ??
      withdrawal?.paymentMethod;
    const userName =
      record.user.displayName ||
      [record.user.firstName, record.user.lastName].filter(Boolean).join(' ');
    const ledgerEntries = record.ledgerEntries ?? [];
    const firstEntry = ledgerEntries[0];
    const lastEntry = ledgerEntries[ledgerEntries.length - 1];
    const status = this.label(sourceStatus);
    const updatedAt =
      sale?.updatedAt ??
      purchase?.completedAt ??
      deposit?.updatedAt ??
      withdrawal?.updatedAt ??
      record.createdAt;
    const completedAt =
      sale?.walletCreditedAt ??
      purchase?.completedAt ??
      withdrawal?.completedAt ??
      null;
    const timeline: Array<{ step: string; time: string; status?: string }> = [
      { step: 'Transaction recorded', time: record.createdAt.toISOString() },
    ];
    if (updatedAt > record.createdAt) {
      timeline.push({
        step: `Status last updated: ${status}`,
        time: updatedAt.toISOString(),
        status: status.toLowerCase().replaceAll(' ', '-'),
      });
    }
    if (completedAt) {
      timeline.push({
        step: `Completed: ${status}`,
        time: completedAt.toISOString(),
        status: status.toLowerCase().replaceAll(' ', '-'),
      });
    }

    return {
      id: record.id,
      userId: record.userId,
      userName: userName || 'Unnamed user',
      userEmail: record.user.email,
      userPhone: record.user.phone,
      userAvatar: record.user.profileImageUrl,
      type,
      category,
      amountSemantics: sale
        ? 'Wallet transaction amount; not submitted gift-card face value'
        : purchase
          ? 'Customer amount charged for the purchase'
          : undefined,
      originalAmount: amount,
      currency,
      usdValue: currency === 'USD' ? amount : null,
      grossAmount: amount,
      platformFee:
        sale?.status === 'PAID'
          ? sale.nobleCardsFee === null
            ? null
            : Number(sale.nobleCardsFee)
          : withdrawal?.quote
            ? Number(withdrawal.quote.nobleCardsFee)
            : deposit?.nobleCardsFee === null ||
                deposit?.nobleCardsFee === undefined
              ? null
              : Number(deposit.nobleCardsFee),
      feeCurrency:
        sale?.payoutCurrency ??
        withdrawal?.sourceCurrencyCode ??
        deposit?.currencyCode ??
        currency,
      feeSplitStatus: sale
        ? sale.status === 'PAID'
          ? 'settled'
          : 'not-settled'
        : withdrawal?.quote
          ? 'quoted'
          : deposit
            ? 'recorded'
            : 'not-recorded',
      providerFee:
        sale?.status === 'PAID'
          ? sale.providerFee === null
            ? null
            : Number(sale.providerFee)
          : withdrawal?.quote
            ? Number(withdrawal.quote.providerFee)
            : deposit?.fee === undefined
              ? null
              : Number(deposit.fee),
      fee: Number(record.fee),
      netAmount: Number(record.netAmount),
      referenceRate: deposit?.exchangeRate?.toString() ?? null,
      appliedRate: withdrawal?.exchangeRate?.toString() ?? null,
      markup:
        purchase?.buyAdjustmentPercent?.toString() ??
        purchase?.customerRatePercent?.toString() ??
        null,
      paymentMethod:
        sale || purchase
          ? 'Gift Card'
          : paymentMethod
            ? this.label(paymentMethod)
            : 'Not recorded',
      provider: record.provider ? this.label(record.provider) : null,
      paymentReference:
        record.providerReference ||
        purchase?.providerReference ||
        sale?.providerTradeId ||
        deposit?.providerReference ||
        withdrawal?.providerReference ||
        record.providerTransactionId ||
        record.reference,
      providerReference:
        record.providerReference ||
        purchase?.providerReference ||
        sale?.providerTradeId ||
        deposit?.providerReference ||
        withdrawal?.providerReference ||
        null,
      providerTransactionId:
        record.providerTransactionId ||
        deposit?.providerTransactionId ||
        withdrawal?.providerTransactionId ||
        null,
      reference: record.reference,
      status,
      source: record.provider
        ? this.label(record.provider)
        : sale || purchase
          ? 'Gift Card Provider'
          : 'Not recorded',
      processingType: 'Not recorded',
      riskFlag: 'Not recorded',
      reconciliationStatus: 'Not recorded',
      walletBefore: firstEntry ? Number(firstEntry.balanceBefore) : null,
      walletAfter: lastEntry ? Number(lastEntry.balanceAfter) : null,
      walletCurrency: firstEntry?.currencyCode ?? null,
      date: record.createdAt.toISOString(),
      timeline,
      internalNotes: null,
      giftCardDetails: sale
        ? {
            cardName: sale.brandNameSnapshot || sale.slug,
            country: sale.cardCountry,
            cardType: sale.cardType,
            cardAmount: Number(sale.cardAmount),
            cardCurrency: sale.cardCurrency,
            quotePayoutAmount:
              sale.quotedPayoutAmount === null
                ? null
                : Number(sale.quotedPayoutAmount),
            quotePayoutCurrency: sale.quotedPayoutCurrency,
            finalPayoutAmount:
              sale.finalPayoutAmount === null
                ? null
                : Number(sale.finalPayoutAmount),
            payoutCurrency: sale.payoutCurrency,
            providerStatus: sale.providerStatus,
            amountSemantics: 'Gift-card face value submitted; not payout',
          }
        : purchase
          ? {
              cardName:
                purchase.brandNameSnapshot || purchase.productNameSnapshot,
              productName: purchase.productNameSnapshot,
              country: purchase.countryCode,
              providerProductId: purchase.providerProductId,
              denominationType: purchase.denominationType,
              quantity: purchase.quantity,
              cardAmount: Number(purchase.amount),
              cardCurrency: purchase.currencyCode,
              faceValueUsd:
                Number(purchase.giftCardValueUsd) > 0
                  ? Number(purchase.giftCardValueUsd)
                  : null,
              customerPrice: Number(purchase.customerPrice),
              providerStatus: purchase.providerStatus,
              providerCost: null,
              amountSemantics:
                'Stored gift-card denomination; not actual provider cost',
            }
          : null,
    };
  }

  private toStandaloneSale(sale: StandaloneSaleRecord) {
    const userName =
      sale.user.displayName ||
      [sale.user.firstName, sale.user.lastName].filter(Boolean).join(' ');
    const status = this.label(sale.status);
    const timeline: Array<{ step: string; time: string; status?: string }> = [
      { step: 'Sale submission recorded', time: sale.createdAt.toISOString() },
    ];
    if (sale.updatedAt > sale.createdAt) {
      timeline.push({
        step: `Status last updated: ${status}`,
        time: sale.updatedAt.toISOString(),
        status: status.toLowerCase().replaceAll(' ', '-'),
      });
    }
    if (sale.walletCreditedAt) {
      timeline.push({
        step: 'Wallet credited',
        time: sale.walletCreditedAt.toISOString(),
        status: 'paid',
      });
    }

    return {
      id: sale.id,
      userId: sale.userId,
      userName: userName || 'Unnamed user',
      userEmail: sale.user.email,
      userPhone: sale.user.phone,
      userAvatar: sale.user.profileImageUrl,
      type: 'Gift Card Sale',
      category: 'Gift Cards',
      amountSemantics: 'Gift-card face value submitted; not payout',
      originalAmount: Number(sale.cardAmount),
      currency: sale.cardCurrency,
      usdValue: sale.cardCurrency === 'USD' ? Number(sale.cardAmount) : null,
      grossAmount: Number(sale.cardAmount),
      platformFee:
        sale.status === 'PAID' && sale.nobleCardsFee !== null
          ? Number(sale.nobleCardsFee)
          : null,
      providerFee:
        sale.status === 'PAID' && sale.providerFee !== null
          ? Number(sale.providerFee)
          : null,
      fee: null,
      feeCurrency: sale.payoutCurrency,
      netAmount:
        sale.status === 'PAID' && sale.finalPayoutAmount !== null
          ? Number(sale.finalPayoutAmount)
          : null,
      referenceRate: null,
      appliedRate: null,
      markup: null,
      paymentMethod: 'Gift Card',
      provider: this.label(sale.provider),
      paymentReference: sale.providerTradeId,
      providerReference: sale.providerTradeId,
      providerTransactionId: null,
      reference: null,
      status,
      source: this.label(sale.provider),
      processingType: 'Sale submission',
      riskFlag: 'Not recorded',
      reconciliationStatus: status,
      walletBefore: null,
      walletAfter: null,
      walletCurrency: null,
      date: sale.createdAt.toISOString(),
      timeline,
      internalNotes: null,
      giftCardDetails: {
        cardName: sale.brandNameSnapshot || sale.slug,
        country: sale.cardCountry,
        cardType: sale.cardType,
        cardAmount: Number(sale.cardAmount),
        cardCurrency: sale.cardCurrency,
        quotePayoutAmount:
          sale.quotedPayoutAmount === null
            ? null
            : Number(sale.quotedPayoutAmount),
        quotePayoutCurrency: sale.quotedPayoutCurrency,
        finalPayoutAmount:
          sale.finalPayoutAmount === null
            ? null
            : Number(sale.finalPayoutAmount),
        payoutCurrency: sale.payoutCurrency,
        providerStatus: sale.providerStatus,
        amountSemantics: 'Gift-card face value submitted; not payout',
      },
    };
  }

  private label(value: string) {
    return value
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private compareTransactions<
    T extends {
      id: string;
      userName: string;
      originalAmount: number;
      status: string;
      date: string;
    },
  >(left: T, right: T, field: string, order: string) {
    const direction = order === 'asc' ? 1 : -1;
    const comparison =
      field === 'id'
        ? left.id.localeCompare(right.id)
        : field === 'userName'
          ? left.userName.localeCompare(right.userName)
          : field === 'originalAmount'
            ? left.originalAmount - right.originalAmount
            : field === 'status'
              ? left.status.localeCompare(right.status)
              : left.date.localeCompare(right.date);
    return comparison === 0
      ? left.id.localeCompare(right.id)
      : comparison * direction;
  }

  private utcStartOfToday() {
    const now = new Date();
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
  }

  private parseUtcDate(value: string, name: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException(`${name} must use YYYY-MM-DD.`);
    }
    const date = new Date(`${value}T00:00:00.000Z`);
    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== value
    ) {
      throw new BadRequestException(`${name} is not a valid calendar date.`);
    }
    return date;
  }

  private parseInteger(
    value: string | undefined,
    fallback: number,
    name: string,
  ) {
    if (value === undefined) return fallback;
    if (!/^\d+$/.test(value)) {
      throw new BadRequestException(`${name} must be a positive integer.`);
    }
    const result = Number(value);
    if (!Number.isSafeInteger(result)) {
      throw new BadRequestException(`${name} must be a safe positive integer.`);
    }
    return result;
  }

  private parseAmount(value: string, name: string) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount < 0) {
      throw new BadRequestException(`${name} must be a non-negative amount.`);
    }
    return amount;
  }

  private normalizeQuery(
    query: Record<string, unknown>,
  ): AdminTransactionQuery {
    const normalized: AdminTransactionQuery = {};
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue;
      if (typeof value !== 'string') {
        throw new BadRequestException(
          `Query parameter ${key} must be a string.`,
        );
      }
      normalized[key] = value;
    }
    return normalized;
  }

  private filterValue(value: string | undefined) {
    const normalized = value?.trim();
    return !normalized || normalized.toLowerCase() === 'all'
      ? undefined
      : normalized;
  }
}
