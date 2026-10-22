import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard security audit attribution', () => {
  it('records unauthenticated admin requests as unknown actors, not API actors', async () => {
    const jwt = { verifyAsync: jest.fn() };
    const executeRaw = jest.fn().mockResolvedValue(1);
    const prisma = { $executeRawUnsafe: executeRaw };
    const guard = new AuthGuard(
      jwt as unknown as JwtService,
      prisma as unknown as PrismaService,
    );
    const request = {
      headers: { 'user-agent': 'test-browser' },
      method: 'GET',
      originalUrl: '/admin/security-logs',
      ip: '127.0.0.1',
    };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    };

    await expect(guard.canActivate(context as never)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    const args = executeRaw.mock.calls[0] as unknown[];
    expect(args[2]).toBe('Admin');
    expect(args[3]).toBe('Unauthenticated Admin Request');
    expect(args[4]).toBe('BLOCKED');
    expect(args[5]).toBe('UNKNOWN');
    expect(args[6]).toBeNull();
    expect(args[7]).toBeNull();
  });
});
