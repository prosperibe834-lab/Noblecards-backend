import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GiftCardsController } from './gift-cards.controller';
import { AdminGiftCardsController } from './admin-gift-cards.controller';
import { AdminGiftCardsGuard } from './admin-gift-cards.guard';
import { GiftCardsService } from './gift-cards.service';
import { SogoClient } from './sogo.client';

@Module({
  imports: [AuthModule],
  controllers: [GiftCardsController, AdminGiftCardsController],
  providers: [GiftCardsService, SogoClient, AdminGiftCardsGuard],
  exports: [GiftCardsService],
})
export class GiftCardsModule {}
