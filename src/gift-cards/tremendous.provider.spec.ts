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

  it('preserves the PIN in redeemDetails while stripping the actual secret code from provider metadata', async () => {
    const client = {
      getProducts: jest.fn(),
      createOrder: jest.fn().mockResolvedValue({
        id: 'ORDER-2',
        status: 'DELIVERED',
        rewards: [{
          id: 'REWARD-2',
          code: 'SECRET-CODE',
          pin: '4826',
          amount: '25',
          redemption_instructions: 'Redeem online.',
        }],
      }),
      getOrder: jest.fn(),
    } as any;

    const result = await new TremendousProvider(client).purchase({
      productId: 'PRODUCT-1',
      amount: 25,
      currencyCode: 'USD',
      email: 'buyer@example.com',
      sender: 'Buyer',
      units: 1,
      reference: 'NC-BUY-2',
    });

    expect(result.voucherCode).toBe('SECRET-CODE');
    expect(result.redeemDetails).toMatchObject({ pin: '4826', redemption_instructions: 'Redeem online.' });
    expect(result.providerMetadata).not.toHaveProperty('rewards.0.code');
    expect(result.providerMetadata).not.toHaveProperty('rewards.0.pin');
  });

  it('generates a link from Tremendous response.reward.link without retaining it in purchase details', async () => {
    const link = 'https://testflight.tremendous.com/rewards/payout/secret-token';
    const client = {
      getProducts: jest.fn(),
      createOrder: jest.fn().mockResolvedValue({
        order: { id: 'ORDER-LINK', status: 'EXECUTED', rewards: [{
          id: 'REWARD-LINK',
          delivery: { method: 'LINK', status: 'SUCCEEDED', link },
        }] },
      }),
      getOrder: jest.fn(),
      generateRewardLink: jest.fn().mockResolvedValue({ reward: { id: 'REWARD-LINK', link } }),
    } as any;
    const provider = new TremendousProvider(client);
    const purchase = await provider.purchase({ productId: 'PRODUCT-1', amount: 25, currencyCode: 'USD', email: 'buyer@example.com', sender: 'Buyer', units: 1, reference: 'NC-BUY-LINK' });

    expect(purchase.redeemId).toBe('REWARD-LINK');
    expect(purchase.redeemDetails).toMatchObject({ delivery: { method: 'LINK' } });
    expect(JSON.stringify(purchase)).not.toContain(link);
    await expect(provider.generateRedemptionLink('REWARD-LINK')).resolves.toBe(link);
    expect(client.generateRewardLink).toHaveBeenCalledWith('REWARD-LINK');
  });

  it('rejects generated URLs outside Tremendous HTTPS origins', async () => {
    const client = {
      getProducts: jest.fn(),
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      generateRewardLink: jest.fn().mockResolvedValue({ reward: { link: 'https://evil.example/redeem' } }),
    } as any;
    await expect(new TremendousProvider(client).generateRedemptionLink('REWARD-LINK')).rejects.toThrow('TREMENDOUS_REDEMPTION_LINK_INVALID');
  });
});
