import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { DepositsService } from './deposits.service';
import { AdminDepositsGuard } from './admin-deposits.guard';

@Controller('admin/deposits')
@UseGuards(AuthGuard, AdminDepositsGuard)
export class AdminDepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Get()
  getDeposits() {
    return this.depositsService.getAdminDeposits();
  }
}