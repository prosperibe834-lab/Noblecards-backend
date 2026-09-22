import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupportTicketDto, SendSupportMessageDto, SupportTicketPriorityDto, SupportTicketStatusDto, UpdateSupportTicketAssignmentDto, UpdateSupportTicketStatusDto } from './support.dto';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaAny() {
    return this.prisma as any;
  }

  async createTicket(userId: string, dto: CreateSupportTicketDto) {
    const subject = dto.subject.trim();
    const message = dto.message.trim();
    if (!subject || !message) {
      throw new BadRequestException('Subject and message are required.');
    }

    const ticket = await this.prismaAny.$transaction(async (tx: any) => {
      const createdTicket = await tx.supportTicket.create({
        data: {
          userId,
          subject,
          category: dto.category,
          priority: dto.priority ?? SupportTicketPriorityDto.MEDIUM,
          status: SupportTicketStatusDto.OPEN,
          source: 'APP',
        },
      });

      await tx.supportMessage.create({
        data: {
          ticketId: createdTicket.id,
          userId,
          senderType: 'USER',
          body: message,
          isInternal: false,
        },
      });

      await tx.supportMessage.create({
        data: {
          ticketId: createdTicket.id,
          senderType: 'SYSTEM',
          body: 'Thank you for contacting NobleCards Support. Your request has been received successfully. A support representative will review your message and get back to you as soon as possible.',
          isInternal: false,
        },
      });

      return tx.supportTicket.findUnique({
        where: { id: createdTicket.id },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              user: { select: { id: true, firstName: true, lastName: true, email: true } },
              attachments: true,
            },
          },
        },
      });
    });

    return this.serializeTicket(ticket);
  }

  async listUserTickets(userId: string) {
    const tickets = await this.prismaAny.supportTicket.findMany({
      where: { userId },
      orderBy: [{ lastMessageAt: 'desc' }, { updatedAt: 'desc' }],
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, attachments: true },
        },
      },
    });

    return tickets.map((ticket) => this.serializeTicket(ticket, true));
  }

  async getUserTicket(userId: string, ticketId: string) {
    const ticket = await this.prismaAny.supportTicket.findFirst({
      where: { id: ticketId, userId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, attachments: true },
        },
      },
    });

    if (!ticket) throw new NotFoundException('Support ticket not found.');
    return this.serializeTicket(ticket, true);
  }

  async addMessage(userId: string, ticketId: string, dto: SendSupportMessageDto) {
    const ticket = await this.prismaAny.supportTicket.findFirst({
      where: { id: ticketId, userId },
      select: { id: true, status: true },
    });
    if (!ticket) throw new NotFoundException('Support ticket not found.');

    const body = dto.message?.trim();
    const hasLocation = dto.latitude !== undefined || dto.longitude !== undefined;
    if (!body && !hasLocation) throw new BadRequestException('Message or location is required.');
    if (hasLocation && (dto.latitude === undefined || dto.longitude === undefined || dto.latitude < -90 || dto.latitude > 90 || dto.longitude < -180 || dto.longitude > 180)) {
      throw new BadRequestException('Valid latitude and longitude are required.');
    }

    const created = await this.prismaAny.supportMessage.create({
      data: {
        ticketId: ticket.id,
        userId,
        senderType: 'USER',
        body: body ?? `Location: ${dto.latitude}, ${dto.longitude}`,
        metadata: hasLocation ? { type: 'LOCATION', latitude: dto.latitude, longitude: dto.longitude } : undefined,
        isInternal: false,
      },
    });

    await this.prismaAny.supportTicket.update({
      where: { id: ticket.id },
      data: {
        status: SupportTicketStatusDto.OPEN,
        updatedAt: new Date(),
        lastMessageAt: new Date(),
      },
    });

    return created;
  }

  async clearUserTicket(userId: string, ticketId: string) {
    const ticket = await this.prismaAny.supportTicket.findFirst({ where: { id: ticketId, userId }, select: { id: true } });
    if (!ticket) throw new NotFoundException('Support ticket not found.');
    const userClearedAt = new Date();
    await this.prismaAny.supportTicket.update({ where: { id: ticket.id }, data: { userClearedAt } });
    return { cleared: true, userClearedAt };
  }

  async addUserAttachment(userId: string, ticketId: string, file: { filename: string; originalname: string; mimetype: string; size: number }) {
    const ticket = await this.prismaAny.supportTicket.findFirst({ where: { id: ticketId, userId }, select: { id: true } });
    if (!ticket) throw new NotFoundException('Support ticket not found.');

    const result = await this.prismaAny.$transaction(async (tx: any) => {
      const message = await tx.supportMessage.create({
        data: {
          ticketId: ticket.id,
          userId,
          senderType: 'USER',
          body: `Attachment: ${file.originalname}`,
          isInternal: false,
        },
      });
      await tx.supportAttachment.create({
        data: {
          messageId: message.id,
          uploadedByUserId: userId,
          fileName: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          storagePath: `uploads/support/${file.filename}`,
          publicUrl: `/uploads/support/${file.filename}`,
        },
      });
      await tx.supportTicket.update({ where: { id: ticket.id }, data: { updatedAt: new Date(), lastMessageAt: new Date(), status: 'OPEN' } });
      return tx.supportMessage.findUnique({ where: { id: message.id }, include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, attachments: true } });
    });
    return this.serializeMessage(result);
  }

  async getAdminTickets(query: Record<string, string | undefined> = {}) {
    const page = Math.max(Number(query.page ?? 1) || 1, 1);
    const pageSize = Math.min(Math.max(Number(query.pageSize ?? 20) || 20, 1), 100);
    const status = query.status && query.status !== 'All' ? query.status : undefined;
    const priority = query.priority && query.priority !== 'All' ? query.priority : undefined;
    const category = query.category && query.category !== 'All' ? query.category : undefined;
    const search = query.search?.trim();

    const where: Record<string, any> = {
      ...(status ? { status: status as any } : {}),
      ...(priority ? { priority: priority as any } : {}),
      ...(category ? { category: category as any } : {}),
      ...(search ? {
        OR: [
          { subject: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { user: { firstName: { contains: search, mode: 'insensitive' } } },
          { user: { lastName: { contains: search, mode: 'insensitive' } } },
        ],
      } : {}),
    };

    const [tickets, total] = await Promise.all([
      this.prismaAny.supportTicket.findMany({
        where,
        orderBy: [{ lastMessageAt: 'desc' }, { updatedAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, isActive: true } },
          assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 10,
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, attachments: true },
          },
        },
      }),
      this.prismaAny.supportTicket.count({ where }),
    ]);

    return {
      tickets: tickets.map((ticket) => ({
        ...this.serializeTicket(ticket),
        messageCount: ticket.messages.length,
      })),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
      stats: await this.getAdminTicketStats(),
    };
  }

  async getAdminTicket(id: string) {
    const ticket = await this.prismaAny.supportTicket.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, attachments: true },
        },
      },
    });

    if (!ticket) throw new NotFoundException('Support ticket not found.');
    return this.serializeTicket(ticket);
  }

  async updateTicketStatus(ticketId: string, dto: UpdateSupportTicketStatusDto) {
    const ticket = await this.prismaAny.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Support ticket not found.');

    const updated = await this.prismaAny.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: dto.status,
        priority: dto.priority ?? ticket.priority,
        resolvedAt: dto.status === 'RESOLVED' || dto.status === 'CLOSED' ? new Date() : null,
        updatedAt: new Date(),
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    return this.serializeTicket(updated);
  }

  async updateTicketAssignment(ticketId: string, dto: UpdateSupportTicketAssignmentDto) {
    const ticket = await this.prismaAny.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Support ticket not found.');

    const assignedToId = dto.assignedToId ?? null;
    if (assignedToId) {
      const admin = await this.prisma.user.findUnique({ where: { id: assignedToId }, select: { id: true, role: true, isActive: true } });
      if (!admin || !admin.isActive || admin.role !== 'ADMIN') {
        throw new BadRequestException('Assigned admin is invalid.');
      }
    }

    const updated = await this.prismaAny.supportTicket.update({
      where: { id: ticketId },
      data: { assignedToId, updatedAt: new Date() },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    return this.serializeTicket(updated);
  }

  async addAdminReply(adminUserId: string, ticketId: string, dto: SendSupportMessageDto) {
    const ticket = await this.prismaAny.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Support ticket not found.');

    const body = dto.message?.trim();
    if (!body) throw new BadRequestException('Message is required.');

    const created = await this.prismaAny.supportMessage.create({
      data: {
        ticketId,
        userId: adminUserId,
        senderType: 'ADMIN',
        body,
        isInternal: dto.isInternal ?? false,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    await this.prismaAny.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: 'IN_PROGRESS',
        updatedAt: new Date(),
        lastMessageAt: new Date(),
      },
    });

    return created;
  }

  private async getAdminTicketStats() {
    const [total, open, inProgress, pending, resolved] = await Promise.all([
      this.prismaAny.supportTicket.count(),
      this.prismaAny.supportTicket.count({ where: { status: 'OPEN' } }),
      this.prismaAny.supportTicket.count({ where: { status: 'IN_PROGRESS' } }),
      this.prismaAny.supportTicket.count({ where: { status: 'PENDING' } }),
      this.prismaAny.supportTicket.count({ where: { status: 'RESOLVED' } }),
    ]);

    return { total, open, inProgress, pending, resolved };
  }

  private serializeTicket(ticket: any, userView = false) {
    const messages = (ticket.messages ?? []).filter((message: any) => {
      if (!userView) return true;
      if (message.isInternal) return false;
      return !ticket.userClearedAt || message.createdAt > ticket.userClearedAt;
    });

    return {
      id: ticket.id,
      userId: ticket.userId,
      subject: ticket.subject,
      category: ticket.category,
      status: ticket.status,
      priority: ticket.priority,
      source: ticket.source,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      resolvedAt: ticket.resolvedAt,
      lastMessageAt: ticket.lastMessageAt,
      user: ticket.user ? {
        id: ticket.user.id,
        firstName: ticket.user.firstName,
        lastName: ticket.user.lastName,
        email: ticket.user.email,
      } : null,
      assignedTo: ticket.assignedTo ? {
        id: ticket.assignedTo.id,
        firstName: ticket.assignedTo.firstName,
        lastName: ticket.assignedTo.lastName,
        email: ticket.assignedTo.email,
      } : null,
      messages: messages.map((message: any) => this.serializeMessage(message)),
    };
  }

  private serializeMessage(message: any) {
    return {
        id: message.id,
        ticketId: message.ticketId,
        userId: message.userId,
        senderType: message.senderType,
        body: message.body,
        isInternal: message.isInternal,
        metadata: message.metadata ?? null,
        createdAt: message.createdAt,
        user: message.user ? {
          id: message.user.id,
          firstName: message.user.firstName,
          lastName: message.user.lastName,
          email: message.user.email,
        } : null,
        attachments: (message.attachments ?? []).map((attachment: any) => ({
          id: attachment.id,
          fileName: attachment.fileName,
          originalName: attachment.originalName,
          mimeType: attachment.mimeType,
          sizeBytes: attachment.sizeBytes,
          publicUrl: attachment.publicUrl,
          createdAt: attachment.createdAt,
        })),
    };
  }
}
