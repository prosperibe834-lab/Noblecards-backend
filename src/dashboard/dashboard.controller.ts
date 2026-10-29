import { Controller, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminDashboardGuard } from './admin-dashboard.guard';
import { DashboardAnalyticsService } from './dashboard-analytics.service';

@Controller('admin/dashboard')
@UseGuards(AuthGuard, AdminDashboardGuard)
export class DashboardController {
  constructor(private readonly analytics: DashboardAnalyticsService) {}

  @Get('data')
  getDashboardData(
    @Req() request: { user?: { userId: string } },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analytics.getDashboardData(request.user?.userId, startDate, endDate);
  }

  @Get('notifications')
  getNotifications(@Req() request: { user?: { userId: string } }) {
    return this.analytics.getAdminNotificationFeed(request.user?.userId);
  }

  @Patch('notifications/:id/read')
  markNotificationAsRead(
    @Req() request: { user?: { userId: string } },
    @Param('id') id: string,
  ) {
    return this.analytics.markNotificationAsRead(id, request.user?.userId);
  }

  @Get('analytics')
  getAnalytics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analytics.getAnalytics(startDate, endDate);
  }
}
