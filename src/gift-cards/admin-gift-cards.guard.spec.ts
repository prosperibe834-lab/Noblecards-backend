import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminGiftCardsGuard } from './admin-gift-cards.guard';

describe('AdminGiftCardsGuard', () => {
  const context = (userId = 'admin-1') => ({
    switchToHttp: () => ({ getRequest: () => ({ user: { userId } }) }),
  }) as unknown as ExecutionContext;

  it('denies inactive and non-admin users', async () => {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue({ role: 'USER', isActive: true }) } } as any;
    await expect(new AdminGiftCardsGuard(prisma).canActivate(context())).rejects.toBeInstanceOf(ForbiddenException);
    prisma.user.findUnique.mockResolvedValue({ role: 'ADMIN', isActive: false });
    await expect(new AdminGiftCardsGuard(prisma).canActivate(context())).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows an active admin', async () => {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue({ role: 'ADMIN', isActive: true }) } } as any;
    await expect(new AdminGiftCardsGuard(prisma).canActivate(context())).resolves.toBe(true);
  });
});