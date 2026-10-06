import { GiftCardsController } from './gift-cards.controller';

describe('GiftCardsController customer orders', () => {
  it('returns each authenticated user purchase and sale once with an explicit type', async () => {
    const purchase = { id: 'buy-db-id', reference: 'buy-provider-ref', status: 'SUCCESSFUL' };
    const sale = { id: 'sell-db-id', status: 'SUBMITTED' };
    const buyGiftCards = { getOrders: jest.fn().mockResolvedValue([purchase]) };
    const giftCards = { getUserSales: jest.fn().mockResolvedValue([sale]) };
    const controller = new GiftCardsController(giftCards as never, buyGiftCards as never);

    const result = await controller.getUserOrders({ user: { userId: 'user-1' } });

    expect(buyGiftCards.getOrders).toHaveBeenCalledWith('user-1');
    expect(giftCards.getUserSales).toHaveBeenCalledWith('user-1');
    expect(result.items).toEqual([
      { ...purchase, transactionType: 'buy' },
      { ...sale, transactionType: 'sell' },
    ]);
    expect(result.purchases).toEqual([purchase]);
    expect(result.sales).toEqual([sale]);
  });
});