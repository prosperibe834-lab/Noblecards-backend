import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GiftCardsController } from './gift-cards.controller';
import { AdminGiftCardsController } from './admin-gift-cards.controller';
import { AdminGiftCardsGuard } from './admin-gift-cards.guard';
import { GiftCardsService } from './gift-cards.service';
import { SogoClient } from './sogo.client';
import { BUY_GIFT_CARD_PROVIDER } from './buy-gift-card-provider.interface';
import { BuyGiftCardService } from './buy-gift-card.service';
import { TopupmateClient } from './topupmate.client';
import { TopupmateProvider } from './topupmate.provider';

@Module({
  imports: [AuthModule],
  controllers: [GiftCardsController, AdminGiftCardsController],
  providers: [
    GiftCardsService,
    SogoClient,
    AdminGiftCardsGuard,
    BuyGiftCardService,
    TopupmateClient,
    TopupmateProvider,
    { provide: BUY_GIFT_CARD_PROVIDER, useExisting: TopupmateProvider },
  ],
  exports: [GiftCardsService],
})
export class GiftCardsModule {}
