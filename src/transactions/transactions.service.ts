import { Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { PrismaService } from '../prisma/prisma.service';

type TransactionStatus = 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'REVERSED' | 'EXPIRED' | 'UNDER_REVIEW';
type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'FEE' | 'REFUND' | 'REVERSAL' | 'PURCHASE' | 'BONUS' | 'ADJUSTMENT';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPendingDepositTransaction(input: {
    userId: string;
    walletId: string;
    currencyCode: string;
    amount: Decimal | string | number;
    netAmount: Decimal | string | number;
    fee: Decimal | string | number;
    provider: 'FLUTTERWAVE' | 'MANUAL' | 'INTERNAL';
    paymentMethod?: 'BANK_TRANSFER' | 'CARD' | 'USSD' | 'MOBILE_MONEY' | 'WALLET_TRANSFER' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'WISE' | 'OTHER' | null;
    providerReference?: string | null;
    metadata?: any;
  }) {
    const reference = `DPT-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    const prisma = this.prisma as any;
    return prisma.transaction.create({
      data: {
        userId: input.userId,
        walletId: input.walletId,
        currencyCode: input.currencyCode,
        type: 'DEPOSIT',
        amount: input.amount instanceof Decimal ? input.amount : new Decimal(String(input.amount)),
        fee: input.fee instanceof Decimal ? input.fee : new Decimal(String(input.fee)),
        netAmount: input.netAmount instanceof Decimal ? input.netAmount : new Decimal(String(input.netAmount)),
        status: 'PENDING',
        provider: input.provider,
        providerReference: input.providerReference ?? null,
        paymentMethod: input.paymentMethod ?? null,
        reference,
        metadata: input.metadata ?? null,
      },
    });
  }

  async findByReference(reference: string) {
    return (this.prisma as any).transaction.findUnique({ where: { reference } });
  }

  async updateStatus(id: string, status: TransactionStatus, extras: Partial<{ providerTransactionId: string | null; providerReference: string | null; paymentMethod: string | null; metadata: any }> = {}) {
    return (this.prisma as any).transaction.update({
      where: { id },
      data: {
        status,
        providerTransactionId: extras.providerTransactionId,
        providerReference: extras.providerReference,
        paymentMethod: extras.paymentMethod as any,
        metadata: extras.metadata ?? undefined,
      },
    });
  }

  async findByProviderTransaction(provider: string, providerTransactionId: string) {
    return (this.prisma as any).transaction.findFirst({
      where: {
        provider: provider as any,
        providerTransactionId,
      },
    });
  }

  async getForUser(userId: string) {
    return (this.prisma as any).transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { deposit: true },
    });
  }

  async getById(id: string) {
    const transaction = await (this.prisma as any).transaction.findUnique({
      where: { id },
      include: { deposit: true },
    });
    if (!transaction) throw new NotFoundException('Transaction not found.');
    return transaction;
  }
}
