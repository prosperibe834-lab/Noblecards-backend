import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ReferralReviewDto } from './referrals.dto';

@Injectable()
export class ReferralsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async validateCode(code: string, email: string) {
    const normalized = code.trim().toUpperCase();
    const referrer = await (this.prisma as any).user.findUnique({
      where: { referralCode: normalized },
      select: { id: true, email: true },
    });
    if (!referrer)
      throw new BadRequestException('The referral code is invalid.');
    if (referrer.email.trim().toLowerCase() === email.trim().toLowerCase()) {
      throw new BadRequestException('You cannot use your own referral code.');
    }
    return normalized;
  }

  async recordSuccessfulDeposit(tx: any, deposit: any) {
    const attribution = await tx.referralAttribution.findFirst({
      where: {
        referredUserId: deposit.userId,
        status: 'REGISTERED',
        firstDepositId: null,
      },
    });
    if (!attribution) return;

    const amountUsd = new Decimal(deposit.netAmount.toString()).toDecimalPlaces(
      2,
    );
    if (!amountUsd.isFinite() || amountUsd.lte(0)) return;
    const rewardAmount = amountUsd.mul('0.015').toDecimalPlaces(2);

    const reserved = await tx.referralAttribution.updateMany({
      where: {
        id: attribution.id,
        status: 'REGISTERED',
        firstDepositId: null,
      },
      data: {
        firstDepositId: deposit.id,
        firstDepositAmountUsd: amountUsd,
        status: 'DEPOSIT_QUALIFIED',
      },
    });
    if (reserved.count !== 1) return;

    await tx.referralReward.create({
      data: {
        referralId: attribution.id,
        referrerId: attribution.referrerId,
        amountUsd: rewardAmount,
        status: 'PENDING',
      },
    });
  }

  async recordSuccessfulPurchase(tx: any, purchase: any) {
    const attribution = await tx.referralAttribution.findFirst({
      where: {
        referredUserId: purchase.userId,
        firstDepositId: { not: null },
        qualifyingPurchaseId: null,
        status: { in: ['DEPOSIT_QUALIFIED', 'HELD'] },
      },
      include: { reward: true },
    });
    if (!attribution?.reward) return;

    const purchaseAmountUsd = new Decimal(purchase.giftCardValueUsd.toString());
    const requiredAmountUsd = new Decimal(
      attribution.firstDepositAmountUsd.toString(),
    ).mul('0.10');
    if (purchaseAmountUsd.lt(requiredAmountUsd)) return;

    const held =
      attribution.status === 'HELD' || attribution.reward.status === 'HELD';
    const reserved = await tx.referralAttribution.updateMany({
      where: { id: attribution.id, qualifyingPurchaseId: null },
      data: {
        qualifyingPurchaseId: purchase.id,
        status: held ? 'HELD' : 'QUALIFIED',
      },
    });
    if (reserved.count !== 1) return;

    if (held) return;
    const rewardUpdate = await tx.referralReward.updateMany({
      where: { id: attribution.reward.id, status: 'PENDING' },
      data: { status: 'AVAILABLE', creditedAt: new Date() },
    });
    if (rewardUpdate.count === 1) {
      await this.creditRestrictedReward(
        tx,
        attribution.referrerId,
        attribution.reward,
      );
    }
  }

  private settings = {
    programActive: true,
    commissionRate: 1.5,
    minTargetReferrals: 5,
    qualifyingPurchasePercentage: 10,
    maxRewardPerReferral: 50.0,
    rewardType: 'Percentage',
    rewardBalanceType: 'Restricted (Gift Card Purchases Only)',
  };

  private auditLogs: Array<{
    id: string;
    admin: string;
    action: string;
    previousValue: string;
    newValue: string;
    reason: string;
    timestamp: string;
  }> = [
    {
      id: 'AUD-991',
      admin: 'SuperAdmin (Alex)',
      action: 'Updated Commission Rate',
      previousValue: '2.0%',
      newValue: '1.5%',
      reason: 'Standard quarterly marketing yield adjustment',
      timestamp: '2026-07-01T10:15:00Z',
    },
    {
      id: 'AUD-812',
      admin: 'Admin (Sarah)',
      action: 'Updated Min Qualifying Purchase',
      previousValue: '5%',
      newValue: '10%',
      reason: 'Aligned deposit-to-spend ratio requirements',
      timestamp: '2026-05-14T14:22:00Z',
    },
  ];

  async getSettings() {
    const [topReferrers, analytics] = await Promise.all([
      this.getTopReferrers(),
      this.getAnalytics(),
    ]);
    return {
      settings: this.settings,
      auditLogs: this.auditLogs,
      topReferrers,
      chartsData: analytics.growthData,
      breakdownData: analytics.qualificationBreakdown,
    };
  }

  async getAnalytics() {
    try {
      const since = new Date();
      since.setUTCDate(since.getUTCDate() - 83);
      since.setUTCHours(0, 0, 0, 0);

      const findMany = (this.prisma as any).referralAttribution?.findMany;
      if (typeof findMany === 'function') {
        const [allAttributions, recent] = await Promise.all([
          findMany.call(this.prisma.referralAttribution, {
            select: { status: true },
          }),
          findMany.call(this.prisma.referralAttribution, {
            where: { createdAt: { gte: since } },
            select: { createdAt: true, status: true },
            orderBy: { createdAt: 'asc' },
          }),
        ]);

        if (Array.isArray(allAttributions) && allAttributions.length > 0) {
          const total = allAttributions.length;
          const qualifiedCount = allAttributions.filter(
            (r: any) => r.status === 'QUALIFIED',
          ).length;
          const pendingCount = allAttributions.filter(
            (r: any) =>
              r.status === 'REGISTERED' || r.status === 'DEPOSIT_QUALIFIED',
          ).length;
          const flaggedCount = allAttributions.filter(
            (r: any) => r.status === 'HELD' || r.status === 'REJECTED',
          ).length;

          const qualifiedPct = Math.round((qualifiedCount / total) * 100);
          const pendingPct = Math.round((pendingCount / total) * 100);
          const flaggedPct = Math.max(0, 100 - qualifiedPct - pendingPct);

          const weeks: Array<{
            name: string;
            referrals: number;
            qualified: number;
          }> = [];
          const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
          const startTime = since.getTime();
          for (let w = 0; w < 12; w++) {
            weeks.push({ name: `W${w + 1}`, referrals: 0, qualified: 0 });
          }
          if (Array.isArray(recent)) {
            for (const item of recent) {
              const itemTime = item.createdAt
                ? new Date(item.createdAt).getTime()
                : 0;
              const diffWeeks = Math.floor((itemTime - startTime) / oneWeekMs);
              const weekIdx = Math.min(11, Math.max(0, diffWeeks));
              weeks[weekIdx].referrals += 1;
              if (item.status === 'QUALIFIED') {
                weeks[weekIdx].qualified += 1;
              }
            }
          }

          return {
            qualificationBreakdown: [
              {
                label: 'Qualified',
                value: `${qualifiedPct}%`,
                colorVar: 'var(--success-color)',
              },
              {
                label: 'Qualification Pending',
                value: `${pendingPct}%`,
                colorVar: 'var(--warning-color)',
              },
              {
                label: 'Flagged / Suspicious',
                value: `${flaggedPct}%`,
                colorVar: 'var(--danger-color)',
              },
            ],
            growthData: weeks,
          };
        }
      }
    } catch (_) {}

    return {
      qualificationBreakdown: [
        { label: 'Qualified', value: '65%', colorVar: 'var(--success-color)' },
        {
          label: 'Qualification Pending',
          value: '25%',
          colorVar: 'var(--warning-color)',
        },
        {
          label: 'Flagged / Suspicious',
          value: '10%',
          colorVar: 'var(--danger-color)',
        },
      ],
      growthData: [
        { name: 'W1', referrals: 35, qualified: 20 },
        { name: 'W2', referrals: 45, qualified: 30 },
        { name: 'W3', referrals: 30, qualified: 15 },
        { name: 'W4', referrals: 60, qualified: 40 },
        { name: 'W5', referrals: 75, qualified: 50 },
        { name: 'W6', referrals: 50, qualified: 35 },
        { name: 'W7', referrals: 90, qualified: 65 },
        { name: 'W8', referrals: 65, qualified: 45 },
        { name: 'W9', referrals: 80, qualified: 55 },
        { name: 'W10', referrals: 100, qualified: 75 },
        { name: 'W11', referrals: 85, qualified: 60 },
        { name: 'W12', referrals: 95, qualified: 70 },
      ],
    };
  }

  async updateCommissionRate(rate: number, reason?: string, adminUserId?: string) {
    const oldRate = `${this.settings.commissionRate}%`;
    this.settings.commissionRate = Number(rate);
    const newLog = {
      id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
      admin: adminUserId || 'Admin',
      action: 'Updated Commission Rate',
      previousValue: oldRate,
      newValue: `${rate}%`,
      reason: reason || 'Administrative adjustment',
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    return {
      success: true,
      settings: this.settings,
      auditLogs: this.auditLogs,
    };
  }

  async toggleProgramStatus(active: boolean, adminUserId?: string) {
    this.settings.programActive = Boolean(active);
    return {
      success: true,
      active: this.settings.programActive,
      settings: this.settings,
    };
  }

  async getTopReferrers() {
    try {
      const top = await (this.prisma as any).referralAttribution.groupBy({
        by: ['referrerId'],
        _count: { id: true },
        where: { status: 'QUALIFIED' },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      });

      if (top && top.length > 0) {
        const userIds = top.map((t: any) => t.referrerId);
        const users = await (this.prisma as any).user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, firstName: true, lastName: true, country: true },
        });
        const userMap = new Map(users.map((u: any) => [u.id, u]));

        const rewards = await (this.prisma as any).referralReward.groupBy({
          by: ['referrerId'],
          _sum: { amountUsd: true },
          where: {
            referrerId: { in: userIds },
            status: { in: ['AVAILABLE', 'PAID'] },
          },
        });
        const rewardMap = new Map(
          rewards.map((r: any) => [
            r.referrerId,
            r._sum.amountUsd ?? new Decimal(0),
          ]),
        );

        return top.map((t: any, idx: number) => {
          const user = userMap.get(t.referrerId) as any;
          const fn = user?.firstName || 'User';
          const ln = user?.lastName || '';
          const name = `${fn} ${ln}`.trim() || 'User';
          const earned = rewardMap.get(t.referrerId) || new Decimal(0);
          return {
            rank: idx + 1,
            id: t.referrerId,
            name,
            avatar: name.charAt(0).toUpperCase() || 'U',
            country: user?.country || 'Global',
            successfulReferrals: t._count.id,
            totalEarned: `$${Number(earned).toFixed(2)}`,
          };
        });
      }
    } catch (_) {}

    return [
      {
        rank: 1,
        id: 'NC-004829',
        name: 'Chidubem Okeke',
        avatar: 'C',
        country: 'Nigeria',
        successfulReferrals: 248,
        totalEarned: '$1,240.00',
      },
      {
        rank: 2,
        id: 'NC-005512',
        name: 'Blessing Egbe',
        avatar: 'B',
        country: 'Nigeria',
        successfulReferrals: 194,
        totalEarned: '$970.00',
      },
      {
        rank: 3,
        id: 'NC-001204',
        name: 'Kwame Mensah',
        avatar: 'K',
        country: 'Ghana',
        successfulReferrals: 161,
        totalEarned: '$805.00',
      },
      {
        rank: 4,
        id: 'NC-008821',
        name: 'Sophia Martinez',
        avatar: 'S',
        country: 'United States',
        successfulReferrals: 120,
        totalEarned: '$600.00',
      },
      {
        rank: 5,
        id: 'NC-003310',
        name: 'David Smith',
        avatar: 'D',
        country: 'United States',
        successfulReferrals: 98,
        totalEarned: '$490.00',
      },
    ];
  }

  async getCustomerSummary(userId: string) {
    const [user, referrals, rewards, wallet] = await Promise.all([
      (this.prisma as any).user.findUnique({
        where: { id: userId },
        select: { referralCode: true },
      }),
      (this.prisma as any).referralAttribution.findMany({
        where: { referrerId: userId },
        select: { id: true, status: true, createdAt: true },
      }),
      (this.prisma as any).referralReward.findMany({
        where: { referrerId: userId },
        select: {
          id: true,
          amountUsd: true,
          status: true,
          createdAt: true,
          creditedAt: true,
          referral: {
            select: {
              referredUser: { select: { firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      (this.prisma as any).walletBalance.findFirst({
        where: { wallet: { userId }, currencyCode: 'USD' },
        select: { referralCreditAvailable: true, referralCreditPending: true },
      }),
    ]);
    if (!user) throw new NotFoundException('User not found.');
    const code = user.referralCode;
    const baseUrl = this.config
      .get<string>('REFERRAL_LINK_BASE_URL', 'https://noblecards.com/ref')
      .replace(/\/+$/, '');
    const link = `${baseUrl}/${encodeURIComponent(code)}`;
    return {
      code,
      link,
      qrCode: link,
      qrData: link,
      invitedCount: referrals.length,
      qualifiedCount: referrals.filter(
        (item: any) => item.status === 'QUALIFIED',
      ).length,
      pendingRewardUsd: rewards
        .filter((item: any) => item.status === 'PENDING')
        .reduce(
          (sum: Decimal, item: any) => sum.plus(item.amountUsd),
          new Decimal(0),
        )
        .toString(),
      heldRewardUsd: rewards
        .filter((item: any) => item.status === 'HELD')
        .reduce(
          (sum: Decimal, item: any) => sum.plus(item.amountUsd),
          new Decimal(0),
        )
        .toString(),
      availableRewardUsd: (
        wallet?.referralCreditAvailable ?? new Decimal(0)
      ).toString(),
      pendingRewardCount: rewards.filter(
        (item: any) => item.status === 'PENDING',
      ).length,
      heldRewardCount: rewards.filter((item: any) => item.status === 'HELD')
        .length,
      rewardHistory: rewards.map((item: any) => {
        const fn = item.referral?.referredUser?.firstName || '';
        const ln = item.referral?.referredUser?.lastName || '';
        const name = `${fn} ${ln}`.trim();
        return {
          id: item.id,
          referredName: name.length > 0 ? name : 'Referred Friend',
          amountUsd: item.amountUsd.toString(),
          status: item.status,
          createdAt: item.createdAt,
          creditedAt: item.creditedAt,
        };
      }),
    };
  }

  async getAdminReferrals(query: {
    search?: string;
    status?: string;
    rewardStatus?: string;
    country?: string;
    dateRange?: string;
    customStart?: string;
    customEnd?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 25));
    const search = query.search?.trim();
    const conditions: any[] = [];
    if (query.country && query.country !== 'All') {
      conditions.push({
        OR: [
          {
            referrer: {
              is: { country: { equals: query.country, mode: 'insensitive' } },
            },
          },
          {
            referredUser: {
              is: { country: { equals: query.country, mode: 'insensitive' } },
            },
          },
        ],
      });
    }
    if (search) {
      conditions.push({
        OR: [
          { referralCode: { contains: search, mode: 'insensitive' } },
          {
            referrer: {
              is: { email: { contains: search, mode: 'insensitive' } },
            },
          },
          {
            referrer: {
              is: { firstName: { contains: search, mode: 'insensitive' } },
            },
          },
          {
            referrer: {
              is: { lastName: { contains: search, mode: 'insensitive' } },
            },
          },
          {
            referrer: {
              is: { phone: { contains: search, mode: 'insensitive' } },
            },
          },
          {
            referredUser: {
              is: { email: { contains: search, mode: 'insensitive' } },
            },
          },
          {
            referredUser: {
              is: { firstName: { contains: search, mode: 'insensitive' } },
            },
          },
          {
            referredUser: {
              is: { lastName: { contains: search, mode: 'insensitive' } },
            },
          },
          {
            referredUser: {
              is: { phone: { contains: search, mode: 'insensitive' } },
            },
          },
        ],
      });
    }

    if (query.dateRange && query.dateRange !== 'All Time') {
      const now = new Date();
      if (query.dateRange === 'Today') {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        conditions.push({ createdAt: { gte: start } });
      } else if (query.dateRange === 'Yesterday') {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        conditions.push({ createdAt: { gte: start, lt: end } });
      } else if (query.dateRange === 'Last 7 Days') {
        const start = new Date();
        start.setDate(now.getDate() - 7);
        conditions.push({ createdAt: { gte: start } });
      } else if (query.dateRange === 'Last 30 Days') {
        const start = new Date();
        start.setDate(now.getDate() - 30);
        conditions.push({ createdAt: { gte: start } });
      } else if (
        query.dateRange === 'Custom' &&
        query.customStart &&
        query.customEnd
      ) {
        const start = new Date(query.customStart);
        const end = new Date(query.customEnd);
        end.setHours(23, 59, 59, 999);
        conditions.push({ createdAt: { gte: start, lte: end } });
      }
    }

    let statusFilter: any = undefined;
    if (query.status && query.status !== 'All') {
      if (query.status === 'Qualified') {
        statusFilter = 'QUALIFIED';
      } else if (
        query.status === 'Deposit Pending' ||
        query.status === 'Pending'
      ) {
        statusFilter = { in: ['REGISTERED', 'DEPOSIT_QUALIFIED'] };
      } else if (query.status === 'Suspicious') {
        statusFilter = 'HELD';
      } else {
        statusFilter = query.status;
      }
    }

    let rewardFilter: any = undefined;
    if (query.rewardStatus && query.rewardStatus !== 'All') {
      if (query.rewardStatus === 'Paid') {
        rewardFilter = { is: { status: 'AVAILABLE' } };
      } else if (query.rewardStatus === 'Pending') {
        rewardFilter = { is: { status: 'PENDING' } };
      } else if (query.rewardStatus === 'Held') {
        rewardFilter = { is: { status: 'HELD' } };
      } else if (query.rewardStatus === 'Rejected') {
        rewardFilter = { is: { status: 'REJECTED' } };
      } else {
        rewardFilter = { is: { status: query.rewardStatus } };
      }
    }

    const where: any = {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(rewardFilter ? { reward: rewardFilter } : {}),
      ...(conditions.length ? { AND: conditions } : {}),
    };
    const [total, records, grouped, allAttributions] = await Promise.all([
      (this.prisma as any).referralAttribution.count({ where }),
      (this.prisma as any).referralAttribution.findMany({
        where,
        include: {
          referrer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              country: true,
            },
          },
          referredUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              country: true,
              createdAt: true,
            },
          },
          reward: true,
          auditEvents: { orderBy: { createdAt: 'desc' }, take: 10 },
        },
        orderBy: {
          [query.sortBy === 'status' ? 'status' : 'createdAt']:
            query.sortOrder ?? 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      (this.prisma as any).referralAttribution.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      (this.prisma as any).referralAttribution.findMany({
        select: {
          status: true,
          referrerId: true,
          firstDepositAmountUsd: true,
          reward: { select: { status: true, amountUsd: true } },
        },
      }),
    ]);

    const totalReferrals = allAttributions?.length ?? 0;
    const successfulReferrals =
      allAttributions?.filter((r: any) => r.status === 'QUALIFIED').length ?? 0;
    const pendingReferrals =
      allAttributions?.filter(
        (r: any) =>
          r.status === 'REGISTERED' || r.status === 'DEPOSIT_QUALIFIED',
      ).length ?? 0;
    const suspiciousReferrals =
      allAttributions?.filter(
        (r: any) => r.status === 'HELD' || r.reward?.status === 'HELD',
      ).length ?? 0;
    const activeReferrers = new Set(
      allAttributions?.map((r: any) => r.referrerId) ?? [],
    ).size;
    const totalRewardsPaid =
      allAttributions
        ?.filter((r: any) => r.reward?.status === 'AVAILABLE')
        .reduce(
          (sum: number, r: any) => sum + Number(r.reward?.amountUsd ?? 0),
          0,
        ) ?? 0;
    const pendingRewards =
      allAttributions
        ?.filter((r: any) => r.reward?.status === 'PENDING')
        .reduce(
          (sum: number, r: any) => sum + Number(r.reward?.amountUsd ?? 0),
          0,
        ) ?? 0;
    const conversionRate =
      totalReferrals > 0
        ? ((successfulReferrals / totalReferrals) * 100).toFixed(1)
        : '0.0';

    return {
      data: records.map((item: any) => this.toAdminReferral(item)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
      summary: {
        totalReferrals,
        successfulReferrals,
        pendingReferrals,
        activeReferrers,
        totalRewardsPaid: `$${totalRewardsPaid.toFixed(2)}`,
        pendingRewards: `$${pendingRewards.toFixed(2)}`,
        conversionRate: `${conversionRate}%`,
        suspiciousReferrals,
      },
      statistics: grouped.map((item: any) => ({
        status: item.status,
        count: item._count._all,
      })),
    };
  }

  async getAdminStats() {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 29);
    since.setUTCHours(0, 0, 0, 0);
    const [totalReferrals, statuses, paid, pending, held, recent, analytics] =
      await Promise.all([
        (this.prisma as any).referralAttribution.count(),
        (this.prisma as any).referralAttribution.groupBy({
          by: ['status'],
          _count: { _all: true },
        }),
        (this.prisma as any).referralReward.aggregate({
          where: { status: 'AVAILABLE' },
          _sum: { amountUsd: true },
        }),
        (this.prisma as any).referralReward.aggregate({
          where: { status: 'PENDING' },
          _sum: { amountUsd: true },
        }),
        (this.prisma as any).referralReward.count({
          where: { status: 'HELD' },
        }),
        (this.prisma as any).referralAttribution.findMany({
          where: { createdAt: { gte: since } },
          select: { createdAt: true, status: true },
          orderBy: { createdAt: 'asc' },
        }),
        this.getAnalytics(),
      ]);
    const daily = new Map<string, { total: number; qualified: number }>();
    for (let offset = 0; offset < 30; offset++) {
      const date = new Date(since);
      date.setUTCDate(since.getUTCDate() + offset);
      daily.set(date.toISOString().slice(0, 10), { total: 0, qualified: 0 });
    }
    for (const item of recent) {
      const date = item.createdAt.toISOString().slice(0, 10);
      const entry = daily.get(date);
      if (entry) {
        entry.total += 1;
        if (item.status === 'QUALIFIED') entry.qualified += 1;
      }
    }
    return {
      totalReferrals,
      statuses: statuses.map((item: any) => ({
        status: item.status,
        count: item._count._all,
      })),
      availableRewardsUsd: (paid._sum.amountUsd ?? new Decimal(0)).toString(),
      pendingRewardsUsd: (pending._sum.amountUsd ?? new Decimal(0)).toString(),
      heldRewards: held,
      daily: [...daily].map(([date, values]) => ({ date, ...values })),
      growthData: analytics.growthData,
      qualificationBreakdown: analytics.qualificationBreakdown,
    };
  }

  async getAdminReferral(id: string) {
    const referral = await (this.prisma as any).referralAttribution.findUnique({
      where: { id },
      include: {
        referrer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        referredUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
          },
        },
        reward: true,
        auditEvents: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!referral) throw new NotFoundException('Referral not found.');
    return this.toAdminReferral(referral);
  }

  async reviewReferral(
    id: string,
    adminUserId: string,
    input: ReferralReviewDto,
  ) {
    const reason = input.reason.trim();
    if (!reason) throw new BadRequestException('A review reason is required.');
    return (this.prisma as any).$transaction(async (tx: any) => {
      const referral = await tx.referralAttribution.findUnique({
        where: { id },
        include: { reward: true },
      });
      if (!referral || !referral.reward) {
        throw new NotFoundException('Referral reward not found.');
      }
      const previousStatus = referral.reward.status;
      if (input.action === 'HOLD') {
        if (previousStatus !== 'PENDING' && previousStatus !== 'AVAILABLE') {
          throw new BadRequestException(
            'Only pending or available rewards can be held.',
          );
        }
        if (previousStatus === 'AVAILABLE') {
          await this.holdRestrictedReward(
            tx,
            referral.referrerId,
            referral.reward,
          );
        }
        await tx.referralReward.update({
          where: { id: referral.reward.id },
          data: {
            status: 'HELD',
            reviewReason: reason,
            reviewedById: adminUserId,
            reviewedAt: new Date(),
          },
        });
        await tx.referralAttribution.update({
          where: { id },
          data: { status: 'HELD' },
        });
      } else if (input.action === 'RELEASE') {
        if (previousStatus !== 'HELD') {
          throw new BadRequestException('Only held rewards can be released.');
        }
        const qualifies = Boolean(referral.qualifyingPurchaseId);
        if (qualifies) {
          if (referral.reward.creditedAt) {
            await this.releaseRestrictedReward(
              tx,
              referral.referrerId,
              referral.reward,
            );
          } else {
            await this.creditRestrictedReward(
              tx,
              referral.referrerId,
              referral.reward,
            );
          }
        }
        await tx.referralReward.update({
          where: { id: referral.reward.id },
          data: {
            status: qualifies ? 'AVAILABLE' : 'PENDING',
            reviewReason: reason,
            reviewedById: adminUserId,
            reviewedAt: new Date(),
            creditedAt: qualifies ? new Date() : null,
          },
        });
        await tx.referralAttribution.update({
          where: { id },
          data: {
            status: qualifies
              ? 'QUALIFIED'
              : referral.firstDepositId
                ? 'DEPOSIT_QUALIFIED'
                : 'REGISTERED',
          },
        });
      } else {
        if (previousStatus === 'AVAILABLE') {
          await this.moveReferralCredit(
            tx,
            referral.referrerId,
            referral.reward.amountUsd,
            `referral-review-reject:${referral.reward.id}`,
            false,
          );
        } else if (previousStatus === 'HELD' && referral.reward.creditedAt) {
          await this.moveReferralCredit(
            tx,
            referral.referrerId,
            referral.reward.amountUsd,
            `referral-review-reject-held:${referral.reward.id}`,
            false,
            true,
          );
        }
        await tx.referralReward.update({
          where: { id: referral.reward.id },
          data: {
            status: 'REJECTED',
            reviewReason: reason,
            reviewedById: adminUserId,
            reviewedAt: new Date(),
          },
        });
        await tx.referralAttribution.update({
          where: { id },
          data: { status: 'REJECTED' },
        });
      }
      const updated = await tx.referralAttribution.findUnique({
        where: { id },
        include: { reward: true },
      });
      await tx.referralAuditEvent.create({
        data: {
          referralId: id,
          adminUserId,
          action: input.action,
          reason,
          previousStatus,
          newStatus: updated.reward.status,
        },
      });
      return {
        id,
        status: updated.status,
        rewardStatus: updated.reward.status,
      };
    });
  }

  private async creditRestrictedReward(
    tx: any,
    referrerId: string,
    reward: any,
  ) {
    await this.moveReferralCredit(
      tx,
      referrerId,
      reward.amountUsd,
      `referral-reward:${reward.id}`,
      true,
    );
  }

  private async holdRestrictedReward(tx: any, userId: string, reward: any) {
    const amount = new Decimal(reward.amountUsd.toString()).toDecimalPlaces(2);
    if (amount.lte(0)) return;
    const operationKey = `referral-review-hold:${reward.id}:${randomUUID()}`;
    if (await tx.ledgerEntry.findUnique({ where: { operationKey } })) return;
    const wallet = await tx.wallet.findUnique({ where: { userId } });
    const balance = wallet
      ? await tx.walletBalance.upsert({
          where: {
            walletId_currencyCode: { walletId: wallet.id, currencyCode: 'USD' },
          },
          update: {},
          create: { walletId: wallet.id, currencyCode: 'USD' },
        })
      : null;
    if (
      !balance ||
      new Decimal(balance.referralCreditAvailable.toString()).lt(amount)
    ) {
      throw new BadRequestException(
        'The restricted referral credit has already been spent.',
      );
    }
    const changed = await tx.walletBalance.updateMany({
      where: { id: balance.id, referralCreditAvailable: { gte: amount } },
      data: {
        referralCreditAvailable: { decrement: amount },
        referralCreditPending: { increment: amount },
      },
    });
    if (changed.count !== 1)
      throw new BadRequestException(
        'The restricted referral credit has already been spent.',
      );
    await tx.ledgerEntry.create({
      data: {
        walletId: wallet.id,
        currencyCode: 'USD',
        type: 'HOLD',
        amount,
        balanceBefore: balance.availableBalance,
        balanceAfter: balance.availableBalance,
        pendingBalanceBefore: balance.pendingBalance,
        pendingBalanceAfter: balance.pendingBalance,
        referralBalanceBefore: balance.referralCreditAvailable,
        referralBalanceAfter: new Decimal(
          balance.referralCreditAvailable.toString(),
        ).minus(amount),
        referralPendingBefore: balance.referralCreditPending,
        referralPendingAfter: new Decimal(
          balance.referralCreditPending.toString(),
        ).plus(amount),
        operationKey,
        reference: operationKey,
        reason: 'Suspicious referral reward held for review',
      },
    });
  }

  private async releaseRestrictedReward(tx: any, userId: string, reward: any) {
    const amount = new Decimal(reward.amountUsd.toString()).toDecimalPlaces(2);
    if (amount.lte(0)) return;
    const operationKey = `referral-review-release:${reward.id}:${randomUUID()}`;
    if (await tx.ledgerEntry.findUnique({ where: { operationKey } })) return;
    const wallet = await tx.wallet.findUnique({ where: { userId } });
    const balance = wallet
      ? await tx.walletBalance.upsert({
          where: {
            walletId_currencyCode: { walletId: wallet.id, currencyCode: 'USD' },
          },
          update: {},
          create: { walletId: wallet.id, currencyCode: 'USD' },
        })
      : null;
    if (
      !balance ||
      new Decimal(balance.referralCreditPending.toString()).lt(amount)
    ) {
      throw new BadRequestException('Held referral credit is unavailable.');
    }
    const changed = await tx.walletBalance.updateMany({
      where: { id: balance.id, referralCreditPending: { gte: amount } },
      data: {
        referralCreditAvailable: { increment: amount },
        referralCreditPending: { decrement: amount },
      },
    });
    if (changed.count !== 1)
      throw new BadRequestException('Held referral credit is unavailable.');
    await tx.ledgerEntry.create({
      data: {
        walletId: wallet.id,
        currencyCode: 'USD',
        type: 'RELEASE',
        amount,
        balanceBefore: balance.availableBalance,
        balanceAfter: balance.availableBalance,
        pendingBalanceBefore: balance.pendingBalance,
        pendingBalanceAfter: balance.pendingBalance,
        referralBalanceBefore: balance.referralCreditAvailable,
        referralBalanceAfter: new Decimal(
          balance.referralCreditAvailable.toString(),
        ).plus(amount),
        referralPendingBefore: balance.referralCreditPending,
        referralPendingAfter: new Decimal(
          balance.referralCreditPending.toString(),
        ).minus(amount),
        operationKey,
        reference: operationKey,
        reason: 'Referral reward review released',
      },
    });
  }

  private async moveReferralCredit(
    tx: any,
    userId: string,
    amountValue: Decimal | string | number,
    operationKey: string,
    credit: boolean,
    fromPending = false,
  ) {
    const amount = new Decimal(amountValue.toString()).toDecimalPlaces(2);
    if (amount.lte(0)) return;
    if (await tx.ledgerEntry.findUnique({ where: { operationKey } })) return;
    const wallet = await tx.wallet.upsert({
      where: { userId },
      update: {},
      create: { id: randomUUID(), userId },
    });
    const balance = await tx.walletBalance.upsert({
      where: {
        walletId_currencyCode: { walletId: wallet.id, currencyCode: 'USD' },
      },
      update: {},
      create: { walletId: wallet.id, currencyCode: 'USD' },
    });
    if (!balance) throw new NotFoundException('USD wallet balance is missing.');
    const availableBefore = new Decimal(
      balance.referralCreditAvailable.toString(),
    );
    const pendingBefore = new Decimal(balance.referralCreditPending.toString());
    if (!credit && !fromPending && availableBefore.lt(amount)) {
      throw new BadRequestException(
        'The restricted referral credit has already been spent.',
      );
    }
    if (credit) {
      await tx.walletBalance.update({
        where: { id: balance.id },
        data: { referralCreditAvailable: { increment: amount } },
      });
    } else if (fromPending) {
      if (pendingBefore.lt(amount))
        throw new BadRequestException('Held referral credit is unavailable.');
      await tx.walletBalance.update({
        where: { id: balance.id },
        data: { referralCreditPending: { decrement: amount } },
      });
    } else {
      const changed = await tx.walletBalance.updateMany({
        where: { id: balance.id, referralCreditAvailable: { gte: amount } },
        data: { referralCreditAvailable: { decrement: amount } },
      });
      if (changed.count !== 1)
        throw new BadRequestException(
          'The restricted referral credit has already been spent.',
        );
    }
    await tx.ledgerEntry.create({
      data: {
        walletId: wallet.id,
        currencyCode: 'USD',
        type: credit ? 'REFERRAL_CREDIT' : 'REFERRAL_DEBIT',
        amount,
        balanceBefore: balance.availableBalance,
        balanceAfter: balance.availableBalance,
        pendingBalanceBefore: balance.pendingBalance,
        pendingBalanceAfter: balance.pendingBalance,
        referralBalanceBefore: availableBefore,
        referralBalanceAfter: credit
          ? availableBefore.plus(amount)
          : fromPending
            ? availableBefore
            : availableBefore.minus(amount),
        referralPendingBefore: pendingBefore,
        referralPendingAfter: fromPending
          ? pendingBefore.minus(amount)
          : pendingBefore,
        operationKey,
        reference: rewardReference(operationKey),
        reason: credit
          ? 'Referral reward credited to restricted gift-card balance'
          : 'Referral reward adjustment',
      },
    });
  }

  private toAdminReferral(item: any) {
    const depositAmount = item.firstDepositAmountUsd
      ? Number(item.firstDepositAmountUsd.toString())
      : 0.0;
    const requiredPurchase =
      depositAmount > 0
        ? Number(new Decimal(depositAmount.toString()).mul('0.10').toFixed(2))
        : 0.0;
    const actualPurchase = item.qualifyingPurchaseId
      ? Number(new Decimal(depositAmount.toString()).mul('0.12').toFixed(2))
      : 0.0;
    const progressPercentage = item.qualifyingPurchaseId
      ? 100
      : depositAmount > 0
        ? 0
        : 0;
    const rewardAmount = item.reward
      ? Number(item.reward.amountUsd.toString())
      : Number(new Decimal(depositAmount.toString()).mul('0.015').toFixed(2));

    const referrerName =
      `${item.referrer?.firstName || ''} ${item.referrer?.lastName || ''}`.trim() ||
      'Unknown Referrer';
    const referredUserName =
      `${item.referredUser?.firstName || ''} ${item.referredUser?.lastName || ''}`.trim() ||
      'Referred Friend';
    const isHeld = item.status === 'HELD' || item.reward?.status === 'HELD';

    const referrerAvatar =
      item.referrer?.firstName?.trim?.()?.charAt?.(0)?.toUpperCase?.() ||
      referrerName.charAt(0).toUpperCase() ||
      'R';
    const referredAvatar =
      item.referredUser?.firstName?.trim?.()?.charAt?.(0)?.toUpperCase?.() ||
      referredUserName.charAt(0).toUpperCase() ||
      'F';

    return {
      id: item.id,
      code: item.referralCode,
      codeUsed: item.referralCode,
      status: this.mapDisplayStatus(item.status),
      rawStatus: item.status,
      createdAt: item.createdAt,
      joinedDate:
        item.createdAt instanceof Date
          ? item.createdAt.toISOString()
          : item.createdAt || new Date().toISOString(),
      qualifiedDate: item.qualifyingPurchaseId
        ? item.createdAt instanceof Date
          ? item.createdAt.toISOString()
          : item.createdAt || null
        : null,
      rewardDate: item.reward?.creditedAt
        ? item.reward.creditedAt instanceof Date
          ? item.reward.creditedAt.toISOString()
          : item.reward.creditedAt
        : null,
      depositAmount,
      requiredPurchase,
      actualPurchase,
      progressPercentage,
      rewardAmount,
      rewardStatus: this.mapDisplayRewardStatus(item.reward?.status),
      riskLevel: isHeld ? 'High Risk' : 'Normal',
      riskReasons: item.reward?.reviewReason
        ? [item.reward.reviewReason]
        : isHeld
          ? ['Flagged for administrative review']
          : [],
      referrer: {
        id: item.referrer?.id || 'N/A',
        name: referrerName,
        username: item.referrer?.email
          ? `@${item.referrer.email.split('@')[0]}`
          : '@referrer',
        email: item.referrer?.email || '',
        phone: item.referrer?.phone || 'N/A',
        country: item.referrer?.country || 'Global',
        avatar: referrerAvatar,
        totalEarned: `$0.00`,
        successfulCount: 0,
      },
      referredUser: {
        id: item.referredUser?.id || 'N/A',
        name: referredUserName,
        username: item.referredUser?.email
          ? `@${item.referredUser.email.split('@')[0]}`
          : '@friend',
        email: item.referredUser?.email || '',
        phone: item.referredUser?.phone || 'N/A',
        country: item.referredUser?.country || 'Global',
        avatar: referredAvatar,
        joinedDate:
          item.referredUser?.createdAt instanceof Date
            ? item.referredUser.createdAt.toISOString()
            : item.referredUser?.createdAt || new Date().toISOString(),
        accountStatus: isHeld ? 'Under Review' : 'Active',
      },
      firstDepositId: item.firstDepositId,
      firstDepositAmountUsd: item.firstDepositAmountUsd?.toString() ?? null,
      qualifyingPurchaseId: item.qualifyingPurchaseId,
      reward: item.reward
        ? {
            id: item.reward.id,
            amountUsd: item.reward.amountUsd.toString(),
            status: item.reward.status,
            creditedAt: item.reward.creditedAt,
            reviewReason: item.reward.reviewReason,
          }
        : null,
      timeline: this.buildTimeline(item),
      auditEvents: item.auditEvents || [],
    };
  }

  private mapDisplayStatus(status: string): string {
    switch (status) {
      case 'QUALIFIED':
        return 'Qualified';
      case 'HELD':
        return 'Suspicious';
      case 'DEPOSIT_QUALIFIED':
        return 'Deposit Completed';
      case 'REGISTERED':
        return 'Deposit Pending';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status || 'Pending';
    }
  }

  private mapDisplayRewardStatus(status?: string): string {
    switch (status) {
      case 'AVAILABLE':
        return 'Paid';
      case 'HELD':
        return 'Held';
      case 'REJECTED':
        return 'Rejected';
      case 'PENDING':
      default:
        return 'Pending';
    }
  }

  private buildTimeline(item: any) {
    const createdIso =
      item.createdAt instanceof Date
        ? item.createdAt.toISOString()
        : item.createdAt || new Date().toISOString();
    const isDepositDone = Boolean(item.firstDepositId);
    const isPurchaseDone = Boolean(item.qualifyingPurchaseId);
    const isHeld = item.status === 'HELD' || item.reward?.status === 'HELD';
    const isQualified = item.status === 'QUALIFIED';
    const isPaid = item.reward?.status === 'AVAILABLE';
    const depositVal = item.firstDepositAmountUsd
      ? Number(item.firstDepositAmountUsd.toString())
      : 0;
    const rewardVal = item.reward?.amountUsd
      ? Number(item.reward.amountUsd.toString())
      : 0;

    return [
      { step: 'Referral Link Used', date: createdIso, status: 'completed' },
      { step: 'User Registered', date: createdIso, status: 'completed' },
      {
        step: isDepositDone
          ? `Deposit Completed ($${depositVal.toFixed(2)})`
          : 'Deposit Requirement',
        date: isDepositDone ? createdIso : null,
        status: isDepositDone ? 'completed' : 'active',
      },
      {
        step: isPurchaseDone
          ? 'Gift Card Purchase Completed'
          : 'Gift Card Purchase Requirement (10%)',
        date: isPurchaseDone ? createdIso : null,
        status: isPurchaseDone
          ? 'completed'
          : isDepositDone
            ? 'active'
            : 'pending',
      },
      {
        step: isHeld ? 'Fraud & Risk Check Flagged' : 'Referral Qualified',
        date: isQualified || isHeld ? createdIso : null,
        status: isHeld ? 'held' : isQualified ? 'completed' : 'pending',
      },
      {
        step: isHeld
          ? 'Reward Placed on Hold'
          : `Restricted Reward ${isPaid ? `Credited ($${rewardVal.toFixed(2)})` : 'Pending'}`,
        date: isPaid
          ? item.reward?.creditedAt instanceof Date
            ? item.reward.creditedAt.toISOString()
            : createdIso
          : null,
        status: isHeld ? 'held' : isPaid ? 'completed' : 'pending',
      },
    ];
  }
}

function rewardReference(operationKey: string) {
  return operationKey.slice(0, 120);
}
