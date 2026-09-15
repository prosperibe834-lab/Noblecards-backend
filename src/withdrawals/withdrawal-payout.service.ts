import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider, ProviderWebhookEventStatus, TransactionStatus } from '../generated/prisma';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { BeneficiaryEncryptionService } from '../security/beneficiary-encryption.service';
import { WalletsService } from '../wallets/wallets.service';
import { EmailService } from '../email/email.service';
import { PAYOUT_PROVIDER_ADAPTER, type PayoutProviderAdapter } from './payout-provider.interface';

type V3BankRecipient = {
  type: 'bank';
  name: string;
  bank: {
    account_number: string;
    code?: string;
    branch?: string;
    account_type?: 'individual';
    name?: string;
    sort_code?: string;
  };
};

type V3PaymentInstruction = {
  source_currency: string;
  destination_currency: string;
  amount: {
    value: number;
    applies_to: 'destination_currency';
  };
  recipient: V3BankRecipient;
  sender: {
    name: {
      first: string;
      last: string;
    };
  };
};

type V3TransferRequest = {
  action: 'instant';
  reference: string;
  narration: string;
  payment_instruction?: V3PaymentInstruction;
  account_bank?: string;
  account_number?: string;
  beneficiary_name?: string;
  amount?: number;
  currency?: string;
  debit_currency?: string;
  destination_branch_code?: string;
  callback_url?: string;
  meta?: Record<string, unknown>;
};

const TERMINAL_STATUSES = new Set<TransactionStatus>([
  TransactionStatus.SUCCESSFUL,
  TransactionStatus.FAILED,
  TransactionStatus.CANCELLED,
  TransactionStatus.REFUNDED,
  TransactionStatus.REVERSED,
]);

const normalizeProviderIdentifier = (value: unknown): string | null => value == null ? null : String(value);

@Injectable()
export class WithdrawalPayoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wallets: WalletsService,
    private readonly encryption: BeneficiaryEncryptionService,
    @Inject(PAYOUT_PROVIDER_ADAPTER) private readonly provider: PayoutProviderAdapter,
    private readonly config: ConfigService,
    @Optional() private readonly email?: EmailService,
  ) {}

  private async getOwnedWithdrawal(userId: string, withdrawalId: string) {
    const withdrawal = await (this.prisma as any).withdrawal.findFirst({
      where: { id: withdrawalId, userId },
      include: { transaction: true, beneficiary: true },
    });
    if (!withdrawal) throw new NotFoundException('Withdrawal not found.');
    return withdrawal;
  }

  private validateEligibility(withdrawal: any) {
    if (TERMINAL_STATUSES.has(withdrawal.status)) {
      throw new ConflictException('Withdrawal is already in a terminal state.');
    }
    if (withdrawal.status === TransactionStatus.PROCESSING || withdrawal.status === TransactionStatus.UNDER_REVIEW) {
      throw new ConflictException('Withdrawal is already being reconciled.');
    }
    if (!withdrawal.transaction || withdrawal.transaction.status === TransactionStatus.SUCCESSFUL) {
      throw new ConflictException('Withdrawal transaction is not eligible for payout execution.');
    }
    if (!withdrawal.beneficiary || !withdrawal.beneficiary.isActive) {
      throw new BadRequestException('Withdrawal beneficiary is unavailable.');
    }
    if (!withdrawal.reference || !withdrawal.sourceCurrencyCode || !withdrawal.destinationCurrencyCode || !withdrawal.countryCode) {
      throw new BadRequestException('Withdrawal payout snapshot is incomplete.');
    }
    if (!withdrawal.paymentMethod || !withdrawal.sourceAmount || !withdrawal.amountReceived) {
      throw new BadRequestException('Withdrawal payout amount or method is invalid.');
    }
  }

  private capabilityInput(withdrawal: any) {
    return {
      countryCode: withdrawal.countryCode,
      currencyCode: withdrawal.destinationCurrencyCode,
      paymentMethod: withdrawal.paymentMethod,
      beneficiaryType: withdrawal.beneficiary.type,
    };
  }

  private idempotencyKey(withdrawal: any) {
    return `nc-payout-${withdrawal.reference}`;
  }

  private normalizeAmount(value: unknown): number {
    const raw = Number(String(value ?? '0'));
    return Number.isFinite(raw) ? raw : 0;
  }

  private buildOfficialV3BankRecipient(countryCode: string, details: Record<string, string | undefined>, accountNumber: string, beneficiaryName: string): V3BankRecipient {
    const institutionCode = details.institutionCode ?? details.providerBankCode ?? '';
    const institutionName = details.institutionName ?? '';
    const branchCode = details.branchCode ?? '';
    const sortCode = details.sortCode ?? '';
    const routingNumber = details.routingNumber ?? '';
    const swiftCode = details.swiftCode ?? '';

    if (countryCode === 'GH') {
      return {
        type: 'bank',
        name: beneficiaryName,
        bank: {
          account_number: accountNumber,
          code: institutionCode,
          branch: branchCode,
        },
      };
    }

    if (countryCode === 'GB') {
      return {
        type: 'bank',
        name: beneficiaryName,
        bank: {
          account_number: accountNumber,
          account_type: 'individual',
          name: institutionName,
          sort_code: sortCode || routingNumber || '',
        },
      };
    }

    return {
      type: 'bank',
      name: beneficiaryName,
      bank: {
        account_number: accountNumber,
        code: institutionCode,
      },
    };
  }

  private buildOfficialV3PaymentInstruction(withdrawal: any, details: Record<string, string | undefined>, beneficiaryName: string, accountNumber: string): V3PaymentInstruction {
    const countryCode = String(withdrawal.countryCode ?? '').toUpperCase();
    const routeCurrency = String(withdrawal.destinationCurrencyCode ?? '').toUpperCase();
    const sourceCurrency = String(withdrawal.sourceCurrencyCode ?? 'USD').toUpperCase();
    const amountValue = this.normalizeAmount(withdrawal.amountReceived);

    const recipient = this.buildOfficialV3BankRecipient(countryCode, details, accountNumber, beneficiaryName);

    return {
      source_currency: sourceCurrency,
      destination_currency: routeCurrency,
      amount: {
        value: amountValue,
        applies_to: 'destination_currency',
      },
      recipient,
      sender: {
        name: {
          first: 'NobleCards',
          last: 'Payout',
        },
      },
    };
  }

  private buildTransferRequest(withdrawal: any): V3TransferRequest {
    const encrypted = withdrawal.beneficiary.encryptedDetails;
    if (typeof encrypted !== 'string') throw new BadRequestException('BENEFICIARY_DATA_UNAVAILABLE: Encrypted beneficiary details are unavailable.');
    const details = this.encryption.decrypt<Record<string, string | undefined>>(encrypted);

    const accountBank = details.institutionCode ?? details.providerBankCode;
    const accountNumber = details.accountNumber;
    const beneficiaryName = details.accountHolderName ?? withdrawal.beneficiary.accountHolderName ?? 'NobleCards Recipient';

    if (!accountBank || !accountNumber) {
      throw new BadRequestException('BENEFICIARY_DATA_INCOMPLETE: Bank account and institution code are required.');
    }

    const routeCurrency = String(withdrawal.destinationCurrencyCode ?? '').toUpperCase();
    const countryCode = String(withdrawal.countryCode ?? '').toUpperCase();
    const amountValue = this.normalizeAmount(withdrawal.amountReceived);
    const paymentInstruction = this.buildOfficialV3PaymentInstruction(withdrawal, details, beneficiaryName, accountNumber);

    if (countryCode === 'GH') {
      const payload: V3TransferRequest = {
        action: 'instant',
        reference: withdrawal.reference,
        narration: `NobleCards withdrawal ${withdrawal.reference}`.slice(0, 180),
        account_bank: accountBank,
        account_number: accountNumber,
        beneficiary_name: beneficiaryName,
        amount: amountValue,
        currency: 'GHS',
        debit_currency: String(withdrawal.sourceCurrencyCode ?? 'USD').toUpperCase(),
      };
      if (details.branchCode) payload.destination_branch_code = details.branchCode;
      const callbackUrl = this.config?.get<string>('FLUTTERWAVE_PAYOUT_CALLBACK_URL');
      if (callbackUrl && callbackUrl.trim()) payload.callback_url = callbackUrl.trim();
      return payload;
    }

    if (countryCode !== 'NG') {
      const payload: V3TransferRequest = {
        action: 'instant',
        reference: withdrawal.reference,
        narration: `NobleCards withdrawal ${withdrawal.reference}`.slice(0, 180),
        payment_instruction: paymentInstruction,
      };

      if (countryCode === 'GB') {
        payload.payment_instruction = {
          ...paymentInstruction,
          destination_currency: 'GBP',
          recipient: {
            type: 'bank',
            name: beneficiaryName,
            bank: {
              account_number: accountNumber,
              account_type: 'individual',
              name: details.institutionName ?? withdrawal.beneficiary.institutionName ?? '',
              sort_code: details.sortCode ?? details.routingNumber ?? '',
            },
          },
        };
        payload.meta = {
          beneficiary: {
            account_number: accountNumber,
            beneficiary_name: beneficiaryName,
            bank_name: details.institutionName ?? withdrawal.beneficiary.institutionName ?? '',
            country: 'UK',
            routing_number: details.routingNumber ?? '',
            sort_code: details.sortCode ?? '',
            swift_code: details.swiftCode ?? '',
          },
        };
      }

      const callbackUrl = this.config?.get<string>('FLUTTERWAVE_PAYOUT_CALLBACK_URL');
      if (callbackUrl && callbackUrl.trim()) payload.callback_url = callbackUrl.trim();
      return payload;
    }

    const payload: V3TransferRequest = {
      action: 'instant',
      reference: withdrawal.reference,
      narration: `NobleCards withdrawal ${withdrawal.reference}`.slice(0, 180),
      account_bank: accountBank,
      account_number: accountNumber,
      beneficiary_name: beneficiaryName,
      amount: amountValue,
      currency: routeCurrency,
      debit_currency: String(withdrawal.sourceCurrencyCode ?? 'USD').toUpperCase(),
    };

    const callbackUrl = this.config?.get<string>('FLUTTERWAVE_PAYOUT_CALLBACK_URL');
    if (callbackUrl && callbackUrl.trim()) payload.callback_url = callbackUrl.trim();

    return payload;
  }

  private async claimAttempt(userId: string, withdrawal: any, idempotencyKey: string) {
    const attemptId = randomUUID();
    const traceId = randomUUID();
    const result = await (this.prisma as any).$transaction(async (tx: any) => {
      const claimed = await tx.withdrawal.updateMany({
        where: { id: withdrawal.id, userId, status: TransactionStatus.PENDING },
        data: { status: TransactionStatus.PROCESSING, provider: PaymentProvider.FLUTTERWAVE },
      });
      if (claimed.count !== 1) throw new ConflictException('Withdrawal is already being processed.');
      const previous = await tx.payoutAttempt.aggregate({ where: { withdrawalId: withdrawal.id }, _max: { attemptNumber: true } });
      const attemptNumber = (previous._max.attemptNumber ?? 0) + 1;
      const attempt = await tx.payoutAttempt.create({
        data: {
          id: attemptId,
          withdrawalId: withdrawal.id,
          provider: PaymentProvider.FLUTTERWAVE,
          attemptNumber,
          status: TransactionStatus.PROCESSING,
          requestMetadata: { reference: withdrawal.reference, idempotencyKey, traceId },
        },
      });
      await tx.transaction.update({ where: { id: withdrawal.transaction.id }, data: { status: TransactionStatus.PROCESSING } });
      return { attempt, traceId };
    });
    return result;
  }

  private async persistProviderResult(withdrawal: any, claim: any, result: any) {
    const outcome = await (this.prisma as any).$transaction(async (tx: any) => {
      const status = result.status as TransactionStatus;
      const providerReference = normalizeProviderIdentifier(result.providerReference);
      const providerTransactionId = normalizeProviderIdentifier(result.providerTransactionId);
      await tx.payoutAttempt.update({
        where: { id: claim.attempt.id },
        data: {
          status,
          providerReference,
          providerTransactionId,
          responseMetadata: result.metadata ?? null,
        },
      });

      if (status === TransactionStatus.SUCCESSFUL) {
        const updated = await tx.withdrawal.updateMany({ where: { id: withdrawal.id, status: { in: [TransactionStatus.PROCESSING, TransactionStatus.UNDER_REVIEW] } }, data: { status: TransactionStatus.SUCCESSFUL, providerReference, providerTransactionId, completedAt: new Date() } });
        await tx.transaction.updateMany({ where: { id: withdrawal.transaction.id, status: { in: [TransactionStatus.PROCESSING, TransactionStatus.UNDER_REVIEW] } }, data: { status: TransactionStatus.SUCCESSFUL, providerReference, providerTransactionId } });
        if (updated.count === 1) {
          await this.wallets.finalizeHeldFunds({ userId: withdrawal.userId, walletId: withdrawal.walletId, currencyCode: withdrawal.sourceCurrencyCode, amount: withdrawal.sourceAmount, transactionId: withdrawal.transaction.id, reference: withdrawal.reference }, tx);
        }
        return { status, shouldSendSuccessEmail: updated.count === 1 };
      } else if (status === TransactionStatus.FAILED) {
        const updated = await tx.withdrawal.updateMany({ where: { id: withdrawal.id, status: { in: [TransactionStatus.PROCESSING, TransactionStatus.UNDER_REVIEW] } }, data: { status: TransactionStatus.FAILED, providerReference, providerTransactionId, failureReason: result.failureReason ?? 'Provider rejected the payout.' } });
        await tx.transaction.updateMany({ where: { id: withdrawal.transaction.id, status: { in: [TransactionStatus.PROCESSING, TransactionStatus.UNDER_REVIEW] } }, data: { status: TransactionStatus.FAILED, providerReference, providerTransactionId } });
        if (updated.count === 1) {
          await this.wallets.releaseHeldFunds({ userId: withdrawal.userId, walletId: withdrawal.walletId, currencyCode: withdrawal.sourceCurrencyCode, amount: withdrawal.sourceAmount, transactionId: withdrawal.transaction.id, reference: withdrawal.reference }, tx);
        }
      } else if (status === TransactionStatus.PROCESSING) {
        await tx.withdrawal.updateMany({ where: { id: withdrawal.id, status: { in: [TransactionStatus.PROCESSING, TransactionStatus.UNDER_REVIEW] } }, data: { status: TransactionStatus.PROCESSING, providerReference, providerTransactionId } });
        await tx.transaction.updateMany({ where: { id: withdrawal.transaction.id, status: { in: [TransactionStatus.PROCESSING, TransactionStatus.UNDER_REVIEW] } }, data: { status: TransactionStatus.PROCESSING, providerReference, providerTransactionId } });
      } else {
        await tx.withdrawal.updateMany({ where: { id: withdrawal.id, status: TransactionStatus.UNDER_REVIEW }, data: { providerReference, providerTransactionId } });
      }
      return { status, shouldSendSuccessEmail: false };
    });
    if (outcome.shouldSendSuccessEmail && this.email) {
      await this.sendWithdrawalSuccessEmail(withdrawal).catch(() => undefined);
    }
    return outcome.status;
  }

  private async sendWithdrawalSuccessEmail(withdrawal: any) {
    const user = await (this.prisma as any).user.findUnique({ where: { id: withdrawal.userId }, select: { email: true } });
    if (!user?.email) return;

    let accountLast4 = withdrawal.beneficiary?.accountLast4;
    if (!accountLast4 && typeof withdrawal.beneficiary?.encryptedDetails === 'string') {
      const details = this.encryption.decrypt<Record<string, string | undefined>>(withdrawal.beneficiary.encryptedDetails);
      accountLast4 = details.accountNumber?.slice(-4);
    }
    const destination = accountLast4 ? `Bank account ending in ${accountLast4}` : 'Bank account';
    await this.email!.sendWithdrawalSuccessEmail(user.email, {
      sourceAmount: withdrawal.sourceAmount.toString(),
      sourceCurrency: withdrawal.sourceCurrencyCode,
      destinationAmount: withdrawal.amountReceived.toString(),
      destinationCurrency: withdrawal.destinationCurrencyCode,
      destination,
      reference: withdrawal.reference,
      completedAt: new Date(),
    });
  }

  async execute(userId: string, withdrawalId: string) {
    const withdrawal = await this.getOwnedWithdrawal(userId, withdrawalId);
    this.validateEligibility(withdrawal);

    const existingAttempt = await (this.prisma as any).payoutAttempt.findFirst({ where: { withdrawalId: withdrawal.id }, orderBy: { attemptNumber: 'desc' } });
    if (existingAttempt?.providerTransactionId || existingAttempt?.providerReference) {
      if (!existingAttempt.providerTransactionId) {
        throw new ConflictException('Withdrawal has an existing provider reference and cannot be submitted again.');
      }
      const result = await this.provider.getPayoutStatus({ transferId: String(existingAttempt.providerTransactionId) });
      const status = result.status === 'SUCCESS' ? TransactionStatus.SUCCESSFUL : result.status === 'FAILED' ? TransactionStatus.FAILED : result.status === 'PROCESSING' ? TransactionStatus.PROCESSING : TransactionStatus.UNDER_REVIEW;
      await this.persistProviderResult(withdrawal, { attempt: existingAttempt }, { ...result, status });
      return { withdrawalId, status, providerReference: normalizeProviderIdentifier(result.providerReference), providerTransactionId: normalizeProviderIdentifier(result.providerTransactionId) };
    }

    if (!this.provider.supportsPayout(this.capabilityInput(withdrawal))) {
      throw new BadRequestException(
        `PROVIDER_CAPABILITY_UNSUPPORTED: ${PaymentProvider.FLUTTERWAVE} payout capability is not available for this withdrawal route.`,
      );
    }
    const request = this.buildTransferRequest(withdrawal);
    const idempotencyKey = this.idempotencyKey(withdrawal);
    const claim = await this.claimAttempt(userId, withdrawal, idempotencyKey);
    try {
      const result = await this.provider.createTransfer({ request, idempotencyKey, traceId: claim.traceId });
      await this.persistProviderResult(withdrawal, claim, result);
      return { withdrawalId, status: result.status, providerReference: result.providerReference, providerTransactionId: result.providerTransactionId };
    } catch (error) {
      await (this.prisma as any).payoutAttempt.update({ where: { id: claim.attempt.id }, data: { status: TransactionStatus.UNDER_REVIEW, errorMessage: 'Provider outcome is ambiguous; reconciliation required.' } });
      await (this.prisma as any).withdrawal.updateMany({ where: { id: withdrawal.id, status: TransactionStatus.PROCESSING }, data: { status: TransactionStatus.UNDER_REVIEW } });
      throw error;
    }
  }

  async reconcile(userId: string, withdrawalId: string) {
    const withdrawal = await this.getOwnedWithdrawal(userId, withdrawalId);
    if (withdrawal.status !== TransactionStatus.UNDER_REVIEW && withdrawal.status !== TransactionStatus.PROCESSING) {
      throw new ConflictException('Withdrawal is not awaiting provider reconciliation.');
    }

    const attempt = await (this.prisma as any).payoutAttempt.findFirst({ where: { withdrawalId: withdrawal.id }, orderBy: { attemptNumber: 'desc' } });
    if (!attempt?.providerTransactionId) throw new BadRequestException('PAYOUT_RECONCILIATION_UNAVAILABLE: Provider transfer ID is not available.');
    const result = await this.provider.getPayoutStatus({ transferId: attempt.providerTransactionId });
    const status = result.status === 'SUCCESS' ? TransactionStatus.SUCCESSFUL : result.status === 'FAILED' ? TransactionStatus.FAILED : result.status === 'PROCESSING' ? TransactionStatus.PROCESSING : TransactionStatus.UNDER_REVIEW;
    await this.persistProviderResult(withdrawal, { attempt }, { ...result, status });
    return result;
  }

  async handleWebhook(signature: string | undefined, rawBody: string) {
    const verification = await this.provider.verifyWebhook(signature, rawBody);
    if (!verification.valid || !verification.eventId || !verification.providerTransactionId) {
      throw new BadRequestException('PAYOUT_WEBHOOK_INVALID: Flutterwave payout webhook verification failed.');
    }
    const payload = JSON.parse(rawBody) as any;
    const eventType = String(payload.type ?? 'unknown');
    const prisma = this.prisma as any;
    try {
      const event = await prisma.providerWebhookEvent.create({
        data: {
          provider: PaymentProvider.FLUTTERWAVE,
          eventId: verification.eventId,
          eventType,
          providerReference: verification.providerReference ?? null,
          providerTransactionId: verification.providerTransactionId,
          status: ProviderWebhookEventStatus.RECEIVED,
          metadata: { status: payload.data?.status },
        },
      });
      const attempt = await prisma.payoutAttempt.findFirst({
        where: { provider: PaymentProvider.FLUTTERWAVE, providerTransactionId: verification.providerTransactionId },
        orderBy: { attemptNumber: 'desc' },
      });
      if (!attempt) {
        await prisma.providerWebhookEvent.update({ where: { id: event.id }, data: { status: ProviderWebhookEventStatus.IGNORED, processedAt: new Date() } });
        return { processed: false, ignored: true };
      }
      const withdrawal = await prisma.withdrawal.findUnique({ include: { transaction: true }, where: { id: attempt.withdrawalId } });
      if (!withdrawal) {
        await prisma.providerWebhookEvent.update({ where: { id: event.id }, data: { status: ProviderWebhookEventStatus.IGNORED, processedAt: new Date() } });
        return { processed: false, ignored: true };
      }
      if (eventType === 'transfer.reversal') {
        await prisma.payoutAttempt.update({
          where: { id: attempt.id },
          data: { status: TransactionStatus.UNDER_REVIEW, errorMessage: 'Provider reversal requires verified returned-funds reconciliation.' },
        });
        await prisma.withdrawal.updateMany({
          where: { id: withdrawal.id, status: TransactionStatus.SUCCESSFUL },
          data: { status: TransactionStatus.UNDER_REVIEW, failureReason: 'Provider reversal requires reconciliation.' },
        });
        await prisma.providerWebhookEvent.update({ where: { id: event.id }, data: { status: ProviderWebhookEventStatus.PROCESSED, processedAt: new Date(), withdrawalId: withdrawal.id } });
        return { processed: true, reversal: true, status: TransactionStatus.UNDER_REVIEW };
      }
      const status = verification.status === 'SUCCESS' ? TransactionStatus.SUCCESSFUL : verification.status === 'FAILED' ? TransactionStatus.FAILED : TransactionStatus.PROCESSING;
      await this.persistProviderResult(withdrawal, { attempt }, { status, providerReference: verification.providerReference, providerTransactionId: verification.providerTransactionId });
      await prisma.providerWebhookEvent.update({ where: { id: event.id }, data: { status: ProviderWebhookEventStatus.PROCESSED, processedAt: new Date(), withdrawalId: withdrawal.id } });
      return { processed: true, status };
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002') return { processed: false, duplicate: true };
      throw error;
    }
  }
}
