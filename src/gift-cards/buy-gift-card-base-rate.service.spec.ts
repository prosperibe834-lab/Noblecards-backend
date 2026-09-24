import { Decimal } from '@prisma/client-runtime-utils';
import { BuyGiftCardBaseRateService } from './buy-gift-card-base-rate.service';

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

function row(overrides: Record<string, unknown> = {}) {
  return {
    id: 'base-rate-1', provider: 'TREMENDOUS', providerProductId: null, brandName: null,
    countryCode: null, currencyCode: null, minimumDenomination: null, maximumDenomination: null,
    ratePercent: new Decimal('80'), combinationKey: 'TREMENDOUS|*|*|*|*|*|*', isActive: true,
    createdAt: new Date(), updatedAt: new Date(), ...overrides,
  };
}

function makeService(rows: any[]) {
  const model = {
    findMany: jest.fn().mockResolvedValue(rows),
    findUnique: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(({ data }) => Promise.resolve(row(data))),
    update: jest.fn().mockImplementation(({ data }) => Promise.resolve(row(data))),
  };
  return { service: new BuyGiftCardBaseRateService({ giftCardBuyBaseRate: model } as any), model };
}

describe('BuyGiftCardBaseRateService', () => {
  it('persists a global base rate with normalized provider scope', async () => {
    const { service, model } = makeService([]);
    await service.create({ ratePercent: 80 });
    expect(model.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        provider: 'TREMENDOUS',
        ratePercent: new Decimal('80'),
        combinationKey: 'TREMENDOUS|*|*|*|*|*|*',
      }),
    }));
  });

  it('resolves product, then country/currency, then global scope', async () => {
    const global = row({ id: 'global', ratePercent: new Decimal('80') });
    const country = row({ id: 'country', countryCode: 'US', currencyCode: 'USD', ratePercent: new Decimal('81') });
    const productRate = row({ id: 'product', providerProductId: 'target-us', ratePercent: new Decimal('82') });
    const { service } = makeService([global, country, productRate]);

    await expect(service.resolve(product, 100)).resolves.toEqual(productRate);
  });

  it('falls back to the global rate when no narrower override matches', async () => {
    const global = row({ id: 'global', ratePercent: new Decimal('80') });
    const country = row({ id: 'country', countryCode: 'GB', currencyCode: 'GBP', ratePercent: new Decimal('82') });
    const { service } = makeService([global, country]);

    await expect(service.resolve(product, 100)).resolves.toEqual(global);
  });

  it('resets an override by deactivating it', async () => {
    const override = row({ id: 'override', countryCode: 'US', currencyCode: 'USD', ratePercent: new Decimal('81') });
    const { service, model } = makeService([override]);
    model.findUnique.mockResolvedValue(override);

    await service.reset(override.id);
    expect(model.update).toHaveBeenCalledWith({ where: { id: override.id }, data: { isActive: false } });
  });
});
