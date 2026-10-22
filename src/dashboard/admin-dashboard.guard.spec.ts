import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminDashboardGuard } from './admin-dashboard.guard';

describe('AdminDashboardGuard', () => {
  const prisma = { user: { findUnique: jest.fn() } };
  let guard: AdminDashboardGuard;

  const context = {
    switchToHttp: () => ({
      getRequest: () => ({ user: { userId: 'admin-id' } }),
    }),
  } as ExecutionContext;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new AdminDashboardGuard(prisma as any);
  });

  it('allows only active administrators', async () => {
    prisma.user.findUnique.mockResolvedValue({ role: 'ADMIN', isActive: true });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it.each([
    [{ role: 'USER', isActive: true }],
    [{ role: 'ADMIN', isActive: false }],
    [null],
  ])('rejects non-admin or inactive accounts', async (user) => {
    prisma.user.findUnique.mockResolvedValue(user);

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
