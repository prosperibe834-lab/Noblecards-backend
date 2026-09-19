import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminSupportGuard } from './admin-support.guard';
import { AdminSupportController, SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [SupportController, AdminSupportController],
  providers: [SupportService, AdminSupportGuard],
  exports: [SupportService],
})
export class SupportModule {}
