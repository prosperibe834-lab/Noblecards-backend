import { BadRequestException } from '@nestjs/common';
import { AdminGiftCardSandboxService } from './admin-gift-card-sandbox.service';

const product = {
  provider: 'TREMENDOUS',
  providerProductId: 'PRODUCT-1',
  productName: 'Sandbox Brand',
  brandName: 'Sandbox Brand',
  country: 'US',
  countryCode: 'US',
  currency: 'USD',
  denominationType: 'FIXED',
  minimumAmount: null,
  maximumAmount: null,
  denominations: ['25'],
  redemptionInstructions: null,
  status: 'ACTIVE',
  providerMetadata: { skus: [{ min: 25, max: 25, currency_code: 'USD' }] },
};

describe('AdminGiftCardSandboxService', () => {
  const makeService = () => {
    const saved = new Map<string, any>();
    const prisma = {
      adminGiftCardSandboxTest: {
        findUnique: jest.fn(({ where }) => Promise.resolve(saved.get(where.idempotencyKey) ?? null)),
        create: jest.fn(({ data }) => {
          const value = { id: 'TEST-1', ...data, amount: { toString: () => String(data.amount) } };
          saved.set(data.idempotencyKey, value);
          return Promise.resolve(value);
        }),
        update: jest.fn(({ data }) => {
          const value = [...saved.values()][0];
          Object.assign(value, data);
          return Promise.resolve(value);
        }),
      },
      user: { findUnique: jest.fn().mockResolvedValue({ email: 'admin@example.com', firstName: 'Admin', lastName: 'User', displayName: null }) },
    };
    const provider = {
      getCatalog: jest.fn().mockResolvedValue([product]),
      purchase: jest.fn().mockResolvedValue({
        providerReference: 'ORDER-1',
        providerStatus: 'DELIVERED',
        providerMessage: null,
        redeemId: 'REWARD-1',
        voucherCode: 'SENSITIVE-CODE',
        redeemDetails: { code: 'SENSITIVE-CODE' },
        providerAmount: '25',
        providerMetadata: { rewards: [{ code: 'SENSITIVE-CODE' }] },
      }),
    };
    const encryption = { encrypt: jest.fn().mockReturnValue('encrypted-voucher') };
    return { service: new AdminGiftCardSandboxService(prisma as any, provider as any, encryption as any), prisma, provider, encryption };
  };

  it('validates the real catalog shape, purchases without wallet calls, and stores a safe result', async () => {
    const { service, prisma, provider, encryption } = makeService();
    const result = await service.purchase('admin-1', {
      productId: 'PRODUCT-1', amount: 25, currencyCode: 'USD', quantity: 1,
      recipientEmail: 'recipient@example.com', idempotencyKey: 'test-key-1',
    });

    expect(provider.getCatalog).toHaveBeenCalledWith({ productId: 'PRODUCT-1', currency: 'USD' });
    expect(provider.purchase).toHaveBeenCalledWith(expect.objectContaining({ reference: expect.stringMatching(/^NC-ADMIN-TREMENDOUS-/) }));
    expect(encryption.encrypt).toHaveBeenCalledWith({ code: 'SENSITIVE-CODE' });
    expect(result).toEqual(expect.objectContaining({ status: 'SUCCESSFUL', providerReference: 'ORDER-1', redeemId: 'REWARD-1' }));
    expect(result).not.toHaveProperty('voucherCode');
    expect(prisma.adminGiftCardSandboxTest.update).toHaveBeenCalled();
  });

  it('returns the persisted result for a repeated idempotency key without another provider order', async () => {
    const { service, provider } = makeService();
    const input = { productId: 'PRODUCT-1', amount: 25, currencyCode: 'USD', quantity: 1, recipientEmail: 'recipient@example.com', idempotencyKey: 'test-key-2' };
    await service.purchase('admin-1', input);
    await service.purchase('admin-1', input);
    expect(provider.purchase).toHaveBeenCalledTimes(1);
  });

  it('rejects an amount not returned by the catalog', async () => {
    const { service, provider } = makeService();
    await expect(service.purchase('admin-1', {
      productId: 'PRODUCT-1', amount: 10, currencyCode: 'USD', quantity: 1,
      recipientEmail: 'recipient@example.com', idempotencyKey: 'test-key-3',
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(provider.purchase).not.toHaveBeenCalled();
  });
});
