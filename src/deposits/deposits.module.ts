import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DepositsController } from './deposits.controller';
import { AdminDepositsController } from './admin-deposits.controller';
import { AdminDepositsGuard } from './admin-deposits.guard';
import { DepositsService } from './deposits.service';
import { WalletsModule } from '../wallets/wallets.module';
import { CurrenciesModule } from '../currencies/currencies.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { LedgerModule } from '../ledger/ledger.module';
import { FlutterwaveModule } from '../flutterwave/flutterwave.module';
import { ExchangeRatesModule } from '../exchange-rates/exchange-rates.module';

@Module({
  imports: [AuthModule, EmailModule, UsersModule, PrismaModule, WalletsModule, CurrenciesModule, TransactionsModule, LedgerModule, FlutterwaveModule, ExchangeRatesModule],
  controllers: [DepositsController, AdminDepositsController],
  providers: [DepositsService, AdminDepositsGuard],
  exports: [DepositsService],
})
export class DepositsModule {}
