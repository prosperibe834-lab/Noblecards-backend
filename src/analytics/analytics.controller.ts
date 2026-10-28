import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AnalyticsService, UserAnalyticsDto } from './analytics.service';

@Controller('analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async getAnalytics(
    @Req() request: { user: { userId: string } },
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<UserAnalyticsDto> {
    return this.analyticsService.getUserAnalytics(
      request.user.userId,
      period || '7D',
      startDate,
      endDate,
    );
  }

  @Get('me')
  async getMyAnalytics(
    @Req() request: { user: { userId: string } },
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<UserAnalyticsDto> {
    return this.analyticsService.getUserAnalytics(
      request.user.userId,
      period || '7D',
      startDate,
      endDate,
    );
  }
}
