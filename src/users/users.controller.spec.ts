import { BadRequestException, RequestMethod } from '@nestjs/common';
import {
  GUARDS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { AuthGuard } from '../auth/auth.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController transaction PIN endpoint', () => {
  const userId = 'user-1';
  let users: {
    createTransactionPin: jest.Mock;
    updateTransactionPin: jest.Mock;
    verifyTransactionPin: jest.Mock;
  };
  let controller: UsersController;

  beforeEach(() => {
    users = {
      createTransactionPin: jest.fn(),
      updateTransactionPin: jest.fn(),
      verifyTransactionPin: jest.fn().mockResolvedValue(true),
    };
    controller = new UsersController(users as unknown as UsersService);
  });

  it('updates the authenticated user with the currentPin/newPin contract', async () => {
    await expect(controller.createTransactionPin(
      { user: { userId } },
      { currentPin: '1234', newPin: '5678' },
    )).resolves.toEqual({ updated: true, hasTransactionPin: true });

    expect(users.updateTransactionPin).toHaveBeenCalledWith(userId, '1234', '5678');
    expect(users.createTransactionPin).not.toHaveBeenCalled();
  });

  it('preserves the existing create contract for first-time PIN setup', async () => {
    await expect(controller.createTransactionPin(
      { user: { userId } },
      { pin: '1234' },
    )).resolves.toEqual({ created: true, hasTransactionPin: true });

    expect(users.createTransactionPin).toHaveBeenCalledWith(userId, '1234');
    expect(users.updateTransactionPin).not.toHaveBeenCalled();
  });

  it('rejects ambiguous or incomplete PIN request bodies', async () => {
    await expect(controller.createTransactionPin(
      { user: { userId } },
      { currentPin: '1234' },
    )).rejects.toBeInstanceOf(BadRequestException);
    expect(users.createTransactionPin).not.toHaveBeenCalled();
    expect(users.updateTransactionPin).not.toHaveBeenCalled();
  });

  it('verifies the PIN for the authenticated user and returns authorization success', async () => {
    const handler = Object.getOwnPropertyDescriptor(
      UsersController.prototype,
      'verifyTransactionPin',
    )?.value;

    expect(Reflect.getMetadata(PATH_METADATA, UsersController)).toBe('users/me');
    expect(Reflect.getMetadata(PATH_METADATA, handler)).toBe(
      'transaction-pin/verify',
    );
    expect(Reflect.getMetadata(METHOD_METADATA, handler)).toBe(
      RequestMethod.POST,
    );
    expect(Reflect.getMetadata(GUARDS_METADATA, UsersController)).toContain(
      AuthGuard,
    );

    await expect(controller.verifyTransactionPin(
      { user: { userId } },
      { pin: '1234' },
    )).resolves.toEqual({ verified: true });

    expect(users.verifyTransactionPin).toHaveBeenCalledWith(userId, '1234');
  });
});