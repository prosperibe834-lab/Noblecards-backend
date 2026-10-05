import * as bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService transaction PIN', () => {
  const userId = 'user-1';
  let prisma: any;
  let service: UsersService;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
        update: jest.fn(),
      },
      transactionPinResetChallenge: {
        deleteMany: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn((callback: (tx: any) => unknown) => callback(prisma)),
      $queryRaw: jest.fn(),
    };
    service = new UsersService(prisma as never, {
      sendPasswordResetCode: jest.fn(),
      sendVerificationCode: jest.fn(),
      sendTransactionPinResetCode: jest.fn(),
    } as any);
  });

  it('creates a bcrypt hash without exposing the plaintext PIN', async () => {
    prisma.user.updateMany.mockResolvedValue({ count: 1 });

    await service.createTransactionPin(userId, '1234');

    const update = prisma.user.updateMany.mock.calls[0][0];
    expect(update.where).toEqual({ id: userId, transactionPinHash: null });
    expect(update.data.transactionPinHash).not.toBe('1234');
    await expect(bcrypt.compare('1234', update.data.transactionPinHash)).resolves.toBe(true);
  });

  it.each(['', '123', '12345', '12a4'])('rejects invalid PIN %j', async (pin) => {
    await expect(service.createTransactionPin(userId, pin)).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.user.updateMany).not.toHaveBeenCalled();
  });

  it('rejects creation when a PIN already exists', async () => {
    prisma.user.updateMany.mockResolvedValue({ count: 0 });
    prisma.user.findUnique.mockResolvedValue({ id: userId, transactionPinHash: 'existing-hash' });

    await expect(service.createTransactionPin(userId, '1234')).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects a wrong current PIN without changing the stored PIN hash', async () => {
    const existingHash = await bcrypt.hash('1234', 4);
    prisma.$queryRaw.mockResolvedValue([{
      transactionPinHash: existingHash,
      transactionPinFailedAttempts: 0,
      transactionPinLockedUntil: null,
    }]);

    await expect(service.updateTransactionPin(userId, '9999', '5678')).rejects.toThrow('Invalid transaction PIN.');

    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: userId },
      data: expect.not.objectContaining({ transactionPinHash: expect.anything() }),
    }));
  });

  it('updates the PIN hash after validating the current PIN', async () => {
    const existingHash = await bcrypt.hash('1234', 4);
    prisma.$queryRaw.mockResolvedValue([{
      transactionPinHash: existingHash,
      transactionPinFailedAttempts: 0,
      transactionPinLockedUntil: null,
    }]);

    await service.updateTransactionPin(userId, '1234', '5678');

    const update = prisma.user.update.mock.calls[0][0];
    expect(update.data.transactionPinHash).not.toBe('5678');
    await expect(bcrypt.compare('5678', update.data.transactionPinHash)).resolves.toBe(true);
    await expect(bcrypt.compare('1234', update.data.transactionPinHash)).resolves.toBe(false);

    prisma.$queryRaw.mockResolvedValue([{
      transactionPinHash: update.data.transactionPinHash,
      transactionPinFailedAttempts: 0,
      transactionPinLockedUntil: null,
    }]);
    await expect(service.verifyTransactionPin(userId, '5678')).resolves.toBe(true);
    await expect(service.verifyTransactionPin(userId, '1234')).rejects.toThrow('Invalid transaction PIN.');
  });

  it.each([['123', '5678'], ['1234', '567']])('rejects malformed update PINs', async (currentPin, newPin) => {
    await expect(service.updateTransactionPin(userId, currentPin, newPin)).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('reports PIN status and omits the hash from public users', async () => {
    prisma.user.findUnique.mockResolvedValue({ transactionPinHash: null });
    await expect(service.hasTransactionPin(userId)).resolves.toBe(false);

    const publicUser = service.toPublicUser({
      id: userId,
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: null,
      country: null,
      countryCode: null,
      gender: null,
      role: 'USER',
      isEmailVerified: true,
      transactionPinHash: 'secret-hash',
    });

    expect(publicUser.hasTransactionPin).toBe(true);
    expect(publicUser).not.toHaveProperty('transactionPinHash');
  });

  it('verifies the correct PIN and resets failed attempts and lockout', async () => {
    prisma.$queryRaw.mockResolvedValue([{
      transactionPinHash: await bcrypt.hash('1234', 4),
      transactionPinFailedAttempts: 3,
      transactionPinLockedUntil: null,
    }]);

    await expect(service.verifyTransactionPin(userId, '1234')).resolves.toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { transactionPinFailedAttempts: 0, transactionPinLockedUntil: null },
    });
  });

  it('increments failed attempts and locks after five failures', async () => {
    prisma.$queryRaw.mockResolvedValue([{
      transactionPinHash: await bcrypt.hash('1234', 4),
      transactionPinFailedAttempts: 4,
      transactionPinLockedUntil: null,
    }]);

    await expect(service.verifyTransactionPin(userId, '9999')).rejects.toThrow('Invalid transaction PIN.');
    const update = prisma.user.update.mock.calls[0][0];
    expect(update.data.transactionPinFailedAttempts).toBe(5);
    expect(update.data.transactionPinLockedUntil.getTime()).toBeGreaterThan(Date.now());
  });

  it('rejects a PIN while the temporary lock is active', async () => {
    prisma.$queryRaw.mockResolvedValue([{
      transactionPinHash: await bcrypt.hash('1234', 4),
      transactionPinFailedAttempts: 5,
      transactionPinLockedUntil: new Date(Date.now() + 60_000),
    }]);

    await expect(service.verifyTransactionPin(userId, '1234')).rejects.toMatchObject({ status: 429 });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('rejects verification when no transaction PIN is configured', async () => {
    prisma.$queryRaw.mockResolvedValue([{
      transactionPinHash: null,
      transactionPinFailedAttempts: 0,
      transactionPinLockedUntil: null,
    }]);

    await expect(service.verifyTransactionPin(userId, '1234')).rejects.toThrow('Transaction PIN is not configured.');
  });

  it('requests a secure transaction PIN reset and sends an OTP to the verified email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: userId, email: 'user@example.com', transactionPinHash: 'old-hash' });

    await expect(service.requestTransactionPinReset(userId)).resolves.toEqual({ sent: true });

    expect(prisma.transactionPinResetChallenge.deleteMany).toHaveBeenCalledWith({ where: { userId } });
    expect(prisma.transactionPinResetChallenge.create).toHaveBeenCalledTimes(1);
    expect(prisma.transactionPinResetChallenge.create.mock.calls[0][0].data).toMatchObject({ userId });
    expect(prisma.transactionPinResetChallenge.create.mock.calls[0][0].data.codeHash).not.toBe('123456');
  });

  it('rejects a wrong transaction PIN reset code', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: userId, email: 'user@example.com' });
    prisma.transactionPinResetChallenge.findFirst.mockResolvedValue({
      id: 'challenge-1',
      userId,
      codeHash: createHash('sha256').update('654321').digest('hex'),
      expiresAt: new Date(Date.now() + 60_000),
      attempts: 0,
      verifiedAt: null,
      consumedAt: null,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
    });

    await expect(service.verifyTransactionPinResetCode(userId, '111111')).rejects.toThrow('Invalid or expired transaction PIN reset code.');
  });

  it('verifies a valid transaction PIN reset code and issues a reset token', async () => {
    const code = '654321';
    prisma.user.findUnique.mockResolvedValue({ id: userId, email: 'user@example.com' });
    prisma.transactionPinResetChallenge.findFirst.mockResolvedValue({
      id: 'challenge-1',
      userId,
      codeHash: createHash('sha256').update(code).digest('hex'),
      expiresAt: new Date(Date.now() + 60_000),
      attempts: 0,
      verifiedAt: null,
      consumedAt: null,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
    });

    const result = await service.verifyTransactionPinResetCode(userId, code);

    expect(result).toHaveProperty('verified', true);
    expect(result).toHaveProperty('resetToken');
    expect(prisma.transactionPinResetChallenge.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'challenge-1' },
      data: expect.objectContaining({ verifiedAt: expect.any(Date), resetTokenHash: expect.any(String) }),
    }));
  });

  it('completes a reset with a valid token and hashes the new PIN', async () => {
    const oldPinHash = await bcrypt.hash('1234', 12);
    const token = 'reset-token-123';
    prisma.user.findUnique.mockResolvedValue({ id: userId, email: 'user@example.com', transactionPinHash: oldPinHash });
    prisma.transactionPinResetChallenge.findFirst.mockResolvedValue({
      id: 'challenge-1',
      userId,
      codeHash: createHash('sha256').update('654321').digest('hex'),
      expiresAt: new Date(Date.now() + 60_000),
      attempts: 0,
      verifiedAt: new Date(),
      consumedAt: null,
      resetTokenHash: createHash('sha256').update(token).digest('hex'),
      resetTokenExpiresAt: new Date(Date.now() + 60_000),
    });

    await expect(service.completeTransactionPinReset(userId, token, '4321', '4321')).resolves.toEqual({ reset: true });

    const updateCall = prisma.user.update.mock.calls[0][0];
    expect(updateCall.where).toEqual({ id: userId });
    expect(updateCall.data.transactionPinHash).not.toBe('4321');
    await expect(bcrypt.compare('4321', updateCall.data.transactionPinHash)).resolves.toBe(true);
    expect(prisma.transactionPinResetChallenge.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'challenge-1' },
      data: expect.objectContaining({ consumedAt: expect.any(Date), resetTokenHash: null }),
    }));
  });
});
