import { Decimal } from '@prisma/client-runtime-utils';
import { RequestTimeoutException } from '@nestjs/common';
import { GiftCardPurchaseStatus } from '../generated/prisma';
import { BuyGiftCardService } from './buy-gift-card.service';

const product = {
  provider: 'TOPUPMATE' as const,
  providerProductId: '14971',
  productName: 'Google Play Italy',
  brandName: 'Google play',
  country: 'Italy',
  countryCode: 'IT',
  currency: 'EUR',
  denominationType: 'FIXED',
  minimumAmount: null,
  maximumAmount: null,
  denominations: ['10', '25'],
  redemptionInstructions: 'Redeem online',
  status: 'ACTIVE',
  providerMetadata: {
    senderCurrencyCode: 'USD',
    fixedRecipientToSenderDenominationsMap: { '10.0': 12.01, '25.0': 30.03 },
  },
};

const makePurchase = (overrides: Record<string, unknown> = {}) => ({
  id: 'purchase-1',
  reference: 'NC-BUY-ref',
  idempotencyKey: 'request-1',
  userId: 'user-1',
  walletId: 'wallet-1',
  transactionId: 'tx-1',
  provider: 'TOPUPMATE',
  providerProductId: '14971',
  providerReference: null,
  redeemId: null,
  brandNameSnapshot: 'Google play',
  productNameSnapshot: 'Google Play Italy',
  countryCode: 'IT',
  currencyCode: 'USD',
  amount: new Decimal('10'),
  quantity: 1,
  providerAmount: new Decimal('12.01'),
  fee: new Decimal('0'),
  customerPrice: new Decimal('12.01'),
  status: GiftCardPurchaseStatus.PROCESSING,
  providerStatus: null,
  providerMessage: null,
  voucherCiphertext: null,
  redeemDetails: null,
  providerMetadata: {},
  metadata: { cardCurrencyCode: 'EUR' },
  createdAt: new Date(),
  completedAt: null,
  ...overrides,
});

function makeService(
  providerResult: any = {
    providerReference: 'tp-1',
    providerStatus: 'success',
    providerMessage: 'ok',
    redeemId: 'r-1',
    voucherCode: 'CODE-1',
    redeemDetails: { instructions: 'online' },
    providerAmount: '12.01',
    providerMetadata: {},
  },
  rateService?: any,
  baseRateService?: any,
  fxRates: Record<string, number> = { USD: 1, EUR: 1, GBP: 1, CAD: 1, NGN: 1 },
) {
  const purchase = makePurchase();
  const tx = {
    transaction: {
      create: jest.fn().mockResolvedValue({ id: 'tx-1' }),
      update: jest.fn().mockResolvedValue({}),
    },
    giftCardPurchase: {
      create: jest.fn().mockResolvedValue(purchase),
      update: jest
        .fn()
        .mockImplementation(({ data }: any) =>
          Promise.resolve(
            makePurchase({
              ...data,
              status: data.status,
              providerReference: data.providerReference ?? null,
              voucherCiphertext: data.voucherCiphertext ?? null,
            }),
          ),
        ),
      findUnique: jest.fn(),
    },
  };
  const prisma = {
    giftCardPurchase: {
      findUnique: jest.fn().mockResolvedValue(null),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    user: {
      findUnique: jest
        .fn()
        .mockResolvedValue({
          email: 'buyer@example.com',
          firstName: 'Test',
          lastName: 'Buyer',
          displayName: null,
        }),
    },
    $transaction: jest.fn(async (callback: any) => callback(tx)),
  } as any;
  const provider = {
    getCatalog: jest.fn().mockResolvedValue([product]),
    purchase: jest.fn().mockResolvedValue(providerResult),
    retrieveVoucher: jest.fn(),
    generateRedemptionLink: jest
      .fn()
      .mockResolvedValue(
        'https://testflight.tremendous.com/rewards/payout/token',
      ),
  } as any;
  const wallets = {
    getOrCreateWallet: jest.fn().mockResolvedValue({ id: 'wallet-1' }),
    ensureBalance: jest.fn().mockResolvedValue({}),
    holdFunds: jest.fn().mockResolvedValue({ alreadyProcessed: false }),
    finalizeHeldFunds: jest.fn().mockResolvedValue({}),
    releaseHeldFunds: jest.fn().mockResolvedValue({}),
  } as any;
  const encryption = {
    encrypt: jest.fn().mockReturnValue('encrypted'),
    decrypt: jest.fn().mockReturnValue({ code: 'CODE-1' }),
  } as any;
  const config = { get: jest.fn().mockReturnValue('0') } as any;
  const exchangeRates = {
    getRates: jest
      .fn()
      .mockResolvedValue({
        base: 'USD',
        rates: fxRates,
        updatedAt: '2026-09-30T00:00:00.000Z',
      }),
  } as any;
  const email = {
    sendGiftCardPurchaseSuccessEmail: jest.fn().mockResolvedValue(undefined),
  } as any;
  return {
    service: new BuyGiftCardService(
      provider,
      prisma,
      wallets,
      encryption,
      config,
      rateService,
      baseRateService,
      exchangeRates,
      email,
    ),
    provider,
    prisma,
    tx,
    wallets,
    encryption,
    exchangeRates,
    email,
  };
}

describe('BuyGiftCardService purchase flow', () => {
  it('validates the real catalog product, holds funds, submits, and finalizes once', async () => {
    const { service, provider, wallets, encryption, email, prisma, tx } =
      makeService();
    const result = await service.purchase('user-1', {
      productId: '14971',
      amount: 10,
      quantity: 1,
      idempotencyKey: 'request-1',
    });
    expect(provider.purchase).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: '14971',
        amount: 10,
        units: 1,
        reference: expect.stringMatching(/^NC-BUY-/),
      }),
    );
    expect(provider.purchase).toHaveBeenCalledWith(
      expect.objectContaining({ currencyCode: 'EUR' }),
    );
    expect(wallets.holdFunds).toHaveBeenCalledTimes(1);
    expect(wallets.finalizeHeldFunds).toHaveBeenCalledTimes(1);
    expect(encryption.encrypt).toHaveBeenCalledWith({ code: 'CODE-1' });
    expect(result.status).toBe(GiftCardPurchaseStatus.SUCCESSFUL);
    expect(result.voucherCode).toBeNull();
    expect(result.redeemDetails).not.toHaveProperty('pin');
    expect(prisma.giftCardPurchase.updateMany).toHaveBeenCalledTimes(1);
    expect(email.sendGiftCardPurchaseSuccessEmail).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(email.sendGiftCardPurchaseSuccessEmail.mock.calls)).not.toContain('CODE-1');
    expect(prisma.user.findUnique).toHaveBeenCalledTimes(2);
  });

  it('returns real voucher data only from the owned purchase-details endpoint', async () => {
    const { service, prisma } = makeService();
    prisma.giftCardPurchase.findFirst = jest.fn().mockResolvedValue(
      makePurchase({
        status: GiftCardPurchaseStatus.SUCCESSFUL,
        voucherCiphertext: 'encrypted-voucher',
        metadata: {
          cardCurrencyCode: 'EUR',
          brandLogoUrl: 'https://cdn.example.test/flixtrain-de.png',
        },
        redeemDetails: { pin: '4826', delivery: { method: 'LINK' } },
      }),
    );

    const details = await service.getPurchase('owner-1', 'purchase-1');

    expect(prisma.giftCardPurchase.findFirst).toHaveBeenCalledWith({
      where: { id: 'purchase-1', userId: 'owner-1' },
    });
    expect(details.voucherCode).toBe('CODE-1');
    expect(details.redeemDetails).toHaveProperty('pin', '4826');
    expect(details.brandLogoUrl).toBe(
      'https://cdn.example.test/flixtrain-de.png',
    );
    expect(details.redeemDetails).not.toHaveProperty('delivery.link');
  });

  it('does not return purchase details to a user who does not own the purchase', async () => {
    const { service, prisma } = makeService();
    prisma.giftCardPurchase.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      service.getPurchase('another-user', 'purchase-1'),
    ).rejects.toThrow(/not found/i);
    expect(prisma.giftCardPurchase.findFirst).toHaveBeenCalledWith({
      where: { id: 'purchase-1', userId: 'another-user' },
    });
  });

  it('never includes voucher codes or PINs in the Orders list response', async () => {
    const { service, prisma, encryption } = makeService();
    prisma.giftCardPurchase.findMany = jest.fn().mockResolvedValue([
      makePurchase({
        status: GiftCardPurchaseStatus.SUCCESSFUL,
        voucherCiphertext: 'encrypted-voucher',
        redeemDetails: { pin: '4826', instructions: 'Redeem online.' },
      }),
    ]);

    const [order] = await service.getOrders('owner-1');

    expect(order.voucherCode).toBeNull();
    expect(order.redeemDetails).not.toHaveProperty('pin');
    expect(encryption.decrypt).not.toHaveBeenCalled();
  });

  it('snapshots the logo belonging to the selected catalog product', async () => {
    const { service, tx, provider } = makeService();
    provider.getCatalog.mockResolvedValue([
      {
        ...product,
        providerMetadata: {
          logoUrl: 'https://cdn.example.test/flixtrain-de.png',
        },
      },
    ]);

    await service.purchase('user-1', {
      productId: product.providerProductId,
      amount: 10,
      quantity: 1,
      idempotencyKey: 'request-logo',
    });

    expect(tx.giftCardPurchase.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          metadata: expect.objectContaining({
            brandLogoUrl: 'https://cdn.example.test/flixtrain-de.png',
          }),
        }),
      }),
    );
  });

  it('returns a redemption link only for an owned successful LINK reward', async () => {
    const { service, provider, prisma } = makeService();
    prisma.giftCardPurchase.findFirst = jest.fn().mockResolvedValue(
      makePurchase({
        status: GiftCardPurchaseStatus.SUCCESSFUL,
        redeemId: 'REWARD-1',
        redeemDetails: { delivery: { method: 'LINK' } },
      }),
    );

    await expect(
      service.getRedemptionLink('user-1', 'purchase-1'),
    ).resolves.toEqual({
      url: 'https://testflight.tremendous.com/rewards/payout/token',
    });
    expect(prisma.giftCardPurchase.findFirst).toHaveBeenCalledWith({
      where: { id: 'purchase-1', userId: 'user-1' },
    });
    expect(provider.generateRedemptionLink).toHaveBeenCalledWith('REWARD-1');
  });

  it('rejects missing, unsuccessful, and previous EMAIL-delivery purchases without generating a link', async () => {
    const { service, provider, prisma } = makeService();
    prisma.giftCardPurchase.findFirst = jest.fn().mockResolvedValueOnce(null);
    await expect(
      service.getRedemptionLink('user-1', 'missing'),
    ).rejects.toThrow(/not found/i);

    prisma.giftCardPurchase.findFirst.mockResolvedValueOnce(
      makePurchase({ status: GiftCardPurchaseStatus.FAILED }),
    );
    await expect(service.getRedemptionLink('user-1', 'failed')).rejects.toThrow(
      /not available/i,
    );

    prisma.giftCardPurchase.findFirst.mockResolvedValueOnce(
      makePurchase({
        status: GiftCardPurchaseStatus.SUCCESSFUL,
        redeemId: 'OLD-REWARD',
        redeemDetails: { delivery: { method: 'EMAIL' } },
      }),
    );
    await expect(service.getRedemptionLink('user-1', 'email')).rejects.toThrow(
      /previous delivery method/i,
    );
    expect(provider.generateRedemptionLink).not.toHaveBeenCalled();
  });

  it('maps Tremendous link failures to a safe application error', async () => {
    const { service, provider, prisma } = makeService();
    prisma.giftCardPurchase.findFirst = jest.fn().mockResolvedValue(
      makePurchase({
        status: GiftCardPurchaseStatus.SUCCESSFUL,
        redeemId: 'REWARD-1',
        redeemDetails: { delivery: { method: 'LINK' } },
      }),
    );
    provider.generateRedemptionLink.mockRejectedValue(
      new Error('provider returned private details'),
    );

    await expect(
      service.getRedemptionLink('user-1', 'purchase-1'),
    ).rejects.toThrow(
      'Unable to open this gift card right now. Please try again.',
    );
  });

  it('never returns a stored redemption URL in a purchase response', async () => {
    const { service, prisma } = makeService();
    prisma.giftCardPurchase.findFirst = jest.fn().mockResolvedValue(
      makePurchase({
        status: GiftCardPurchaseStatus.SUCCESSFUL,
        redeemDetails: {
          delivery: {
            method: 'LINK',
            link: 'https://testflight.tremendous.com/rewards/payout/secret',
          },
        },
      }),
    );

    const result = await service.getPurchase('user-1', 'purchase-1');

    expect(JSON.stringify(result)).not.toContain('/rewards/payout/secret');
  });

  it('keeps buy details usable when the stored voucher payload is malformed', async () => {
    const { service, prisma, encryption } = makeService();
    encryption.decrypt.mockImplementation(() => {
      throw new Error('Beneficiary payload could not be decrypted and parsed.');
    });
    prisma.giftCardPurchase.findFirst = jest.fn().mockResolvedValue(
      makePurchase({
        status: GiftCardPurchaseStatus.SUCCESSFUL,
        voucherCiphertext: 'v1:malformed',
        redeemDetails: { code: 'LEGACY-CODE', pin: '5432' },
        providerMetadata: { code: 'LEGACY-FALLBACK' },
      }),
    );

    const result = await service.getPurchase('user-1', 'purchase-1');

    expect(result.status).toBe(GiftCardPurchaseStatus.SUCCESSFUL);
    expect(result.voucherCode).toBe('LEGACY-CODE');
    expect(result.redeemDetails).toEqual({ pin: '5432' });
  });

  it('does not send a second success email after the email-attempt claim is taken', async () => {
    const { service, prisma, email } = makeService();
    prisma.giftCardPurchase.updateMany.mockResolvedValue({ count: 0 });

    await service.purchase('user-1', {
      productId: '14971',
      amount: 10,
      quantity: 1,
    });

    expect(prisma.giftCardPurchase.updateMany).toHaveBeenCalledTimes(1);
    expect(email.sendGiftCardPurchaseSuccessEmail).not.toHaveBeenCalled();
  });

  it('uses the explicitly selected country and currency when provider product IDs repeat', async () => {
    const { service, provider, tx } = makeService();
    provider.getCatalog.mockResolvedValue([
      product,
      {
        ...product,
        country: 'United Kingdom',
        countryCode: 'GB',
        currency: 'GBP',
        providerMetadata: { senderCurrencyCode: 'GBP' },
      },
    ]);

    await service.purchase('user-1', {
      productId: product.providerProductId,
      countryCode: 'GB',
      currencyCode: 'GBP',
      amount: 10,
      quantity: 1,
    });

    expect(provider.getCatalog).toHaveBeenCalledWith({
      productId: product.providerProductId,
      countryCode: 'GB',
      currency: 'GBP',
    });

    expect(tx.giftCardPurchase.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          countryCode: 'GB',
          provider: 'TREMENDOUS',
        }),
      }),
    );
    expect(provider.purchase).toHaveBeenCalledWith(
      expect.objectContaining({ currencyCode: 'GBP' }),
    );
  });

  it('rejects an unavailable product or denomination before charging', async () => {
    const { service, provider, wallets } = makeService();
    provider.getCatalog.mockResolvedValue([]);
    await expect(
      service.purchase('user-1', {
        productId: 'missing',
        amount: 10,
        quantity: 1,
      }),
    ).rejects.toThrow(/not available/i);
    expect(wallets.holdFunds).not.toHaveBeenCalled();
  });

  it('releases the hold on a definitive provider rejection', async () => {
    const { service, wallets } = makeService({
      providerReference: null,
      providerStatus: 'failed',
      providerMessage: 'Rejected',
      redeemId: null,
      voucherCode: null,
      redeemDetails: null,
      providerAmount: null,
      providerMetadata: {},
    });
    const result = await service.purchase('user-1', {
      productId: '14971',
      amount: 10,
      quantity: 1,
    });
    expect(wallets.releaseHeldFunds).toHaveBeenCalledTimes(1);
    expect(wallets.finalizeHeldFunds).not.toHaveBeenCalled();
    expect(result.status).toBe(GiftCardPurchaseStatus.FAILED);
  });

  it('keeps the hold and marks the purchase under review on timeout', async () => {
    const { service, provider, wallets } = makeService();
    provider.purchase.mockRejectedValue(
      new RequestTimeoutException('TOPUPMATE_REQUEST_TIMEOUT'),
    );
    const result = await service.purchase('user-1', {
      productId: '14971',
      amount: 10,
      quantity: 1,
    });
    expect(wallets.releaseHeldFunds).not.toHaveBeenCalled();
    expect(wallets.finalizeHeldFunds).not.toHaveBeenCalled();
    expect(result.status).toBe(GiftCardPurchaseStatus.UNDER_REVIEW);
  });

  it('returns an existing idempotent purchase without submitting again', async () => {
    const { service, prisma, provider, email } = makeService();
    prisma.giftCardPurchase.findUnique.mockResolvedValue(
      makePurchase({
        userId: 'user-1',
        status: GiftCardPurchaseStatus.UNDER_REVIEW,
      }),
    );
    const result = await service.purchase('user-1', {
      productId: '14971',
      amount: 10,
      quantity: 1,
      idempotencyKey: 'request-1',
    });
    expect(provider.purchase).not.toHaveBeenCalled();
    expect(email.sendGiftCardPurchaseSuccessEmail).not.toHaveBeenCalled();
    expect(result.id).toBe('purchase-1');
  });

  it('does not allow another user to reuse an idempotency key', async () => {
    const { service, prisma } = makeService();
    prisma.giftCardPurchase.findUnique.mockResolvedValue(
      makePurchase({ userId: 'other-user' }),
    );
    await expect(
      service.purchase('user-1', {
        productId: '14971',
        amount: 10,
        quantity: 1,
        idempotencyKey: 'request-1',
      }),
    ).rejects.toThrow(/another user/i);
  });

  it('applies the persisted Buy adjustment while ignoring a client final-price override', async () => {
    const rateService = {
      resolve: jest
        .fn()
        .mockResolvedValue({ adjustmentPercent: new Decimal('10') }),
    };
    const { service, tx, wallets } = makeService(undefined, rateService);

    await service.purchase('user-1', {
      productId: '14971',
      amount: 10,
      quantity: 1,
      idempotencyKey: 'request-rate',
      ...({ customerPrice: 0.01 } as any),
    });

    expect(rateService.resolve).toHaveBeenCalledWith(product, 10);
    expect(wallets.holdFunds).toHaveBeenCalledWith(
      expect.objectContaining({ amount: new Decimal('11') }),
      tx,
    );
    expect(tx.giftCardPurchase.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          providerAmount: new Decimal('10'),
          fee: new Decimal('0'),
          buyAdjustmentPercent: new Decimal('10'),
          buyAdjustmentAmount: new Decimal('1'),
          customerPrice: new Decimal('11'),
        }),
      }),
    );
  });

  it('adds Buy markup percentage points to the configured Base Buy Rate', async () => {
    const rateService = {
      resolve: jest
        .fn()
        .mockResolvedValue({ adjustmentPercent: new Decimal('3') }),
    };
    const baseRateService = {
      resolve: jest.fn().mockResolvedValue({ ratePercent: new Decimal('80') }),
    };
    const { service, provider, tx, wallets } = makeService(
      undefined,
      rateService,
      baseRateService,
    );
    provider.getCatalog.mockResolvedValue([
      { ...product, denominations: ['100'], providerMetadata: {} },
    ]);

    await service.purchase('user-1', {
      productId: '14971',
      amount: 100,
      quantity: 1,
      idempotencyKey: 'request-base-rate',
      ...({ customerPrice: 999 } as any),
    });

    expect(wallets.holdFunds).toHaveBeenCalledWith(
      expect.objectContaining({ amount: new Decimal('83') }),
      tx,
    );
    expect(tx.giftCardPurchase.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          baseBuyRatePercent: new Decimal('80'),
          buyAdjustmentPercent: new Decimal('3'),
          customerRatePercent: new Decimal('83'),
          customerPrice: new Decimal('83'),
        }),
      }),
    );
  });

  it('converts a EUR denomination to USD before applying the configured Buy rate', async () => {
    const rateService = {
      resolve: jest
        .fn()
        .mockResolvedValue({ adjustmentPercent: new Decimal('3') }),
    };
    const baseRateService = {
      resolve: jest.fn().mockResolvedValue({ ratePercent: new Decimal('80') }),
    };
    const { service, provider } = makeService(
      undefined,
      rateService,
      baseRateService,
      {
        USD: 1,
        EUR: 0.92,
      },
    );
    provider.getCatalog.mockResolvedValue([
      {
        ...product,
        country: 'Germany',
        countryCode: 'DE',
        denominations: ['15'],
        minimumAmount: '15',
        maximumAmount: '15',
      },
    ]);

    const quote = await service.quote({
      productId: product.providerProductId,
      countryCode: 'DE',
      currencyCode: 'EUR',
      amount: 15,
      quantity: 1,
    });

    expect(quote).toEqual(
      expect.objectContaining({
        currencyCode: 'EUR',
        walletCurrencyCode: 'USD',
        faceValue: 15,
        fxRate: '0.92',
        usdFaceValue: '16.3',
        customerRatePercent: '83',
        customerPrice: '13.53',
      }),
    );
  });

  it('does not quote or charge when the selected currency has no valid USD FX rate', async () => {
    const { service, wallets } = makeService(undefined, undefined, undefined, {
      USD: 1,
    });

    await expect(
      service.quote({
        productId: product.providerProductId,
        countryCode: 'IT',
        currencyCode: 'EUR',
        amount: 10,
        quantity: 1,
      }),
    ).rejects.toThrow(/no USD exchange rate exists for EUR/i);
    expect(wallets.holdFunds).not.toHaveBeenCalled();
  });
});
