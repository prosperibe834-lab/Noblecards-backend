import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { Optional } from '@nestjs/common';
import { WalletsService } from '../wallets/wallets.service';
import { BeneficiaryVerificationStatus, PaymentMethod, TransactionStatus, TransactionType, WithdrawalQuoteStatus } from '../generated/prisma';

export type CreateWithdrawalInput = {
  quoteId: string;
  beneficiaryId: string;
  idempotencyKey: string;
  pin: string;
};

export type WithdrawalResponse = {
  id: string;
  reference: string;
  status: TransactionStatus;
  quoteId: string;
  beneficiaryId: string;
  sourceCurrency: string;
  sourceAmount: string;
  destinationCurrency: string;
  destinationCountry: string;
  paymentMethod: PaymentMethod;
  destinationAmount: string;
  exchangeRate: string;
  providerFee: string;
  nobleCardsFee: string;
  totalFee: string;
  recipientAmount: string;
  createdAt: Date;
  transactionId: string | null;
};

@Injectable()
export class WithdrawalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wallets: WalletsService,
    private readonly users: UsersService,
    @Optional() private readonly email?: EmailService,
  ) {}

  private ensureIdempotencyKey(value: string) {
    if (!value || !value.trim()) throw new BadRequestException('Idempotency key is required.');
    if (value.length > 128) throw new BadRequestException('Idempotency key is too long.');
    if (!/^[A-Za-z0-9._:-]+$/.test(value)) {
      throw new BadRequestException('Idempotency key contains unsupported characters.');
    }
  }

  private generateReference() {
    return `WD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}_PMCKDU_1`;
  }

  private async getQuoteForUser(userId: string, quoteId: string) {
    const quote = await (this.prisma as any).withdrawalQuote.findFirst({
      where: { id: quoteId, userId },
    });
    if (!quote) throw new NotFoundException('Withdrawal quote not found.');
    return quote;
  }

  private async getBeneficiaryForUser(userId: string, beneficiaryId: string) {
    const beneficiary = await (this.prisma as any).beneficiary.findFirst({
      where: { id: beneficiaryId, userId },
    });
    if (!beneficiary) throw new NotFoundException('Beneficiary not found.');
    return beneficiary;
  }

  private async validateQuoteUsability(quote: any) {
    if (quote.status !== WithdrawalQuoteStatus.ACTIVE) {
      if (quote.status === WithdrawalQuoteStatus.EXPIRED) {
        throw new BadRequestException('Withdrawal quote has expired.');
      }
      throw new BadRequestException('Withdrawal quote is no longer usable.');
    }
    if (new Date() >= new Date(quote.expiresAt)) {
      await (this.prisma as any).withdrawalQuote.updateMany({
        where: { id: quote.id, userId: quote.userId, status: WithdrawalQuoteStatus.ACTIVE },
        data: { status: WithdrawalQuoteStatus.EXPIRED, usedAt: new Date() },
      });
      throw new BadRequestException('Withdrawal quote has expired.');
    }
  }

  private async validateBeneficiary(beneficiary: any, quote: any) {
    if (!beneficiary || beneficiary.userId !== quote.userId) {
      throw new NotFoundException('Beneficiary not found.');
    }
    if (!beneficiary.isActive) {
      throw new BadRequestException('Beneficiary is inactive.');
    }
    if (beneficiary.verificationStatus !== BeneficiaryVerificationStatus.VERIFIED) {
      throw new BadRequestException('Beneficiary must be verified before withdrawal creation.');
    }
    if (beneficiary.countryCode !== quote.countryCode) {
      throw new BadRequestException('Beneficiary destination does not match the quote country.');
    }
    if (beneficiary.currencyCode !== quote.destinationCurrencyCode) {
      throw new BadRequestException('Beneficiary currency does not match the quote destination currency.');
    }
    if (beneficiary.paymentMethod !== quote.paymentMethod) {
      throw new BadRequestException('Beneficiary payment method does not match the quote payment method.');
    }
  }

  private async validateWallet(userId: string, walletId: string, quote: any) {
    const wallet = await (this.prisma as any).wallet.findFirst({ where: { id: walletId, userId } });
    if (!wallet) throw new NotFoundException('Wallet not found.');

    const balance = await (this.prisma as any).walletBalance.findUnique({
      where: { walletId_currencyCode: { walletId, currencyCode: quote.sourceCurrencyCode } },
    });
    if (!balance) throw new NotFoundException(`Wallet balance for ${quote.sourceCurrencyCode} not found.`);

    const sourceAmount = new Decimal(quote.sourceAmount.toString());
    if (new Decimal(balance.availableBalance.toString()).lt(sourceAmount)) {
      throw new BadRequestException('Insufficient available balance for withdrawal.');
    }

    return { wallet, balance };
  }

  private async verifyPin(userId: string, pin: string) {
    if (!/^[0-9]{4}$/.test(pin)) {
      throw new BadRequestException('Transaction PIN must be a 4-digit number.');
    }
    await this.users.verifyTransactionPin(userId, pin);
  }

  async createWithdrawal(userId: string, input: CreateWithdrawalInput): Promise<WithdrawalResponse> {
    this.ensureIdempotencyKey(input.idempotencyKey);
    await this.verifyPin(userId, input.pin);

    const existing = await (this.prisma as any).withdrawal.findFirst({
      where: { userId, idempotencyKey: input.idempotencyKey },
      include: { transaction: true },
    });
    if (existing) {
      return {
        id: existing.id,
        reference: existing.reference,
        status: existing.status,
        quoteId: existing.quoteId,
        beneficiaryId: existing.beneficiaryId,
        sourceCurrency: existing.sourceCurrencyCode,
        sourceAmount: existing.sourceAmount.toString(),
        destinationCurrency: existing.destinationCurrencyCode,
        destinationCountry: existing.country,
        paymentMethod: existing.paymentMethod,
        destinationAmount: existing.destinationAmount.toString(),
        exchangeRate: existing.exchangeRate.toString(),
        providerFee: existing.fee.toString(),
        nobleCardsFee: existing.fee.toString(),
        totalFee: existing.fee.toString(),
        recipientAmount: existing.amountReceived.toString(),
        createdAt: existing.createdAt,
        transactionId: existing.transaction?.id ?? null,
      };
    }

    const quote = await this.getQuoteForUser(userId, input.quoteId);
    await this.validateQuoteUsability(quote);

    const beneficiary = await this.getBeneficiaryForUser(userId, input.beneficiaryId);
    await this.validateBeneficiary(beneficiary, quote);

    const wallet = await this.validateWallet(userId, (await (this.prisma as any).wallet.findFirst({ where: { userId } }))?.id ?? '', quote);
    if (!wallet.wallet) throw new NotFoundException('Wallet not found.');

    const operationKey = `withdrawal:${input.quoteId}:hold`;
    const reference = this.generateReference();
    const withdrawalId = randomUUID();
    const transactionId = randomUUID();

    const result = await (this.prisma as any).$transaction(async (tx: any) => {
      const quoteLock = await tx.withdrawalQuote.findFirst({ where: { id: input.quoteId, userId } });
      if (!quoteLock) throw new NotFoundException('Withdrawal quote not found.');
      await this.validateQuoteUsability(quoteLock);

      const beneficiaryLock = await tx.beneficiary.findFirst({ where: { id: input.beneficiaryId, userId } });
      if (!beneficiaryLock) throw new NotFoundException('Beneficiary not found.');
      await this.validateBeneficiary(beneficiaryLock, quoteLock);

      const walletLock = await tx.wallet.findFirst({ where: { id: wallet.wallet.id, userId } });
      if (!walletLock) throw new NotFoundException('Wallet not found.');
      const balanceLock = await tx.walletBalance.findUnique({
        where: { walletId_currencyCode: { walletId: walletLock.id, currencyCode: quoteLock.sourceCurrencyCode } },
      });
      if (!balanceLock) throw new NotFoundException(`Wallet balance for ${quoteLock.sourceCurrencyCode} not found.`);

      const quoteUpdate = await tx.withdrawalQuote.updateMany({
        where: { id: quoteLock.id, userId, status: WithdrawalQuoteStatus.ACTIVE, expiresAt: { gt: new Date() } },
        data: { status: WithdrawalQuoteStatus.USED, usedAt: new Date() },
      });
      if (quoteUpdate.count !== 1) {
        throw new ConflictException('Withdrawal quote has already been used or expired.');
      }

      const transactionRecord = await tx.transaction.create({
        data: {
          id: transactionId,
          userId,
          walletId: walletLock.id,
          currencyCode: quoteLock.sourceCurrencyCode,
          type: TransactionType.WITHDRAWAL,
          amount: quoteLock.sourceAmount,
          fee: quoteLock.totalFee,
          netAmount: new Decimal(quoteLock.sourceAmount.toString()).minus(new Decimal(quoteLock.totalFee.toString())),
          status: TransactionStatus.PENDING,
          paymentMethod: quoteLock.paymentMethod,
          reference: reference.replace('WD-', 'TX-'),
          metadata: {
            quoteId: quoteLock.id,
            beneficiaryId: beneficiaryLock.id,
            withdrawalReference: reference,
          },
        },
      });

      const held = await this.wallets.holdFunds({
        userId,
        walletId: walletLock.id,
        currencyCode: quoteLock.sourceCurrencyCode,
        amount: new Decimal(quoteLock.sourceAmount.toString()),
        transactionId: transactionRecord.id,
        reference: operationKey,
      }, tx);
      if (held.alreadyProcessed && held.ledgerEntryId) {
        return { alreadyProcessed: true, ledgerEntryId: held.ledgerEntryId };
      }

      const withdrawal = await tx.withdrawal.create({
        data: {
          id: withdrawalId,
          reference,
          userId,
          walletId: walletLock.id,
          transactionId: transactionRecord.id,
          sourceCurrencyCode: quoteLock.sourceCurrencyCode,
          destinationCurrencyCode: quoteLock.destinationCurrencyCode,
          sourceAmount: quoteLock.sourceAmount,
          destinationAmount: quoteLock.destinationAmount,
          exchangeRate: quoteLock.exchangeRate,
          fee: quoteLock.totalFee,
          amountReceived: quoteLock.amountReceived,
          country: 'Nigeria',
          countryCode: quoteLock.countryCode,
          paymentMethod: quoteLock.paymentMethod,
          provider: null,
          providerReference: null,
          providerTransactionId: null,
          quoteId: quoteLock.id,
          beneficiaryId: beneficiaryLock.id,
          idempotencyKey: input.idempotencyKey,
          status: TransactionStatus.PENDING,
          failureReason: null,
          metadata: { quoteId: quoteLock.id, beneficiaryId: beneficiaryLock.id },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return { withdrawal, transaction: transactionRecord, hold: held };
    });

    if ((result as any)?.alreadyProcessed) {
      throw new ConflictException('A withdrawal with this idempotency key already exists.');
    }

    if (this.email && (this.prisma as any).user?.findUnique) {
      const user = await (this.prisma as any).user.findUnique({ where: { id: userId }, select: { email: true } });
      if (user?.email) {
        await this.email.sendWithdrawalCreatedEmail(
          user.email,
          result.withdrawal.reference,
          result.withdrawal.amountReceived.toString(),
          result.withdrawal.destinationCurrencyCode,
        ).catch(() => undefined);
      }
    }

    return {
      id: result.withdrawal.id,
      reference: result.withdrawal.reference,
      status: result.withdrawal.status,
      quoteId: result.withdrawal.quoteId,
      beneficiaryId: result.withdrawal.beneficiaryId,
      sourceCurrency: result.withdrawal.sourceCurrencyCode,
      sourceAmount: result.withdrawal.sourceAmount.toString(),
      destinationCurrency: result.withdrawal.destinationCurrencyCode,
      destinationCountry: result.withdrawal.country,
      paymentMethod: result.withdrawal.paymentMethod,
      destinationAmount: result.withdrawal.destinationAmount.toString(),
      exchangeRate: result.withdrawal.exchangeRate.toString(),
      providerFee: result.withdrawal.fee.toString(),
      nobleCardsFee: result.withdrawal.fee.toString(),
      totalFee: result.withdrawal.fee.toString(),
      recipientAmount: result.withdrawal.amountReceived.toString(),
      createdAt: result.withdrawal.createdAt,
      transactionId: result.transaction.id,
    };
  }
}
