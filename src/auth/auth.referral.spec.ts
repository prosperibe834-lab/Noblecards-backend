import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthService referral attribution', () => {
  it('validates and preserves a supplied referral code for registration verification', async () => {
    const pendingRegistration: any = {
      upsert: jest.fn().mockResolvedValue({ email: 'friend@example.com' }),
      findUnique: jest.fn().mockResolvedValue(null),
    };
    const prisma: any = {
      pendingRegistration: pendingRegistration,
      user: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: 'referrer-1', email: 'owner@example.com' }),
      },
    };
    const users: any = { findByEmail: jest.fn().mockResolvedValue(null) };
    const email: any = {
      sendVerificationCode: jest.fn().mockResolvedValue(undefined),
    };
    const service = new AuthService(prisma, email, users, {} as any);
    const hash = jest
      .spyOn(require('bcrypt'), 'hash')
      .mockResolvedValue('hashed-password' as never);

    await service.register({
      email: 'friend@example.com',
      password: 'password',
      firstName: 'Friend',
      lastName: 'User',
      referralCode: 'refcode123',
    });

    expect(pendingRegistration.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ referralCode: 'REFCODE123' }),
        update: expect.objectContaining({ referralCode: 'REFCODE123' }),
      }),
    );
    expect(email.sendVerificationCode).toHaveBeenCalledTimes(1);
    hash.mockRestore();
  });

  it('rejects an invalid referral code before creating a pending registration', async () => {
    const pendingRegistration: any = {
      upsert: jest.fn(),
      findUnique: jest.fn().mockResolvedValue(null),
    };
    const prisma: any = {
      pendingRegistration,
      user: { findUnique: jest.fn().mockResolvedValue(null) },
    };
    const users: any = { findByEmail: jest.fn().mockResolvedValue(null) };
    const service = new AuthService(prisma, {} as any, users, {} as any);
    const hash = jest
      .spyOn(require('bcrypt'), 'hash')
      .mockResolvedValue('hashed-password' as never);

    await expect(
      service.register({
        email: 'friend@example.com',
        password: 'password',
        firstName: 'Friend',
        lastName: 'User',
        referralCode: 'missing123',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(pendingRegistration.upsert).not.toHaveBeenCalled();
    hash.mockRestore();
  });

  it('persists a unique code and the validated referrer relationship at OTP verification', async () => {
    let nextUserId = 0;
    const referrer = { id: 'referrer-1' };
    const createdUsers: any[] = [];
    const attributed: any[] = [];
    const pending = {
      id: 'pending-1',
      email: 'friend@example.com',
      passwordHash: 'hashed',
      firstName: 'Friend',
      lastName: 'User',
      phone: null,
      country: 'US',
      countryCode: 'US',
      gender: null,
      referralCode: 'REFCODE123',
      existingUserId: null,
      otpHash: 'ignored',
      otpExpiresAt: new Date(Date.now() + 60_000),
      otpAttempts: 0,
    };
    const tx = {
      user: {
        create: jest.fn(async ({ data }) => {
          const user = { id: `referred-${++nextUserId}`, ...data };
          createdUsers.push(user);
          return user;
        }),
        findUnique: jest.fn().mockResolvedValue(referrer),
      },
      referralAttribution: {
        create: jest.fn(async ({ data }) => attributed.push(data)),
      },
      pendingRegistration: { delete: jest.fn().mockResolvedValue({}) },
    };
    const prisma: any = {
      pendingRegistration: { findUnique: jest.fn().mockResolvedValue(pending) },
      refreshSession: {
        create: jest.fn().mockResolvedValue({ id: 'session-1' }),
      },
      $transaction: jest.fn((callback) => callback(tx)),
    };
    const users: any = {
      refreshVerification: jest.fn(async (user) => user),
      toPublicUser: jest.fn((user) => user),
    };
    const jwt: any = { signAsync: jest.fn().mockResolvedValue('access-token') };
    const service = new AuthService(prisma, {} as any, users, jwt);
    jest.spyOn(service as any, 'checkCode').mockResolvedValue(undefined);

    await service.verifyEmail({ email: pending.email, code: '123456' });

    expect(createdUsers[0].referralCode).toMatch(/^[A-F0-9]{10}$/);
    expect(attributed).toEqual([
      {
        referrerId: referrer.id,
        referredUserId: 'referred-1',
        referralCode: 'REFCODE123',
      },
    ]);
    expect(tx.pendingRegistration.delete).toHaveBeenCalledWith({
      where: { id: 'pending-1' },
    });
  });
});
