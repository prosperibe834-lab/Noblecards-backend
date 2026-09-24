import { TremendousProvider } from './tremendous.provider';

describe('TremendousProvider', () => {
  it('normalizes product countries, currencies, SKUs, and logo metadata', async () => {
    const client = {
      getProducts: jest.fn().mockResolvedValue({
        products: [{
          id: 'PRODUCT-1',
          name: 'Sandbox Brand US',
          currency_codes: ['USD'],
          category: 'merchant_card',
          subcategory: 'shopping',
          images: [{ type: 'logo', src: 'https://example.test/logo.png' }],
          countries: [{ abbr: 'US' }],
          skus: [{ min: 25, max: 25, currency_code: 'USD' }, { min: 50, max: 50, currency_code: 'USD' }],
          usage_instructions: 'Use online.',
        }],
      }),
    } as any;

    await expect(new TremendousProvider(client).getCatalog({ countryCode: 'US', currency: 'USD' })).resolves.toEqual([
      expect.objectContaining({
        provider: 'TREMENDOUS',
        providerProductId: 'PRODUCT-1',
        productName: 'Sandbox Brand US',
        countryCode: 'US',
        currency: 'USD',
        denominationType: 'FIXED',
        denominations: ['25', '50'],
        providerMetadata: expect.objectContaining({ logoUrl: 'https://example.test/logo.png' }),
      }),
    ]);
  });

  it('maps order and voucher responses without returning provider secrets', async () => {
    const client = {
      getProducts: jest.fn(),
      createOrder: jest.fn().mockResolvedValue({ id: 'ORDER-1', status: 'DELIVERED', rewards: [{ id: 'REWARD-1', code: 'SECRET-CODE', amount: '25' }] }),
      getOrder: jest.fn(),
    } as any;
    const result = await new TremendousProvider(client).purchase({ productId: 'PRODUCT-1', amount: 25, currencyCode: 'USD', email: 'buyer@example.com', sender: 'Buyer', units: 1, reference: 'NC-BUY-1' });
    expect(result).toEqual(expect.objectContaining({ providerReference: 'ORDER-1', providerStatus: 'DELIVERED', redeemId: 'REWARD-1', voucherCode: 'SECRET-CODE' }));
    expect(result.providerMetadata).not.toHaveProperty('rewards.0.code');
  });
});
