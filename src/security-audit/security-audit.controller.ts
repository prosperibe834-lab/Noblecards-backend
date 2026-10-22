import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AdminDashboardGuard } from '../dashboard/admin-dashboard.guard';
import { SecurityAuditService } from './security-audit.service';

@Controller('admin/security-logs')
@UseGuards(AuthGuard, AdminDashboardGuard)
export class SecurityAuditController {
  constructor(private readonly audit: SecurityAuditService) {}

  @Get('options')
  getFilterOptions() {
    return this.audit.getFilterOptions();
  }

  @Get('statistics')
  getStatistics(@Query() filters: Record<string, unknown>) {
    return this.audit.getStatistics(filters);
  }

  @Get('alerts')
  getAlerts(@Query() filters: Record<string, unknown>) {
    return this.audit.getAlerts(filters);
  }

  @Get('export')
  async exportCsv(
    @Query() filters: Record<string, unknown>,
    @Res() response: Response,
  ) {
    const csv = await this.audit.exportCsv(filters);
    response
      .status(200)
      .type('text/csv')
      .setHeader(
        'Content-Disposition',
        'attachment; filename="noblecards-security-audit.csv"',
      )
      .send(csv);
  }

  @Get(':id')
  getDetails(@Param('id') id: string) {
    return this.audit.getDetails(id);
  }

  @Get()
  getLogs(@Query() filters: Record<string, unknown>) {
    return this.audit.getLogs(filters);
  }
}
