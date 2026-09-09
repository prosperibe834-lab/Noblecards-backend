import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { LedgerService } from '../ledger/ledger.service';
import { WalletsService } from './wallets.service';

describe('WalletsService held funds', () => {
  const walletId = 'wallet-1';
  const userId = 'user-1';
  let prisma: any;
  let ledger: { recordEntry: jest.Mock };
  let service: WalletsService;

  beforeEach(() => {
    prisma = {
      wallet: { findFirst: jest.fn().mockResolvedValue({ id: walletId, userId }) },
      walletBalance: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'balance-1',
          availableBalance: new Decimal('100.00'),
          pendingBalance: new Decimal('0.00'),
        }),
      },
      ledgerEntry: { findUnique: jest.fn().mockResolvedValue(null) },
      $executeRaw: jest.fn().mockResolvedValue(1),
      $transaction: jest.fn((callback: (tx: any) => unknown) => callback(prisma)),
    };
    ledger = { recordEntry: jest.fn().mockResolvedValue({ id: 'ledger-1' }) };
    service = new WalletsService(prisma as never, ledger as never as LedgerService);
  });

  it('holds funds atomically and records both balance snapshots', async () => {
    await expect(service.holdFunds({
      userId,
      walletId,
      currencyCode: 'USD',
      amount: '80.00',
      reference: 'WD-1',
    })).resolves.toEqual({ alreadyProcessed: false, ledgerEntryId: 'ledger-1' });

    expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
    expect(ledger.recordEntry).toHaveBeenCalledWith(expect.objectContaining({
      type: 'HOLD',
      amount: new Decimal('80.00'),
      balanceBefore: new Decimal('100.00'),
      balanceAfter: new Decimal('20.00'),
      pendingBalanceBefore: new Decimal('0.00'),
      pendingBalanceAfter: new Decimal('80.00'),
      operationKey: 'WD-1:HOLD',
    }), prisma);
  });

  it('rejects insufficient holds without writing a ledger entry', async () => {
    await expect(service.holdFunds({
      userId,
      walletId,
      currencyCode: 'USD',
      amount: '101.00',
      reference: 'WD-2',
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
    expect(ledger.recordEntry).not.toHaveBeenCalled();
  });

  it('rejects access to another user wallet', async () => {
    prisma.wallet.findFirst.mockResolvedValue(null);

    await expect(service.holdFunds({
      userId: 'user-2',
      walletId,
      currencyCode: 'USD',
      amount: '10.00',
      reference: 'WD-3',
    })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('releases held funds and increases available balance', async () => {
    prisma.walletBalance.findUnique.mockResolvedValue({
      id: 'balance-1',
      availableBalance: new Decimal('20.00'),
      pendingBalance: new Decimal('80.00'),
    });

    await service.releaseHeldFunds({ userId, walletId, currencyCode: 'USD', amount: '80.00', reference: 'WD-4' });

    expect(ledger.recordEntry).toHaveBeenCalledWith(expect.objectContaining({
      type: 'RELEASE',
      balanceAfter: new Decimal('100.00'),
      pendingBalanceAfter: new Decimal('0.00'),
      operationKey: 'WD-4:RELEASE',
    }), prisma);
  });

  it('finalizes held funds without reducing available balance again', async () => {
    prisma.walletBalance.findUnique.mockResolvedValue({
      id: 'balance-1',
      availableBalance: new Decimal('20.00'),
      pendingBalance: new Decimal('80.00'),
    });

    await service.finalizeHeldFunds({ userId, walletId, currencyCode: 'USD', amount: '80.00', reference: 'WD-5' });

    expect(ledger.recordEntry).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DEBIT',
      balanceBefore: new Decimal('20.00'),
      balanceAfter: new Decimal('20.00'),
      pendingBalanceAfter: new Decimal('0.00'),
      operationKey: 'WD-5:FINALIZE',
    }), prisma);
  });

  it('returns the existing operation without mutating twice', async () => {
    prisma.ledgerEntry.findUnique.mockResolvedValue({ id: 'ledger-existing' });

    await expect(service.holdFunds({ userId, walletId, currencyCode: 'USD', amount: '80.00', reference: 'WD-6' }))
      .resolves.toEqual({ alreadyProcessed: true, ledgerEntryId: 'ledger-existing' });
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
    expect(ledger.recordEntry).not.toHaveBeenCalled();
  });

  it('does not create a ledger entry when the atomic balance update affects no row', async () => {
    prisma.$executeRaw.mockResolvedValue(0);

    await expect(service.holdFunds({ userId, walletId, currencyCode: 'USD', amount: '80.00', reference: 'WD-7' }))
      .rejects.toBeInstanceOf(BadRequestException);
    expect(ledger.recordEntry).not.toHaveBeenCalled();
  });
});