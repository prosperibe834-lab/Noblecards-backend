import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminDashboardGuard } from './admin-dashboard.guard';
import { DashboardAnalyticsService } from './dashboard-analytics.service';

@Controller('admin/dashboard')
@UseGuards(AuthGuard, AdminDashboardGuard)
export class DashboardController {
  constructor(private readonly analytics: DashboardAnalyticsService) {}

  @Get('analytics')
  getAnalytics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analytics.getAnalytics(startDate, endDate);
  }
}
