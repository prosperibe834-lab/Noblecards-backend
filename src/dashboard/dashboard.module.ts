import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FlutterwaveModule } from '../flutterwave/flutterwave.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminDashboardGuard } from './admin-dashboard.guard';
import { DashboardAnalyticsService } from './dashboard-analytics.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [AuthModule, FlutterwaveModule, PrismaModule],
  controllers: [DashboardController],
  providers: [AdminDashboardGuard, DashboardAnalyticsService],
})
export class DashboardModule {}
