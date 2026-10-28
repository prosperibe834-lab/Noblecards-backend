import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminDashboardGuard } from '../dashboard/admin-dashboard.guard';
import { ReportsService, ReportsResponseDto } from './reports.service';

@Controller('admin/reports')
@UseGuards(AuthGuard, AdminDashboardGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getReports(
    @Query('dateRange') dateRange?: string,
    @Query('reportType') reportType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ReportsResponseDto> {
    return this.reportsService.getReports(dateRange, reportType, startDate, endDate);
  }
}
