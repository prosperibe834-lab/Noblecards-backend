import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WalletsModule } from '../wallets/wallets.module';
import { CurrenciesModule } from '../currencies/currencies.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { LedgerModule } from '../ledger/ledger.module';
import { FlutterwaveController } from './flutterwave.controller';
import { FlutterwaveService } from './flutterwave.service';
import { ReferralsModule } from '../referrals/referrals.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    PrismaModule,
    WalletsModule,
    CurrenciesModule,
    TransactionsModule,
    LedgerModule,
    ReferralsModule,
    EmailModule,
  ],
  controllers: [FlutterwaveController],
  providers: [FlutterwaveService],
  exports: [FlutterwaveService],
})
export class FlutterwaveModule {}
