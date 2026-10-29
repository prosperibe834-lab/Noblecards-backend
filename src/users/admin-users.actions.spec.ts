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

  it('hashes admin-created passwords before persistence and sets KYC verification and dateOfBirth', async () => {
    const prisma = {
      user: { create: jest.fn().mockResolvedValue({ id: 'user-2' }) },
    } as any;
    await new UsersService(prisma).createAdminUser({
      email: 'created@example.com',
      password: 'secret',
      fullName: 'Created User',
      kycStatus: 'Verified',
      status: 'Active',
      dateOfBirth: '1995-05-15',
      address: 'Lagos',
    });
    const data = prisma.user.create.mock.calls[0][0].data;
    expect(data.passwordHash).not.toBe('secret');
    expect(data.passwordHash).toMatch(/^\$2[aby]\$/);
    expect(data.isVerified).toBe(true);
    expect(data.isEmailVerified).toBe(true);
    expect(data.isActive).toBe(true);
    expect(data.address).toBe('Lagos');
    expect(data.dateOfBirth).toEqual(new Date('1995-05-15'));
  });

  it('updates user KYC status, email, and dateOfBirth', async () => {
    const prisma = {
      user: { update: jest.fn().mockResolvedValue({ id: 'user-3' }) },
    } as any;
    await new UsersService(prisma).updateAdminUser('user-3', {
      fullName: 'Updated Name',
      email: 'updated@example.com',
      kycStatus: 'Verified',
      status: 'Active',
      dateOfBirth: '1990-01-01',
      address: 'Abuja',
    });
    const data = prisma.user.update.mock.calls[0][0].data;
    expect(data.email).toBe('updated@example.com');
    expect(data.isVerified).toBe(true);
    expect(data.isEmailVerified).toBe(true);
    expect(data.address).toBe('Abuja');
    expect(data.dateOfBirth).toEqual(new Date('1990-01-01'));
  });
});

