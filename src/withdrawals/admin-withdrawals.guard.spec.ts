import { ExecutionContext } from '@nestjs/common';
import { AdminWithdrawalsGuard } from './admin-withdrawals.guard';

describe('AdminWithdrawalsGuard', () => {
  const context = (userId: string) => ({
    switchToHttp: () => ({ getRequest: () => ({ user: { userId } }) }),
  }) as unknown as ExecutionContext;

  it('allows an active admin', async () => {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue({ role: 'ADMIN', isActive: true }) } } as any;
    await expect(new AdminWithdrawalsGuard(prisma).canActivate(context('admin-1'))).resolves.toBe(true);
  });

  it('rejects non-admin users', async () => {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue({ role: 'USER', isActive: true }) } } as any;
    await expect(new AdminWithdrawalsGuard(prisma).canActivate(context('user-1'))).rejects.toThrow('Admin access required.');
  });

  it('rejects inactive admins', async () => {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue({ role: 'ADMIN', isActive: false }) } } as any;
    await expect(new AdminWithdrawalsGuard(prisma).canActivate(context('admin-1'))).rejects.toThrow('Admin access required.');
  });
});
