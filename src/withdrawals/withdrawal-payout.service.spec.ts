import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PaymentMethod, TransactionStatus } from '../generated/prisma';
import { WithdrawalPayoutService } from './withdrawal-payout.service';

const makeWithdrawal = (overrides: Record<string, unknown> = {}) => ({
  id: 'withdrawal-1',
  userId: 'user-1',
  reference: 'WD-123',
  status: TransactionStatus.PENDING,
  sourceCurrencyCode: 'USD',
  destinationCurrencyCode: 'NGN',
  sourceAmount: '100.00',
  amountReceived: '147.00',
  paymentMethod: PaymentMethod.BANK_TRANSFER,
  countryCode: 'NG',
  beneficiary: { id: 'beneficiary-1', type: 'BANK_ACCOUNT', isActive: true },
  transaction: { id: 'transaction-1', status: TransactionStatus.PENDING },
  ...overrides,
});

describe('WithdrawalPayoutService', () => {
  const makeService = (withdrawal = makeWithdrawal()) => {
    const prisma = {
      withdrawal: { findFirst: jest.fn().mockResolvedValue(withdrawal) },
      payoutAttempt: { findFirst: jest.fn().mockResolvedValue(null) },
    } as any;
    const provider = {
      supportsPayout: jest.fn().mockReturnValue(false),
      createTransfer: jest.fn(),
      getPayoutStatus: jest.fn(),
      verifyWebhook: jest.fn(),
    };
    const wallets = { finalizeHeldFunds: jest.fn(), releaseHeldFunds: jest.fn() } as any;
    const encryption = { decrypt: jest.fn().mockReturnValue({ accountNumber: '1234567890', institutionCode: '044' }) } as any;
    return { service: new WithdrawalPayoutService(prisma, wallets, encryption, provider), prisma, provider };
  };

  it('rejects an unsupported payout route before creating an attempt or calling a provider', async () => {
    const { service, provider } = makeService();

    await expect(service.execute('user-1', 'withdrawal-1'))
      .rejects.toMatchObject({ response: expect.objectContaining({ message: expect.stringContaining('PROVIDER_CAPABILITY_UNSUPPORTED') }) });

    expect(provider.supportsPayout).toHaveBeenCalledWith({
      countryCode: 'NG',
      currencyCode: 'NGN',
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      beneficiaryType: 'BANK_ACCOUNT',
    });
    expect(provider.createTransfer).not.toHaveBeenCalled();
  });

  it('enforces ownership before capability checks', async () => {
    const { service, provider, prisma } = makeService(null as any);

    await expect(service.execute('user-2', 'withdrawal-1')).rejects.toBeInstanceOf(NotFoundException);
    expect(provider.supportsPayout).not.toHaveBeenCalled();
    expect(prisma.withdrawal.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'withdrawal-1', userId: 'user-2' },
    }));
  });

  it('does not execute a withdrawal already in processing or terminal state', async () => {
    const processing = makeService(makeWithdrawal({ status: TransactionStatus.PROCESSING }));
    await expect(processing.service.execute('user-1', 'withdrawal-1')).rejects.toBeInstanceOf(ConflictException);
    expect(processing.provider.supportsPayout).not.toHaveBeenCalled();

    const successful = makeService(makeWithdrawal({ status: TransactionStatus.SUCCESSFUL }));
    await expect(successful.service.execute('user-1', 'withdrawal-1')).rejects.toBeInstanceOf(ConflictException);
    expect(successful.provider.supportsPayout).not.toHaveBeenCalled();
  });

  it('does not reconcile unsupported provider status', async () => {
    const { service, provider } = makeService(makeWithdrawal({ status: TransactionStatus.UNDER_REVIEW }));

    await expect(service.reconcile('user-1', 'withdrawal-1'))
      .rejects.toBeInstanceOf(BadRequestException);
    expect(provider.getPayoutStatus).not.toHaveBeenCalled();
  });

  it('keeps a successful payout under review when a reversal has no verified returned-funds amount', async () => {
    const withdrawal = makeWithdrawal({ status: TransactionStatus.SUCCESSFUL });
    const { service, provider, prisma } = makeService(withdrawal);
    const event = { id: 'event-1' };
    prisma.providerWebhookEvent = {
      create: jest.fn().mockResolvedValue(event),
      update: jest.fn().mockResolvedValue(event),
    };
    prisma.payoutAttempt = {
      findFirst: jest.fn().mockResolvedValue({ id: 'attempt-1', withdrawalId: 'withdrawal-1', providerTransactionId: 'trf-1', attemptNumber: 1 }),
      update: jest.fn().mockResolvedValue({}),
    };
    prisma.withdrawal.findUnique = jest.fn().mockResolvedValue({ ...withdrawal, transaction: withdrawal.transaction });
    prisma.withdrawal.updateMany = jest.fn().mockResolvedValue({ count: 1 });
    provider.verifyWebhook.mockResolvedValue({ valid: true, eventId: 'event-1', providerTransactionId: 'trf-1', providerReference: 'WD-123', status: 'UNKNOWN' });

    const result = await service.handleWebhook('signature', JSON.stringify({ type: 'transfer.reversal', data: { id: 'trf-1', reference: 'WD-123', status: 'SUCCESSFUL' } }));

    expect(result).toEqual({ processed: true, reversal: true, status: TransactionStatus.UNDER_REVIEW });
    expect(provider.verifyWebhook).toHaveBeenCalled();
    expect(prisma.withdrawal.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: TransactionStatus.UNDER_REVIEW }) }));
    expect(prisma.payoutAttempt.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: TransactionStatus.UNDER_REVIEW }) }));
  });
});
