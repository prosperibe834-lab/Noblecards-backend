import { BadRequestException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { BuyGiftCardRateService } from './buy-gift-card-rate.service';

const product = {
  provider: 'TREMENDOUS',
  providerProductId: 'target-us',
  productName: 'Target US',
  brandName: 'Target',
  country: 'United States',
  countryCode: 'US',
  currency: 'USD',
  denominationType: 'FIXED',
  minimumAmount: null,
  maximumAmount: null,
  denominations: ['100'],
  redemptionInstructions: null,
  status: 'ACTIVE',
  providerMetadata: {},
};

function makeAdjustment(overrides: Record<string, unknown> = {}) {
  return {
    id: 'buy-adjustment-1',
    providerProductId: null,
    brandName: null,
    countryCode: null,
    currencyCode: null,
    minimumDenomination: null,
    maximumDenomination: null,
    adjustmentPercent: new Decimal('3'),
    combinationKey: '*|*|*|*|*|*',
    isActive: true,
    createdAt: new Date('2026-09-24T12:00:00Z'),
    updatedAt: new Date('2026-09-24T12:00:00Z'),
    ...overrides,
  };
}

function makeService(rows: any[] = []) {
  const model = {
    findMany: jest.fn().mockResolvedValue(rows),
    findUnique: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(({ data }) => Promise.resolve(makeAdjustment(data))),
    update: jest.fn().mockImplementation(({ data }) => Promise.resolve(makeAdjustment(data))),
    delete: jest.fn().mockResolvedValue(undefined),
  };
  return { service: new BuyGiftCardRateService({ giftCardBuyRateAdjustment: model } as any), model };
}

describe('BuyGiftCardRateService', () => {
  it('persists a normalized product-scoped adjustment', async () => {
    const { service, model } = makeService();

    await service.create({
      providerProductId: 'target-us',
      brandName: 'Target',
      countryCode: 'us',
      currencyCode: 'usd',
      adjustmentPercent: 3,
    });

    expect(model.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        providerProductId: 'target-us',
        brandName: 'Target',
        countryCode: 'US',
        currencyCode: 'USD',
        adjustmentPercent: new Decimal('3'),
        combinationKey: 'target-us|target|US|USD|*|*',
      }),
    }));
  });

  it('resolves the most specific active adjustment before broader scopes', async () => {
    const broad = makeAdjustment({ id: 'broad', adjustmentPercent: new Decimal('2') });
    const productScope = makeAdjustment({ id: 'product', providerProductId: 'target-us', adjustmentPercent: new Decimal('4') });
    const exactRange = makeAdjustment({
      id: 'range', providerProductId: 'target-us', minimumDenomination: new Decimal('100'), maximumDenomination: new Decimal('100'), adjustmentPercent: new Decimal('6'),
    });
    const { service } = makeService([broad, productScope, exactRange]);

    await expect(service.resolve(product, 100)).resolves.toEqual(exactRange);
  });

  it('resets matching adjustments to zero without deleting them', async () => {
    const row = makeAdjustment({ providerProductId: 'target-us' });
    const { service, model } = makeService([row]);

    await expect(service.bulk({ providerProductId: 'target-us', adjustmentPercent: 0, reset: true })).resolves.toEqual({
      updated: 1,
      created: 0,
      totalAffected: 1,
    });
    expect(model.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: row.id },
      data: { adjustmentPercent: new Decimal('0') },
    }));
    expect(model.delete).not.toHaveBeenCalled();
  });

  it('resets one adjustment to the baseline without deleting the row', async () => {
    const row = makeAdjustment({ adjustmentPercent: new Decimal('8') });
    const { service, model } = makeService([row]);
    model.findUnique.mockResolvedValue(row);

    await service.reset(row.id);

    expect(model.update).toHaveBeenCalledWith({
      where: { id: row.id },
      data: { adjustmentPercent: new Decimal('0'), isActive: true },
    });
    expect(model.delete).not.toHaveBeenCalled();
  });

  it('rejects an inverted denomination range', async () => {
    const { service } = makeService();

    await expect(service.create({ minimumDenomination: 100, maximumDenomination: 10, adjustmentPercent: 3 })).rejects.toBeInstanceOf(BadRequestException);
  });
});
