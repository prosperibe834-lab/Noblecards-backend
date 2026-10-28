import { BadRequestException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { ReferralsService } from './referrals.service';

describe('ReferralsService', () => {
  let service: ReferralsService;
  let prisma: any;
  let config: any;

  beforeEach(() => {
    prisma = {};
    config = { get: jest.fn((_key: string, fallback: string) => fallback) };
    service = new ReferralsService(prisma, config);
  });

  it('rejects unknown and self-referral codes', async () => {
    prisma.user = { findUnique: jest.fn().mockResolvedValue(null) };
    await expect(
      service.validateCode('missing1', 'new@example.com'),
    ).rejects.toBeInstanceOf(BadRequestException);

    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'owner@example.com',
    });
    await expect(
      service.validateCode('code123', ' OWNER@example.com '),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates one 1.5% pending reward for the first successful deposit only', async () => {
    const attribution = {
      id: 'referral-1',
      referrerId: 'referrer-1',
    };
    const tx = {
      referralAttribution: {
        findFirst: jest
          .fn()
          .mockResolvedValueOnce(attribution)
          .mockResolvedValueOnce(null),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      referralReward: { create: jest.fn().mockResolvedValue({}) },
    };
    const deposit = {
      id: 'deposit-1',
      userId: 'referred-1',
      status: 'SUCCESSFUL',
      currencyCode: 'NGN',
      netAmount: new Decimal('100.00'),
      exchangeRate: new Decimal('1372.5856'),
    };

    await service.recordSuccessfulDeposit(tx, deposit);
    await service.recordSuccessfulDeposit(tx, { ...deposit, id: 'deposit-2' });

    expect(tx.referralAttribution.updateMany).toHaveBeenCalledTimes(1);
    expect(tx.referralAttribution.updateMany).toHaveBeenCalledWith({
      where: { id: 'referral-1', status: 'REGISTERED', firstDepositId: null },
      data: {
        firstDepositId: 'deposit-1',
        firstDepositAmountUsd: new Decimal('100.00'),
        status: 'DEPOSIT_QUALIFIED',
      },
    });
    expect(tx.referralReward.create).toHaveBeenCalledWith({
      data: {
        referralId: 'referral-1',
        referrerId: 'referrer-1',
        amountUsd: new Decimal('1.50'),
        status: 'PENDING',
      },
    });
  });

  it('requires a successful qualifying purchase of at least ten percent before crediting', async () => {
    const attribution = {
      id: 'referral-1',
      referrerId: 'referrer-1',
      status: 'DEPOSIT_QUALIFIED',
      firstDepositAmountUsd: new Decimal('100'),
      reward: {
        id: 'reward-1',
        amountUsd: new Decimal('1.50'),
        status: 'PENDING',
      },
    };
    const tx = {
      referralAttribution: {
        findFirst: jest
          .fn()
          .mockResolvedValueOnce(attribution)
          .mockResolvedValueOnce(attribution),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      referralReward: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      ledgerEntry: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({}),
      },
      wallet: { upsert: jest.fn().mockResolvedValue({ id: 'wallet-1' }) },
      walletBalance: {
        upsert: jest.fn().mockResolvedValue({
          id: 'wallet-balance-1',
          referralCreditAvailable: new Decimal(0),
          referralCreditPending: new Decimal(0),
          availableBalance: new Decimal(0),
          pendingBalance: new Decimal(0),
        }),
        update: jest.fn().mockResolvedValue({}),
      },
    };

    await service.recordSuccessfulPurchase(tx, {
      id: 'purchase-too-small',
      userId: 'referred-1',
      giftCardValueUsd: new Decimal('9.99'),
    });
    expect(tx.referralAttribution.updateMany).not.toHaveBeenCalled();
    expect(tx.walletBalance.update).not.toHaveBeenCalled();

    await service.recordSuccessfulPurchase(tx, {
      id: 'purchase-qualifying',
      userId: 'referred-1',
      giftCardValueUsd: new Decimal('10.00'),
    });
    await service.recordSuccessfulPurchase(tx, {
      id: 'duplicate-purchase',
      userId: 'referred-1',
      giftCardValueUsd: new Decimal('50.00'),
    });

    expect(tx.referralAttribution.updateMany).toHaveBeenCalledWith({
      where: { id: 'referral-1', qualifyingPurchaseId: null },
      data: {
        qualifyingPurchaseId: 'purchase-qualifying',
        status: 'QUALIFIED',
      },
    });
    expect(tx.walletBalance.update).toHaveBeenCalledWith({
      where: { id: 'wallet-balance-1' },
      data: { referralCreditAvailable: { increment: new Decimal('1.50') } },
    });
    expect(tx.referralReward.updateMany).toHaveBeenCalledWith({
      where: { id: 'reward-1', status: 'PENDING' },
      data: { status: 'AVAILABLE', creditedAt: expect.any(Date) },
    });
    expect(tx.ledgerEntry.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'REFERRAL_CREDIT',
          amount: new Decimal('1.50'),
          operationKey: 'referral-reward:reward-1',
        }),
      }),
    );
    expect(tx.walletBalance.update).toHaveBeenCalledTimes(1);
  });

  it('keeps suspicious rewards held without crediting the restricted balance', async () => {
    const tx = {
      referralAttribution: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'referral-held',
          referrerId: 'referrer-1',
          status: 'HELD',
          firstDepositAmountUsd: new Decimal('100'),
          reward: {
            id: 'reward-held',
            amountUsd: new Decimal('1.50'),
            status: 'HELD',
          },
        }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      referralReward: { updateMany: jest.fn() },
      walletBalance: { update: jest.fn() },
    };

    await service.recordSuccessfulPurchase(tx, {
      id: 'purchase-held',
      userId: 'referred-1',
      giftCardValueUsd: new Decimal('10'),
    });

    expect(tx.referralAttribution.updateMany).toHaveBeenCalledWith({
      where: { id: 'referral-held', qualifyingPurchaseId: null },
      data: { qualifyingPurchaseId: 'purchase-held', status: 'HELD' },
    });
    expect(tx.referralReward.updateMany).not.toHaveBeenCalled();
    expect(tx.walletBalance.update).not.toHaveBeenCalled();
  });

  it('reports pending, held, and available rewards separately', async () => {
    prisma.user = {
      findUnique: jest.fn().mockResolvedValue({ referralCode: 'CODE123456' }),
    };
    prisma.referralAttribution = {
      findMany: jest.fn().mockResolvedValue([
        { id: 'ref-1', status: 'QUALIFIED', createdAt: new Date() },
        { id: 'ref-2', status: 'HELD', createdAt: new Date() },
      ]),
    };
    prisma.referralReward = {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'reward-pending',
          amountUsd: new Decimal('1.50'),
          status: 'PENDING',
          createdAt: new Date(),
          creditedAt: null,
          referral: { referredUser: { firstName: 'A', lastName: 'Friend' } },
        },
        {
          id: 'reward-held',
          amountUsd: new Decimal('2.00'),
          status: 'HELD',
          createdAt: new Date(),
          creditedAt: null,
          referral: { referredUser: { firstName: 'B', lastName: 'Friend' } },
        },
        {
          id: 'reward-available',
          amountUsd: new Decimal('3.00'),
          status: 'AVAILABLE',
          createdAt: new Date(),
          creditedAt: new Date(),
          referral: { referredUser: { firstName: 'C', lastName: 'Friend' } },
        },
      ]),
    };
    prisma.walletBalance = {
      findFirst: jest.fn().mockResolvedValue({
        referralCreditAvailable: new Decimal('3.00'),
        referralCreditPending: new Decimal('0.00'),
      }),
    };

    const summary = await service.getCustomerSummary('referrer-1');

    expect(summary).toMatchObject({
      pendingRewardUsd: '1.5',
      heldRewardUsd: '2',
      availableRewardUsd: '3',
      pendingRewardCount: 1,
      heldRewardCount: 1,
    });
    expect(summary.rewardHistory.map((reward: any) => reward.status)).toEqual([
      'PENDING',
      'HELD',
      'AVAILABLE',
    ]);
    expect(
      summary.rewardHistory.every(
        (reward: any) =>
          !('depositAmountUsd' in reward) && !('purchaseAmountUsd' in reward),
      ),
    ).toBe(true);
  });

  it('returns filtered pages with bounded pagination and safe aggregate status data', async () => {
    prisma.referralAttribution = {
      count: jest.fn().mockResolvedValue(0),
      findMany: jest.fn().mockResolvedValue([]),
      groupBy: jest.fn().mockResolvedValue([]),
    };

    const result = await service.getAdminReferrals({
      search: '  code  ',
      country: 'NG',
      status: 'REGISTERED',
      rewardStatus: 'PENDING',
      page: 3,
      limit: 1000,
      sortBy: 'status',
      sortOrder: 'asc',
    });

    expect(result.pagination).toEqual({
      page: 3,
      limit: 100,
      total: 0,
      totalPages: 0,
    });
    expect(prisma.referralAttribution.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 200,
        take: 100,
        orderBy: { status: 'asc' },
        where: expect.objectContaining({
          status: 'REGISTERED',
          reward: { is: { status: 'PENDING' } },
          AND: expect.arrayContaining([
            expect.objectContaining({ OR: expect.any(Array) }),
            expect.objectContaining({ OR: expect.any(Array) }),
          ]),
        }),
      }),
    );
  });

  it('records a persistent audit event when an admin places a pending reward on hold', async () => {
    const referral = {
      id: 'referral-1',
      referrerId: 'referrer-1',
      firstDepositId: 'deposit-1',
      qualifyingPurchaseId: null,
      reward: {
        id: 'reward-1',
        status: 'PENDING',
        amountUsd: new Decimal('1.50'),
        creditedAt: null,
      },
    };
    const tx = {
      referralAttribution: {
        findUnique: jest
          .fn()
          .mockResolvedValueOnce(referral)
          .mockResolvedValueOnce({
            status: 'HELD',
            reward: { status: 'HELD' },
          }),
        update: jest.fn().mockResolvedValue({}),
      },
      referralReward: { update: jest.fn().mockResolvedValue({}) },
      referralAuditEvent: { create: jest.fn().mockResolvedValue({}) },
    };
    prisma.$transaction = jest.fn((callback) => callback(tx));

    await expect(
      service.reviewReferral('referral-1', 'admin-1', {
        action: 'HOLD',
        reason: 'Duplicate-account review',
      }),
    ).resolves.toEqual({
      id: 'referral-1',
      status: 'HELD',
      rewardStatus: 'HELD',
    });

    expect(tx.referralReward.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'reward-1' },
        data: expect.objectContaining({
          status: 'HELD',
          reviewReason: 'Duplicate-account review',
        }),
      }),
    );
    expect(tx.referralAuditEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        referralId: 'referral-1',
        adminUserId: 'admin-1',
        action: 'HOLD',
        reason: 'Duplicate-account review',
      }),
    });
  });

  it('provides referral program settings and updates commission rate with audit log', async () => {
    prisma.referralAttribution = { groupBy: jest.fn().mockResolvedValue([]) };
    const initial = await service.getSettings();
    expect(initial.settings.commissionRate).toBe(1.5);
    expect(initial.settings.programActive).toBe(true);

    const updated = await service.updateCommissionRate(
      2.5,
      'Promotion increase',
      'admin-99',
    );
    expect(updated.success).toBe(true);
    expect(updated.settings.commissionRate).toBe(2.5);
    expect(updated.auditLogs[0]).toMatchObject({
      admin: 'admin-99',
      previousValue: '1.5%',
      newValue: '2.5%',
      reason: 'Promotion increase',
    });

    const toggled = await service.toggleProgramStatus(false, 'admin-99');
    expect(toggled.success).toBe(true);
    expect(toggled.active).toBe(false);
  });

  it('provides qrCode and qrData in customer summary', async () => {
    prisma.user = {
      findUnique: jest.fn().mockResolvedValue({ referralCode: 'QRTEST123' }),
    };
    prisma.referralAttribution = { findMany: jest.fn().mockResolvedValue([]) };
    prisma.referralReward = { findMany: jest.fn().mockResolvedValue([]) };
    prisma.walletBalance = { findFirst: jest.fn().mockResolvedValue(null) };

    const summary = await service.getCustomerSummary('user-qr');
    expect(summary.code).toBe('QRTEST123');
    expect(summary.link).toContain('QRTEST123');
    expect(summary.qrCode).toBe(summary.link);
    expect(summary.qrData).toBe(summary.link);
  });
});

