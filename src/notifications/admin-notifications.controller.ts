import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminUsersGuard } from '../users/admin-users.guard';
import { NotificationsService } from './notifications.service';
import {
  CreateBroadcastDto,
  AdminNotificationsQueryDto,
  ToggleTriggerDto,
} from './notifications.dto';

@Controller('admin/notifications')
@UseGuards(AuthGuard, AdminUsersGuard)
export class AdminNotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Query() query: AdminNotificationsQueryDto) {
    return this.notificationsService.getAdminNotifications(query);
  }

  @Get('audience-count')
  async getAudienceCount(
    @Query('audience') audience: string,
    @Query('country') country?: string,
  ) {
    return this.notificationsService.getAudienceCount(audience || 'Everyone', country);
  }

  @Post('broadcast')
  async createBroadcast(
    @Req() request: { user: { userId: string } },
    @Body() dto: CreateBroadcastDto,
  ) {
    return this.notificationsService.createBroadcast(dto, request.user?.userId);
  }

  @Get('triggers')
  async getTriggers() {
    return this.notificationsService.getAutomatedTriggers();
  }

  @Patch('triggers/:id')
  async toggleTrigger(
    @Param('id') id: string,
    @Body() dto: ToggleTriggerDto,
  ) {
    return this.notificationsService.toggleAutomatedTrigger(id, dto.active);
  }

  @Post('triggers/run/:type')
  async runTrigger(
    @Param('type') type: string,
    @Body('country') country?: string,
  ) {
    return this.notificationsService.runTriggerManually(type, country);
  }
}
