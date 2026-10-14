import { Decimal } from '@prisma/client-runtime-utils';
import { WalletsService } from './wallets.service';

describe('WalletsService restricted referral credit', () => {
  it('reserves referral credit in separate restricted buckets without touching cash balance', async () => {
    const tx: any = {
      wallet: { findFirst: jest.fn().mockResolvedValue({ id: 'wallet-1' }) },
      ledgerEntry: { findUnique: jest.fn().mockResolvedValue(null) },
      walletBalance: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'balance-1',
          referralCreditAvailable: new Decimal('12.00'),
          referralCreditPending: new Decimal('0.00'),
          availableBalance: new Decimal('75.00'),
          pendingBalance: new Decimal('4.00'),
        }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    const ledger: any = {
      recordEntry: jest.fn().mockResolvedValue({ id: 'ledger-1' }),
    };
    const service = new WalletsService({} as any, ledger);

    await service.holdReferralCredit({
      userId: 'user-1',
      walletId: 'wallet-1',
      amountUsd: '5.00',
      transactionId: 'transaction-1',
      reference: 'purchase-1',
      tx,
    });

    expect(tx.walletBalance.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'balance-1',
        referralCreditAvailable: { gte: new Decimal('5.00') },
      },
      data: {
        referralCreditAvailable: { decrement: new Decimal('5.00') },
        referralCreditPending: { increment: new Decimal('5.00') },
      },
    });
    expect(ledger.recordEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'HOLD',
        balanceBefore: new Decimal('75.00'),
        balanceAfter: new Decimal('75.00'),
        referralBalanceBefore: new Decimal('12.00'),
        referralBalanceAfter: new Decimal('7.00'),
        referralPendingBefore: new Decimal('0.00'),
        referralPendingAfter: new Decimal('5.00'),
      }),
      tx,
    );
  });

  it('spends only the reserved referral bucket after a successful gift-card purchase', async () => {
    const tx: any = {
      wallet: { findFirst: jest.fn().mockResolvedValue({ id: 'wallet-1' }) },
      ledgerEntry: { findUnique: jest.fn().mockResolvedValue(null) },
      walletBalance: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'balance-1',
          referralCreditAvailable: new Decimal('7.00'),
          referralCreditPending: new Decimal('5.00'),
          availableBalance: new Decimal('75.00'),
          pendingBalance: new Decimal('4.00'),
        }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    const ledger: any = {
      recordEntry: jest.fn().mockResolvedValue({ id: 'ledger-2' }),
    };
    const service = new WalletsService({} as any, ledger);

    await service.finalizeReferralCredit({
      userId: 'user-1',
      walletId: 'wallet-1',
      amountUsd: '5.00',
      transactionId: 'transaction-1',
      reference: 'purchase-1',
      tx,
    });

    expect(tx.walletBalance.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'balance-1',
        referralCreditPending: { gte: new Decimal('5.00') },
      },
      data: { referralCreditPending: { decrement: new Decimal('5.00') } },
    });
    expect(ledger.recordEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'REFERRAL_DEBIT',
        balanceBefore: new Decimal('75.00'),
        balanceAfter: new Decimal('75.00'),
        pendingBalanceBefore: new Decimal('4.00'),
        pendingBalanceAfter: new Decimal('4.00'),
        referralBalanceBefore: new Decimal('7.00'),
        referralBalanceAfter: new Decimal('7.00'),
        referralPendingBefore: new Decimal('5.00'),
        referralPendingAfter: new Decimal('0.00'),
      }),
      tx,
    );
  });
});
