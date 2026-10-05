import { BadRequestException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController transaction PIN endpoint', () => {
  const userId = 'user-1';
  let users: { createTransactionPin: jest.Mock; updateTransactionPin: jest.Mock };
  let controller: UsersController;

  beforeEach(() => {
    users = {
      createTransactionPin: jest.fn(),
      updateTransactionPin: jest.fn(),
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
});