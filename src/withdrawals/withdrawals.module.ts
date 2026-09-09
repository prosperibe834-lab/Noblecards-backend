import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CurrenciesModule } from '../currencies/currencies.module';
import { ExchangeRatesModule } from '../exchange-rates/exchange-rates.module';
import { PrismaModule } from '../prisma/prisma.module';
import { WalletsModule } from '../wallets/wallets.module';
import { UsersModule } from '../users/users.module';
import { BeneficiaryEncryptionService } from '../security/beneficiary-encryption.service';
import { WithdrawalsController } from './withdrawals.controller';
import { WithdrawalQuoteService } from './withdrawal-quote.service';
import { WithdrawalService } from './withdrawal.service';
import { FlutterwavePayoutAdapter } from './flutterwave-payout.adapter';
import { FlutterwavePayoutClient } from './flutterwave-payout.client';
import { WithdrawalPayoutController } from './withdrawal-payout.controller';
import { WithdrawalPayoutService } from './withdrawal-payout.service';
import { PAYOUT_PROVIDER_ADAPTER } from './payout-provider.interface';
import { BeneficiaryService } from './beneficiary.service';
import { WITHDRAWAL_PROVIDER } from './beneficiary-provider.interface';

@Module({
  imports: [AuthModule, CurrenciesModule, ExchangeRatesModule, PrismaModule, WalletsModule, UsersModule],
  controllers: [WithdrawalsController, WithdrawalPayoutController],
  providers: [
    WithdrawalQuoteService,
    WithdrawalService,
    WithdrawalPayoutService,
    BeneficiaryService,
    FlutterwavePayoutAdapter,
    FlutterwavePayoutClient,
    BeneficiaryEncryptionService,
    { provide: PAYOUT_PROVIDER_ADAPTER, useExisting: FlutterwavePayoutAdapter },
    { provide: WITHDRAWAL_PROVIDER, useExisting: FlutterwavePayoutAdapter },
  ],
  exports: [WithdrawalQuoteService, WithdrawalPayoutService],
})
export class WithdrawalsModule {}