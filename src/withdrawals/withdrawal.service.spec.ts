import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { PaymentMethod, TransactionStatus, WithdrawalQuoteStatus } from '../generated/prisma';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import { WithdrawalService } from './withdrawal.service';

describe('WithdrawalService', () => {
  const baseQuote = {
    id: 'quote-1',
    userId: 'user-1',
    sourceCurrencyCode: 'USD',
    destinationCurrencyCode: 'NGN',
    countryCode: 'NG',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    sourceAmount: new Decimal('100.00'),
    exchangeRate: new Decimal('1.50'),
    destinationAmount: new Decimal('150.00'),
    destinationFee: new Decimal('3.00'),
    recipientAmount: new Decimal('147.00'),
    providerFee: new Decimal('2.00'),
    nobleCardsFee: new Decimal('1.00'),
    totalFee: new Decimal('3.00'),
    amountReceived: new Decimal('147.00'),
    status: WithdrawalQuoteStatus.ACTIVE,
    expiresAt: new Date(Date.now() + 60_000),
    usedAt: null,
  };

  const makeService = (overrides?: Partial<{ quote: any; beneficiary: any; wallet: any; balance: any; existingWithdrawal: any }>) => {
    const prisma = {
      $transaction: jest.fn(async (callback: (tx: any) => any) => callback(prisma)),
      withdrawal: {
        findFirst: jest.fn().mockResolvedValue(overrides?.existingWithdrawal ?? null),
        create: jest.fn().mockImplementation(async ({ data }) => ({ id: 'withdrawal-1', ...data })),
      },
      withdrawalQuote: {
        findFirst: jest.fn().mockResolvedValue(overrides?.quote ?? baseQuote),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      beneficiary: {
        findFirst: jest.fn().mockResolvedValue(overrides?.beneficiary ?? {
          id: 'beneficiary-1',
          userId: 'user-1',
          country: 'Nigeria',
          countryCode: 'NG',
          currencyCode: 'NGN',
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          isActive: true,
          verificationStatus: 'VERIFIED',
        }),
      },
      wallet: { findFirst: jest.fn().mockResolvedValue(overrides?.wallet ?? { id: 'wallet-1', userId: 'user-1' }) },
      walletBalance: { findUnique: jest.fn().mockResolvedValue(overrides?.balance ?? { id: 'balance-1', availableBalance: new Decimal('1000.00'), pendingBalance: new Decimal('0.00') }) },
      transaction: { create: jest.fn().mockImplementation(async ({ data }) => ({ id: 'tx-1', ...data })) },
    } as any;

    const users = { verifyTransactionPin: jest.fn().mockResolvedValue(true) } as unknown as UsersService;
    const wallets = {
      holdFunds: jest.fn().mockResolvedValue({ alreadyProcessed: false, ledgerEntryId: 'ledger-1' }),
    } as unknown as WalletsService;

    const service = new WithdrawalService(prisma, wallets, users);
    return { service, prisma, users, wallets };
  };

  it('creates an internal withdrawal and holds the quote source amount', async () => {
    const { service, prisma, wallets, users } = makeService();

    const result = await service.createWithdrawal('user-1', {
      quoteId: 'quote-1',
      beneficiaryId: 'beneficiary-1',
      idempotencyKey: 'wd-req-1',
      pin: '1234',
    });

    expect(users.verifyTransactionPin).toHaveBeenCalledWith('user-1', '1234');
    expect(prisma.withdrawalQuote.updateMany).toHaveBeenCalled();
    expect(wallets.holdFunds).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user-1',
      walletId: 'wallet-1',
      currencyCode: 'USD',
      amount: expect.anything(),
      transactionId: expect.any(String),
      reference: expect.stringContaining('withdrawal:'),
    }), prisma);
    expect(result.reference).toMatch(/^WD-/);
    expect(result.status).toBe(TransactionStatus.PENDING);
    expect(result.quoteId).toBe('quote-1');
  });

  it('rejects an expired quote before creating a withdrawal', async () => {
    const { service } = makeService({
      quote: { ...baseQuote, status: WithdrawalQuoteStatus.EXPIRED, expiresAt: new Date(Date.now() - 1000) },
    });

    await expect(service.createWithdrawal('user-1', {
      quoteId: 'quote-1',
      beneficiaryId: 'beneficiary-1',
      idempotencyKey: 'wd-req-2',
      pin: '1234',
    })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects duplicate idempotent withdrawals and returns the original record', async () => {
    const existingWithdrawal = {
      id: 'existing-withdrawal',
      reference: 'WD-EXISTING',
      userId: 'user-1',
      walletId: 'wallet-1',
      quoteId: 'quote-1',
      beneficiaryId: 'beneficiary-1',
      status: TransactionStatus.PENDING,
      sourceCurrencyCode: 'USD',
      destinationCurrencyCode: 'NGN',
      sourceAmount: new Decimal('100.00'),
      destinationAmount: new Decimal('150.00'),
      exchangeRate: new Decimal('1.50'),
      fee: new Decimal('3.00'),
      amountReceived: new Decimal('147.00'),
      country: 'Nigeria',
      countryCode: 'NG',
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      idempotencyKey: 'wd-req-3',
      createdAt: new Date(),
      updatedAt: new Date(),
      transaction: { id: 'tx-1', status: TransactionStatus.PENDING },
    };

    const { service } = makeService({ existingWithdrawal });

    const result = await service.createWithdrawal('user-1', {
      quoteId: 'quote-1',
      beneficiaryId: 'beneficiary-1',
      idempotencyKey: 'wd-req-3',
      pin: '1234',
    });

    expect(result.id).toBe('existing-withdrawal');
    expect(result.reference).toBe('WD-EXISTING');
  });

  it('does not allow a quote to be consumed twice', async () => {
    const { service, prisma } = makeService();
    prisma.withdrawalQuote.updateMany.mockResolvedValue({ count: 0 });

    await expect(service.createWithdrawal('user-1', {
      quoteId: 'quote-1',
      beneficiaryId: 'beneficiary-1',
      idempotencyKey: 'wd-req-4',
      pin: '1234',
    })).rejects.toBeInstanceOf(ConflictException);
  });
});
