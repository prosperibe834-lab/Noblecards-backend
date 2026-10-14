import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Decimal } from '@prisma/client-runtime-utils';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { EmailService } from '../src/email/email.service';
import { FlutterwaveService } from '../src/flutterwave/flutterwave.service';
import { BuyGiftCardService } from '../src/gift-cards/buy-gift-card.service';
import { BeneficiaryEncryptionService } from '../src/security/beneficiary-encryption.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ReferralsService } from '../src/referrals/referrals.service';
import { WalletsService } from '../src/wallets/wallets.service';

jest.setTimeout(60_000);

describe('Referral flow with isolated PostgreSQL persistence', () => {
  let app: any;
  let prisma: PrismaService;
  let auth: AuthService;
  let referrals: ReferralsService;
  let flutterwave: FlutterwaveService;
  let wallets: WalletsService;
  let giftCards: BuyGiftCardService;
  let emailCodes: Map<string, string>;
  let adminToken: string;
  let userA: any;
  let userB: any;
  let userC: any;
  let userD: any;
  let adminUser: any;
  let usdCreatedByTest = false;
  const createdUserIds: string[] = [];
  const integrationId = randomUUID();

  const assertTestDatabase = async () => {
    const rows = await prisma.$queryRaw<Array<{ name: string }>>`SELECT current_database() AS name`;
    if (rows[0]?.name !== 'noble_cards_test') {
      throw new Error(
        'Safety check failed: refusing referral integration data operations outside noble_cards_test.',
      );
    }
  };

  const registerUser = async (email: string, referralCode?: string) => {
    await auth.register({
      email,
      password: 'ReferralTest-Password-2026',
      firstName: 'Referral',
      lastName: 'Tester',
      ...(referralCode ? { referralCode } : {}),
    });
    const code = emailCodes.get(email);
    if (!code) throw new Error('The mocked OTP delivery did not capture a verification code.');
    return auth.verifyEmail({ email, code });
  };

  const createDeposit = async (
    user: any,
    amount: string,
    netAmount = amount,
  ) => {
    const wallet = await wallets.getOrCreateWallet(user.user.id);
    const transactionId = randomUUID();
    const reference = `REFERRAL-E2E-TX-${randomUUID()}`;
    const transaction = await prisma.transaction.create({
      data: {
        id: transactionId,
        userId: user.user.id,
        walletId: wallet.id,
        currencyCode: 'USD',
        type: 'DEPOSIT',
        amount: new Decimal(amount),
        fee: new Decimal(amount).minus(netAmount),
        netAmount: new Decimal(netAmount),
        status: 'PENDING',
        provider: 'FLUTTERWAVE',
        reference,
      },
    });
    return prisma.deposit.create({
      data: {
        userId: user.user.id,
        walletId: wallet.id,
        transactionId: transaction.id,
        currencyCode: 'USD',
        amount: new Decimal(amount),
        fee: new Decimal(amount).minus(netAmount),
        netAmount: new Decimal(netAmount),
        provider: 'FLUTTERWAVE',
        providerTransactionId: `provider-${randomUUID()}`,
        providerReference: `reference-${randomUUID()}`,
        idempotencyKey: `referral-e2e-${randomUUID()}`,
        status: 'PENDING',
      },
    });
  };

  const verifyDeposit = async (
    deposit: any,
    providerVerified: boolean,
    verifiedAmount = deposit.amount.toString(),
  ) => {
    const verifySpy = jest
      .spyOn(flutterwave as any, 'verifyTransaction')
      .mockResolvedValueOnce({
        verified: providerVerified,
        amount: verifiedAmount,
        currency: 'USD',
      });
    try {
      return await flutterwave.verifyAndCreditDeposit({
        provider: 'FLUTTERWAVE',
        providerTransactionId: deposit.providerTransactionId,
        providerReference: deposit.providerReference,
      });
    } finally {
      verifySpy.mockRestore();
    }
  };

  const purchaseGiftCard = (
    user: any,
    amount: number,
    idempotencyKey: string,
    useReferralCredit = false,
  ) =>
    giftCards.purchase(user.user.id, {
      productId: 'referral-test-card',
      amount,
      quantity: 1,
      countryCode: 'US',
      currencyCode: 'USD',
      deliveryEmail: user.user.email,
      idempotencyKey,
      useReferralCredit,
    });

  const summaryFor = async (token: string) => {
    const response = await request(app.getHttpServer())
      .get('/referrals/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    return response.body;
  };

  beforeAll(async () => {
    const configuredUrl = process.env.DATABASE_URL;
    if (!configuredUrl) throw new Error('DATABASE_URL must be supplied by the guarded test runner.');
    const targetName = decodeURIComponent(new URL(configuredUrl).pathname.replace(/^\/+/, ''));
    if (targetName !== 'noble_cards_test') {
      throw new Error('Safety check failed before app startup: target must be noble_cards_test.');
    }

    emailCodes = new Map();
    const emailMock = {
      sendVerificationCode: jest.fn(async (email: string, code: string) => {
        emailCodes.set(email, code);
      }),
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(emailMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get(PrismaService);
    await assertTestDatabase();
    auth = app.get(AuthService);
    referrals = app.get(ReferralsService);
    flutterwave = app.get(FlutterwaveService);
    wallets = app.get(WalletsService);

    const existingUsd = await prisma.currency.findUnique({ where: { code: 'USD' } });
    if (!existingUsd) {
      await prisma.currency.create({
        data: { code: 'USD', name: 'US Dollar', symbol: '$' },
      });
      usdCreatedByTest = true;
    }

    const testConfig = {
      get: (key: string) => (key === 'BUY_GIFT_CARD_FEE_PERCENT' ? '0' : undefined),
    };
    const product = {
      provider: 'REFERRAL_TEST_PROVIDER',
      providerProductId: 'referral-test-card',
      productName: 'Integration Test Gift Card',
      brandName: 'Noble Test',
      country: 'United States',
      countryCode: 'US',
      currency: 'USD',
      denominationType: 'VARIABLE',
      minimumAmount: '1',
      maximumAmount: '1000',
      denominations: [],
      redemptionInstructions: null,
      status: 'ACTIVE',
      providerMetadata: {},
    };
    const provider = {
      getCatalog: jest.fn(async () => [product]),
      purchase: jest.fn(async ({ reference }: { reference: string }) => ({
        providerReference: `sandbox-${reference}`,
        providerStatus: 'SUCCESSFUL',
        providerMessage: 'Sandbox transaction completed.',
        redeemId: null,
        voucherCode: null,
        redeemDetails: null,
        providerAmount: null,
        providerMetadata: { sandbox: true },
      })),
      retrieveVoucher: jest.fn(),
    };
    const deterministicRates = {
      getRates: async () => ({ base: 'USD', rates: { USD: 1 } }),
    };
    giftCards = new BuyGiftCardService(
      provider as any,
      prisma,
      wallets,
      app.get(BeneficiaryEncryptionService),
      testConfig as any,
      undefined,
      undefined,
      deterministicRates as any,
      emailMock as any,
      referrals,
    );

    const suffix = integrationId.replace(/-/g, '').slice(0, 12);
    const emailA = `ref-a-${suffix}@example.test`;
    const emailB = `ref-b-${suffix}@example.test`;
    const emailC = `ref-c-${suffix}@example.test`;
    const emailD = `ref-d-${suffix}@example.test`;
    userA = await registerUser(emailA);
    userA.persisted = await prisma.user.findUnique({ where: { id: userA.user.id } });
    createdUserIds.push(userA.user.id);
    expect(userA.persisted.referralCode).toMatch(/^[A-F0-9]{10}$/);
    userB = await registerUser(emailB, userA.persisted.referralCode);
    userB.persisted = await prisma.user.findUnique({ where: { id: userB.user.id } });
    createdUserIds.push(userB.user.id);
    userC = await registerUser(emailC, userA.persisted.referralCode);
    createdUserIds.push(userC.user.id);
    userD = await registerUser(emailD, userA.persisted.referralCode);
    createdUserIds.push(userD.user.id);

    adminUser = await prisma.user.create({
      data: {
        email: `ref-admin-${suffix}@example.test`,
        passwordHash: 'integration-test-only',
        firstName: 'Referral',
        lastName: 'Admin',
        referralCode: `ADM${suffix.toUpperCase()}`,
        role: 'ADMIN',
      },
    });
    createdUserIds.push(adminUser.id);
    adminToken = await app
      .get(JwtService)
      .signAsync({ userId: adminUser.id, sessionId: `referral-e2e-${suffix}` });

    for (const user of [userA, userB, userC, userD]) {
      await wallets.getOrCreateWallet(user.user.id);
    }
  });

  afterAll(async () => {
    if (!prisma) {
      if (app) await app.close();
      return;
    }
    await assertTestDatabase();
    const userIds = createdUserIds;
    if (userIds.length) {
      const attributions = await prisma.referralAttribution.findMany({
        where: { OR: [{ referrerId: { in: userIds } }, { referredUserId: { in: userIds } }] },
        select: { id: true },
      });
      const attributionIds = attributions.map((item) => item.id);
      if (attributionIds.length) {
        await prisma.referralAuditEvent.deleteMany({ where: { referralId: { in: attributionIds } } });
        await prisma.referralReward.deleteMany({ where: { referralId: { in: attributionIds } } });
        await prisma.referralAttribution.deleteMany({ where: { id: { in: attributionIds } } });
      }
      await prisma.giftCardPurchase.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.deposit.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.ledgerEntry.deleteMany({ where: { wallet: { userId: { in: userIds } } } });
      await prisma.transaction.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.refreshSession.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.walletBalance.deleteMany({ where: { wallet: { userId: { in: userIds } } } });
      await prisma.wallet.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.pendingRegistration.deleteMany({
        where: { email: { contains: integrationId.replace(/-/g, '').slice(0, 12) } },
      });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    if (usdCreatedByTest) {
      await prisma.currency.deleteMany({ where: { code: 'USD' } });
    }
    await app.close();
  });

  it('persists unique attribution through verified signup and isolates each customer summary', async () => {
    await assertTestDatabase();
    const attribution = await prisma.referralAttribution.findUnique({
      where: { referredUserId: userB.user.id },
    });
    expect(attribution).toMatchObject({
      referrerId: userA.user.id,
      referredUserId: userB.user.id,
      referralCode: userA.persisted.referralCode,
      status: 'REGISTERED',
    });

    const referrerSummary = await summaryFor(userA.accessToken);
    const friendSummary = await summaryFor(userB.accessToken);
    expect(referrerSummary).toMatchObject({
      code: userA.persisted.referralCode,
      invitedCount: 3,
      qualifiedCount: 0,
      pendingRewardUsd: '0',
      heldRewardUsd: '0',
      availableRewardUsd: '0',
    });
    expect(referrerSummary.link).toContain(encodeURIComponent(userA.persisted.referralCode));
    expect(friendSummary).toMatchObject({
      code: userB.persisted.referralCode,
      invitedCount: 0,
      qualifiedCount: 0,
      rewardHistory: [],
    });
    expect(friendSummary.code).not.toBe(referrerSummary.code);

    await expect(
      auth.register({
        email: `ref-invalid-${integrationId}@example.test`,
        password: 'ReferralTest-Password-2026',
        firstName: 'Invalid',
        lastName: 'Code',
        referralCode: 'MISSING123',
      }),
    ).rejects.toThrow('The referral code is invalid.');
    await expect(
      auth.register({
        email: userA.user.email,
        password: 'ReferralTest-Password-2026',
        firstName: 'Self',
        lastName: 'Referral',
        referralCode: userA.persisted.referralCode,
      }),
    ).rejects.toThrow();
    await expect(
      auth.register({
        email: userB.user.email,
        password: 'ReferralTest-Password-2026',
        firstName: 'Changed',
        lastName: 'Attribution',
        referralCode: userB.user.referralCode,
      }),
    ).rejects.toThrow();
    expect(await prisma.referralAttribution.findUnique({
      where: { referredUserId: userB.user.id },
    })).toMatchObject({ referrerId: userA.user.id, referralCode: userA.persisted.referralCode });
  });

  it('credits only a positive successful first deposit and creates one exact pending reward', async () => {
    await assertTestDatabase();
    const failedDeposit = await createDeposit(userC, '50.00');
    expect(await verifyDeposit(failedDeposit, false)).toMatchObject({ status: 'FAILED' });
    expect(await prisma.referralReward.count({
      where: { referral: { referredUserId: userC.user.id } },
    })).toBe(0);

    const firstDeposit = await createDeposit(userB, '100.00');
    expect(await verifyDeposit(firstDeposit, true)).toMatchObject({
      status: 'SUCCESSFUL',
      alreadyProcessed: false,
    });
    expect(await verifyDeposit(firstDeposit, true)).toMatchObject({
      status: 'SUCCESSFUL',
      alreadyProcessed: true,
    });

    const secondDeposit = await createDeposit(userB, '50.00');
    await verifyDeposit(secondDeposit, true);
    const reward = await prisma.referralReward.findUnique({
      where: { referralId: (await prisma.referralAttribution.findUnique({
        where: { referredUserId: userB.user.id },
      }))!.id },
    });
    expect(reward?.amountUsd.toString()).toBe('1.5');
    expect(reward?.status).toBe('PENDING');
    expect(reward?.creditedAt).toBeNull();
    const attribution = await prisma.referralAttribution.findUnique({
      where: { referredUserId: userB.user.id },
    });
    expect(attribution?.firstDepositId).toBe(firstDeposit.id);
    expect(attribution?.firstDepositAmountUsd?.toString()).toBe('100');
    const bBalance = await prisma.walletBalance.findUnique({
      where: { walletId_currencyCode: { walletId: (await prisma.wallet.findUnique({ where: { userId: userB.user.id } }))!.id, currencyCode: 'USD' } },
    });
    expect(bBalance?.availableBalance.toString()).toBe('150');
    expect(await prisma.ledgerEntry.count({
      where: { reference: `deposit-${firstDeposit.id}` },
    })).toBe(1);
    expect(await prisma.referralReward.count({
      where: { referral: { referredUserId: userB.user.id } },
    })).toBe(1);

    const zeroDeposit = await createDeposit(userD, '0.00');
    await expect(verifyDeposit(zeroDeposit, true)).rejects.toThrow(
      'Deposit amount and wallet-credit amount must be greater than zero.',
    );
    expect(await prisma.deposit.findUnique({ where: { id: zeroDeposit.id } })).toMatchObject({ status: 'PENDING' });
    expect(await prisma.ledgerEntry.count({ where: { reference: `deposit-${zeroDeposit.id}` } })).toBe(0);
    expect(await prisma.referralReward.count({
      where: { referral: { referredUserId: userD.user.id } },
    })).toBe(0);

    const cSuccessfulDeposit = await createDeposit(userC, '50.00');
    await verifyDeposit(cSuccessfulDeposit, true);
    const cReward = await prisma.referralReward.findFirst({
      where: { referral: { referredUserId: userC.user.id } },
    });
    expect(cReward?.amountUsd.toString()).toBe('0.75');
    expect(cReward?.status).toBe('PENDING');
  });

  it('keeps a held reward pending through failed and sub-threshold purchases, then releases it at threshold', async () => {
    await assertTestDatabase();
    await request(app.getHttpServer()).get('/admin/referrals')
      .set('Authorization', `Bearer ${userB.accessToken}`)
      .expect(403);

    const bAttribution = await prisma.referralAttribution.findUnique({
      where: { referredUserId: userB.user.id },
    });
    const holdResponse = await request(app.getHttpServer())
      .patch(`/admin/referrals/${bAttribution!.id}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ action: 'HOLD', reason: 'Integration suspicious-activity review' })
      .expect(200);
    expect(holdResponse.body).toMatchObject({ id: bAttribution!.id, status: 'HELD', rewardStatus: 'HELD' });

    const bWallet = await prisma.wallet.findUnique({ where: { userId: userB.user.id } });
    const beforeFailedPurchase = await prisma.walletBalance.findUnique({
      where: { walletId_currencyCode: { walletId: bWallet!.id, currencyCode: 'USD' } },
    });
    const purchaseProvider = (giftCards as any).provider;
    const originalPurchase = purchaseProvider.purchase;
    purchaseProvider.purchase = jest.fn(async ({ reference }: { reference: string }) => ({
      providerReference: `failed-${reference}`,
      providerStatus: 'FAILED',
      providerMessage: 'Sandbox rejection.',
      redeemId: null,
      voucherCode: null,
      redeemDetails: null,
      providerAmount: null,
      providerMetadata: { sandbox: true },
    }));
    const failedPurchase = await purchaseGiftCard(userB, 9.99, `fail-${integrationId}`);
    expect(failedPurchase.status).toBe('FAILED');
    purchaseProvider.purchase = originalPurchase;
    const afterFailedPurchase = await prisma.walletBalance.findUnique({
      where: { walletId_currencyCode: { walletId: bWallet!.id, currencyCode: 'USD' } },
    });
    expect(afterFailedPurchase?.availableBalance.toString()).toBe(beforeFailedPurchase?.availableBalance.toString());

    const underThreshold = await purchaseGiftCard(userB, 9.99, `below-${integrationId}`);
    expect(underThreshold.status).toBe('SUCCESSFUL');
    let attribution = await prisma.referralAttribution.findUnique({
      where: { referredUserId: userB.user.id },
      include: { reward: true },
    });
    expect(attribution?.qualifyingPurchaseId).toBeNull();
    expect(attribution?.reward?.status).toBe('HELD');
    expect(attribution?.reward?.creditedAt).toBeNull();

    const qualifyingPurchase = await purchaseGiftCard(userB, 10, `qualify-${integrationId}`);
    expect(qualifyingPurchase.status).toBe('SUCCESSFUL');
    attribution = await prisma.referralAttribution.findUnique({
      where: { referredUserId: userB.user.id },
      include: { reward: true },
    });
    expect(attribution?.qualifyingPurchaseId).toBe(qualifyingPurchase.id);
    expect(attribution?.status).toBe('HELD');
    expect(attribution?.reward?.status).toBe('HELD');

    const heldSummary = await summaryFor(userA.accessToken);
    expect(heldSummary.heldRewardUsd).toBe('1.5');
    expect(heldSummary.availableRewardUsd).toBe('0');
    expect(heldSummary.pendingRewardUsd).toBe('0.75');

    await request(app.getHttpServer())
      .patch(`/admin/referrals/${attribution!.id}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ action: 'RELEASE', reason: 'Integration review cleared' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.rewardStatus).toBe('AVAILABLE');
      });
    const available = await prisma.walletBalance.findUnique({
      where: { walletId_currencyCode: { walletId: (await prisma.wallet.findUnique({ where: { userId: userA.user.id } }))!.id, currencyCode: 'USD' } },
    });
    expect(available?.referralCreditAvailable.toString()).toBe('1.5');
    expect(available?.referralCreditPending.toString()).toBe('0');
    expect(available?.availableBalance.toString()).toBe('0');
    const details = await request(app.getHttpServer())
      .get(`/admin/referrals/${attribution!.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(details.body.auditEvents.map((event: any) => event.action)).toEqual(['RELEASE', 'HOLD']);

    const purchaseRecord = await prisma.giftCardPurchase.findUnique({ where: { id: qualifyingPurchase.id } });
    const ledgerCountBeforeReplay = await prisma.ledgerEntry.count({
      where: { reference: purchaseRecord!.reference },
    });
    const replay = await purchaseGiftCard(userB, 10, `qualify-${integrationId}`);
    expect(replay.id).toBe(qualifyingPurchase.id);
    await prisma.$transaction((tx) => referrals.recordSuccessfulPurchase(tx, purchaseRecord));
    expect(await prisma.referralReward.count({
      where: { referral: { referredUserId: userB.user.id } },
    })).toBe(1);
    expect(await prisma.ledgerEntry.count({
      where: { reference: purchaseRecord!.reference },
    })).toBe(ledgerCountBeforeReplay);
  });

  it('allows restricted credit only on a gift-card purchase and never as cash withdrawal funds', async () => {
    await assertTestDatabase();
    const aWallet = await prisma.wallet.findUnique({ where: { userId: userA.user.id } });
    const initial = await prisma.walletBalance.findUnique({
      where: { walletId_currencyCode: { walletId: aWallet!.id, currencyCode: 'USD' } },
    });
    expect(initial?.referralCreditAvailable.toString()).toBe('1.5');
    expect(initial?.availableBalance.toString()).toBe('0');

    await expect(wallets.holdFunds({
      userId: userA.user.id,
      walletId: aWallet!.id,
      currencyCode: 'USD',
      amount: '1.50',
      reference: `cash-withdrawal-${integrationId}`,
    })).rejects.toThrow('Insufficient available balance.');
    const afterWithdrawalAttempt = await prisma.walletBalance.findUnique({
      where: { walletId_currencyCode: { walletId: aWallet!.id, currencyCode: 'USD' } },
    });
    expect(afterWithdrawalAttempt?.referralCreditAvailable.toString()).toBe('1.5');
    expect(afterWithdrawalAttempt?.availableBalance.toString()).toBe('0');

    const purchase = await purchaseGiftCard(userA, 1.5, `spend-referral-${integrationId}`, true);
    expect(purchase.status).toBe('SUCCESSFUL');
    const afterPurchase = await prisma.walletBalance.findUnique({
      where: { walletId_currencyCode: { walletId: aWallet!.id, currencyCode: 'USD' } },
    });
    expect(afterPurchase?.referralCreditAvailable.toString()).toBe('0');
    expect(afterPurchase?.referralCreditPending.toString()).toBe('0');
    expect(afterPurchase?.availableBalance.toString()).toBe('0');
    expect(await prisma.ledgerEntry.count({
      where: { walletId: aWallet!.id, type: 'REFERRAL_DEBIT', reference: purchase.reference },
    })).toBe(1);
    const ownerSummary = await summaryFor(userA.accessToken);
    expect(ownerSummary.availableRewardUsd).toBe('0');
    expect(ownerSummary.rewardHistory.find((item: any) => item.status === 'AVAILABLE')).toBeTruthy();
  });

  it('persists review actions, enforces admin permissions, and supports live search and pagination', async () => {
    await assertTestDatabase();
    const cDeposit = await prisma.deposit.findFirst({
      where: { userId: userC.user.id, status: 'SUCCESSFUL' },
    });
    expect(cDeposit).toBeTruthy();
    const cPurchase = await purchaseGiftCard(userC, 5, `c-qualify-${integrationId}`);
    expect(cPurchase.status).toBe('SUCCESSFUL');

    const cAttribution = await prisma.referralAttribution.findUnique({
      where: { referredUserId: userC.user.id },
    });
    expect(cAttribution?.status).toBe('QUALIFIED');
    expect(await prisma.referralReward.findUnique({
      where: { referralId: cAttribution!.id },
    })).toMatchObject({ status: 'AVAILABLE' });

    const held = await request(app.getHttpServer())
      .patch(`/admin/referrals/${cAttribution!.id}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ action: 'HOLD', reason: 'Integration re-review' })
      .expect(200);
    expect(held.body.rewardStatus).toBe('HELD');
    const cBalance = await prisma.walletBalance.findUnique({
      where: { walletId_currencyCode: { walletId: (await prisma.wallet.findUnique({ where: { userId: userA.user.id } }))!.id, currencyCode: 'USD' } },
    });
    expect(cBalance?.referralCreditPending.toString()).toBe('0.75');
    expect(cBalance?.referralCreditAvailable.toString()).toBe('0');

    const released = await request(app.getHttpServer())
      .patch(`/admin/referrals/${cAttribution!.id}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ action: 'RELEASE', reason: 'Integration re-review cleared' })
      .expect(200);
    expect(released.body.rewardStatus).toBe('AVAILABLE');
    const rejected = await request(app.getHttpServer())
      .patch(`/admin/referrals/${cAttribution!.id}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ action: 'REJECT', reason: 'Integration test rejection' })
      .expect(200);
    expect(rejected.body.rewardStatus).toBe('REJECTED');
    const cReward = await prisma.referralReward.findUnique({ where: { referralId: cAttribution!.id } });
    expect(cReward).toMatchObject({ status: 'REJECTED', reviewReason: 'Integration test rejection' });
    expect(await prisma.referralAuditEvent.count({ where: { referralId: cAttribution!.id } })).toBe(3);
    expect(await prisma.walletBalance.findUnique({
      where: { walletId_currencyCode: { walletId: (await prisma.wallet.findUnique({ where: { userId: userA.user.id } }))!.id, currencyCode: 'USD' } },
    })).toMatchObject({
      referralCreditAvailable: new Decimal('0'),
      referralCreditPending: new Decimal('0'),
      availableBalance: new Decimal('0'),
    });

    await request(app.getHttpServer()).get('/admin/referrals').expect(401);
    await request(app.getHttpServer())
      .patch(`/admin/referrals/${cAttribution!.id}/review`)
      .set('Authorization', `Bearer ${userB.accessToken}`)
      .send({ action: 'HOLD', reason: 'unauthorized test' })
      .expect(403);

    const list = await request(app.getHttpServer())
      .get('/admin/referrals')
      .query({ search: userC.user.email, rewardStatus: 'REJECTED', page: 1, limit: 1, sortBy: 'createdAt', sortOrder: 'desc' })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.data[0]).toMatchObject({
      id: cAttribution!.id,
      status: 'REJECTED',
      reward: { status: 'REJECTED', amountUsd: '0.75' },
    });
    expect(list.body.pagination).toMatchObject({ page: 1, limit: 1, total: 1, totalPages: 1 });
    const stats = await request(app.getHttpServer())
      .get('/admin/referrals/stats')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(stats.body.totalReferrals).toBe(3);
    expect(stats.body.heldRewards).toBe(0);
  });
});
