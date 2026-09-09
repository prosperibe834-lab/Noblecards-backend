import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { PrismaService } from '../prisma/prisma.service';

type LedgerEntryType = 'CREDIT' | 'DEBIT' | 'HOLD' | 'RELEASE' | 'FEE' | 'REFUND' | 'REVERSAL' | 'ADJUSTMENT';

@Injectable()
export class LedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async recordEntry(input: {
    walletId: string;
    currencyCode: string;
    type: LedgerEntryType;
    amount: Decimal | string | number;
    balanceBefore: Decimal | string | number;
    balanceAfter: Decimal | string | number;
    pendingBalanceBefore?: Decimal | string | number | null;
    pendingBalanceAfter?: Decimal | string | number | null;
    transactionId?: string | null;
    reference?: string | null;
    operationKey?: string | null;
    reason?: string | null;
  }, client: any = this.prisma) {
    return client.ledgerEntry.create({
      data: {
        walletId: input.walletId,
        currencyCode: input.currencyCode,
        transactionId: input.transactionId ?? null,
        type: input.type,
        amount: input.amount instanceof Decimal ? input.amount : new Decimal(String(input.amount)),
        balanceBefore: input.balanceBefore instanceof Decimal ? input.balanceBefore : new Decimal(String(input.balanceBefore)),
        balanceAfter: input.balanceAfter instanceof Decimal ? input.balanceAfter : new Decimal(String(input.balanceAfter)),
        pendingBalanceBefore: input.pendingBalanceBefore == null ? null : input.pendingBalanceBefore instanceof Decimal ? input.pendingBalanceBefore : new Decimal(String(input.pendingBalanceBefore)),
        pendingBalanceAfter: input.pendingBalanceAfter == null ? null : input.pendingBalanceAfter instanceof Decimal ? input.pendingBalanceAfter : new Decimal(String(input.pendingBalanceAfter)),
        reference: input.reference ?? null,
        operationKey: input.operationKey ?? null,
        reason: input.reason ?? null,
      },
    });
  }
}
