import { Decimal } from '@prisma/client-runtime-utils';
import { GiftCardSaleStatus, PaymentProvider } from '../generated/prisma';
import { GiftCardsService } from './gift-cards.service';

const dto = {
  slug: 'amazon',
  cardCountry: 'US',
  cardType: 'ecode',
  cardCurrency: 'USD',
  payoutCurrency: 'NGN',
  cardAmount: 100,
  additionalInfo: 'masked-test-reference',
  idempotencyKey: 'sale-key-1',
};

const makeSale = (overrides: Record<string, unknown> = {}) => ({
  id: 'sale-1',
  userId: 'user-1',
  provider: PaymentProvider.SOGO,
  providerTradeId: 'trade-1',
  providerStatus: 'submitted',
  status: GiftCardSaleStatus.SUBMITTED,
  idempotencyKey: 'sale-key-1',
  slug: 'amazon',
  brandNameSnapshot: 'Amazon',
  cardCountry: 'US',
  cardType: 'ecode',
  cardCurrency: 'USD',
  cardAmount: new Decimal('100.00'),
  providerRate: new Decimal('502'),
  adjustmentPercent: new Decimal('0'),
  quotedRate: new Decimal('502'),
  quotedPayoutAmount: new Decimal('50200'),
  quotedPayoutCurrency: 'NGN',
  finalPayoutAmount: null,
  payoutCurrency: null,
  createdAt: new Date('2026-09-15T12:00:00Z'),
  updatedAt: new Date('2026-09-15T12:00:00Z'),
  ...overrides,
});

describe('GiftCardsService', () => {
  function makeService(providerResponse: Record<string, unknown> = { message: 'submitted', trade_id: 'trade-1', status: 'submitted' }) {
    const prisma = {
      giftCardSale: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(makeSale()),
        update: jest.fn().mockResolvedValue(makeSale()),
      },
      giftCardSellRateAdjustment: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({
          id: 'adjustment-1', slug: 'amazon', cardCountry: 'US', cardCurrency: 'USD', payoutCurrency: 'NGN', cardType: 'ecode',
          receiptType: null, minimumDenomination: null, maximumDenomination: null, adjustmentPercent: new Decimal('5'), isActive: true,
        }),
        update: jest.fn().mockResolvedValue({
          id: 'adjustment-1', slug: 'amazon', cardCountry: 'US', cardCurrency: 'USD', payoutCurrency: 'NGN', cardType: 'ecode',
          receiptType: null, minimumDenomination: null, maximumDenomination: null, adjustmentPercent: new Decimal('0'), isActive: true,
        }),
      },
    } as any;
    const sogo = {
      getSellCatalog: jest.fn().mockResolvedValue({ data: ['amazon'] }),
      getSellRates: jest.fn().mockResolvedValue({
        amazon: { USD: { ecode: { NGN: 502 } } },
      }),
      submitSell: jest.fn().mockResolvedValue(providerResponse),
    } as any;
    return { service: new GiftCardsService(prisma, sogo), prisma, sogo };
  }

  it('delegates catalog and rates without exposing configuration', async () => {
    const { service, sogo } = makeService();

    await expect(service.getSellCatalog()).resolves.toEqual({ data: ['amazon'] });
    await expect(service.getSellRates()).resolves.toEqual({
      amazon: { USD: { ecode: { NGN: 502 } } },
    });
    expect(sogo.getSellCatalog).toHaveBeenCalledTimes(1);
    expect(sogo.getSellRates).toHaveBeenCalledTimes(1);
  });

  it('projects the real Sogo catalog separately from customer sales', async () => {
    const { service, prisma, sogo } = makeService();
    sogo.getSellCatalog.mockResolvedValue({ data: [{
      name: 'Amazon', slug: 'amazon', countries: [{ code: 'US', currency: 'USD', label: 'United States (USD)' }],
      card_types: ['physical', 'ecode'], sub_types: ['cash_receipt'], min_amount: 50, max_amount: 500,
    }] });
    sogo.getSellRates.mockResolvedValue({ data: [{
      slug: 'amazon', name: 'Amazon', rates: { USD: {
        physical: { NGN: { cash_receipt: 605 } },
        ecode: { NGN: 502 },
      } },
    }] });
    prisma.giftCardSellRateAdjustment.findMany.mockResolvedValue([]);

    await expect(service.getAdminCatalog()).resolves.toEqual(expect.objectContaining({
      source: 'sogo',
      brandCount: 1,
      catalog: expect.arrayContaining([
        expect.objectContaining({ brand: 'Amazon', cardType: 'ecode', providerRate: '502', finalRate: '502' }),
        expect.objectContaining({ brand: 'Amazon', cardType: 'physical', receiptType: 'cash_receipt', providerRate: '605' }),
      ]),
    }));
  });

  it('does not invent unsupported card types or receipt types from the Sogo catalog', async () => {
    const { service, prisma, sogo } = makeService();
    sogo.getSellCatalog.mockResolvedValue({ data: [{
      name: 'Apple/iTunes', slug: 'apple', countries: [{ code: 'US', currency: 'USD', label: 'United States (USD)' }],
      card_types: ['ecode'], min_amount: 10, max_amount: 500,
    }] });
    sogo.getSellRates.mockResolvedValue({ data: [{
      slug: 'apple', name: 'Apple/iTunes', rates: { USD: { ecode: { NGN: 450 } } },
    }] });
    prisma.giftCardSellRateAdjustment.findMany.mockResolvedValue([]);

    const result = await service.getAdminCatalog();

    expect(result.catalog).toEqual([
      expect.objectContaining({ brand: 'Apple/iTunes', cardType: 'ecode', receiptType: null }),
    ]);
  });

  it('projects physical-only brands with scalar rates instead of dropping them', async () => {
    const { service, prisma, sogo } = makeService();
    sogo.getSellCatalog.mockResolvedValue({ data: [
      ...['American Express', 'Vanilla', 'Visa'].map((name) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        countries: [{ code: 'US', currency: 'USD', label: 'United States (USD)' }],
        card_types: ['physical'],
        min_amount: 25,
        max_amount: 500,
      })),
    ] });
    sogo.getSellRates.mockResolvedValue({ data: [
      ...[
        ['american-express', 500],
        ['vanilla', 402],
        ['visa', 410],
      ].map(([slug, rate]) => ({ slug, rates: { USD: { physical: { NGN: rate, GHS: 4.1 } } } })),
    ] });
    prisma.giftCardSellRateAdjustment.findMany.mockResolvedValue([]);

    const result = await service.getAdminCatalog();

    expect(result.catalog).toEqual(expect.arrayContaining([
      expect.objectContaining({ brand: 'American Express', cardType: 'physical', payoutCurrency: 'NGN' }),
      expect.objectContaining({ brand: 'Vanilla', cardType: 'physical', payoutCurrency: 'NGN' }),
      expect.objectContaining({ brand: 'Visa', cardType: 'physical', payoutCurrency: 'NGN' }),
    ]));
    expect(result.projectionWarnings).toEqual([]);
  });

  it('resets matching existing adjustments to zero without creating zero-value records', async () => {
    const { service, prisma, sogo } = makeService();
    sogo.getSellCatalog.mockResolvedValue({ data: [{
      name: 'Amazon', slug: 'amazon', countries: [{ code: 'US', currency: 'USD', label: 'United States (USD)' }],
      card_types: ['ecode'], min_amount: 10, max_amount: 500,
    }] });
    sogo.getSellRates.mockResolvedValue({ data: [{
      slug: 'amazon', name: 'Amazon', rates: { USD: { ecode: { NGN: 502 } } },
    }] });
    prisma.giftCardSellRateAdjustment.findMany.mockResolvedValue([{
      id: 'adjustment-1', slug: 'amazon', cardCountry: 'US', cardCurrency: 'USD', payoutCurrency: 'NGN', cardType: 'ecode',
      receiptType: null, minimumDenomination: null, maximumDenomination: null, adjustmentPercent: new Decimal('5'), isActive: true,
    }]);

    await expect(service.bulkRateAdjustment({ adjustmentPercent: 0, reset: true } as any)).resolves.toEqual(expect.objectContaining({
      updated: 1,
      created: 0,
      totalAffected: 1,
    }));
    expect(prisma.giftCardSellRateAdjustment.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'adjustment-1' },
      data: { adjustmentPercent: new Decimal('0') },
    }));
    expect(prisma.giftCardSellRateAdjustment.create).not.toHaveBeenCalled();
  });

  it('persists a submitted Sogo trade without creating a transaction or crediting a wallet', async () => {
    const { service, prisma, sogo } = makeService({
      message: 'Your gift card trade has been submitted. Our team will review it shortly.',
      trade_id: 'trade-1',
      status: 'submitted',
    });
    prisma.giftCardSale.create.mockResolvedValue(makeSale({ status: GiftCardSaleStatus.UNDER_REVIEW }));
    prisma.giftCardSale.update.mockResolvedValue(makeSale({ status: GiftCardSaleStatus.UNDER_REVIEW }));

    const result = await service.submitSell('user-1', {
      ...dto,
      additionalInfo: JSON.stringify({ cards: [{ amount: 100, code: 'masked-test-reference' }] }),
    });

    expect(sogo.submitSell).toHaveBeenCalledWith(expect.objectContaining({
      slug: 'amazon',
      card_country: 'US',
      card_type: 'ecode',
      card_currency: 'USD',
      card_amount: 100,
      additional_info: 'masked-test-reference',
      idempotencyKey: 'sale-key-1',
    }));
    expect(prisma.giftCardSale.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        userId: 'user-1',
        provider: PaymentProvider.SOGO,
        idempotencyKey: 'sale-key-1',
        status: GiftCardSaleStatus.SUBMITTED,
        quotedRate: new Decimal('502'),
        providerRate: new Decimal('502'),
        adjustmentPercent: new Decimal('0'),
        quotedPayoutAmount: new Decimal('50200'),
        quotedPayoutCurrency: 'NGN',
      }),
    }));
    expect(prisma.giftCardSale.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        providerTradeId: 'trade-1',
        status: GiftCardSaleStatus.UNDER_REVIEW,
      }),
    }));
    expect(result).toEqual(expect.objectContaining({
      id: 'sale-1',
      status: GiftCardSaleStatus.UNDER_REVIEW,
      providerTradeId: 'trade-1',
    }));
    expect(JSON.stringify(result)).not.toContain('sandbox-secret');
  });

  it('maps a provider under-review response without crediting funds', async () => {
    const { service, prisma } = makeService({
      message: 'Trade is under review',
      trade_id: 'trade-review-1',
      status: 'under_review',
    });
    prisma.giftCardSale.create.mockResolvedValue(makeSale({
      providerTradeId: 'trade-review-1',
      providerStatus: 'under_review',
      status: GiftCardSaleStatus.UNDER_REVIEW,
    }));
    prisma.giftCardSale.update.mockResolvedValue(makeSale({
      providerTradeId: 'trade-review-1',
      providerStatus: 'under_review',
      status: GiftCardSaleStatus.UNDER_REVIEW,
    }));

    await expect(service.submitSell('user-1', dto)).resolves.toEqual(expect.objectContaining({
      status: GiftCardSaleStatus.UNDER_REVIEW,
    }));
    expect(prisma.giftCardSale.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: GiftCardSaleStatus.SUBMITTED }),
    }));
    expect(prisma.giftCardSale.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: GiftCardSaleStatus.UNDER_REVIEW }),
    }));
  });

  it('applies an active positive adjustment after selecting the Sogo provider rate', async () => {
    const { service, prisma } = makeService();
    prisma.giftCardSellRateAdjustment.findMany.mockResolvedValue([
      {
        slug: 'amazon', cardCountry: 'US', cardCurrency: 'USD', payoutCurrency: 'NGN', cardType: 'ecode',
        receiptType: null, minimumDenomination: null, maximumDenomination: null,
        adjustmentPercent: new Decimal('5'), isActive: true,
      },
    ]);

    await service.submitSell('user-1', dto);

    expect(prisma.giftCardSale.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        providerRate: new Decimal('502'),
        adjustmentPercent: new Decimal('5'),
        quotedRate: new Decimal('527.1'),
        quotedPayoutAmount: new Decimal('52710'),
      }),
    }));
  });

  it('applies an active negative adjustment without changing the provider snapshot', async () => {
    const { service, prisma } = makeService();
    prisma.giftCardSellRateAdjustment.findMany.mockResolvedValue([
      {
        slug: 'amazon', cardCountry: 'US', cardCurrency: 'USD', payoutCurrency: 'NGN', cardType: 'ecode',
        receiptType: null, minimumDenomination: null, maximumDenomination: null,
        adjustmentPercent: new Decimal('-5'), isActive: true,
      },
    ]);

    await service.submitSell('user-1', dto);

    expect(prisma.giftCardSale.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        providerRate: new Decimal('502'),
        adjustmentPercent: new Decimal('-5'),
        quotedRate: new Decimal('476.9'),
        quotedPayoutAmount: new Decimal('47690'),
      }),
    }));
  });

  it('rejects invalid denomination ranges and duplicate configurations', async () => {
    const { service, prisma } = makeService();
    await expect(service.createRateAdjustment({ ...dto, minimumDenomination: 100, maximumDenomination: 50, adjustmentPercent: 5 } as any)).rejects.toThrow(/minimum denomination/i);

    prisma.giftCardSellRateAdjustment.create.mockRejectedValue({ code: 'P2002' });
    await expect(service.createRateAdjustment({ ...dto, adjustmentPercent: 5 } as any)).rejects.toThrow(/already exists/i);
  });

  it('returns the existing sale and does not submit twice for a duplicate idempotency key', async () => {
    const { service, prisma, sogo } = makeService();
    prisma.giftCardSale.findUnique.mockResolvedValue(makeSale());

    await expect(service.submitSell('user-1', dto)).resolves.toEqual(expect.objectContaining({ id: 'sale-1' }));
    expect(sogo.submitSell).not.toHaveBeenCalled();
    expect(prisma.giftCardSale.create).not.toHaveBeenCalled();
  });

  it('rejects reuse of an idempotency key by another user', async () => {
    const { service, prisma } = makeService();
    prisma.giftCardSale.findUnique.mockResolvedValue(makeSale({ userId: 'other-user' }));

    await expect(service.submitSell('user-1', dto)).rejects.toThrow(/another user/i);
  });

  it.each([
    ['rejected', GiftCardSaleStatus.REJECTED],
    ['failed', GiftCardSaleStatus.FAILED],
    ['cancelled', GiftCardSaleStatus.CANCELLED],
  ])('maps documented terminal provider status %s', async (providerStatus, internalStatus) => {
    const { service, prisma } = makeService({ trade_id: 'trade-terminal', status: providerStatus });
    prisma.giftCardSale.create.mockResolvedValue(makeSale({ providerTradeId: 'trade-terminal', providerStatus, status: internalStatus }));
    prisma.giftCardSale.update.mockResolvedValue(makeSale({ providerTradeId: 'trade-terminal', providerStatus, status: internalStatus }));

    await expect(service.submitSell('user-1', dto)).resolves.toEqual(expect.objectContaining({ status: internalStatus }));
  });

  it('returns the created sale when Sogo rejects so the client can show the failed result', async () => {
    const { service, prisma, sogo } = makeService();
    const providerError = {
      message: 'The redemption code provided does not appear to be valid.',
      providerStatus: 422,
    };
    sogo.submitSell.mockRejectedValue({ getResponse: () => providerError });
    prisma.giftCardSale.update.mockResolvedValue(makeSale({
      status: GiftCardSaleStatus.FAILED,
      providerStatus: 'REQUEST_FAILED',
      providerResponse: providerError,
    }));

    await expect(service.submitSell('user-1', dto)).resolves.toEqual(expect.objectContaining({
      id: 'sale-1',
      status: GiftCardSaleStatus.FAILED,
      providerMessage: providerError.message,
    }));
    expect(prisma.giftCardSale.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        status: GiftCardSaleStatus.FAILED,
        providerResponse: providerError,
      }),
    }));
  });
});
