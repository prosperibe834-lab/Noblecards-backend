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
    return {
      code,
      link: `${baseUrl}/${encodeURIComponent(code)}`,
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
      rewardHistory: rewards.map((item: any) => ({
        id: item.id,
        referredName:
          `${item.referral.referredUser.firstName} ${item.referral.referredUser.lastName}`.trim(),
        amountUsd: item.amountUsd.toString(),
        status: item.status,
        createdAt: item.createdAt,
        creditedAt: item.creditedAt,
      })),
    };
  }

  async getAdminReferrals(query: {
    search?: string;
    status?: string;
    rewardStatus?: string;
    country?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 25));
    const search = query.search?.trim();
    const conditions: any[] = [];
    if (query.country) {
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
        ],
      });
    }
    const where: any = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.rewardStatus
        ? { reward: { is: { status: query.rewardStatus } } }
        : {}),
      ...(conditions.length ? { AND: conditions } : {}),
    };
    const [total, records, grouped] = await Promise.all([
      (this.prisma as any).referralAttribution.count({ where }),
      (this.prisma as any).referralAttribution.findMany({
        where,
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
    ]);
    return {
      data: records.map((item: any) => this.toAdminReferral(item)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
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
    const [totalReferrals, statuses, paid, pending, held, recent] =
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
    return {
      id: item.id,
      code: item.referralCode,
      status: item.status,
      createdAt: item.createdAt,
      referrer: item.referrer,
      referredUser: item.referredUser,
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
      auditEvents: item.auditEvents,
    };
  }
}

function rewardReference(operationKey: string) {
  return operationKey.slice(0, 120);
}
