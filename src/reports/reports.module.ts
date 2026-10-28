import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminDashboardGuard } from '../dashboard/admin-dashboard.guard';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ReportsController],
  providers: [AdminDashboardGuard, ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
