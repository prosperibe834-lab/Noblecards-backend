import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { DepositsController } from './deposits.controller';
import { DepositsService } from './deposits.service';
import { WalletsModule } from '../wallets/wallets.module';
import { CurrenciesModule } from '../currencies/currencies.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { LedgerModule } from '../ledger/ledger.module';
import { FlutterwaveModule } from '../flutterwave/flutterwave.module';

@Module({
  imports: [AuthModule, EmailModule, UsersModule, WalletsModule, CurrenciesModule, TransactionsModule, LedgerModule, FlutterwaveModule],
  controllers: [DepositsController],
  providers: [DepositsService],
  exports: [DepositsService],
})
export class DepositsModule {}
