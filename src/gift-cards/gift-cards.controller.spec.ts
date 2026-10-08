import { RequestMethod } from '@nestjs/common';
import {
  GUARDS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { AppModule } from '../app.module';
import { AuthGuard } from '../auth/auth.guard';
import { GiftCardsModule } from './gift-cards.module';
import { GiftCardOrdersModule } from './gift-card-orders.module';
import { GiftCardOrdersController } from './gift-card-orders.controller';
import { GiftCardsController } from './gift-cards.controller';

describe('GiftCardsController route registration', () => {
  it('registers both GiftCards and the dedicated Orders modules in AppModule', () => {
    expect(Reflect.getMetadata('imports', AppModule)).toContain(GiftCardOrdersModule);
    expect(Reflect.getMetadata('imports', AppModule)).toContain(GiftCardsModule);
  });

  it('maps authenticated GET /gift-cards/buy/:id to the existing purchase handler', async () => {
    const purchase = { id: 'buy-db-id', status: 'SUCCESSFUL' };
    const getPurchase = jest.fn().mockResolvedValue(purchase);
    const buyGiftCards = { getPurchase };
    const controller = new GiftCardsController({} as never, buyGiftCards as never);
    const handler = Object.getOwnPropertyDescriptor(
      GiftCardsController.prototype,
      'getPurchase',
    )?.value;

    expect(Reflect.getMetadata(PATH_METADATA, GiftCardsController)).toBe(
      'gift-cards',
    );
    expect(Reflect.getMetadata(PATH_METADATA, handler)).toBe('buy/:id');
    expect(Reflect.getMetadata(METHOD_METADATA, handler)).toBe(
      RequestMethod.GET,
    );
    expect(Reflect.getMetadata(GUARDS_METADATA, GiftCardsController)).toContain(
      AuthGuard,
    );

    await expect(
      controller.getPurchase({ user: { userId: 'user-1' } }, 'buy-db-id'),
    ).resolves.toBe(purchase);
    expect(getPurchase).toHaveBeenCalledWith('user-1', 'buy-db-id');
  });

  it('keeps the dedicated Orders module as the only GET /gift-cards/orders route', () => {
    const ordersHandler = Object.getOwnPropertyDescriptor(
      GiftCardOrdersController.prototype,
      'getUserOrders',
    )?.value;

    expect(Reflect.getMetadata(PATH_METADATA, ordersHandler)).toBe('orders');
    expect(Reflect.getMetadata(METHOD_METADATA, ordersHandler)).toBe(
      RequestMethod.GET,
    );
    expect('getUserOrders' in GiftCardsController.prototype).toBe(false);
  });
});