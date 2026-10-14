import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import {
  ReferralsController,
  AdminReferralsController,
} from './referrals.controller';
import { ReferralsService } from './referrals.service';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, ConfigModule],
  controllers: [ReferralsController, AdminReferralsController],
  providers: [ReferralsService],
  exports: [ReferralsService],
})
export class ReferralsModule {}
