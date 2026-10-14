import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { randomUUID } from 'node:crypto';
import { LedgerService } from '../ledger/ledger.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService,
  ) {}

  private validateAmount(amount: Decimal | string | number) {
    const value =
      amount instanceof Decimal ? amount : new Decimal(String(amount));
    if (!value.isFinite() || value.lte(0)) {
      throw new BadRequestException('Amount must be greater than zero.');
    }
    return value.toDecimalPlaces(2);
  }

  private isUniqueViolation(error: unknown) {
    return (
      error &&
      typeof error === 'object' &&
      (error as { code?: string }).code === 'P2002'
    );
  }

  async holdReferralCredit(input: {
    userId: string;
    walletId: string;
    amountUsd: Decimal | string | number;
    transactionId?: string | null;
    reference: string;
    tx?: any;
  }) {
    return this.mutateReferralCredit({ ...input, operation: 'HOLD' });
  }

  async releaseReferralCredit(input: {
    userId: string;
    walletId: string;
    amountUsd: Decimal | string | number;
    transactionId?: string | null;
    reference: string;
    tx?: any;
  }) {
    return this.mutateReferralCredit({ ...input, operation: 'RELEASE' });
  }

  async finalizeReferralCredit(input: {
    userId: string;
    walletId: string;
    amountUsd: Decimal | string | number;
    transactionId?: string | null;
    reference: string;
    tx?: any;
  }) {
    return this.mutateReferralCredit({ ...input, operation: 'FINALIZE' });
  }

  private async mutateReferralCredit(input: {
    userId: string;
    walletId: string;
    amountUsd: Decimal | string | number;
    transactionId?: string | null;
    reference: string;
    operation: 'HOLD' | 'RELEASE' | 'FINALIZE';
    tx?: any;
  }) {
    const amount = this.validateAmount(input.amountUsd);
    const operationKey = `${input.reference}:REFERRAL_${input.operation}`;
    const client = input.tx ?? this.prisma;
    const perform = async (tx: any) => {
      const wallet = await tx.wallet.findFirst({
        where: { id: input.walletId, userId: input.userId },
      });
      if (!wallet) throw new NotFoundException('Wallet not found.');
      if (await tx.ledgerEntry.findUnique({ where: { operationKey } })) {
        return { alreadyProcessed: true };
      }
      const balance = await tx.walletBalance.findUnique({
        where: {
          walletId_currencyCode: {
            walletId: input.walletId,
            currencyCode: 'USD',
          },
        },
      });
      if (!balance)
        throw new NotFoundException('USD wallet balance not found.');
      const availableBefore = new Decimal(
        balance.referralCreditAvailable.toString(),
      );
      const pendingBefore = new Decimal(
        balance.referralCreditPending.toString(),
      );
      const holding = input.operation === 'HOLD';
      const releasing = input.operation === 'RELEASE';
      const source = holding ? availableBefore : pendingBefore;
      if (source.lt(amount)) {
        throw new BadRequestException(
          holding
            ? 'Insufficient restricted referral credit.'
            : 'Insufficient pending referral credit.',
        );
      }
      const updated = await tx.walletBalance.updateMany({
        where: {
          id: balance.id,
          ...(holding
            ? { referralCreditAvailable: { gte: amount } }
            : { referralCreditPending: { gte: amount } }),
        },
        data: holding
          ? {
              referralCreditAvailable: { decrement: amount },
              referralCreditPending: { increment: amount },
            }
          : releasing
            ? {
                referralCreditAvailable: { increment: amount },
                referralCreditPending: { decrement: amount },
              }
            : { referralCreditPending: { decrement: amount } },
      });
      if (updated.count !== 1) {
        throw new BadRequestException(
          'Referral credit balance changed; retry the purchase.',
        );
      }
      const availableAfter = holding
        ? availableBefore.minus(amount)
        : releasing
          ? availableBefore.plus(amount)
          : availableBefore;
      const pendingAfter = holding
        ? pendingBefore.plus(amount)
        : pendingBefore.minus(amount);
      await this.ledger.recordEntry(
        {
          walletId: input.walletId,
          currencyCode: 'USD',
          type: holding ? 'HOLD' : releasing ? 'RELEASE' : 'REFERRAL_DEBIT',
          amount,
          balanceBefore: balance.availableBalance,
          balanceAfter: balance.availableBalance,
          pendingBalanceBefore: balance.pendingBalance,
          pendingBalanceAfter: balance.pendingBalance,
          referralBalanceBefore: availableBefore,
          referralBalanceAfter: availableAfter,
          referralPendingBefore: pendingBefore,
          referralPendingAfter: pendingAfter,
          transactionId: input.transactionId,
          operationKey,
          reference: input.reference,
          reason: holding
            ? 'Restricted referral credit reserved for gift-card purchase'
            : releasing
              ? 'Reserved referral credit returned after unsuccessful purchase'
              : 'Restricted referral credit spent on gift-card purchase',
        },
        tx,
      );
      return { alreadyProcessed: false };
    };
    try {
      return input.tx
        ? await perform(input.tx)
        : await client.$transaction(perform);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        const existing = await client.ledgerEntry.findUnique({
          where: { operationKey },
        });
        if (existing) return { alreadyProcessed: true };
      }
      throw error;
    }
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
        const wallet = await tx.wallet.findFirst({
          where: { id: input.walletId, userId: input.userId },
        });
        if (!wallet) throw new NotFoundException('Wallet not found.');

        const existingOperation = await tx.ledgerEntry.findUnique({
          where: { operationKey },
        });
        if (existingOperation)
          return {
            alreadyProcessed: true,
            ledgerEntryId: existingOperation.id,
          };

        const balance = await tx.walletBalance.findUnique({
          where: {
            walletId_currencyCode: {
              walletId: input.walletId,
              currencyCode: input.currencyCode,
            },
          },
        });
        if (!balance) throw new NotFoundException('Wallet balance not found.');

        const availableBefore = new Decimal(
          balance.availableBalance.toString(),
        );
        const pendingBefore = new Decimal(balance.pendingBalance.toString());
        const isHold = input.operation === 'HOLD';
        const sourceBefore = isHold ? availableBefore : pendingBefore;
        if (sourceBefore.lt(amount)) {
          throw new BadRequestException(
            isHold
              ? 'Insufficient available balance.'
              : 'Insufficient pending balance.',
          );
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
          throw new BadRequestException(
            isHold
              ? 'Insufficient available balance.'
              : 'Insufficient pending balance.',
          );
        }

        const availableAfter = isHold
          ? availableBefore.minus(amount)
          : input.operation === 'RELEASE'
            ? availableBefore.plus(amount)
            : availableBefore;
        const pendingAfter = isHold
          ? pendingBefore.plus(amount)
          : pendingBefore.minus(amount);
        const entry = await this.ledger.recordEntry(
          {
            walletId: input.walletId,
            currencyCode: input.currencyCode,
            type:
              input.operation === 'HOLD'
                ? 'HOLD'
                : input.operation === 'RELEASE'
                  ? 'RELEASE'
                  : 'DEBIT',
            amount,
            balanceBefore: availableBefore,
            balanceAfter: availableAfter,
            pendingBalanceBefore: pendingBefore,
            pendingBalanceAfter: pendingAfter,
            transactionId: input.transactionId,
            reference: input.reference,
            operationKey,
            reason:
              input.operation === 'HOLD'
                ? 'Withdrawal funds held'
                : input.operation === 'RELEASE'
                  ? 'Withdrawal funds released'
                  : 'Withdrawal funds finalized',
          },
          tx,
        );

        return { alreadyProcessed: false, ledgerEntryId: entry.id };
      };
      return await (input.tx
        ? operation(input.tx)
        : client.$transaction(operation));
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        const existing = await client.ledgerEntry.findUnique({
          where: { operationKey },
        });
        if (existing)
          return { alreadyProcessed: true, ledgerEntryId: existing.id };
      }
      throw error;
    }
  }

  holdFunds(
    input: {
      userId: string;
      walletId: string;
      currencyCode: string;
      amount: Decimal | string | number;
      transactionId?: string | null;
      reference: string;
    },
    tx?: any,
  ) {
    return this.mutateHeldFunds({ ...input, operation: 'HOLD', tx });
  }

  releaseHeldFunds(
    input: {
      userId: string;
      walletId: string;
      currencyCode: string;
      amount: Decimal | string | number;
      transactionId?: string | null;
      reference: string;
    },
    tx?: any,
  ) {
    return this.mutateHeldFunds({ ...input, operation: 'RELEASE', tx });
  }

  finalizeHeldFunds(
    input: {
      userId: string;
      walletId: string;
      currencyCode: string;
      amount: Decimal | string | number;
      transactionId?: string | null;
      reference: string;
    },
    tx?: any,
  ) {
    return this.mutateHeldFunds({ ...input, operation: 'FINALIZE', tx });
  }

  async getOrCreateWallet(userId: string) {
    const wallet = await (this.prisma as any).wallet.upsert({
      where: { userId },
      update: {},
      create: { id: randomUUID(), userId },
    });
    await this.ensureBalance(wallet.id, 'USD');
    return wallet;
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
        referralCreditAvailable: balance.referralCreditAvailable.toString(),
        referralCreditPending: balance.referralCreditPending.toString(),
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
      referralCreditAvailable: item.referralCreditAvailable.toString(),
      referralCreditPending: item.referralCreditPending.toString(),
      updatedAt: item.updatedAt,
    }));
  }

  async getWalletById(walletId: string) {
    const wallet = await (this.prisma as any).wallet.findUnique({
      where: { id: walletId },
    });
    if (!wallet) throw new NotFoundException('Wallet not found.');
    return wallet;
  }

  async ensureBalance(walletId: string, currencyCode: string) {
    const currency = await (this.prisma as any).currency.findUnique({
      where: { code: currencyCode },
    });
    if (!currency)
      throw new NotFoundException(
        `Currency ${currencyCode} is not configured.`,
      );

    return (this.prisma as any).walletBalance.upsert({
      where: { walletId_currencyCode: { walletId, currencyCode } },
      update: {},
      create: {
        walletId,
        currencyCode,
        availableBalance: new Decimal(0),
        pendingBalance: new Decimal(0),
      },
      include: { currency: true },
    });
  }
}
