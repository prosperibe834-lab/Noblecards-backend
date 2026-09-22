import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SupportService } from './support.service';

describe('SupportService phase-two behavior', () => {
  const ticket = {
    id: 'ticket-1',
    userId: 'user-1',
    subject: 'Help',
    category: 'GENERAL',
    status: 'OPEN',
    priority: 'MEDIUM',
    source: 'APP',
    createdAt: new Date('2026-09-19T10:00:00Z'),
    updatedAt: new Date('2026-09-19T10:00:00Z'),
    resolvedAt: null,
    lastMessageAt: new Date('2026-09-19T10:00:00Z'),
    userClearedAt: null,
    user: { id: 'user-1', firstName: 'Test', lastName: 'User', email: 'user@example.com' },
    assignedTo: null,
  };

  it('creates user and system messages in the same ticket transaction', async () => {
    const createdMessages: any[] = [];
    const prisma = {
      $transaction: jest.fn(async (callback) => callback({
        supportTicket: {
          create: jest.fn().mockResolvedValue(ticket),
          findUnique: jest.fn().mockResolvedValue({
            ...ticket,
            messages: createdMessages,
          }),
        },
        supportMessage: {
          create: jest.fn().mockImplementation(async ({ data }) => {
            createdMessages.push(data);
            return data;
          }),
        },
      })),
    } as any;

    const result = await new SupportService(prisma).createTicket('user-1', {
      subject: 'Help',
      category: 'GENERAL' as any,
      priority: 'MEDIUM' as any,
      message: 'I need help',
    });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(createdMessages).toEqual([
      expect.objectContaining({ senderType: 'USER', body: 'I need help', isInternal: false }),
      expect.objectContaining({ senderType: 'SYSTEM', isInternal: false }),
    ]);
    expect(result.messages).toHaveLength(2);
  });

  it('hides cleared and internal messages from the user but keeps them for admin', async () => {
    const clearedAt = new Date('2026-09-19T12:00:00Z');
    const messages = [
      { id: 'old', userId: 'user-1', senderType: 'USER', body: 'old', isInternal: false, createdAt: new Date('2026-09-19T11:00:00Z') },
      { id: 'note', userId: 'admin-1', senderType: 'ADMIN', body: 'note', isInternal: true, createdAt: new Date('2026-09-19T13:00:00Z') },
      { id: 'new', userId: 'user-1', senderType: 'USER', body: 'new', isInternal: false, createdAt: new Date('2026-09-19T14:00:00Z') },
    ];
    const prisma = {
      supportTicket: {
        findFirst: jest.fn().mockResolvedValue({ ...ticket, userClearedAt: clearedAt, messages }),
        findUnique: jest.fn().mockResolvedValue({ ...ticket, userClearedAt: clearedAt, messages }),
      },
    } as any;

    const service = new SupportService(prisma);
    const userResult = await service.getUserTicket('user-1', 'ticket-1');
    const adminResult = await service.getAdminTicket('ticket-1');

    expect(userResult.messages.map((message: any) => message.id)).toEqual(['new']);
    expect(adminResult.messages.map((message: any) => message.id)).toEqual(['old', 'note', 'new']);
  });

  it('clears only an owned ticket without deleting messages', async () => {
    const prisma = {
      supportTicket: {
        findFirst: jest.fn().mockResolvedValue({ id: 'ticket-1' }),
        update: jest.fn().mockResolvedValue({}),
      },
    } as any;

    const result = await new SupportService(prisma).clearUserTicket('user-1', 'ticket-1');

    expect(result.cleared).toBe(true);
    expect(prisma.supportTicket.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'ticket-1' },
      data: { userClearedAt: expect.any(Date) },
    }));
  });

  it('rejects clearing another user ticket', async () => {
    const prisma = { supportTicket: { findFirst: jest.fn().mockResolvedValue(null) } } as any;
    await expect(new SupportService(prisma).clearUserTicket('other-user', 'ticket-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates an attachment message using the authenticated user identity', async () => {
    const prisma = {
      supportTicket: { findFirst: jest.fn().mockResolvedValue({ id: 'ticket-1' }) },
      $transaction: jest.fn(async (callback) => callback({
        supportMessage: {
          create: jest.fn().mockResolvedValue({ id: 'message-1' }),
          findUnique: jest.fn().mockResolvedValue({
            id: 'message-1', ticketId: 'ticket-1', userId: 'user-1', senderType: 'USER',
            body: 'Attachment: image.png', isInternal: false, createdAt: new Date(),
            user: null,
            attachments: [{ id: 'attachment-1', fileName: 'generated.png', originalName: 'image.png', mimeType: 'image/png', sizeBytes: 10, publicUrl: '/uploads/support/generated.png', createdAt: new Date() }],
          }),
        },
        supportAttachment: { create: jest.fn().mockResolvedValue({}) },
        supportTicket: { update: jest.fn().mockResolvedValue({}) },
      })),
    } as any;

    const result = await new SupportService(prisma).addUserAttachment('user-1', 'ticket-1', {
      filename: 'generated.png', originalname: 'image.png', mimetype: 'image/png', size: 10,
    });

    expect(result.attachments[0].originalName).toBe('image.png');
    const tx = await prisma.$transaction.mock.results[0].value;
    expect(tx).toBeDefined();
  });

  it('rejects invalid location coordinates', async () => {
    const prisma = {
      supportTicket: { findFirst: jest.fn().mockResolvedValue({ id: 'ticket-1', status: 'OPEN' }) },
    } as any;

    await expect(new SupportService(prisma).addMessage('user-1', 'ticket-1', {
      latitude: 120,
      longitude: 10,
    })).rejects.toBeInstanceOf(BadRequestException);
  });
});
