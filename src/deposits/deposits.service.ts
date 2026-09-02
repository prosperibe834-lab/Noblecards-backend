import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

type PaymentMethod = 'BANK_TRANSFER' | 'CARD' | 'USSD' | 'MOBILE_MONEY' | 'WALLET_TRANSFER' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'WISE' | 'OTHER';
type PaymentProvider = 'FLUTTERWAVE' | 'MANUAL' | 'INTERNAL';
type DepositStatus = 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'REVERSED' | 'EXPIRED' | 'UNDER_REVIEW';
type LedgerEntryType = 'CREDIT' | 'DEBIT' | 'HOLD' | 'RELEASE' | 'FEE' | 'REFUND' | 'REVERSAL' | 'ADJUSTMENT';
type TransactionStatus = 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'REVERSED' | 'EXPIRED' | 'UNDER_REVIEW';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionsService } from '../transactions/transactions.service';
import { LedgerService } from '../ledger/ledger.service';
import { FlutterwaveService } from '../flutterwave/flutterwave.service';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { ConfigService } from '@nestjs/config';
import { CreateDepositDto, DepositPaymentMethodOption, DepositProviderOption } from './deposits.dto';

@Injectable()
export class DepositsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wallets: WalletsService,
    private readonly transactions: TransactionsService,
    private readonly ledger: LedgerService,
    private readonly flutterwave: FlutterwaveService,
    private readonly exchangeRates: ExchangeRatesService,
    private readonly config: ConfigService,
  ) {}

  private async calculateFees(amount: Decimal, currencyCode: string, amountAlreadyInCurrency = false) {
    const providerPercent = Number(this.config.get('DEPOSIT_PROVIDER_FEE_PERCENT', 2));
    const noblePercent = Number(this.config.get('DEPOSIT_NOBLECARDS_FEE_PERCENT', 1));
    const rateMap = await this.exchangeRates.getRates();
    const exchangeRate = new Decimal(String(rateMap.rates[currencyCode] ?? 1));
    const baseAmount = amountAlreadyInCurrency ? amount : amount.mul(exchangeRate);
    const providerFee = baseAmount.mul(providerPercent).div(100).toDecimalPlaces(2);
    const nobleCardsFee = baseAmount.mul(noblePercent).div(100).toDecimalPlaces(2);
    const totalFees = providerFee.plus(nobleCardsFee).toDecimalPlaces(2);
    return {
      providerFee,
      nobleCardsFee,
      totalFees,
      customerPayableAmount: baseAmount.plus(totalFees).toDecimalPlaces(2),
      exchangeRate: exchangeRate.mul(new Decimal(1).plus(new Decimal(providerPercent + noblePercent).div(100))).toDecimalPlaces(8),
      walletCreditAmount: amountAlreadyInCurrency ? amount.div(exchangeRate).toDecimalPlaces(2) : amount.toDecimalPlaces(2),
    };
  }

  async createDeposit(userId: string, dto: CreateDepositDto) {
    const logger = new (require('@nestjs/common').Logger)('DepositsService');
    logger.log('[createDeposit] Processing deposit request');
    logger.log('[createDeposit] userId=' + userId + ', currency=' + dto.currency + ', amount=' + dto.amount);
    
    const currencyRows = await this.prisma.$queryRaw<Array<any>>`
      SELECT * FROM "Currency" WHERE "code" = ${dto.currency.toUpperCase()}
    `;
    const currencyRecord = currencyRows[0] ?? null;
    
    if (!currencyRecord) throw new NotFoundException('Currency ' + dto.currency.toUpperCase() + ' was not found.');
    if (!currencyRecord.enabled || !currencyRecord.depositEnabled) {
      throw new BadRequestException('Deposits are disabled for ' + dto.currency + '.');
    }
    if (!Number.isFinite(dto.amount) || dto.amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero.');
    }
    const provider = (dto.provider ?? DepositProviderOption.FLUTTERWAVE) as PaymentProvider;
    const paymentMethod = (dto.paymentMethod ?? DepositPaymentMethodOption.BANK_TRANSFER) as PaymentMethod;
    if (provider !== 'MANUAL' && !['USD', 'NGN', 'GBP', 'GHS'].includes(currencyRecord.code)) {
      throw new BadRequestException('Currency ' + currencyRecord.code + ' is not supported by the configured Flutterwave account.');
    }
    const currency = currencyRecord;
    const normalizedKey = dto.idempotencyKey ?? userId + ':' + currency.code + ':' + dto.amount + ':' + Date.now();
    const existingRows = await this.prisma.$queryRaw<Array<any>>`
      SELECT d.*, t.id AS "transactionId", t.status AS "transactionStatus", t.reference AS "transactionReference"
      FROM "Deposit" d
      LEFT JOIN "Transaction" t ON d."transactionId" = t.id
      WHERE d."userId" = ${userId} AND d."idempotencyKey" = ${normalizedKey}
      LIMIT 1
    `;
    const existing = existingRows[0] ?? null;
    if (existing) {
      logger.log('[createDeposit] Idempotent deposit found: ' + existing.id);
      return {
        id: existing.id,
        status: existing.status,
        provider: existing.provider,
        amount: existing.amount.toString(),
        currency: existing.currencyCode,
        walletId: existing.walletId,
        transaction: existing.transactionId ? { id: existing.transactionId, status: existing.transactionStatus, reference: existing.transactionReference } : null,
      };
    }

    const walletRows = await this.prisma.$queryRaw`
      INSERT INTO "Wallet" ("id", "userId", "createdAt", "updatedAt")
      VALUES (${randomUUID()}, ${userId}, NOW(), NOW())
      ON CONFLICT ("userId") DO UPDATE SET "updatedAt" = "Wallet"."updatedAt"
      RETURNING "id", "userId", "createdAt", "updatedAt"
    ` as any[];
    const wallet = walletRows[0];
    const requestedAmount = new Decimal(dto.amount.toFixed(2));
    const localCurrencyBankTransfer = paymentMethod === 'BANK_TRANSFER' && ['NGN', 'GHS', 'GBP'].includes(currency.code);

    const feeBreakdown = await this.calculateFees(requestedAmount, currency.code, localCurrencyBankTransfer);
    const amount = feeBreakdown.customerPayableAmount;
    const fee = feeBreakdown.totalFees;
    const netAmount = localCurrencyBankTransfer ? feeBreakdown.walletCreditAmount : requestedAmount;

    if (currency.code === 'NGN' && paymentMethod === 'BANK_TRANSFER') {
      logger.log(`[createDeposit][NGN TRACE] Requested USD: ${feeBreakdown.walletCreditAmount.toFixed(2)}`);
      logger.log(`[createDeposit][NGN TRACE] Calculated customer payable NGN: ${amount.toFixed(2)}`);
    }

    logger.log('[createDeposit] paymentMethod=' + paymentMethod + ', provider=' + provider);

    const transactionId = randomUUID();
    const transactionReference = `DPT-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const transactionMetadata = {
      source: 'deposit-creation',
      country: dto.country ?? null,
      countryCode: dto.countryCode ?? null,
    };
    const transaction = {
      id: transactionId,
      reference: transactionReference,
      status: 'PENDING' as TransactionStatus,
    };
    await this.prisma.$executeRaw`
      INSERT INTO "Transaction" (
        "id", "userId", "walletId", "currencyCode", "type", "amount", "fee",
        "netAmount", "status", "provider", "paymentMethod", "reference", "metadata", "createdAt", "updatedAt"
      ) VALUES (
        ${transactionId}, ${userId}, ${wallet.id}, ${currency.code}, 'DEPOSIT',
        ${amount.toString()}, ${fee.toString()}, ${netAmount.toString()}, 'PENDING',
        ${provider}, ${paymentMethod}, ${transactionReference}, ${JSON.stringify(transactionMetadata)}, NOW(), NOW()
      )
    `;

    const depositId = randomUUID();
    const depositMetadata = {
      source: 'deposit-creation',
      country: dto.country ?? null,
      countryCode: dto.countryCode ?? null,
    };
    await this.prisma.$executeRaw`
      INSERT INTO "Deposit" (
        "id", "userId", "walletId", "currencyCode", "amount", "fee", "netAmount",
        "provider", "paymentMethod", "country", "countryCode", "status",
        "idempotencyKey", "metadata", "transactionId", "createdAt", "updatedAt"
      ) VALUES (
        ${depositId}, ${userId}, ${wallet.id}, ${currency.code}, ${amount.toString()},
        ${fee.toString()}, ${netAmount.toString()}, ${provider}, ${paymentMethod},
        ${dto.country ?? null}, ${dto.countryCode ?? null}, 'PENDING', ${normalizedKey},
        ${JSON.stringify(depositMetadata)}, ${transaction.id}, NOW(), NOW()
      )
    `;
    const deposit = {
      id: depositId,
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
      status: 'PENDING' as DepositStatus,
      idempotencyKey: normalizedKey,
      metadata: depositMetadata,
      transactionId: transaction.id,
    };

    logger.log('[createDeposit] Deposit row created: ' + deposit.id);

    // Route BANK_TRANSFER + NGN to Dynamic Virtual Account flow
    // Route BANK_TRANSFER + GBP to UK Bank Account Charge flow
    // Other methods use standard redirect checkout
    let paymentIntent;
    if (paymentMethod === 'BANK_TRANSFER' && currency.code === 'NGN') {
      logger.log('[createDeposit] CALLING FLUTTERWAVE CREATE VIRTUAL ACCOUNT for NGN BANK_TRANSFER');
      logger.log(`[createDeposit][NGN TRACE] Flutterwave amount sent: ${amount.toFixed(2)}, currency: NGN`);
      paymentIntent = await this.flutterwave.createVirtualAccount({
        amount: amount.toNumber(),
        currency: currency.code,
        reference: transaction.reference,
        userId,
        walletId: wallet.id,
        depositId: deposit.id,
        country: dto.country,
        countryCode: dto.countryCode,
      });
    } else if (paymentMethod === 'BANK_TRANSFER' && currency.code === 'GHS') {
      logger.log('[createDeposit] CALLING FLUTTERWAVE CREATE VIRTUAL ACCOUNT for GHS BANK_TRANSFER');
      paymentIntent = await this.flutterwave.createGhsVirtualAccount({
        amount: amount.toNumber(),
        currency: currency.code,
        reference: transaction.reference,
        userId,
        walletId: wallet.id,
        depositId: deposit.id,
        country: dto.country,
        countryCode: dto.countryCode,
      });
    } else if (paymentMethod === 'BANK_TRANSFER' && currency.code === 'GBP') {
      logger.log('[createDeposit] CALLING FLUTTERWAVE CREATE GBP BANK CHARGE for GBP BANK_TRANSFER');
      paymentIntent = await this.flutterwave.createGbpBankCharge({
        amount: amount.toNumber(),
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
        amount: amount.toNumber(),
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

    const updatedMetadata = {
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
    };
    await this.prisma.$executeRaw`
      UPDATE "Deposit"
      SET "providerReference" = ${paymentIntent.providerReference},
          "providerTransactionId" = ${paymentIntent.providerTransactionId},
          "metadata" = ${JSON.stringify(updatedMetadata)},
          "updatedAt" = NOW()
      WHERE "id" = ${deposit.id}
    `;

    logger.log('[GBP DEBUG 4] DepositsService paymentIntent: ' + JSON.stringify({
      paymentMethod,
      currency: currency.code,
      authorizationUrl: paymentIntent.authorizationUrl ?? null,
      providerReference: paymentIntent.providerReference,
      providerTransactionId: paymentIntent.providerTransactionId,
      meta: paymentIntent.meta,
    }));
    logger.log('[GBP DEBUG 5] Final authorizationUrl before database/response: ' + (paymentIntent.authorizationUrl ?? 'NONE'));

    // For local bank transfers, return account details instead of payment link
    if (paymentMethod === 'BANK_TRANSFER' && (currency.code === 'NGN' || currency.code === 'GHS')) {
      return {
        id: deposit.id,
        status: deposit.status,
        provider: deposit.provider,
        currency: deposit.currencyCode,
        amount: deposit.amount.toString(),
        fee: deposit.fee.toString(),
        netAmount: deposit.netAmount.toString(),
        requestedAmount: requestedAmount.toFixed(2),
        requestedCurrency: 'USD',
        providerFee: feeBreakdown.providerFee.toFixed(2),
        nobleCardsFee: feeBreakdown.nobleCardsFee.toFixed(2),
        totalFees: feeBreakdown.totalFees.toFixed(2),
        customerPayableAmount: feeBreakdown.customerPayableAmount.toFixed(2),
        walletCreditAmount: feeBreakdown.walletCreditAmount.toFixed(2),
        walletCreditCurrency: 'USD',
        exchangeRate: feeBreakdown.exchangeRate.toFixed(2),
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

      logger.log('[GBP DEBUG 6] Final POST /deposits response: ' + JSON.stringify(responsePayload));
      logger.log('[createDeposit] GBP API response authorizationUrl=' + (responsePayload.authorizationUrl ?? 'NONE'));
      logger.log('[createDeposit] GBP API response authorizationUrl type=' + typeof responsePayload.authorizationUrl);

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
      requestedAmount: requestedAmount.toFixed(2),
      requestedCurrency: 'USD',
      providerFee: feeBreakdown.providerFee.toFixed(2),
      nobleCardsFee: feeBreakdown.nobleCardsFee.toFixed(2),
      totalFees: feeBreakdown.totalFees.toFixed(2),
      customerPayableAmount: feeBreakdown.customerPayableAmount.toFixed(2),
      walletCreditAmount: feeBreakdown.walletCreditAmount.toFixed(2),
      walletCreditCurrency: 'USD',
      exchangeRate: feeBreakdown.exchangeRate.toFixed(2),
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
    const deposits = await this.prisma.$queryRaw<Array<any>>`
      SELECT d.*, t.id AS "transactionId", t.status AS "transactionStatus", t.reference AS "transactionReference"
      FROM "Deposit" d
      LEFT JOIN "Transaction" t ON d."transactionId" = t.id
      WHERE d."userId" = ${userId}
        ${filters.status ? Prisma.sql`AND d."status" = ${filters.status}` : Prisma.empty}
        ${filters.currency ? Prisma.sql`AND d."currencyCode" = ${filters.currency.toUpperCase()}` : Prisma.empty}
        ${filters.provider ? Prisma.sql`AND d."provider" = ${filters.provider}` : Prisma.empty}
      ORDER BY d."createdAt" DESC
    `;

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
      transaction: deposit.transactionId ? {
        id: deposit.transactionId,
        status: deposit.transactionStatus,
        reference: deposit.transactionReference,
      } : null,
    }));
  }

  async getDeposit(userId: string, id: string) {
    const depositRows = await this.prisma.$queryRaw<Array<any>>`
      SELECT d.*, t.id AS "transactionId", t.status AS "transactionStatus", t.reference AS "transactionReference"
      FROM "Deposit" d
      LEFT JOIN "Transaction" t ON d."transactionId" = t.id
      WHERE d."id" = ${id} AND d."userId" = ${userId}
    `;
    const deposit = depositRows[0] ?? null;
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
