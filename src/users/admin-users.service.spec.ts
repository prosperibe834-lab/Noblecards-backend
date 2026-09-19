import { UsersService } from './users.service';

describe('UsersService admin users', () => {
  it('maps real users, USD balances, card counts, pagination, and countries', async () => {
    const prisma = {
      user: {
        findMany: jest.fn()
          .mockResolvedValueOnce([{
            id: 'user-1', email: 'user@example.com', firstName: 'Test', lastName: 'User', username: 'test',
            phone: null, country: 'Nigeria', gender: null, dateOfBirth: null, address: null,
            profileImageUrl: null, isEmailVerified: true, isVerified: true, isActive: true,
            createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'),
          }])
          .mockResolvedValueOnce([{ country: 'Nigeria' }]),
        count: jest.fn().mockResolvedValueOnce(1).mockResolvedValue(1),
      },
      $queryRaw: jest.fn()
        .mockResolvedValueOnce([{ userId: 'user-1', count: 3n }])
        .mockResolvedValueOnce([{ userId: 'user-1', balance: '125.50' }]),
    } as any;
    const result = await new UsersService(prisma).getAdminUsers({ page: '1', pageSize: '10' });

    expect(result.users[0]).toEqual(expect.objectContaining({
      id: 'user-1', balance: 125.5, cards: 3, kycStatus: 'Verified', status: 'Active',
    }));
    expect(result.pagination).toEqual({ page: 1, pageSize: 10, total: 1, totalPages: 1 });
    expect(result.countries).toEqual(['Nigeria']);
    expect(result.stats.totalUsers.count).toBe(1);
  });
});
