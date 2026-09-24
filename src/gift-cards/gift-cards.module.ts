import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WalletsModule } from '../wallets/wallets.module';
import { GiftCardsController } from './gift-cards.controller';
import { AdminGiftCardsController } from './admin-gift-cards.controller';
import { AdminGiftCardsGuard } from './admin-gift-cards.guard';
import { GiftCardsService } from './gift-cards.service';
import { SogoClient } from './sogo.client';
import { BUY_GIFT_CARD_PROVIDER } from './buy-gift-card-provider.interface';
import { BuyGiftCardService } from './buy-gift-card.service';
import { BuyGiftCardRateService } from './buy-gift-card-rate.service';
import { BuyGiftCardBaseRateService } from './buy-gift-card-base-rate.service';
import { TopupmateClient } from './topupmate.client';
import { TopupmateProvider } from './topupmate.provider';
import { TremendousClient } from './tremendous.client';
import { TremendousProvider } from './tremendous.provider';
import { BeneficiaryEncryptionService } from '../security/beneficiary-encryption.service';
import { AdminGiftCardSandboxService } from './admin-gift-card-sandbox.service';

@Module({
  imports: [AuthModule, WalletsModule],
  controllers: [GiftCardsController, AdminGiftCardsController],
  providers: [
    GiftCardsService,
    SogoClient,
    AdminGiftCardsGuard,
    BuyGiftCardService,
    BuyGiftCardRateService,
    BuyGiftCardBaseRateService,
    TopupmateClient,
    TopupmateProvider,
    TremendousClient,
    TremendousProvider,
    BeneficiaryEncryptionService,
    AdminGiftCardSandboxService,
    { provide: BUY_GIFT_CARD_PROVIDER, useExisting: TremendousProvider },
  ],
  exports: [GiftCardsService],
})
export class GiftCardsModule {}
