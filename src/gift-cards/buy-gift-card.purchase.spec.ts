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
  createdAt: new Date(),
  completedAt: null,
  ...overrides,
});

function makeService(providerResult: any = { providerReference: 'tp-1', providerStatus: 'success', providerMessage: 'ok', redeemId: 'r-1', voucherCode: 'CODE-1', redeemDetails: { instructions: 'online' }, providerAmount: '12.01', providerMetadata: {} }, rateService?: any, baseRateService?: any) {
  const purchase = makePurchase();
  const tx = {
    transaction: { create: jest.fn().mockResolvedValue({ id: 'tx-1' }), update: jest.fn().mockResolvedValue({}) },
    giftCardPurchase: {
      create: jest.fn().mockResolvedValue(purchase),
      update: jest.fn().mockImplementation(({ data }: any) => Promise.resolve(makePurchase({ ...data, status: data.status, providerReference: data.providerReference ?? null, voucherCiphertext: data.voucherCiphertext ?? null }))),
      findUnique: jest.fn(),
    },
  };
  const prisma = {
    giftCardPurchase: { findUnique: jest.fn().mockResolvedValue(null) },
    user: { findUnique: jest.fn().mockResolvedValue({ email: 'buyer@example.com', firstName: 'Test', lastName: 'Buyer', displayName: null }) },
    $transaction: jest.fn(async (callback: any) => callback(tx)),
  } as any;
  const provider = {
    getCatalog: jest.fn().mockResolvedValue([product]),
    purchase: jest.fn().mockResolvedValue(providerResult),
    retrieveVoucher: jest.fn(),
  } as any;
  const wallets = {
    getOrCreateWallet: jest.fn().mockResolvedValue({ id: 'wallet-1' }),
    ensureBalance: jest.fn().mockResolvedValue({}),
    holdFunds: jest.fn().mockResolvedValue({ alreadyProcessed: false }),
    finalizeHeldFunds: jest.fn().mockResolvedValue({}),
    releaseHeldFunds: jest.fn().mockResolvedValue({}),
  } as any;
  const encryption = { encrypt: jest.fn().mockReturnValue('encrypted'), decrypt: jest.fn().mockReturnValue({ code: 'CODE-1' }) } as any;
  const config = { get: jest.fn().mockReturnValue('0') } as any;
  return { service: new BuyGiftCardService(provider, prisma, wallets, encryption, config, rateService, baseRateService), provider, prisma, tx, wallets, encryption };
}

describe('BuyGiftCardService purchase flow', () => {
  it('validates the real catalog product, holds funds, submits, and finalizes once', async () => {
    const { service, provider, wallets, encryption } = makeService();
    const result = await service.purchase('user-1', { productId: '14971', amount: 10, quantity: 1, idempotencyKey: 'request-1' });
    expect(provider.purchase).toHaveBeenCalledWith(expect.objectContaining({ productId: '14971', amount: 10, units: 1, reference: expect.stringMatching(/^NC-BUY-/) }));
    expect(wallets.holdFunds).toHaveBeenCalledTimes(1);
    expect(wallets.finalizeHeldFunds).toHaveBeenCalledTimes(1);
    expect(encryption.encrypt).toHaveBeenCalledWith({ code: 'CODE-1' });
    expect(result.status).toBe(GiftCardPurchaseStatus.SUCCESSFUL);
  });

  it('rejects an unavailable product or denomination before charging', async () => {
    const { service, provider, wallets } = makeService();
    provider.getCatalog.mockResolvedValue([]);
    await expect(service.purchase('user-1', { productId: 'missing', amount: 10, quantity: 1 })).rejects.toThrow(/not available/i);
    expect(wallets.holdFunds).not.toHaveBeenCalled();
  });

  it('releases the hold on a definitive provider rejection', async () => {
    const { service, wallets } = makeService({ providerReference: null, providerStatus: 'failed', providerMessage: 'Rejected', redeemId: null, voucherCode: null, redeemDetails: null, providerAmount: null, providerMetadata: {} });
    const result = await service.purchase('user-1', { productId: '14971', amount: 10, quantity: 1 });
    expect(wallets.releaseHeldFunds).toHaveBeenCalledTimes(1);
    expect(wallets.finalizeHeldFunds).not.toHaveBeenCalled();
    expect(result.status).toBe(GiftCardPurchaseStatus.FAILED);
  });

  it('keeps the hold and marks the purchase under review on timeout', async () => {
    const { service, provider, wallets } = makeService();
    provider.purchase.mockRejectedValue(new RequestTimeoutException('TOPUPMATE_REQUEST_TIMEOUT'));
    const result = await service.purchase('user-1', { productId: '14971', amount: 10, quantity: 1 });
    expect(wallets.releaseHeldFunds).not.toHaveBeenCalled();
    expect(wallets.finalizeHeldFunds).not.toHaveBeenCalled();
    expect(result.status).toBe(GiftCardPurchaseStatus.UNDER_REVIEW);
  });

  it('returns an existing idempotent purchase without submitting again', async () => {
    const { service, prisma, provider } = makeService();
    prisma.giftCardPurchase.findUnique.mockResolvedValue(makePurchase({ userId: 'user-1', status: GiftCardPurchaseStatus.UNDER_REVIEW }));
    const result = await service.purchase('user-1', { productId: '14971', amount: 10, quantity: 1, idempotencyKey: 'request-1' });
    expect(provider.purchase).not.toHaveBeenCalled();
    expect(result.id).toBe('purchase-1');
  });

  it('does not allow another user to reuse an idempotency key', async () => {
    const { service, prisma } = makeService();
    prisma.giftCardPurchase.findUnique.mockResolvedValue(makePurchase({ userId: 'other-user' }));
    await expect(service.purchase('user-1', { productId: '14971', amount: 10, quantity: 1, idempotencyKey: 'request-1' })).rejects.toThrow(/another user/i);
  });

  it('applies the persisted Buy adjustment while ignoring a client final-price override', async () => {
    const rateService = { resolve: jest.fn().mockResolvedValue({ adjustmentPercent: new Decimal('10') }) };
    const { service, tx, wallets } = makeService(undefined, rateService);

    await service.purchase('user-1', { productId: '14971', amount: 10, quantity: 1, idempotencyKey: 'request-rate', ...( { customerPrice: 0.01 } as any) });

    expect(rateService.resolve).toHaveBeenCalledWith(product, 10);
    expect(wallets.holdFunds).toHaveBeenCalledWith(expect.objectContaining({ amount: new Decimal('13.21') }), tx);
    expect(tx.giftCardPurchase.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        providerAmount: new Decimal('12.01'),
        fee: new Decimal('0'),
        buyAdjustmentPercent: new Decimal('10'),
        buyAdjustmentAmount: new Decimal('1.20'),
        customerPrice: new Decimal('13.21'),
      }),
    }));
  });

  it('adds Buy markup percentage points to the configured Base Buy Rate', async () => {
    const rateService = { resolve: jest.fn().mockResolvedValue({ adjustmentPercent: new Decimal('3') }) };
    const baseRateService = { resolve: jest.fn().mockResolvedValue({ ratePercent: new Decimal('80') }) };
    const { service, provider, tx, wallets } = makeService(undefined, rateService, baseRateService);
    provider.getCatalog.mockResolvedValue([{ ...product, denominations: ['100'], providerMetadata: {} }]);

    await service.purchase('user-1', { productId: '14971', amount: 100, quantity: 1, idempotencyKey: 'request-base-rate', ...( { customerPrice: 999 } as any) });

    expect(wallets.holdFunds).toHaveBeenCalledWith(expect.objectContaining({ amount: new Decimal('83') }), tx);
    expect(tx.giftCardPurchase.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        baseBuyRatePercent: new Decimal('80'),
        buyAdjustmentPercent: new Decimal('3'),
        customerRatePercent: new Decimal('83'),
        customerPrice: new Decimal('83'),
      }),
    }));
  });
});
