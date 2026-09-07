import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService transaction PIN', () => {
  const userId = 'user-1';
  let prisma: {
    user: {
      findUnique: jest.Mock;
      updateMany: jest.Mock;
    };
  };
  let service: UsersService;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
      },
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
});
