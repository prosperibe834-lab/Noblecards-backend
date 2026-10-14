import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { PrismaService } from '../prisma/prisma.service';

type LedgerEntryType =
  | 'CREDIT'
  | 'DEBIT'
  | 'HOLD'
  | 'RELEASE'
  | 'FEE'
  | 'REFUND'
  | 'REVERSAL'
  | 'ADJUSTMENT'
  | 'REFERRAL_CREDIT'
  | 'REFERRAL_DEBIT';

@Injectable()
export class LedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async recordEntry(
    input: {
      walletId: string;
      currencyCode: string;
      type: LedgerEntryType;
      amount: Decimal | string | number;
      balanceBefore: Decimal | string | number;
      balanceAfter: Decimal | string | number;
      pendingBalanceBefore?: Decimal | string | number | null;
      pendingBalanceAfter?: Decimal | string | number | null;
      referralBalanceBefore?: Decimal | string | number | null;
      referralBalanceAfter?: Decimal | string | number | null;
      referralPendingBefore?: Decimal | string | number | null;
      referralPendingAfter?: Decimal | string | number | null;
      transactionId?: string | null;
      operationKey?: string | null;
      reference?: string | null;
      reason?: string | null;
    },
    tx?: any,
  ) {
    const client = tx ?? this.prisma;
    return (client as any).ledgerEntry.create({
      data: {
        walletId: input.walletId,
        currencyCode: input.currencyCode,
        transactionId: input.transactionId ?? null,
        type: input.type,
        amount:
          input.amount instanceof Decimal
            ? input.amount
            : new Decimal(String(input.amount)),
        balanceBefore:
          input.balanceBefore instanceof Decimal
            ? input.balanceBefore
            : new Decimal(String(input.balanceBefore)),
        balanceAfter:
          input.balanceAfter instanceof Decimal
            ? input.balanceAfter
            : new Decimal(String(input.balanceAfter)),
        pendingBalanceBefore:
          input.pendingBalanceBefore == null
            ? null
            : input.pendingBalanceBefore instanceof Decimal
              ? input.pendingBalanceBefore
              : new Decimal(String(input.pendingBalanceBefore)),
        pendingBalanceAfter:
          input.pendingBalanceAfter == null
            ? null
            : input.pendingBalanceAfter instanceof Decimal
              ? input.pendingBalanceAfter
              : new Decimal(String(input.pendingBalanceAfter)),
        referralBalanceBefore:
          input.referralBalanceBefore == null
            ? null
            : input.referralBalanceBefore instanceof Decimal
              ? input.referralBalanceBefore
              : new Decimal(String(input.referralBalanceBefore)),
        referralBalanceAfter:
          input.referralBalanceAfter == null
            ? null
            : input.referralBalanceAfter instanceof Decimal
              ? input.referralBalanceAfter
              : new Decimal(String(input.referralBalanceAfter)),
        referralPendingBefore:
          input.referralPendingBefore == null
            ? null
            : input.referralPendingBefore instanceof Decimal
              ? input.referralPendingBefore
              : new Decimal(String(input.referralPendingBefore)),
        referralPendingAfter:
          input.referralPendingAfter == null
            ? null
            : input.referralPendingAfter instanceof Decimal
              ? input.referralPendingAfter
              : new Decimal(String(input.referralPendingAfter)),
        operationKey: input.operationKey ?? null,
        reference: input.reference ?? null,
        reason: input.reason ?? null,
      },
    });
  }
}
