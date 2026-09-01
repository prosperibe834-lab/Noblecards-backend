import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { PrismaService } from '../prisma/prisma.service';

type PaymentMethod = 'BANK_TRANSFER' | 'CARD' | 'USSD' | 'MOBILE_MONEY' | 'WALLET_TRANSFER' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'WISE' | 'OTHER';
type PaymentProvider = 'FLUTTERWAVE' | 'MANUAL' | 'INTERNAL';
type DepositStatus = 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'REVERSED' | 'EXPIRED' | 'UNDER_REVIEW';
type LedgerEntryType = 'CREDIT' | 'DEBIT' | 'HOLD' | 'RELEASE' | 'FEE' | 'REFUND' | 'REVERSAL' | 'ADJUSTMENT';
type TransactionStatus = 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'REVERSED' | 'EXPIRED' | 'UNDER_REVIEW';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionsService } from '../transactions/transactions.service';
import { LedgerService } from '../ledger/ledger.service';
import { FlutterwaveService } from '../flutterwave/flutterwave.service';
import { CreateDepositDto, DepositPaymentMethodOption, DepositProviderOption } from './deposits.dto';

@Injectable()
export class DepositsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wallets: WalletsService,
    private readonly transactions: TransactionsService,
    private readonly ledger: LedgerService,
    private readonly flutterwave: FlutterwaveService,
  ) {}

  async createDeposit(userId: string, dto: CreateDepositDto) {
    const logger = new (require('@nestjs/common').Logger)('DepositsService');
    logger.log('[createDeposit] Processing deposit request');
    logger.log(`[createDeposit] userId=${userId}, currency=${dto.currency}, amount=${dto.amount}`);
    
    // Get currency directly from Prisma instead of using CurrenciesService
    const prismaClient = this.prisma as any;
    const currency = await prismaClient.currency.findUnique({
      where: { code: dto.currency.toUpperCase() },
    });
    
    if (!currency) throw new NotFoundException(`Currency ${dto.currency.toUpperCase()} was not found.`);
    if (!currency.enabled || !currency.depositEnabled) {
      throw new BadRequestException(`Deposits are disabled for ${dto.currency}.`);
    }
    if (!Number.isFinite(dto.amount) || dto.amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero.');
    }

    const normalizedKey = dto.idempotencyKey ?? `${userId}:${currency.code}:${dto.amount}:${Date.now()}`;
    const existing = await prismaClient.deposit.findFirst({
      where: { userId, idempotencyKey: normalizedKey },
      include: { transaction: true },
    });
    if (existing) {
      logger.log(`[createDeposit] Idempotent deposit found: ${existing.id}`);
      return {
        id: existing.id,
        status: existing.status,
        provider: existing.provider,
        amount: existing.amount.toString(),
        currency: existing.currencyCode,
        walletId: existing.walletId,
        transaction: existing.transaction ? { id: existing.transaction.id, status: existing.transaction.status, reference: existing.transaction.reference } : null,
      };
    }

    const wallet = await this.wallets.getOrCreateWallet(userId);
    const amount = new Decimal(dto.amount.toFixed(2));
    const fee = new Decimal(0);
    const netAmount = new Decimal(dto.amount.toFixed(2));

    const provider = (dto.provider ?? DepositProviderOption.FLUTTERWAVE) as PaymentProvider;
    const paymentMethod = (dto.paymentMethod ?? DepositPaymentMethodOption.BANK_TRANSFER) as PaymentMethod;

    logger.log(`[createDeposit] paymentMethod=${paymentMethod}, provider=${provider}`);

    const transaction = await this.transactions.createPendingDepositTransaction({
      userId,
      walletId: wallet.id,
      currencyCode: currency.code,
      amount,
      netAmount,
      fee,
      provider,
      paymentMethod,
      metadata: {
        source: 'deposit-creation',
        country: dto.country ?? null,
        countryCode: dto.countryCode ?? null,
      },
    });

    const deposit = await prismaClient.deposit.create({
      data: {
        userId,
        walletId: wallet.id,
        currencyCode: currency.code,
        amount,
        fee,
        netAmount,
        provider,
        paymentMethod,
        country: dto.country ?? null,
        countryCode: dto.countryCode ?? null,
        status: 'PENDING',
        idempotencyKey: normalizedKey,
        metadata: {
          source: 'deposit-creation',
          country: dto.country ?? null,
          countryCode: dto.countryCode ?? null,
        },
        transactionId: transaction.id,
      },
      include: { transaction: true },
    });

    logger.log(`[createDeposit] Deposit row created: ${deposit.id}`);

    // Route BANK_TRANSFER + NGN to Dynamic Virtual Account flow
    // Route BANK_TRANSFER + GBP to UK Bank Account Charge flow
    // Other methods use standard redirect checkout
    let paymentIntent;
    if (paymentMethod === 'BANK_TRANSFER' && currency.code === 'NGN') {
      logger.log(`[createDeposit] CALLING FLUTTERWAVE CREATE VIRTUAL ACCOUNT for NGN BANK_TRANSFER`);
      paymentIntent = await this.flutterwave.createVirtualAccount({
        amount: dto.amount,
        currency: currency.code,
        reference: transaction.reference,
        userId,
        walletId: wallet.id,
        depositId: deposit.id,
        country: dto.country,
        countryCode: dto.countryCode,
      });
    } else if (paymentMethod === 'BANK_TRANSFER' && currency.code === 'GBP') {
      logger.log(`[createDeposit] CALLING FLUTTERWAVE CREATE GBP BANK CHARGE for GBP BANK_TRANSFER`);
      paymentIntent = await this.flutterwave.createGbpBankCharge({
        amount: dto.amount,
        currency: currency.code,
        reference: transaction.reference,
        userId,
        walletId: wallet.id,
        depositId: deposit.id,
        country: dto.country,
        countryCode: dto.countryCode,
      });
    } else {
      paymentIntent = await this.flutterwave.createPayment({
        amount: dto.amount,
        currency: currency.code,
        reference: transaction.reference,
        userId,
        walletId: wallet.id,
        depositId: deposit.id,
        paymentMethod,
        country: dto.country,
        countryCode: dto.countryCode,
      });
    }

    await prismaClient.deposit.update({
      where: { id: deposit.id },
      data: {
        providerReference: paymentIntent.providerReference,
        providerTransactionId: paymentIntent.providerTransactionId,
        metadata: {
          ...(deposit.metadata as Record<string, unknown> ?? {}),
          flutterwave: paymentIntent.meta,
          providerReference: paymentIntent.providerReference,
          providerTransactionId: paymentIntent.providerTransactionId,
          ...(paymentIntent.paymentLink && { paymentLink: paymentIntent.paymentLink }),
          ...(paymentIntent.authorizationUrl && { authorizationUrl: paymentIntent.authorizationUrl }),
          ...(paymentIntent.bankName && {
            bankTransfer: {
              bankName: paymentIntent.bankName,
              accountNumber: paymentIntent.accountNumber,
              accountName: paymentIntent.accountName,
              expiresAt: paymentIntent.expiresAt,
            },
          }),
        },
      },
    });

    logger.log(`[GBP DEBUG 4] DepositsService paymentIntent: ${JSON.stringify({
      paymentMethod,
      currency: currency.code,
      authorizationUrl: paymentIntent.authorizationUrl ?? null,
      providerReference: paymentIntent.providerReference,
      providerTransactionId: paymentIntent.providerTransactionId,
      meta: paymentIntent.meta,
    })}`);
    logger.log(`[GBP DEBUG 5] Final authorizationUrl before database/response: ${paymentIntent.authorizationUrl ?? 'NONE'}`);

    // For NGN bank transfer, return account details instead of payment link
    if (paymentMethod === 'BANK_TRANSFER' && currency.code === 'NGN') {
      return {
        id: deposit.id,
        status: deposit.status,
        provider: deposit.provider,
        currency: deposit.currencyCode,
        amount: deposit.amount.toString(),
        fee: deposit.fee.toString(),
        netAmount: deposit.netAmount.toString(),
        paymentMethod: 'BANK_TRANSFER',
        bankTransfer: {
          bankName: paymentIntent.bankName,
          accountNumber: paymentIntent.accountNumber,
          accountName: paymentIntent.accountName,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          expiresAt: paymentIntent.expiresAt,
        },
        providerReference: paymentIntent.providerReference,
        providerTransactionId: paymentIntent.providerTransactionId,
        walletId: wallet.id,
        transaction: {
          id: transaction.id,
          reference: transaction.reference,
          status: transaction.status,
        },
      };
    }

    // For GBP bank transfer, return authorization URL
    if (paymentMethod === 'BANK_TRANSFER' && currency.code === 'GBP') {
      const responsePayload = {
        id: deposit.id,
        status: deposit.status,
        provider: deposit.provider,
        currency: deposit.currencyCode,
        amount: deposit.amount.toString(),
        fee: deposit.fee.toString(),
        netAmount: deposit.netAmount.toString(),
        paymentMethod: 'BANK_TRANSFER',
        authorizationUrl: paymentIntent.authorizationUrl,
        providerReference: paymentIntent.providerReference,
        providerTransactionId: paymentIntent.providerTransactionId,
        walletId: wallet.id,
        transaction: {
          id: transaction.id,
          reference: transaction.reference,
          status: transaction.status,
        },
      };

      logger.log(`[GBP DEBUG 6] Final POST /deposits response: ${JSON.stringify(responsePayload)}`);
      logger.log(`[createDeposit] GBP API response authorizationUrl=${responsePayload.authorizationUrl ?? 'NONE'}`);
      logger.log(`[createDeposit] GBP API response authorizationUrl type=${typeof responsePayload.authorizationUrl}`);

      return responsePayload;
    }

    return {
      id: deposit.id,
      status: deposit.status,
      provider: deposit.provider,
      currency: deposit.currencyCode,
      amount: deposit.amount.toString(),
      fee: deposit.fee.toString(),
      netAmount: deposit.netAmount.toString(),
      paymentLink: paymentIntent.paymentLink,
      providerReference: paymentIntent.providerReference,
      providerTransactionId: paymentIntent.providerTransactionId,
      walletId: wallet.id,
      transaction: {
        id: transaction.id,
        reference: transaction.reference,
        status: transaction.status,
      },
    };
  }

  async listDeposits(userId: string, filters: { status?: string; currency?: string; provider?: string }) {
    const prisma = this.prisma as any;
    const deposits = await prisma.deposit.findMany({
      where: {
        userId,
        ...(filters.status ? { status: filters.status as DepositStatus } : {}),
        ...(filters.currency ? { currencyCode: filters.currency.toUpperCase() } : {}),
        ...(filters.provider ? { provider: filters.provider as PaymentProvider } : {}),
      },
      include: { transaction: true },
      orderBy: { createdAt: 'desc' },
    });

    return deposits.map((deposit) => ({
      id: deposit.id,
      status: deposit.status,
      provider: deposit.provider,
      currency: deposit.currencyCode,
      amount: deposit.amount.toString(),
      fee: deposit.fee.toString(),
      netAmount: deposit.netAmount.toString(),
      createdAt: deposit.createdAt,
      updatedAt: deposit.updatedAt,
      transaction: deposit.transaction ? {
        id: deposit.transaction.id,
        status: deposit.transaction.status,
        reference: deposit.transaction.reference,
      } : null,
    }));
  }

  async getDeposit(userId: string, id: string) {
    const prisma = this.prisma as any;
    const deposit = await prisma.deposit.findFirst({
      where: { id, userId },
      include: { transaction: true },
    });
    if (!deposit) throw new NotFoundException('Deposit not found.');
    return deposit;
  }

  async verifyAndCreditDeposit(input: {
    provider: PaymentProvider;
    providerTransactionId: string;
    providerReference?: string;
    amount?: string;
    currency?: string;
  }) {
    return this.flutterwave.verifyAndCreditDeposit(input);
  }
}
