import { AppModule } from '../app.module';
import { GiftCardOrdersController } from './gift-card-orders.controller';
import { GiftCardOrdersModule } from './gift-card-orders.module';

describe('GiftCardOrdersController', () => {
  it('registers the Orders module in the application', () => {
    expect(Reflect.getMetadata('imports', AppModule)).toContain(
      GiftCardOrdersModule,
    );
  });

  it('aggregates only the authenticated user purchases and sales', async () => {
    const purchase = { id: 'buy-1', status: 'SUCCESSFUL' };
    const sale = { id: 'sell-1', status: 'SUBMITTED' };
    const prisma = {
      giftCardPurchase: { findMany: jest.fn().mockResolvedValue([purchase]) },
      giftCardSale: { findMany: jest.fn().mockResolvedValue([sale]) },
    };
    const controller = new GiftCardOrdersController(prisma as never);

    const result = await controller.getUserOrders({
      user: { userId: 'authenticated-user' },
    });

    expect(prisma.giftCardPurchase.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'authenticated-user' } }),
    );
    const purchaseSelect =
      prisma.giftCardPurchase.findMany.mock.calls[0][0].select;
    expect(purchaseSelect).not.toHaveProperty('voucherCiphertext');
    expect(purchaseSelect).not.toHaveProperty('redeemDetails');
    expect(purchaseSelect).not.toHaveProperty('providerMetadata');
    expect(prisma.giftCardSale.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'authenticated-user' } }),
    );
    expect(result.items).toEqual([
      { ...purchase, transactionType: 'buy' },
      { ...sale, transactionType: 'sell' },
    ]);
    expect(result.purchases).toEqual([purchase]);
    expect(result.sales).toEqual([sale]);
  });
});
