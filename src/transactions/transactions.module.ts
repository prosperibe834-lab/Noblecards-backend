import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminDashboardGuard } from '../dashboard/admin-dashboard.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminTransactionsController } from './admin-transactions.controller';
import { AdminTransactionsService } from './admin-transactions.service';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [AdminTransactionsController],
  providers: [
    TransactionsService,
    AdminTransactionsService,
    AdminDashboardGuard,
  ],
  exports: [TransactionsService, AdminTransactionsService],
})
export class TransactionsModule {}
