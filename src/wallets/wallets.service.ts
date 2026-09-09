import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService, private readonly ledger: LedgerService) {}

  private validateAmount(amount: Decimal | string | number) {
    const value = amount instanceof Decimal ? amount : new Decimal(String(amount));
    if (!value.isFinite() || value.lte(0)) {
      throw new BadRequestException('Amount must be greater than zero.');
    }
    return value.toDecimalPlaces(2);
  }

  private isUniqueViolation(error: unknown) {
    return error && typeof error === 'object' && (error as { code?: string }).code === 'P2002';
  }

  private async mutateHeldFunds(input: {
    userId: string;
    walletId: string;
    currencyCode: string;
    amount: Decimal | string | number;
    transactionId?: string | null;
    reference: string;
    operation: 'HOLD' | 'RELEASE' | 'FINALIZE';
    tx?: any;
  }) {
    const amount = this.validateAmount(input.amount);
    const operationKey = `${input.reference}:${input.operation}`;
    const client = input.tx ?? this.prisma;

    try {
      const operation = async (tx: any) => {
        const wallet = await tx.wallet.findFirst({ where: { id: input.walletId, userId: input.userId } });
        if (!wallet) throw new NotFoundException('Wallet not found.');

        const existingOperation = await tx.ledgerEntry.findUnique({ where: { operationKey } });
        if (existingOperation) return { alreadyProcessed: true, ledgerEntryId: existingOperation.id };

        const balance = await tx.walletBalance.findUnique({
          where: { walletId_currencyCode: { walletId: input.walletId, currencyCode: input.currencyCode } },
        });
        if (!balance) throw new NotFoundException('Wallet balance not found.');

        const availableBefore = new Decimal(balance.availableBalance.toString());
        const pendingBefore = new Decimal(balance.pendingBalance.toString());
        const isHold = input.operation === 'HOLD';
        const sourceBefore = isHold ? availableBefore : pendingBefore;
        if (sourceBefore.lt(amount)) {
          throw new BadRequestException(isHold ? 'Insufficient available balance.' : 'Insufficient pending balance.');
        }

        let updatedRows: number;
        if (isHold) {
          updatedRows = await tx.$executeRaw`
            UPDATE "WalletBalance"
            SET "availableBalance" = "availableBalance" - ${amount.toString()}::numeric,
                "pendingBalance" = "pendingBalance" + ${amount.toString()}::numeric,
                "updatedAt" = NOW()
            WHERE "id" = ${balance.id}
              AND "availableBalance" >= ${amount.toString()}::numeric
          `;
        } else if (input.operation === 'RELEASE') {
          updatedRows = await tx.$executeRaw`
            UPDATE "WalletBalance"
            SET "availableBalance" = "availableBalance" + ${amount.toString()}::numeric,
                "pendingBalance" = "pendingBalance" - ${amount.toString()}::numeric,
                "updatedAt" = NOW()
            WHERE "id" = ${balance.id}
              AND "pendingBalance" >= ${amount.toString()}::numeric
          `;
        } else {
          updatedRows = await tx.$executeRaw`
            UPDATE "WalletBalance"
            SET "pendingBalance" = "pendingBalance" - ${amount.toString()}::numeric,
                "updatedAt" = NOW()
            WHERE "id" = ${balance.id}
              AND "pendingBalance" >= ${amount.toString()}::numeric
          `;
        }
        if (updatedRows !== 1) {
          throw new BadRequestException(isHold ? 'Insufficient available balance.' : 'Insufficient pending balance.');
        }

        const availableAfter = isHold
          ? availableBefore.minus(amount)
          : input.operation === 'RELEASE' ? availableBefore.plus(amount) : availableBefore;
        const pendingAfter = isHold ? pendingBefore.plus(amount) : pendingBefore.minus(amount);
        const entry = await this.ledger.recordEntry({
          walletId: input.walletId,
          currencyCode: input.currencyCode,
          type: input.operation === 'HOLD' ? 'HOLD' : input.operation === 'RELEASE' ? 'RELEASE' : 'DEBIT',
          amount,
          balanceBefore: availableBefore,
          balanceAfter: availableAfter,
          pendingBalanceBefore: pendingBefore,
          pendingBalanceAfter: pendingAfter,
          transactionId: input.transactionId,
          reference: input.reference,
          operationKey,
          reason: input.operation === 'HOLD' ? 'Withdrawal funds held' : input.operation === 'RELEASE' ? 'Withdrawal funds released' : 'Withdrawal funds finalized',
        }, tx);

        return { alreadyProcessed: false, ledgerEntryId: entry.id };
      };
      return await (input.tx ? operation(input.tx) : client.$transaction(operation));
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        const existing = await client.ledgerEntry.findUnique({ where: { operationKey } });
        if (existing) return { alreadyProcessed: true, ledgerEntryId: existing.id };
      }
      throw error;
    }
  }

  holdFunds(input: { userId: string; walletId: string; currencyCode: string; amount: Decimal | string | number; transactionId?: string | null; reference: string }, tx?: any) {
    return this.mutateHeldFunds({ ...input, operation: 'HOLD', tx });
  }

  releaseHeldFunds(input: { userId: string; walletId: string; currencyCode: string; amount: Decimal | string | number; transactionId?: string | null; reference: string }, tx?: any) {
    return this.mutateHeldFunds({ ...input, operation: 'RELEASE', tx });
  }

  finalizeHeldFunds(input: { userId: string; walletId: string; currencyCode: string; amount: Decimal | string | number; transactionId?: string | null; reference: string }, tx?: any) {
    return this.mutateHeldFunds({ ...input, operation: 'FINALIZE', tx });
  }

  async getOrCreateWallet(userId: string) {
    return (this.prisma as any).wallet.upsert({
      where: { userId },
      update: {},
      create: { id: randomUUID(), userId },
    });
  }

  async getWallet(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    const balances = await (this.prisma as any).walletBalance.findMany({
      where: { walletId: wallet.id },
      include: { currency: true },
      orderBy: { currencyCode: 'asc' },
    });

    return {
      wallet: {
        id: wallet.id,
        userId: wallet.userId,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      },
      balances: balances.map((balance) => ({
        id: balance.id,
        currency: balance.currencyCode,
        currencyName: balance.currency.name,
        symbol: balance.currency.symbol,
        availableBalance: balance.availableBalance.toString(),
        pendingBalance: balance.pendingBalance.toString(),
        updatedAt: balance.updatedAt,
      })),
    };
  }

  async getBalances(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    const balances = await (this.prisma as any).walletBalance.findMany({
      where: { walletId: wallet.id },
      include: { currency: true },
      orderBy: { currencyCode: 'asc' },
    });

    return balances.map((item) => ({
      id: item.id,
      walletId: item.walletId,
      currency: item.currencyCode,
      name: item.currency.name,
      symbol: item.currency.symbol,
      availableBalance: item.availableBalance.toString(),
      pendingBalance: item.pendingBalance.toString(),
      updatedAt: item.updatedAt,
    }));
  }

  async getWalletById(walletId: string) {
    const wallet = await (this.prisma as any).wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found.');
    return wallet;
  }

  async ensureBalance(walletId: string, currencyCode: string) {
    const existing = await (this.prisma as any).walletBalance.findUnique({
      where: { walletId_currencyCode: { walletId, currencyCode } },
      include: { currency: true },
    });

    if (existing) return existing;

    const currency = await (this.prisma as any).currency.findUnique({ where: { code: currencyCode } });
    if (!currency) throw new NotFoundException(`Currency ${currencyCode} is not configured.`);

    return (this.prisma as any).walletBalance.create({
      data: {
        walletId,
        currencyCode,
        availableBalance: new Decimal(0),
        pendingBalance: new Decimal(0),
      },
      include: { currency: true },
    });
  }
}
