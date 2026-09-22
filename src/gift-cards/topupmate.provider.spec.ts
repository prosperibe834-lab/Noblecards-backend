import { TopupmateProvider } from './topupmate.provider';

describe('TopupmateProvider', () => {
  it('normalizes provider products and preserves provider metadata', async () => {
    const client = {
      getAvailableGiftCards: jest.fn().mockResolvedValue({
        data: [{
          product: 'amazon-us',
          product_name: 'Amazon US',
          brand_name: 'Amazon',
          country: { code: 'US', name: 'United States' },
          currency: { code: 'USD' },
          denomination_type: 'range',
          min_amount: 10,
          max_amount: 500,
          amounts: [25, 50, 100],
          redeem_details: 'Redeem online',
          status: 'active',
        }],
      }),
    } as any;

    await expect(new TopupmateProvider(client).getCatalog({ countryCode: 'US' })).resolves.toEqual([expect.objectContaining({
      provider: 'TOPUPMATE',
      providerProductId: 'amazon-us',
      productName: 'Amazon US',
      brandName: 'Amazon',
      countryCode: 'US',
      currency: 'USD',
      minimumAmount: '10',
      maximumAmount: '500',
      denominations: ['25', '50', '100'],
      redemptionInstructions: 'Redeem online',
      providerMetadata: expect.objectContaining({ product: 'amazon-us' }),
    })]);
  });

  it('accepts a top-level product list response', async () => {
    const client = { getAvailableGiftCards: jest.fn().mockResolvedValue([{ id: 'p-1', name: 'Brand', countryCode: 'GB' }]) } as any;
    await expect(new TopupmateProvider(client).getCatalog({})).resolves.toEqual([
      expect.objectContaining({ providerProductId: 'p-1', countryCode: 'GB', productName: 'Brand' }),
    ]);
  });

  it('drops records that do not contain a provider product id and name', async () => {
    const client = { getAvailableGiftCards: jest.fn().mockResolvedValue({ data: [{ id: 'missing-name' }] }) } as any;
    await expect(new TopupmateProvider(client).getCatalog({})).resolves.toEqual([]);
  });
});
