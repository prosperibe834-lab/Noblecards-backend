import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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

  @Patch(':id/notes')
  updateNotes(
    @Param('id') id: string,
    @Body() body: { notes: string },
  ) {
    return this.transactions.updateNotes(id, body?.notes ?? '');
  }

  @Post(':id/refund')
  issueRefund(
    @Param('id') id: string,
    @Body() body: { reason: string; customNotes?: string },
  ) {
    return this.transactions.issueRefund(id, body);
  }
}
