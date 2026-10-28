import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let emailService: jest.Mocked<EmailService>;
  let prismaService: any;

  const mockUsers = [
    { id: 'user-1', email: 'user1@example.com', firstName: 'Alice', country: 'Nigeria', isActive: true },
    { id: 'user-2', email: 'user2@example.com', firstName: 'Bob', country: 'Ghana', isActive: true },
  ];

  let broadcastsDb: any[] = [];
  let notificationsDb: any[] = [];
  let triggersDb: any[] = [];

  beforeEach(async () => {
    broadcastsDb = [
      {
        id: 'NT-004829',
        type: 'Promotion',
        title: 'Weekend Flash Sale!',
        message: 'Get 5% cashback',
        audience: 'Nigeria, Ghana',
        channels: ['Push', 'Email'],
        status: 'Sent',
        delivered: '99%',
        read: '65%',
        createdBy: 'Admin',
        sentDate: new Date('2026-08-12T10:00:00.000Z'),
        createdAt: new Date('2026-08-12T10:00:00.000Z'),
      },
    ];

    notificationsDb = [];
    triggersDb = [
      { id: 'TR-1001', label: 'Large Deposit Alert', group: 'Transactions', active: true },
      { id: 'TR-1002', label: 'Low Balance Reminder', group: 'Transactions', active: false },
    ];

    emailService = {
      sendBroadcastEmail: jest.fn().mockResolvedValue(undefined),
    } as any;

    prismaService = {
      user: {
        findMany: jest.fn().mockImplementation(async (args) => {
          if (args?.where?.country?.equals) {
            return mockUsers.filter(
              (u) => u.country.toLowerCase() === args.where.country.equals.toLowerCase(),
            );
          }
          return mockUsers;
        }),
        findUnique: jest.fn().mockResolvedValue({ id: 'admin-1', firstName: 'Admin', lastName: 'User' }),
        count: jest.fn().mockResolvedValue(mockUsers.length),
      },
      deposit: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      notificationBroadcast: {
        findMany: jest.fn().mockImplementation(async (args) => {
          let list = [...broadcastsDb];
          if (args?.where?.type?.equals) {
            list = list.filter(
              (b) => b.type.toLowerCase() === args.where.type.equals.toLowerCase(),
            );
          }
          if (args?.where?.OR) {
            const q = args.where.OR[0].id.contains.toLowerCase();
            list = list.filter((b) => b.title.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
          }
          return list;
        }),
        count: jest.fn().mockImplementation(async (args) => {
          if (args?.where?.status === 'Scheduled') {
            return broadcastsDb.filter((b) => b.status === 'Scheduled').length;
          }
          return broadcastsDb.length;
        }),
        findFirst: jest.fn().mockImplementation(async () => broadcastsDb[0]),
        create: jest.fn().mockImplementation(async ({ data }) => {
          const item = { ...data, createdAt: new Date() };
          broadcastsDb.unshift(item);
          return item;
        }),
      },
      notificationTrigger: {
        findMany: jest.fn().mockImplementation(async () => [...triggersDb]),
        count: jest.fn().mockImplementation(async () => triggersDb.length),
        findUnique: jest.fn().mockImplementation(async ({ where }) =>
          triggersDb.find((t) => t.id === where.id),
        ),
        update: jest.fn().mockImplementation(async ({ where, data }) => {
          const item = triggersDb.find((t) => t.id === where.id);
          if (item) Object.assign(item, data);
          return item;
        }),
        create: jest.fn().mockImplementation(async ({ data }) => {
          triggersDb.push(data);
          return data;
        }),
      },
      notification: {
        findMany: jest.fn().mockImplementation(async (args) => {
          let list = notificationsDb.filter((n) => n.userId === args.where.userId);
          if (args?.where?.category?.equals) {
            list = list.filter(
              (n) => n.category.toLowerCase() === args.where.category.equals.toLowerCase(),
            );
          }
          return list;
        }),
        count: jest.fn().mockImplementation(async (args) => {
          return notificationsDb.filter(
            (n) =>
              n.userId === args.where.userId &&
              (args.where.isRead !== undefined ? n.isRead === args.where.isRead : true),
          ).length;
        }),
        findFirst: jest.fn().mockImplementation(async ({ where }) =>
          notificationsDb.find((n) => n.id === where.id && n.userId === where.userId),
        ),
        createMany: jest.fn().mockImplementation(async ({ data }) => {
          for (const d of data) {
            notificationsDb.unshift({
              id: `notif-${Date.now()}-${Math.random()}`,
              ...d,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
          return { count: data.length };
        }),
        updateMany: jest.fn().mockImplementation(async ({ where, data }) => {
          let count = 0;
          for (const n of notificationsDb) {
            if (n.userId === where.userId) {
              Object.assign(n, data);
              count++;
            }
          }
          return { count };
        }),
        update: jest.fn().mockImplementation(async ({ where, data }) => {
          const item = notificationsDb.find((n) => n.id === where.id);
          if (item) Object.assign(item, data);
          return item;
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: prismaService },
        { provide: EmailService, useValue: emailService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('Admin Notifications & History', () => {
    it('should return paginated admin broadcasts with stats', async () => {
      const result = await service.getAdminNotifications({ page: 1, limit: 5 });
      expect(result).toBeDefined();
      expect(result.notifications.length).toBeLessThanOrEqual(5);
      expect(result.stats).toBeDefined();
      expect(result.stats.totalSent).toBeGreaterThan(0);
      expect(result.pagination.totalItems).toBeGreaterThan(0);
    });

    it('should filter admin broadcasts by type', async () => {
      const result = await service.getAdminNotifications({ type: 'Promotion' });
      expect(result.notifications.every((n) => n.type.toLowerCase() === 'promotion')).toBe(true);
    });

    it('should filter admin broadcasts by search term', async () => {
      const result = await service.getAdminNotifications({ search: 'Flash Sale' });
      expect(result.notifications.length).toBeGreaterThan(0);
      expect(result.notifications[0].title).toContain('Flash Sale');
    });

    it('should return audience count for target audience', async () => {
      const res = await service.getAudienceCount('Nigeria');
      expect(res.count).toBeDefined();
    });
  });

  describe('Manual Broadcast (Gmail & In-App)', () => {
    it('should push manual broadcast to both Gmail and in-app feeds', async () => {
      const dto = {
        type: 'Promotion',
        title: 'Super Flash Deal!',
        message: 'Get 10% bonus credit on all gift card trades today.',
        audience: 'Everyone',
        channels: { inApp: true, email: true, push: false, sms: false },
        scheduleType: 'now',
      };

      const result = await service.createBroadcast(dto, 'admin-1');

      expect(result.success).toBe(true);
      expect(result.broadcast).toBeDefined();
      expect(result.broadcast.title).toBe(dto.title);
      expect(result.broadcast.channels).toContain('In-App');
      expect(result.broadcast.channels).toContain('Email');
      expect(result.broadcast.status).toBe('Sent');

      // Verify Gmail dispatch was called for users
      expect(emailService.sendBroadcastEmail).toHaveBeenCalledTimes(mockUsers.length);
      expect(emailService.sendBroadcastEmail).toHaveBeenCalledWith(
        'user1@example.com',
        dto.title,
        dto.message,
        'Alice',
      );

      // Verify in-app distribution
      const userNotifications = await service.getUserNotifications('user-1');
      const inAppItem = userNotifications.notifications.find((n) => n.title === dto.title);
      expect(inAppItem).toBeDefined();
      expect(inAppItem?.category).toBe('promotions');
    });

    it('should handle scheduled broadcast properly', async () => {
      const dto = {
        type: 'Maintenance',
        title: 'Upcoming Server Maintenance',
        message: 'Our systems will be upgraded tonight.',
        audience: 'Everyone',
        channels: { inApp: true, email: false },
        scheduleType: 'scheduled',
        scheduleDate: '2026-11-01T02:00:00.000Z',
      };

      const result = await service.createBroadcast(dto);
      expect(result.success).toBe(true);
      expect(result.broadcast.status).toBe('Scheduled');
      expect(emailService.sendBroadcastEmail).not.toHaveBeenCalled();
    });
  });

  describe('Automated Triggers', () => {
    it('should return initial automated triggers', async () => {
      const triggers = await service.getAutomatedTriggers();
      expect(triggers.length).toBeGreaterThanOrEqual(2);
      expect(triggers.some((t) => t.id === 'TR-1001')).toBe(true);
    });

    it('should toggle an automated trigger active state', async () => {
      const triggers = await service.getAutomatedTriggers();
      const before = triggers.find((t) => t.id === 'TR-1002')!;
      const originalState = before.active;

      const updated = await service.toggleAutomatedTrigger('TR-1002');
      expect(updated.active).toBe(!originalState);

      const updatedExplicit = await service.toggleAutomatedTrigger('TR-1002', true);
      expect(updatedExplicit.active).toBe(true);
    });
  });

  describe('Mobile User Notifications', () => {
    const testUserId = 'test-customer-99';

    it('should initialize and return user notifications with categories', async () => {
      const res = await service.getUserNotifications(testUserId);
      expect(res.notifications.length).toBeGreaterThanOrEqual(5);
      expect(res.unreadCount).toBeGreaterThan(0);

      // Filter by category
      const promoOnly = await service.getUserNotifications(testUserId, { category: 'promotions' });
      expect(promoOnly.notifications.every((n) => n.category === 'promotions')).toBe(true);
    });

    it('should mark all notifications as read', async () => {
      await service.getUserNotifications(testUserId);
      const markResult = await service.markAllAsRead(testUserId);
      expect(markResult.success).toBe(true);

      const unread = await service.getUnreadCount(testUserId);
      expect(unread.unreadCount).toBe(0);
    });

    it('should toggle read status of a single notification', async () => {
      const res = await service.getUserNotifications(testUserId);
      const firstItem = res.notifications[0];
      const initialRead = firstItem.isRead;

      const toggleRes = await service.toggleReadStatus(testUserId, firstItem.id);
      expect(toggleRes.success).toBe(true);
      expect(toggleRes.notification?.isRead).toBe(!initialRead);
    });

    it('should toggle pinned status of notification', async () => {
      const res = await service.getUserNotifications(testUserId);
      const targetItem = res.notifications[res.notifications.length - 1]; // last item

      const pinRes = await service.togglePin(testUserId, targetItem.id);
      expect(pinRes.success).toBe(true);
      expect(pinRes.notification?.isPinned).toBe(true);
    });
  });
});
