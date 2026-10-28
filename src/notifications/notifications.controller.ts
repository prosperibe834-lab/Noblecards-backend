import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { NotificationsService } from './notifications.service';
import { UserNotificationsQueryDto } from './notifications.dto';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getMyNotifications(
    @Req() request: { user: { userId: string } },
    @Query() query: UserNotificationsQueryDto,
  ) {
    return this.notificationsService.getUserNotifications(
      request.user.userId,
      query,
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Req() request: { user: { userId: string } }) {
    return this.notificationsService.getUnreadCount(request.user.userId);
  }

  @Post('read-all')
  async markAllAsRead(@Req() request: { user: { userId: string } }) {
    return this.notificationsService.markAllAsRead(request.user.userId);
  }

  @Patch(':id/read')
  async toggleReadStatus(
    @Req() request: { user: { userId: string } },
    @Param('id') id: string,
    @Body('isRead') isRead?: boolean,
  ) {
    return this.notificationsService.toggleReadStatus(
      request.user.userId,
      id,
      isRead,
    );
  }

  @Patch(':id/pin')
  async togglePin(
    @Req() request: { user: { userId: string } },
    @Param('id') id: string,
  ) {
    return this.notificationsService.togglePin(request.user.userId, id);
  }
}
