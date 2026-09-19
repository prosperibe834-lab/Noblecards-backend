import { NotFoundException } from '@nestjs/common';
import { TransactionStatus } from '../generated/prisma';
import { AdminWithdrawalsService } from './admin-withdrawals.service';

const withdrawal = {
  id: 'withdrawal-1',
  reference: 'WD-1',
  userId: 'user-1',
  sourceCurrencyCode: 'USD',
  destinationCurrencyCode: 'NGN',
  sourceAmount: '100.00',
  destinationAmount: '150000.00',
  exchangeRate: '1500.00000000',
  fee: '3.00',
  amountReceived: '149997.00',
  country: 'Nigeria',
  countryCode: 'NG',
  paymentMethod: 'BANK_TRANSFER',
  provider: 'FLUTTERWAVE',
  providerReference: 'provider-ref',
  providerTransactionId: 'provider-tx',
  status: TransactionStatus.PENDING,
  failureReason: null,
  createdAt: new Date('2026-09-01T10:00:00.000Z'),
  updatedAt: new Date('2026-09-01T10:00:00.000Z'),
  completedAt: null,
  user: {
    id: 'user-1',
    firstName: 'Test',
    lastName: 'User',
    displayName: null,
    email: 'user@example.com',
    phone: '+2340000000000',
    username: 'testuser',
    profileImageUrl: null,
  },
  transaction: {
    id: 'transaction-1',
    status: TransactionStatus.PENDING,
    reference: 'TX-1',
    provider: 'FLUTTERWAVE',
    providerReference: 'provider-ref',
    providerTransactionId: 'provider-tx',
    ledgerEntries: [],
  },
  beneficiary: {
    id: 'beneficiary-1',
    type: 'BANK_ACCOUNT',
    institutionName: 'Example Bank',
    providerBankCode: '001',
    accountHolderName: 'Test User',
    accountLast4: '1234',
    mobileMoneyProvider: null,
  },
  payoutAttempts: [],
  webhookEvents: [],
};

const makePrisma = () => ({
  withdrawal: {
    findMany: jest.fn().mockResolvedValue([withdrawal]),
    findUnique: jest.fn().mockResolvedValue(withdrawal),
    count: jest.fn().mockResolvedValue(1),
    aggregate: jest.fn().mockResolvedValue({ _count: { _all: 1 }, _sum: { sourceAmount: '100.00', fee: '3.00' } }),
    groupBy: jest.fn().mockResolvedValue([{ status: TransactionStatus.PENDING, _count: { _all: 1 }, _sum: { sourceAmount: '100.00' } }]),
  },
  $queryRaw: jest.fn().mockResolvedValue([]),
});

describe('AdminWithdrawalsService', () => {
  it('returns paginated real withdrawal records with stats and chart data', async () => {
    const prisma = makePrisma() as any;
    const service = new AdminWithdrawalsService(prisma);

    const result = await service.getAdminWithdrawals({
      page: '2',
      pageSize: '25',
      search: 'user@example.com',
      status: 'PENDING',
      currency: 'NGN',
      country: 'NG',
      method: 'BANK_TRANSFER',
      dateFrom: '2026-09-01',
      dateTo: '2026-09-02',
      sort: 'amount',
      direction: 'asc',
    });

    const findManyArgs = prisma.withdrawal.findMany.mock.calls[0][0];
    expect(findManyArgs.skip).toBe(25);
    expect(findManyArgs.take).toBe(25);
    expect(findManyArgs.orderBy).toEqual({ sourceAmount: 'asc' });
    expect(findManyArgs.where).toEqual(expect.objectContaining({
      status: TransactionStatus.PENDING,
      destinationCurrencyCode: 'NGN',
      countryCode: 'NG',
      paymentMethod: 'BANK_TRANSFER',
      createdAt: expect.objectContaining({ gte: expect.any(Date), lte: expect.any(Date) }),
      OR: expect.arrayContaining([{ reference: { contains: 'user@example.com', mode: 'insensitive' } }]),
    }));
    expect(result.pagination).toEqual({ page: 2, pageSize: 25, total: 1, totalPages: 1 });
    expect(result.withdrawals[0]).toEqual(expect.objectContaining({
      id: 'withdrawal-1',
      userEmail: 'user@example.com',
      status: TransactionStatus.PENDING,
      originalAmount: 150000,
      usdValue: 100,
      method: 'Bank Transfer',
    }));
    expect(result.withdrawals[0]).not.toHaveProperty('passwordHash');
    expect(result.withdrawals[0]).not.toHaveProperty('transactionPinHash');
    expect(result.stats).toEqual(expect.objectContaining({ totalWithdrawals: 1, totalWithdrawalVolume: 100, pendingWithdrawals: 1 }));
  });

  it('returns a safe detail record and rejects missing withdrawals', async () => {
    const prisma = makePrisma() as any;
    const service = new AdminWithdrawalsService(prisma);

    const result = await service.getAdminWithdrawal('withdrawal-1');
    expect(result).toEqual(expect.objectContaining({ id: 'withdrawal-1', providerReference: 'provider-ref' }));
    expect(result.destination).toEqual(expect.objectContaining({ accountNumber: '******1234' }));
    expect(result).not.toHaveProperty('encryptedDetails');

    prisma.withdrawal.findUnique.mockResolvedValue(null);
    await expect(service.getAdminWithdrawal('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns empty records and zero statistics when the database has no withdrawals', async () => {
    const prisma = makePrisma() as any;
    prisma.withdrawal.findMany.mockResolvedValue([]);
    prisma.withdrawal.count.mockResolvedValue(0);
    prisma.withdrawal.aggregate.mockResolvedValue({ _count: { _all: 0 }, _sum: { sourceAmount: null, fee: null } });
    prisma.withdrawal.groupBy.mockResolvedValue([]);
    const service = new AdminWithdrawalsService(prisma);

    const result = await service.getAdminWithdrawals({});

    expect(result.withdrawals).toEqual([]);
    expect(result.pagination).toEqual({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
    expect(result.stats).toEqual(expect.objectContaining({ totalWithdrawals: 0, totalWithdrawalVolume: 0, totalFees: 0 }));
    expect(result.chartData).toEqual(expect.objectContaining({ volumeOverTime: [], statusBreakdown: [] }));
  });
});
