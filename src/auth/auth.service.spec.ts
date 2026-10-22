import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService change password', () => {
  const userId = 'user-1';
  const sessionId = 'session-current';
  let prisma: any;
  let users: any;
  let service: AuthService;

  beforeEach(() => {
    prisma = {
      user: { update: jest.fn().mockResolvedValue({}) },
      refreshSession: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      $transaction: jest.fn().mockResolvedValue([]),
      $executeRawUnsafe: jest.fn().mockResolvedValue(1),
    };
    users = { findById: jest.fn(), findByEmail: jest.fn() };
    service = new AuthService(prisma, {} as any, users, {} as any);
  });

  it('rejects an incorrect current password without updating credentials', async () => {
    users.findById.mockResolvedValue({
      id: userId,
      passwordHash: await bcrypt.hash('Correct@123', 4),
    });

    await expect(
      service.changePassword(userId, sessionId, 'Wrong@123', 'Updated@456'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
    const args = prisma.$executeRawUnsafe.mock.calls[0] as unknown[];
    expect(args[2]).toBe('Password');
    expect(args[3]).toBe('Password Change Failed');
    expect(args[4]).toBe('FAILED');
    expect(args[5]).toBe('USER');
    expect(args[6]).toBe(userId);
    expect(args.join(' ')).not.toContain('Wrong@123');
  });

  it('hashes the new password and revokes other sessions only', async () => {
    users.findById.mockResolvedValue({
      id: userId,
      passwordHash: await bcrypt.hash('Correct@123', 4),
    });

    await expect(
      service.changePassword(userId, sessionId, 'Correct@123', 'Updated@456'),
    ).resolves.toEqual({ updated: true });

    const update = prisma.user.update.mock.calls[0][0];
    expect(update.where).toEqual({ id: userId });
    expect(update.data.passwordHash).not.toBe('Updated@456');
    await expect(
      bcrypt.compare('Updated@456', update.data.passwordHash),
    ).resolves.toBe(true);
    expect(prisma.refreshSession.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId, id: { not: sessionId }, revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      }),
    );
  });

  it('rejects a new password shorter than eight characters', async () => {
    await expect(
      service.changePassword(userId, sessionId, 'Correct@123', 'short'),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(users.findById).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('records failed login identity as an unverified email rather than linking an account', async () => {
    users.findByEmail.mockResolvedValue({
      id: 'admin-account',
      role: 'ADMIN',
      isEmailVerified: true,
      isActive: true,
      passwordHash: await bcrypt.hash('Correct@123', 4),
    });

    await expect(
      service.login({
        email: '  ADMIN@example.com ',
        password: 'Wrong@123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    const rawArgs = prisma.$executeRawUnsafe.mock.calls[0] as unknown[];
    const outcome = rawArgs[4];
    const actorType = rawArgs[5];
    const actorUserId = rawArgs[6];
    const targetUserId = rawArgs[7];
    const metadata = rawArgs[17];
    expect(outcome).toBe('FAILED');
    expect(actorType).toBe('UNKNOWN');
    expect(actorUserId).toBeNull();
    expect(targetUserId).toBeNull();
    expect(metadata).toBe('{"attemptedEmail":"admin@example.com"}');
    expect(rawArgs.join(' ')).not.toContain('Wrong@123');
  });
});
