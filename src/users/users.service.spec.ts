import * as bcrypt from 'bcrypt';
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
      $transaction: jest.fn((callback: (tx: any) => unknown) => callback(prisma)),
      $queryRaw: jest.fn(),
    };
    service = new UsersService(prisma as never);
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
});
