import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Decimal } from '@prisma/client-runtime-utils';
import { randomUUID } from 'node:crypto';
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
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { CreateCardDepositDto, CreateDepositDto, DepositPaymentMethodOption, DepositProviderOption } from './deposits.dto';

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

  private getFeeConfig() {
    const providerPercent = Number(this.config.get<number | string>('DEPOSIT_PROVIDER_FEE_PERCENT', 2));
    const noblePercent = Number(this.config.get<number | string>('DEPOSIT_NOBLECARDS_FEE_PERCENT', 1));

    if (!Number.isFinite(providerPercent) || providerPercent < 0) {
      throw new BadRequestException('DEPOSIT_PROVIDER_FEE_PERCENT must be a valid non-negative number.');
    }

    if (!Number.isFinite(noblePercent) || noblePercent < 0) {
      throw new BadRequestException('DEPOSIT_NOBLECARDS_FEE_PERCENT must be a valid non-negative number.');
    }

    return {
      providerPercent,
      noblePercent,
    };
  }

  private calculateDepositFees(amount: Decimal, exchangeRate: Decimal = new Decimal(1)) {
    const { providerPercent, noblePercent } = this.getFeeConfig();
    const totalFeePercent = new Decimal(providerPercent).plus(new Decimal(noblePercent));
    const feeMultiplier = new Decimal(1).plus(totalFeePercent.div(new Decimal(100)));
    const effectiveExchangeRate = exchangeRate.mul(feeMultiplier);
    const baseLocalAmount = amount.mul(exchangeRate);
    const providerFee = baseLocalAmount.mul(new Decimal(providerPercent)).div(new Decimal(100));
    const nobleCardsFee = baseLocalAmount.mul(new Decimal(noblePercent)).div(new Decimal(100));
    const totalFees = providerFee.plus(nobleCardsFee);
    const customerPayableAmount = baseLocalAmount.plus(totalFees);

    return {
      rawExchangeRate: exchangeRate.toDecimalPlaces(8),
      effectiveExchangeRate: effectiveExchangeRate.toDecimalPlaces(8),
      baseLocalAmount: baseLocalAmount.toDecimalPlaces(2),
      providerFee: providerFee.toDecimalPlaces(2),
      nobleCardsFee: nobleCardsFee.toDecimalPlaces(2),
      totalFees: totalFees.toDecimalPlaces(2),
      customerPayableAmount: customerPayableAmount.toDecimalPlaces(2),
      exchangeRate: effectiveExchangeRate.toDecimalPlaces(8),
      walletCreditAmount: amount.toDecimalPlaces(2),
      walletCreditCurrency: 'USD',
      requestedAmount: amount.toDecimalPlaces(2),
      requestedCurrency: 'USD',
    };
  }

  private assertSupportedFlutterwaveCurrency(currencyCode: string, provider: PaymentProvider) {
    if (provider !== 'FLUTTERWAVE') {
      return;
    }

    const normalizedCode = currencyCode.toUpperCase();
    const supportedCodes = ['USD', 'NGN', 'GBP', 'GHS'];
    if (!supportedCodes.includes(normalizedCode)) {
      throw new BadRequestException(
        `Currency ${normalizedCode} is not supported by the configured Flutterwave account for deposits. Supported Flutterwave currencies: ${supportedCodes.join(', ')}.`,
      );
    }
  }

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

    const provider = (dto.provider ?? DepositProviderOption.FLUTTERWAVE) as PaymentProvider;
    this.assertSupportedFlutterwaveCurrency(currency.code, provider);

    const normalizedKey = dto.idempotencyKey ?? `${userId}:${currency.code}:${dto.amount}:${Date.now()}`;
    const existing = await prismaClient.deposit.findFirst({
      where: { userId, idempotencyKey: normalizedKey },
      include: { transaction: true },
    });
    if (existing) {
      logger.log(`[createDeposit] Idempotent deposit found: ${existing.id}`);
      const existingFeeBreakdown = {
        providerFee: existing.fee ? existing.fee.toString() : '0.00',
        nobleCardsFee: '0.00',
        totalFees: existing.fee ? existing.fee.toString() : '0.00',
        customerPayableAmount: existing.amount ? existing.amount.toString() : '0.00',
        walletCreditAmount: existing.netAmount ? existing.netAmount.toString() : '0.00',
        walletCreditCurrency: existing.currencyCode,
        exchangeRate: '1',
      };

      return {
        id: existing.id,
        status: existing.status,
        provider: existing.provider,
        amount: existing.amount.toString(),
        currency: existing.currencyCode,
        walletId: existing.walletId,
        fee: existing.fee ? existing.fee.toString() : '0.00',
        netAmount: existing.netAmount ? existing.netAmount.toString() : '0.00',
        requestedAmount: existing.amount ? existing.amount.toString() : '0.00',
        requestedCurrency: existing.currencyCode,
        providerFee: existingFeeBreakdown.providerFee,
        nobleCardsFee: existingFeeBreakdown.nobleCardsFee,
        totalFees: existingFeeBreakdown.totalFees,
        customerPayableAmount: existingFeeBreakdown.customerPayableAmount,
        walletCreditAmount: existingFeeBreakdown.walletCreditAmount,
        walletCreditCurrency: existingFeeBreakdown.walletCreditCurrency,
        exchangeRate: existingFeeBreakdown.exchangeRate,
        transaction: existing.transaction ? { id: existing.transaction.id, status: existing.transaction.status, reference: existing.transaction.reference } : null,
      };
    }

    const wallet = await this.wallets.getOrCreateWallet(userId);
    const requestedAmount = new Decimal(dto.amount.toFixed(2));
    const rateMap = await this.exchangeRates.getRates();
    const targetCurrency = currency.code.toUpperCase();
    const exchangeRateValue = rateMap.rates[targetCurrency];
    if (!exchangeRateValue || !Number.isFinite(exchangeRateValue) || exchangeRateValue <= 0) {
      throw new BadRequestException(`No exchange rate is available for ${targetCurrency}.`);
    }
    const exchangeRate = new Decimal(String(exchangeRateValue));
    const feeBreakdown = this.calculateDepositFees(requestedAmount, exchangeRate);
    const paymentAmount = feeBreakdown.customerPayableAmount;
    const fee = feeBreakdown.totalFees;
    const netAmount = requestedAmount;

    const paymentMethod = (dto.paymentMethod ?? DepositPaymentMethodOption.BANK_TRANSFER) as PaymentMethod;

    logger.log(`[createDeposit] paymentMethod=${paymentMethod}, provider=${provider}`);

    const transaction = await this.transactions.createPendingDepositTransaction({
      userId,
      walletId: wallet.id,
      currencyCode: currency.code,
      amount: paymentAmount,
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
        amount: paymentAmount,
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
    // Route BANK_TRANSFER + GHS to Ghana Virtual Account flow
    // Other methods use standard redirect checkout
    let paymentIntent;
    if (paymentMethod === 'BANK_TRANSFER' && currency.code === 'NGN') {
      logger.log(`[createDeposit] CALLING FLUTTERWAVE CREATE VIRTUAL ACCOUNT for NGN BANK_TRANSFER`);
      paymentIntent = await this.flutterwave.createVirtualAccount({
        amount: paymentAmount.toNumber(),
        currency: currency.code,
        reference: transaction.reference,
        userId,
        walletId: wallet.id,
        depositId: deposit.id,
        country: dto.country,
        countryCode: dto.countryCode,
      });
    } else if (paymentMethod === 'BANK_TRANSFER' && currency.code === 'GHS') {
      logger.log(`[createDeposit] CALLING FLUTTERWAVE CREATE VIRTUAL ACCOUNT for GHS BANK_TRANSFER`);
      paymentIntent = await this.flutterwave.createGhsVirtualAccount({
        amount: paymentAmount.toNumber(),
        currency: currency.code,
        reference: transaction.reference,
        userId,
        walletId: wallet.id,
        depositId: deposit.id,
        country: dto.country,
        countryCode: dto.countryCode,
      });
      logger.log(`[createDeposit] GHS Virtual Account Response: ${JSON.stringify(paymentIntent)}`);
    } else if (paymentMethod === 'BANK_TRANSFER' && currency.code === 'GBP') {
      logger.log(`[createDeposit] CALLING FLUTTERWAVE CREATE GBP BANK CHARGE for GBP BANK_TRANSFER`);
      paymentIntent = await this.flutterwave.createGbpBankCharge({
        amount: paymentAmount.toNumber(),
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
        amount: paymentAmount.toNumber(),
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

    // For NGN or GHS bank transfer, return account details instead of payment link
    if (paymentMethod === 'BANK_TRANSFER' && (currency.code === 'NGN' || currency.code === 'GHS')) {
      const bankTransferResponse = {
        id: deposit.id,
        status: deposit.status,
        provider: deposit.provider,
        currency: deposit.currencyCode,
        amount: deposit.amount.toString(),
        fee: deposit.fee.toString(),
        netAmount: deposit.netAmount.toString(),
        requestedAmount: feeBreakdown.requestedAmount.toFixed(2),
        requestedCurrency: feeBreakdown.requestedCurrency,
        providerFee: feeBreakdown.providerFee.toFixed(2),
        nobleCardsFee: feeBreakdown.nobleCardsFee.toFixed(2),
        totalFees: feeBreakdown.totalFees.toFixed(2),
        customerPayableAmount: feeBreakdown.customerPayableAmount.toFixed(2),
        walletCreditAmount: feeBreakdown.walletCreditAmount.toFixed(2),
        walletCreditCurrency: feeBreakdown.walletCreditCurrency,
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
      logger.log(`[createDeposit] ${currency.code} BANK_TRANSFER response to Flutter: ${JSON.stringify(bankTransferResponse)}`);
      return bankTransferResponse;
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
        requestedAmount: feeBreakdown.requestedAmount.toFixed(2),
        requestedCurrency: feeBreakdown.requestedCurrency,
        providerFee: feeBreakdown.providerFee.toFixed(2),
        nobleCardsFee: feeBreakdown.nobleCardsFee.toFixed(2),
        totalFees: feeBreakdown.totalFees.toFixed(2),
        customerPayableAmount: feeBreakdown.customerPayableAmount.toFixed(2),
        walletCreditAmount: feeBreakdown.walletCreditAmount.toFixed(2),
        walletCreditCurrency: feeBreakdown.walletCreditCurrency,
        exchangeRate: feeBreakdown.exchangeRate.toFixed(2),
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
      requestedAmount: feeBreakdown.requestedAmount.toFixed(2),
      requestedCurrency: feeBreakdown.requestedCurrency,
      providerFee: feeBreakdown.providerFee.toFixed(2),
      nobleCardsFee: feeBreakdown.nobleCardsFee.toFixed(2),
      totalFees: feeBreakdown.totalFees.toFixed(2),
      customerPayableAmount: feeBreakdown.customerPayableAmount.toFixed(2),
      walletCreditAmount: feeBreakdown.walletCreditAmount.toFixed(2),
      walletCreditCurrency: feeBreakdown.walletCreditCurrency,
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

  async createCardDeposit(userId: string, dto: CreateCardDepositDto) {
    const currencyCode = dto.currency.toUpperCase();
    if (!['NGN', 'GHS', 'GBP'].includes(currencyCode)) {
      throw new BadRequestException('Card deposits support NGN, GHS, and GBP only.');
    }
    if (!Number.isFinite(dto.requestedAmount) || dto.requestedAmount <= 0 || !Number.isFinite(dto.amount) || dto.amount <= 0) {
      throw new BadRequestException('Card deposit amount must be greater than zero.');
    }

    const currencies = await this.prisma.$queryRaw<Array<any>>`
      SELECT * FROM "Currency" WHERE "code" = ${currencyCode}
    `;
    const currency = currencies[0];
    if (!currency) throw new NotFoundException(`Currency ${currencyCode} was not found.`);
    if (!currency.enabled || !currency.depositEnabled) {
      throw new BadRequestException(`Deposits are disabled for ${currencyCode}.`);
    }

    const requestedAmount = new Decimal(dto.requestedAmount.toFixed(2));
    const payableAmount = new Decimal(dto.amount.toFixed(2));
    const rateMap = await this.exchangeRates.getRates();
    const rate = rateMap.rates[currencyCode];
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new BadRequestException(`No exchange rate is available for ${currencyCode}.`);
    }
    const feeBreakdown = this.calculateDepositFees(requestedAmount, new Decimal(String(rate)));
    if (!payableAmount.eq(feeBreakdown.customerPayableAmount)) {
      throw new BadRequestException('Card payable amount does not match the current exchange rate and fee calculation.');
    }

    const provider: PaymentProvider = 'FLUTTERWAVE';
    const paymentMethod: PaymentMethod = 'CARD';
    const idempotencyKey = dto.idempotencyKey ?? `${userId}:${currencyCode}:${dto.requestedAmount}:${Date.now()}`;
    const existingRows = await this.prisma.$queryRaw<Array<any>>`
      SELECT d.*, t.id AS "transactionId", t.status AS "transactionStatus", t.reference AS "transactionReference"
      FROM "Deposit" d
      LEFT JOIN "Transaction" t ON t.id = d."transactionId"
      WHERE d."userId" = ${userId} AND d."idempotencyKey" = ${idempotencyKey}
      LIMIT 1
    `;
    const existing = existingRows[0];
    if (existing) {
      return {
        id: existing.id,
        status: existing.status,
        provider: existing.provider,
        amount: existing.amount.toString(),
        currency: existing.currencyCode,
        netAmount: existing.netAmount.toString(),
        authorizationUrl: existing.metadata?.authorizationUrl ?? null,
        providerReference: existing.providerReference,
        providerTransactionId: existing.providerTransactionId,
        walletId: existing.walletId,
      };
    }

    const walletRows = await this.prisma.$queryRaw<Array<any>>`
      INSERT INTO "Wallet" ("id", "userId", "createdAt", "updatedAt")
      VALUES (${randomUUID()}, ${userId}, NOW(), NOW())
      ON CONFLICT ("userId") DO UPDATE SET "updatedAt" = "Wallet"."updatedAt"
      RETURNING "id"
    `;
    const wallet = walletRows[0];
    if (!wallet) throw new NotFoundException('Wallet could not be found for card deposit.');

    const transactionId = randomUUID();
    const transactionReference = `DPT-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
    const depositId = randomUUID();
    const amount = feeBreakdown.customerPayableAmount;
    const fee = feeBreakdown.totalFees;
    const netAmount = requestedAmount;
    const metadata = {
      source: 'deposit-creation',
      requestedAmount: requestedAmount.toFixed(2),
      requestedCurrency: 'USD',
      exchangeRate: feeBreakdown.exchangeRate.toFixed(8),
      providerFee: feeBreakdown.providerFee.toFixed(2),
      nobleCardsFee: feeBreakdown.nobleCardsFee.toFixed(2),
      walletCreditAmount: requestedAmount.toFixed(2),
      walletCreditCurrency: 'USD',
    };

    await this.prisma.$executeRaw`
      INSERT INTO "Transaction" (
        "id", "userId", "walletId", "currencyCode", "type", "amount", "fee", "netAmount",
        "status", "provider", "paymentMethod", "reference", "metadata", "createdAt", "updatedAt"
      ) VALUES (
        ${transactionId}, ${userId}, ${wallet.id}, ${currencyCode}, 'DEPOSIT', ${amount.toString()}, ${fee.toString()},
        ${netAmount.toString()}, 'PENDING', ${provider}, ${paymentMethod}, ${transactionReference},
        ${JSON.stringify({ source: 'deposit-creation' })}, NOW(), NOW()
      )
    `;
    await this.prisma.$executeRaw`
      INSERT INTO "Deposit" (
        "id", "userId", "walletId", "currencyCode", "amount", "fee", "netAmount", "provider", "paymentMethod",
        "status", "idempotencyKey", "metadata", "exchangeRate", "transactionId", "createdAt", "updatedAt"
      ) VALUES (
        ${depositId}, ${userId}, ${wallet.id}, ${currencyCode}, ${amount.toString()}, ${fee.toString()},
        ${netAmount.toString()}, ${provider}, ${paymentMethod}, 'PENDING', ${idempotencyKey}, ${JSON.stringify(metadata)},
        ${feeBreakdown.exchangeRate.toString()}, ${transactionId}, NOW(), NOW()
      )
    `;

    const paymentIntent = await this.flutterwave.createCardCharge({
      amount: amount.toNumber(),
      currency: currencyCode,
      reference: transactionReference,
      userId,
      walletId: wallet.id,
      depositId,
      card: dto.card,
    });
    const updatedMetadata = {
      ...metadata,
      flutterwave: paymentIntent.meta,
      providerReference: paymentIntent.providerReference,
      providerTransactionId: paymentIntent.providerTransactionId,
      ...(paymentIntent.authorizationUrl && { authorizationUrl: paymentIntent.authorizationUrl }),
    };
    await this.prisma.$executeRaw`
      UPDATE "Deposit"
      SET "providerReference" = ${paymentIntent.providerReference},
          "providerTransactionId" = ${paymentIntent.providerTransactionId},
          "metadata" = ${JSON.stringify(updatedMetadata)},
          "updatedAt" = NOW()
      WHERE "id" = ${depositId}
    `;

    return {
      id: depositId,
      status: 'PENDING',
      provider,
      currency: currencyCode,
      amount: amount.toString(),
      fee: fee.toString(),
      netAmount: netAmount.toString(),
      requestedAmount: requestedAmount.toFixed(2),
      requestedCurrency: 'USD',
      providerFee: feeBreakdown.providerFee.toFixed(2),
      nobleCardsFee: feeBreakdown.nobleCardsFee.toFixed(2),
      totalFees: feeBreakdown.totalFees.toFixed(2),
      customerPayableAmount: feeBreakdown.customerPayableAmount.toFixed(2),
      walletCreditAmount: requestedAmount.toFixed(2),
      walletCreditCurrency: 'USD',
      exchangeRate: feeBreakdown.exchangeRate.toFixed(2),
      authorizationUrl: paymentIntent.authorizationUrl,
      providerReference: paymentIntent.providerReference,
      providerTransactionId: paymentIntent.providerTransactionId,
      walletId: wallet.id,
      transaction: { id: transactionId, reference: transactionReference, status: 'PENDING' },
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
