import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AdminDashboardGuard } from '../dashboard/admin-dashboard.guard';
import { ReportsService, ReportsResponseDto, ScheduleReportDto, ScheduledReportItem } from './reports.service';

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

  @Post('schedule')
  async scheduleReport(@Body() dto: ScheduleReportDto) {
    return this.reportsService.scheduleReport(dto);
  }

  @Get('schedules')
  async getScheduledReports(): Promise<ScheduledReportItem[]> {
    return this.reportsService.getScheduledReports();
  }

  @Delete('schedules/:id')
  async deleteScheduledReport(@Param('id') id: string) {
    return this.reportsService.deleteScheduledReport(id);
  }

  @Get('export')
  async exportCsv(
    @Query('dateRange') dateRange: string,
    @Query('reportType') reportType: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const csv = await this.reportsService.exportCsv(dateRange, reportType, startDate, endDate);
    const filename = `NobleCards_Report_${dateRange || '30days'}_${Date.now()}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  }
}
