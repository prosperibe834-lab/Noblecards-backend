import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminWithdrawalsGuard } from './admin-withdrawals.guard';
import { AdminWithdrawalsService } from './admin-withdrawals.service';

@Controller('admin/withdrawals')
@UseGuards(AuthGuard, AdminWithdrawalsGuard)
export class AdminWithdrawalsController {
  constructor(private readonly withdrawals: AdminWithdrawalsService) {}

  @Get()
  getWithdrawals(@Query() query: Record<string, string | undefined>) {
    return this.withdrawals.getAdminWithdrawals(query);
  }

  @Get(':id')
  getWithdrawal(@Param('id') id: string) {
    return this.withdrawals.getAdminWithdrawal(id);
  }
}
