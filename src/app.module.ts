import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
import { DepositsModule } from './deposits/deposits.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { TransactionsModule } from './transactions/transactions.module';
import { LedgerModule } from './ledger/ledger.module';
import { FlutterwaveModule } from './flutterwave/flutterwave.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [resolve(process.cwd(), '.env'), resolve(process.cwd(), 'noble_cards_backend', '.env')],
  }), PrismaModule, EmailModule, UsersModule, AuthModule, WalletsModule, CurrenciesModule, TransactionsModule, LedgerModule, DepositsModule, FlutterwaveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}