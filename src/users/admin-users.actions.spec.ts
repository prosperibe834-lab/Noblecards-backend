import { UsersService } from './users.service';

describe('UsersService admin actions', () => {
  it('updates the existing active field for suspension', async () => {
    const prisma = {
      user: { update: jest.fn().mockResolvedValue({ id: 'user-1', isActive: false }) },
    } as any;
    await expect(new UsersService(prisma).updateAdminUserStatus('user-1', 'SUSPENDED')).resolves.toEqual({
      id: 'user-1', status: 'Suspended',
    });
    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'user-1' }, data: { isActive: false },
    }));
  });

  it('deactivates instead of deleting users with financial relations', async () => {
    const prisma = {
      user: { update: jest.fn().mockResolvedValue({ id: 'user-1' }) },
    } as any;
    await expect(new UsersService(prisma).deactivateAdminUser('user-1')).resolves.toEqual({
      id: 'user-1', status: 'Suspended', deactivated: true,
    });
    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'user-1' }, data: { isActive: false },
    }));
  });

  it('hashes admin-created passwords before persistence', async () => {
    const prisma = {
      user: { create: jest.fn().mockResolvedValue({ id: 'user-2' }) },
    } as any;
    await new UsersService(prisma).createAdminUser({
      email: 'created@example.com', password: 'secret', fullName: 'Created User',
    });
    const data = prisma.user.create.mock.calls[0][0].data;
    expect(data.passwordHash).not.toBe('secret');
    expect(data.passwordHash).toMatch(/^\$2[aby]\$/);
  });
});
