import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminDashboardGuard } from '../dashboard/admin-dashboard.guard';
import { AdminTransactionsService } from './admin-transactions.service';

@Controller('admin/transactions')
@UseGuards(AuthGuard, AdminDashboardGuard)
export class AdminTransactionsController {
  constructor(private readonly transactions: AdminTransactionsService) {}

  @Get()
  getTransactions(@Query() query: Record<string, unknown>) {
    return this.transactions.getTransactions(query);
  }
}
