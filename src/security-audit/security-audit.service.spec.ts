import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  recordAdminAccessDenied,
  sanitizeAuditMetadata,
  writeSecurityAuditEvent,
} from './security-audit.utils';
import { SecurityAuditService } from './security-audit.service';

describe('SecurityAuditService', () => {
  let prisma: {
    $queryRawUnsafe: jest.Mock;
    $executeRawUnsafe: jest.Mock;
    user: { findUnique: jest.Mock };
  };
  let service: SecurityAuditService;

  beforeEach(() => {
    prisma = {
      $queryRawUnsafe: jest.fn(),
      $executeRawUnsafe: jest.fn(),
      user: { findUnique: jest.fn() },
    };
    service = new SecurityAuditService(prisma as unknown as PrismaService);
  });

  it('applies validated combined filters and returns paginated records', async () => {
    prisma.$queryRawUnsafe
      .mockResolvedValueOnce([{ matches: true }])
      .mockResolvedValueOnce([{ total: 1 }])
      .mockResolvedValueOnce([
        {
          id: 'event-1',
          eventType: 'Login',
          event: 'Successful Login',
          outcome: 'SUCCESS',
          actorType: 'USER',
          actorUserId: 'user-1',
          targetUserId: 'user-1',
          ipAddress: null,
          userAgent: null,
          country: 'Nigeria',
          city: 'Lagos',
          deviceType: 'Mobile',
          operatingSystem: 'Android',
          browser: 'Chrome',
          risk: 'HIGH',
          description: 'User authenticated successfully.',
          metadata: null,
          createdAt: new Date('2026-10-16T12:00:00.000Z'),
          actorName: 'Ada Example',
          actorUsername: 'ada',
          actorEmail: 'ada@example.test',
          actorPhone: null,
          targetName: 'Ada Example',
          targetUsername: 'ada',
          targetEmail: 'ada@example.test',
          targetPhone: null,
        },
      ]);

    const result = await service.getLogs({
      eventType: 'Login',
      status: 'Success',
      actor: 'User',
      dateRange: 'CUSTOM',
      startDate: '2026-10-01',
      endDate: '2026-10-16',
      search: 'Ada',
      page: '1',
      pageSize: '10',
    });

    expect(result.pagination).toEqual({
      totalRecords: 1,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
    });
    expect(result.data[0]).toMatchObject({
      id: 'event-1',
      actor: 'User',
      userName: 'Ada Example',
      status: 'Success',
      risk: 'High',
      isVpn: null,
      isTor: null,
      deviceType: 'Mobile',
      os: 'Android',
      browser: 'Chrome',
      country: 'Nigeria',
      city: 'Lagos',
    });
    expect(prisma.$queryRawUnsafe.mock.calls[1][0]).toContain('e."eventType"');
    expect(prisma.$queryRawUnsafe.mock.calls[0][0]).toContain(
      `LOWER(BTRIM(COALESCE(e."eventType", '')))`,
    );
    expect(prisma.$queryRawUnsafe.mock.calls[1][0]).toContain(
      `e."metadata"->>'attemptedEmail'`,
    );
    expect(prisma.$queryRawUnsafe.mock.calls[1][0]).toContain(
      'LEFT JOIN "User" actor',
    );
    expect(prisma.$queryRawUnsafe.mock.calls[1][0]).toContain(
      'LEFT JOIN "User" target',
    );
    expect(prisma.$queryRawUnsafe.mock.calls[1][0]).toContain(
      'e."createdAt" <',
    );
    expect(prisma.$queryRawUnsafe.mock.calls[1].slice(1)).toEqual(
      expect.arrayContaining([
        'Login',
        'Success',
        'USER',
        '%Ada%',
        new Date('2026-10-01T00:00:00.000Z'),
        new Date('2026-10-17T00:00:00.000Z'),
      ]),
    );
    expect(prisma.$queryRawUnsafe.mock.calls[2][0]).toContain(
      'LIMIT $7 OFFSET $8',
    );
  });

  it('filters by recorded event, outcome, risk, actor, country and device together', async () => {
    prisma.$queryRawUnsafe
      .mockResolvedValueOnce([{ matches: true }])
      .mockResolvedValueOnce([{ matches: true }])
      .mockResolvedValueOnce([{ matches: true }])
      .mockResolvedValueOnce([{ total: 1 }])
      .mockResolvedValueOnce([]);

    await service.getLogs({
      eventType: 'Login',
      status: 'Failed',
      risk: 'High',
      actor: 'Admin',
      country: 'Nigeria',
      device: 'Mobile',
      dateRange: 'ALL',
      search: 'failed',
    });

    const countSql = prisma.$queryRawUnsafe.mock.calls[3][0] as string;
    const values = prisma.$queryRawUnsafe.mock.calls[3].slice(1);
    expect(countSql).toContain('e."eventType"');
    expect(countSql).toContain('e."outcome"');
    expect(countSql).toContain('e."risk"');
    expect(countSql).toContain('e."actorType"');
    expect(countSql).toContain('e."country"');
    expect(countSql).toContain('e."deviceType"');
    expect(countSql).toContain('e."metadata"->>');
    expect(values).toEqual([
      'Login',
      'Failed',
      'High',
      'ADMIN',
      'Nigeria',
      'Mobile',
      '%failed%',
    ]);
  });

  it('matches unknown actors to unauthenticated and legacy API records', async () => {
    prisma.$queryRawUnsafe
      .mockResolvedValueOnce([{ total: 0 }])
      .mockResolvedValueOnce([]);

    await service.getLogs({ actor: 'API' });

    const sql = prisma.$queryRawUnsafe.mock.calls[0][0] as string;
    expect(sql).toContain(`UPPER(e."actorType") IN ('UNKNOWN', 'API')`);
  });

  it('rejects country, device, and event values absent from persisted events', async () => {
    prisma.$queryRawUnsafe
      .mockResolvedValueOnce([{ matches: false }])
      .mockResolvedValueOnce([{ matches: false }])
      .mockResolvedValueOnce([{ matches: false }]);
    await expect(service.getLogs({ country: 'Nowhere' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(service.getLogs({ device: 'Unknown Device' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(service.getLogs({ eventType: 'Unsupported' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.$queryRawUnsafe).toHaveBeenCalledTimes(3);
  });

  it('returns distinct filter options from persisted values, not static examples', async () => {
    prisma.$queryRawUnsafe
      .mockResolvedValueOnce([{ value: 'Admin' }, { value: 'Login' }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ value: 'Mobile' }]);

    await expect(service.getFilterOptions()).resolves.toEqual({
      eventTypes: ['Admin', 'Login'],
      countries: [],
      devices: ['Mobile'],
    });
  });

  it('keeps the acting identity separate from targets and never labels API requests as actors', async () => {
    prisma.$queryRawUnsafe
      .mockResolvedValueOnce([{ total: 4 }])
      .mockResolvedValueOnce([
        {
          id: 'user-action',
          eventType: 'Password',
          event: 'Password Changed',
          outcome: 'SUCCESS',
          actorType: 'USER',
          actorUserId: 'user-1',
          targetUserId: 'target-1',
          ipAddress: null,
          userAgent: null,
          country: null,
          city: null,
          deviceType: null,
          operatingSystem: null,
          browser: null,
          risk: null,
          description: 'Account password changed.',
          metadata: null,
          createdAt: new Date('2026-10-16T12:00:00.000Z'),
          actorName: 'Ada User',
          actorUsername: 'ada',
          actorEmail: 'ada@example.test',
          actorPhone: null,
          targetName: 'Target User',
          targetUsername: 'target',
          targetEmail: 'target@example.test',
          targetPhone: null,
        },
        {
          id: 'admin-action',
          eventType: 'Admin',
          event: 'PATCH /admin/users/:id',
          outcome: 'SUCCESS',
          actorType: 'ADMIN',
          actorUserId: 'admin-1',
          targetUserId: 'target-1',
          ipAddress: null,
          userAgent: null,
          country: null,
          city: null,
          deviceType: null,
          operatingSystem: null,
          browser: null,
          risk: null,
          description: 'Administrative request completed.',
          metadata: null,
          createdAt: new Date('2026-10-16T12:00:00.000Z'),
          actorName: 'Alex Admin',
          actorUsername: 'alex',
          actorEmail: 'alex@example.test',
          actorPhone: null,
          targetName: 'Target User',
          targetUsername: 'target',
          targetEmail: 'target@example.test',
          targetPhone: null,
        },
        {
          id: 'system-action',
          eventType: 'System',
          event: 'Automated Security Check',
          outcome: 'SUCCESS',
          actorType: 'SYSTEM',
          actorUserId: null,
          targetUserId: null,
          ipAddress: null,
          userAgent: null,
          country: null,
          city: null,
          deviceType: null,
          operatingSystem: null,
          browser: null,
          risk: null,
          description: 'Automated check completed.',
          metadata: null,
          createdAt: new Date('2026-10-16T12:00:00.000Z'),
          actorName: null,
          actorUsername: null,
          actorEmail: null,
          actorPhone: null,
          targetName: null,
          targetUsername: null,
          targetEmail: null,
          targetPhone: null,
        },
        {
          id: 'anonymous-action',
          eventType: 'Admin',
          event: 'Unauthenticated Admin Request',
          outcome: 'BLOCKED',
          actorType: 'API',
          actorUserId: null,
          targetUserId: null,
          ipAddress: null,
          userAgent: null,
          country: null,
          city: null,
          deviceType: null,
          operatingSystem: null,
          browser: null,
          risk: null,
          description: 'Authentication was not available.',
          metadata: { attemptedEmail: 'attempt@example.test' },
          createdAt: new Date('2026-10-16T12:00:00.000Z'),
          actorName: null,
          actorUsername: null,
          actorEmail: null,
          actorPhone: null,
          targetName: null,
          targetUsername: null,
          targetEmail: null,
          targetPhone: null,
        },
      ]);

    const { data } = await service.getLogs({});

    expect(data[0]).toMatchObject({
      actor: 'User',
      actorType: 'USER',
      actorId: 'user-1',
      userId: 'user-1',
      userName: 'Ada User',
      targetUserId: 'target-1',
      targetUserName: 'Target User',
      metadata: {
        target: {
          userId: 'target-1',
          name: 'Target User',
          email: 'target@example.test',
        },
      },
    });
    expect(data[1]).toMatchObject({
      actor: 'Admin',
      actorType: 'ADMIN',
      actorId: 'admin-1',
      userId: 'admin-1',
      userName: 'Alex Admin',
      userEmail: 'alex@example.test',
      adminId: 'admin-1',
      adminName: 'Alex Admin',
    });
    expect(data[2]).toMatchObject({
      actor: 'System',
      actorType: 'SYSTEM',
      userId: null,
      userName: null,
    });
    expect(data[3]).toMatchObject({
      actor: 'Unknown',
      actorType: 'UNKNOWN',
      userId: null,
      userName: null,
      userEmail: 'attempt@example.test',
    });
    expect(prisma.$queryRawUnsafe.mock.calls[1][0]).toContain(
      'LEFT JOIN "User" actor ON actor."id" = e."actorUserId"',
    );
    expect(prisma.$queryRawUnsafe.mock.calls[1][0]).toContain(
      'LEFT JOIN "User" target ON target."id" = e."targetUserId"',
    );
  });

  it('returns actual event aggregates and makes admin actions exclude admin logins', async () => {
    const expected = {
      totalEvents: 8,
      successfulEvents: 4,
      failedEvents: 2,
      suspiciousEvents: 1,
      adminActions: 1,
      userEvents: 6,
      loginAttempts: 3,
      blockedAttempts: 1,
    };
    prisma.$queryRawUnsafe.mockResolvedValueOnce([expected]);

    await expect(
      service.getStatistics({ dateRange: 'TODAY' }),
    ).resolves.toEqual(expected);
    const sql = prisma.$queryRawUnsafe.mock.calls[0][0] as string;
    expect(sql).toContain(`LOWER(e."eventType") = 'admin'`);
    expect(sql).toContain(`UPPER(e."outcome") <> 'BLOCKED'`);
    expect(sql).toContain(`UPPER(e."outcome") = 'BLOCKED'`);
  });

  it('resolves authenticated action classifications from the persisted user role', async () => {
    prisma.user.findUnique
      .mockResolvedValueOnce({ role: 'ADMIN' })
      .mockResolvedValueOnce({ role: 'USER' })
      .mockResolvedValueOnce(null);

    await expect(service.resolveActorType('admin-1')).resolves.toBe('ADMIN');
    await expect(service.resolveActorType('user-1')).resolves.toBe('USER');
    await expect(service.resolveActorType('missing-user')).resolves.toBe(
      'UNKNOWN',
    );
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'admin-1' },
      select: { role: true },
    });
  });

  it('builds active alerts only from repeated failed logins and accepts searchable filters', async () => {
    prisma.$queryRawUnsafe.mockResolvedValueOnce([]);
    await expect(
      service.getAlerts({ search: '10.0.0.1', actor: 'User' }),
    ).resolves.toEqual([]);

    const [sql, ...values] = prisma.$queryRawUnsafe.mock.calls[0] as [
      string,
      ...unknown[],
    ];
    expect(sql).toContain(`e."createdAt" >= NOW() - INTERVAL '5 minutes'`);
    expect(sql).toContain('HAVING COUNT(*) >= 5');
    expect(sql).toContain('LEFT JOIN "User" actor');
    expect(values).toEqual(['USER', '%10.0.0.1%']);
  });

  it('rejects invalid dates, page sizes, and risk values before querying', async () => {
    await expect(
      service.getLogs({
        dateRange: 'CUSTOM',
        startDate: '2026-02-30',
        endDate: '2026-03-01',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.getLogs({ pageSize: '1000' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(service.getLogs({ risk: 'UNKNOWN' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(
      service.getLogs({ dateRange: 'CUSTOM', startDate: '2026-10-01' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$queryRawUnsafe).not.toHaveBeenCalled();
  });

  it('allows a custom range to be selected before either date is supplied', async () => {
    prisma.$queryRawUnsafe
      .mockResolvedValueOnce([{ total: 0 }])
      .mockResolvedValueOnce([]);
    await expect(
      service.getLogs({ dateRange: 'CUSTOM', startDate: '', endDate: '' }),
    ).resolves.toMatchObject({
      pagination: { totalRecords: 0 },
      data: [],
    });
    expect(prisma.$queryRawUnsafe.mock.calls[0][0]).not.toContain(
      'e."createdAt" >=',
    );
  });

  it('returns exact details and reports missing events', async () => {
    prisma.$queryRawUnsafe.mockResolvedValueOnce([]);
    await expect(service.getDetails('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.$queryRawUnsafe.mock.calls[0][1]).toBe('missing');
  });

  it('exports the complete filtered result and escapes spreadsheet formulas', async () => {
    prisma.$queryRawUnsafe
      .mockResolvedValueOnce([{ matches: true }])
      .mockResolvedValueOnce([
        {
          id: 'event-1',
          eventType: 'Admin',
          event: 'Rate change',
          outcome: 'SUCCESS',
          actorType: 'ADMIN',
          actorUserId: 'admin-1',
          targetUserId: null,
          ipAddress: null,
          userAgent: null,
          country: null,
          city: null,
          deviceType: null,
          operatingSystem: null,
          browser: null,
          risk: null,
          description: '=HYPERLINK("https://example.test")',
          metadata: { authorization: 'not-exported', method: 'PATCH' },
          createdAt: new Date('2026-10-16T12:00:00.000Z'),
          actorName: 'Admin Example',
          actorUsername: 'admin',
          actorEmail: 'admin@example.test',
          actorPhone: null,
          targetName: null,
          targetUsername: null,
          targetEmail: null,
          targetPhone: null,
        },
      ]);

    const csv = await service.exportCsv({
      eventType: 'Admin',
      dateRange: 'ALL',
    });
    expect(csv).toContain('"id","timestamp","event"');
    expect(csv).toContain(`"'=HYPERLINK(""https://example.test"")"`);
    expect(csv).not.toContain('authorization');
    expect(prisma.$queryRawUnsafe.mock.calls[1][0]).not.toContain('LIMIT');
  });
});

describe('security audit metadata', () => {
  it('records denied admin access using the verified identity role', async () => {
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const request = {
      user: { userId: 'user-1' },
      headers: { 'user-agent': 'test-browser' },
      ip: '127.0.0.1',
      method: 'GET',
      originalUrl: '/admin/deposits?page=2',
    };

    await recordAdminAccessDenied(audit, request, 'USER');

    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'Admin',
        event: 'Admin Access Denied',
        outcome: 'BLOCKED',
        actorType: 'USER',
        actorUserId: 'user-1',
        metadata: { method: 'GET', route: '/admin/deposits' },
      }),
    );
  });

  it('drops sensitive metadata keys and inserts only safe fields', async () => {
    expect(
      sanitizeAuditMetadata({
        route: '/admin/users',
        password: 'secret',
        accessToken: 'secret',
        authorization: 'secret',
        nested: { safe: false },
      }),
    ).toEqual({ route: '/admin/users' });

    const prisma = { $executeRawUnsafe: jest.fn().mockResolvedValue(1) };
    await writeSecurityAuditEvent(prisma as unknown as PrismaService, {
      eventType: 'Admin',
      event: 'PATCH /admin/users/:id',
      outcome: 'SUCCESS',
      actorType: 'ADMIN',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      description: 'Administrative request completed.',
      metadata: { method: 'PATCH', password: 'never persisted' },
    });
    const args = prisma.$executeRawUnsafe.mock.calls[0];
    expect(args[0]).toContain('INSERT INTO "SecurityAuditEvent"');
    expect(args[1]).toMatch(/^[0-9a-f-]{36}$/i);
    expect(args[12]).toBe('Desktop');
    expect(args[13]).toBe('Windows');
    expect(args[14]).toBe('Chrome');
    expect(args[17]).toBe('{"method":"PATCH"}');
    expect(args.join(' ')).not.toContain('never persisted');
  });

  it('does not infer device or location fields from absent metadata', async () => {
    const prisma = { $executeRawUnsafe: jest.fn().mockResolvedValue(1) };
    await writeSecurityAuditEvent(prisma as unknown as PrismaService, {
      eventType: 'Login',
      event: 'Successful Login',
      outcome: 'SUCCESS',
      actorType: 'USER',
      description: 'Authenticated.',
    });
    const args = prisma.$executeRawUnsafe.mock.calls[0];
    expect(args.slice(9, 15)).toEqual([null, null, null, null, null, null]);
  });
});
