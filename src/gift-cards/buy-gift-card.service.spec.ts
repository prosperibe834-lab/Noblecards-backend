import { BuyGiftCardService } from './buy-gift-card.service';

describe('BuyGiftCardService', () => {
  it('filters normalized products for country, currency, and product', async () => {
    const provider = {
      getCatalog: jest.fn().mockResolvedValue([
        { provider: 'TOPUPMATE', providerProductId: 'us-amazon', productName: 'Amazon US', brandName: 'Amazon', countryCode: 'US', currency: 'USD' },
        { provider: 'TOPUPMATE', providerProductId: 'gb-amazon', productName: 'Amazon GB', brandName: 'Amazon', countryCode: 'GB', currency: 'GBP' },
      ]),
    } as any;
    const service = new BuyGiftCardService(provider);

    await expect(service.getCatalog({ countryCode: 'us', currency: 'usd', productName: 'amazon' })).resolves.toEqual({
      provider: 'TOPUPMATE',
      products: [expect.objectContaining({ providerProductId: 'us-amazon' })],
    });
    expect(provider.getCatalog).toHaveBeenCalledWith({ countryCode: 'us', currency: 'usd', productName: 'amazon' });
  });

  it('keeps purchase execution disabled during the catalog foundation phase', () => {
    expect(() => new BuyGiftCardService({} as any).assertPurchaseDisabled()).toThrow('purchase flow is not enabled yet');
  });
});
