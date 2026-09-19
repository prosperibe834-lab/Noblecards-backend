import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminSupportGuard } from './admin-support.guard';
import { CreateSupportTicketDto, SendSupportMessageDto, SupportQueryDto, UpdateSupportTicketAssignmentDto, UpdateSupportTicketStatusDto } from './support.dto';
import { SupportService } from './support.service';

@Controller('support')
@UseGuards(AuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  async createTicket(@Req() request: { user: { userId: string } }, @Body() dto: CreateSupportTicketDto) {
    return this.supportService.createTicket(request.user.userId, dto);
  }

  @Get('tickets')
  async listUserTickets(@Req() request: { user: { userId: string } }) {
    return this.supportService.listUserTickets(request.user.userId);
  }

  @Get('tickets/:id')
  async getTicket(@Req() request: { user: { userId: string } }, @Param('id') id: string) {
    return this.supportService.getUserTicket(request.user.userId, id);
  }

  @Post('tickets/:id/messages')
  async addUserMessage(@Req() request: { user: { userId: string } }, @Param('id') id: string, @Body() dto: SendSupportMessageDto) {
    return this.supportService.addMessage(request.user.userId, id, dto);
  }
}

@Controller('admin/support')
@UseGuards(AuthGuard, AdminSupportGuard)
export class AdminSupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('tickets')
  async getTickets(@Query() query: SupportQueryDto) {
    return this.supportService.getAdminTickets(query as Record<string, string | undefined>);
  }

  @Get('tickets/:id')
  async getTicket(@Param('id') id: string) {
    return this.supportService.getAdminTicket(id);
  }

  @Patch('tickets/:id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateSupportTicketStatusDto) {
    return this.supportService.updateTicketStatus(id, dto);
  }

  @Patch('tickets/:id/assignment')
  async updateAssignment(@Param('id') id: string, @Body() dto: UpdateSupportTicketAssignmentDto) {
    return this.supportService.updateTicketAssignment(id, dto);
  }

  @Post('tickets/:id/messages')
  async addAdminReply(@Req() request: { user: { userId: string } }, @Param('id') id: string, @Body() dto: SendSupportMessageDto) {
    return this.supportService.addAdminReply(request.user.userId, id, dto);
  }
}
