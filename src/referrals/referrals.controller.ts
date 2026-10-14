import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminUsersGuard } from '../users/admin-users.guard';
import { AdminReferralsQueryDto, ReferralReviewDto } from './referrals.dto';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
@UseGuards(AuthGuard)
export class ReferralsController {
  constructor(private readonly referrals: ReferralsService) {}

  @Get('me')
  getMyReferralSummary(@Req() request: { user: { userId: string } }) {
    return this.referrals.getCustomerSummary(request.user.userId);
  }
}

@Controller('admin/referrals')
@UseGuards(AuthGuard, AdminUsersGuard)
export class AdminReferralsController {
  constructor(private readonly referrals: ReferralsService) {}

  @Get()
  getReferrals(@Query() query: AdminReferralsQueryDto) {
    return this.referrals.getAdminReferrals(query);
  }

  @Get('stats')
  getStats() {
    return this.referrals.getAdminStats();
  }

  @Get(':id')
  getReferral(@Param('id') id: string) {
    return this.referrals.getAdminReferral(id);
  }

  @Patch(':id/review')
  reviewReferral(
    @Param('id') id: string,
    @Req() request: { user: { userId: string } },
    @Body() dto: ReferralReviewDto,
  ) {
    return this.referrals.reviewReferral(id, request.user.userId, dto);
  }
}
