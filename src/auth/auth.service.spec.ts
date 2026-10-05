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
    };
    users = { findById: jest.fn() };
    service = new AuthService(prisma, {} as any, users, {} as any);
  });

  it('rejects an incorrect current password without updating credentials', async () => {
    users.findById.mockResolvedValue({
      id: userId,
      passwordHash: await bcrypt.hash('Correct@123', 4),
    });

    await expect(service.changePassword(userId, sessionId, 'Wrong@123', 'Updated@456'))
      .rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('hashes the new password and revokes other sessions only', async () => {
    users.findById.mockResolvedValue({
      id: userId,
      passwordHash: await bcrypt.hash('Correct@123', 4),
    });

    await expect(service.changePassword(userId, sessionId, 'Correct@123', 'Updated@456'))
      .resolves.toEqual({ updated: true });

    const update = prisma.user.update.mock.calls[0][0];
    expect(update.where).toEqual({ id: userId });
    expect(update.data.passwordHash).not.toBe('Updated@456');
    await expect(bcrypt.compare('Updated@456', update.data.passwordHash)).resolves.toBe(true);
    expect(prisma.refreshSession.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId, id: { not: sessionId }, revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    }));
  });

  it('rejects a new password shorter than eight characters', async () => {
    await expect(service.changePassword(userId, sessionId, 'Correct@123', 'short'))
      .rejects.toBeInstanceOf(BadRequestException);
    expect(users.findById).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});