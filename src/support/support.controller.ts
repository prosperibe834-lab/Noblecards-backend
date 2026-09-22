import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { AuthGuard } from '../auth/auth.guard';
import { AdminSupportGuard } from './admin-support.guard';
import { CreateSupportTicketDto, SendSupportMessageDto, SupportQueryDto, UpdateSupportTicketAssignmentDto, UpdateSupportTicketStatusDto } from './support.dto';
import { SupportService } from './support.service';

const supportUploadDirectory = join(process.cwd(), 'uploads', 'support');
mkdirSync(supportUploadDirectory, { recursive: true });

const supportedAttachmentTypes = [
  'image/jpeg', 'image/png', 'image/webp',
  'application/pdf', 'text/plain',
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm',
];

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

  @Patch('tickets/:id/clear')
  async clearTicket(@Req() request: { user: { userId: string } }, @Param('id') id: string) {
    return this.supportService.clearUserTicket(request.user.userId, id);
  }

  @Post('tickets/:id/attachments')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: supportUploadDirectory,
      filename: (_request, file, callback) => {
        const extension = file.mimetype.split('/')[1]?.replace(/[^a-z0-9]/gi, '') || 'bin';
        callback(null, `${randomBytes(24).toString('hex')}.${extension}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => callback(null, supportedAttachmentTypes.includes(file.mimetype)),
  }))
  async uploadAttachment(
    @Req() request: { user: { userId: string } },
    @Param('id') id: string,
    @UploadedFile() file?: { filename: string; originalname: string; mimetype: string; size: number },
  ) {
    if (!file) throw new BadRequestException('A supported image, document, or audio file under 10MB is required.');
    return this.supportService.addUserAttachment(request.user.userId, id, file);
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
