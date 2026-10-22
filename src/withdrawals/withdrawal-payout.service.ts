import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PaymentProvider,
  ProviderWebhookEventStatus,
  TransactionStatus,
} from '../generated/prisma';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { BeneficiaryEncryptionService } from '../security/beneficiary-encryption.service';
import { WalletsService } from '../wallets/wallets.service';
import { EmailService } from '../email/email.service';
import {
  PAYOUT_PROVIDER_ADAPTER,
  type PayoutProviderAdapter,
} from './payout-provider.interface';
import { recordPlatformEarning } from '../dashboard/platform-accounting';

type V3TransferRequest = {
  action: 'instant';
  reference: string;
  narration: string;
  account_bank?: string;
  account_number?: string;
  beneficiary_name?: string;
  amount?: number;
  currency?: string;
  debit_currency?: string;
  destination_branch_code?: string;
  callback_url?: string;
  meta?: Array<Record<string, string>>;
};

const TERMINAL_STATUSES = new Set<TransactionStatus>([
  TransactionStatus.SUCCESSFUL,
  TransactionStatus.FAILED,
  TransactionStatus.CANCELLED,
  TransactionStatus.REFUNDED,
  TransactionStatus.REVERSED,
]);

const normalizeProviderIdentifier = (value: unknown): string | null =>
  value == null ? null : String(value);

@Injectable()
export class WithdrawalPayoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wallets: WalletsService,
    private readonly encryption: BeneficiaryEncryptionService,
    @Inject(PAYOUT_PROVIDER_ADAPTER)
    private readonly provider: PayoutProviderAdapter,
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
    if (
      withdrawal.status === TransactionStatus.PROCESSING ||
      withdrawal.status === TransactionStatus.UNDER_REVIEW
    ) {
      throw new ConflictException('Withdrawal is already being reconciled.');
    }
    if (
      !withdrawal.transaction ||
      withdrawal.transaction.status === TransactionStatus.SUCCESSFUL
    ) {
      throw new ConflictException(
        'Withdrawal transaction is not eligible for payout execution.',
      );
    }
    if (!withdrawal.beneficiary || !withdrawal.beneficiary.isActive) {
      throw new BadRequestException('Withdrawal beneficiary is unavailable.');
    }
    if (
      !withdrawal.reference ||
      !withdrawal.sourceCurrencyCode ||
      !withdrawal.destinationCurrencyCode ||
      !withdrawal.countryCode
    ) {
      throw new BadRequestException(
        'Withdrawal payout snapshot is incomplete.',
      );
    }
    if (
      !withdrawal.paymentMethod ||
      !withdrawal.sourceAmount ||
      !withdrawal.amountReceived
    ) {
      throw new BadRequestException(
        'Withdrawal payout amount or method is invalid.',
      );
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

  private get isSandbox(): boolean {
    return (
      this.config?.get<string>('FLUTTERWAVE_PAYOUT_ENVIRONMENT')?.toLowerCase() ===
      'sandbox'
    );
  }

  private async getConfirmedProviderStatus(
    transferId: string,
    expectedReference: string,
  ) {
    const result = await this.provider.getPayoutStatus({ transferId });
    if (
      String(result.providerTransactionId ?? '') !== transferId ||
      String(result.providerReference ?? '') !== expectedReference
    ) {
      throw new ConflictException(
        'Provider status identifiers do not match this withdrawal; manual reconciliation is required.',
      );
    }
    const isSandboxSuccess =
      this.isSandbox &&
      (result.status === 'PROCESSING' || result.status === 'UNKNOWN');
    const status =
      result.status === 'SUCCESS' || isSandboxSuccess
        ? TransactionStatus.SUCCESSFUL
        : result.status === 'FAILED'
          ? TransactionStatus.FAILED
          : result.status === 'PROCESSING'
            ? TransactionStatus.PROCESSING
            : TransactionStatus.UNDER_REVIEW;
    return { ...result, status };
  }

  private normalizeAmount(value: unknown): number {
    const raw = Number(String(value ?? '0'));
    return Number.isFinite(raw) ? raw : 0;
  }

  private buildTransferRequest(withdrawal: any): V3TransferRequest {
    const encrypted = withdrawal.beneficiary.encryptedDetails;
    if (typeof encrypted !== 'string')
      throw new BadRequestException(
        'BENEFICIARY_DATA_UNAVAILABLE: Encrypted beneficiary details are unavailable.',
      );
    const details =
      this.encryption.decrypt<Record<string, string | undefined>>(encrypted);

    const routeCurrency = String(
      withdrawal.destinationCurrencyCode ?? '',
    ).toUpperCase();
    const countryCode = String(withdrawal.countryCode ?? '').toUpperCase();
    const amountValue = this.normalizeAmount(withdrawal.amountReceived);
    const accountBank = details.institutionCode ?? details.providerBankCode;
    const accountNumber = details.accountNumber;
    const beneficiaryName =
      details.accountHolderName ??
      withdrawal.beneficiary.accountHolderName ??
      'NobleCards Recipient';

    if (!accountNumber) {
      throw new BadRequestException(
        'BENEFICIARY_DATA_INCOMPLETE: Bank account number is required.',
      );
    }

    if (!this.isSandbox && (countryCode === 'CA' || routeCurrency === 'CAD')) {
      throw new BadRequestException(
        'PAYOUT_CORRIDOR_UNSUPPORTED: Flutterwave V3 documentation does not currently list CAD bank transfers.',
      );
    }

    if (
      countryCode === 'GB' ||
      countryCode === 'US' ||
      countryCode === 'CA'
    ) {
      const expectedCurrency =
        countryCode === 'GB' ? 'GBP' : countryCode === 'US' ? 'USD' : 'CAD';
      if (routeCurrency !== expectedCurrency) {
        throw new BadRequestException(
          'PAYOUT_CORRIDOR_INVALID: Country and destination currency do not match.',
        );
      }
      const beneficiaryAddress =
        details.beneficiaryAddress ??
        [
          details.streetNumber,
          details.streetName,
          details.city,
          details.state,
          details.postalCode,
        ]
          .filter(Boolean)
          .join(', ');
      const accountType = details.accountType?.toLowerCase() ?? '';
      const routingNumber =
        countryCode === 'GB'
          ? (details.sortCode ?? '').replace(/\D/g, '')
          : countryCode === 'US'
            ? (details.routingNumber ?? '').replace(/\D/g, '')
            : `${details.institutionNumber ?? ''}${details.transitNumber ?? ''}`.replace(/\D/g, '');
      const swiftCode = details.swiftCode?.toUpperCase() ?? '';
      const bankName =
        details.institutionName ?? withdrawal.beneficiary.institutionName ?? '';

      if (
        (countryCode !== 'CA' && !routingNumber) ||
        (countryCode === 'CA' &&
          (!details.institutionNumber || !details.transitNumber)) ||
        !bankName ||
        !beneficiaryAddress
      ) {
        throw new BadRequestException(
          'BENEFICIARY_DATA_INCOMPLETE: Bank name, routing identifier, and beneficiary address are required.',
        );
      }
      if (
        countryCode === 'GB' &&
        !['personal', 'corporate'].includes(accountType)
      ) {
        throw new BadRequestException(
          'BENEFICIARY_DATA_INCOMPLETE: UK account type must be personal or corporate.',
        );
      }
      const nameParts = beneficiaryName.trim().split(/\s+/);
      if (
        countryCode === 'GB' &&
        accountType === 'personal' &&
        nameParts.length < 2
      ) {
        throw new BadRequestException(
          'BENEFICIARY_DATA_INCOMPLETE: Personal UK beneficiaries require first and last names.',
        );
      }
      if (
        countryCode === 'US' &&
        (!['checking', 'depository'].includes(accountType) || !swiftCode)
      ) {
        throw new BadRequestException(
          'BENEFICIARY_DATA_INCOMPLETE: US account type and SWIFT code are required.',
        );
      }

      const meta: Record<string, string> = {
        bank_name: bankName,
        beneficiary_address: beneficiaryAddress,
        postal_code: details.postalCode ?? '',
        street_number: details.streetNumber ?? '',
        street_name: details.streetName ?? '',
      };
      if (routingNumber) meta.routing_number = routingNumber;
      if (accountType) meta.account_type = accountType;
      if (details.city) meta.city = details.city;
      if (countryCode === 'CA') {
        meta.institution_number = details.institutionNumber ?? '';
        meta.transit_number = details.transitNumber ?? '';
        meta.country = 'CA';
      } else if (countryCode === 'US') {
        meta.swift_code = swiftCode;
        meta.country = 'US';
      } else if (accountType === 'personal') {
        meta.first_name = nameParts[0];
        meta.last_name = nameParts.slice(1).join(' ');
        meta.country = 'GB';
      } else {
        meta.beneficiary_merchant_name = beneficiaryName;
        meta.country = 'GB';
      }

      const callbackUrl = this.config?.get<string>(
        'FLUTTERWAVE_PAYOUT_CALLBACK_URL',
      );
      const payload: V3TransferRequest = {
        action: 'instant',
        reference: withdrawal.reference,
        narration: (countryCode === 'GB' && details.transferReason
          ? details.transferReason
          : `NobleCards withdrawal ${withdrawal.reference}`
        ).slice(0, 180),
        account_number: accountNumber,
        beneficiary_name: beneficiaryName,
        amount: amountValue,
        currency: routeCurrency,
        debit_currency: String(
          withdrawal.sourceCurrencyCode ?? 'USD',
        ).toUpperCase(),
        meta: [meta],
      };
      if (callbackUrl && callbackUrl.trim())
        payload.callback_url = callbackUrl.trim();
      return payload;
    }

    if (!accountBank) {
      throw new BadRequestException(
        'BENEFICIARY_DATA_INCOMPLETE: Bank institution code is required.',
      );
    }

    if (countryCode === 'GH' && details.branchRequired && !details.branchCode) {
      throw new BadRequestException(
        'BENEFICIARY_BRANCH_REQUIRED: Select a valid provider branch before payout.',
      );
    }

    if (countryCode === 'GH') {
      const payload: V3TransferRequest = {
        action: 'instant',
        reference: withdrawal.reference,
        narration: `NobleCards withdrawal ${withdrawal.reference}`.slice(
          0,
          180,
        ),
        account_bank: accountBank,
        account_number: accountNumber,
        beneficiary_name: beneficiaryName,
        amount: amountValue,
        currency: 'GHS',
        debit_currency: String(
          withdrawal.sourceCurrencyCode ?? 'USD',
        ).toUpperCase(),
      };
      if (details.branchCode)
        payload.destination_branch_code = details.branchCode;
      const callbackUrl = this.config?.get<string>(
        'FLUTTERWAVE_PAYOUT_CALLBACK_URL',
      );
      if (callbackUrl && callbackUrl.trim())
        payload.callback_url = callbackUrl.trim();
      return payload;
    }

    if (countryCode !== 'NG' || routeCurrency !== 'NGN') {
      throw new BadRequestException(
        'PAYOUT_CORRIDOR_UNSUPPORTED: No verified V3 bank transfer request is configured for this corridor.',
      );
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
      debit_currency: String(
        withdrawal.sourceCurrencyCode ?? 'USD',
      ).toUpperCase(),
    };

    const callbackUrl = this.config?.get<string>(
      'FLUTTERWAVE_PAYOUT_CALLBACK_URL',
    );
    if (callbackUrl && callbackUrl.trim())
      payload.callback_url = callbackUrl.trim();

    return payload;
  }

  private async claimAttempt(
    userId: string,
    withdrawal: any,
    idempotencyKey: string,
  ) {
    const attemptId = randomUUID();
    const traceId = randomUUID();
    const result = await (this.prisma as any).$transaction(async (tx: any) => {
      const claimed = await tx.withdrawal.updateMany({
        where: { id: withdrawal.id, userId, status: TransactionStatus.PENDING },
        data: {
          status: TransactionStatus.PROCESSING,
          provider: PaymentProvider.FLUTTERWAVE,
        },
      });
      if (claimed.count !== 1)
        throw new ConflictException('Withdrawal is already being processed.');
      const previous = await tx.payoutAttempt.aggregate({
        where: { withdrawalId: withdrawal.id },
        _max: { attemptNumber: true },
      });
      const attemptNumber = (previous._max.attemptNumber ?? 0) + 1;
      const attempt = await tx.payoutAttempt.create({
        data: {
          id: attemptId,
          withdrawalId: withdrawal.id,
          provider: PaymentProvider.FLUTTERWAVE,
          attemptNumber,
          status: TransactionStatus.PROCESSING,
          requestMetadata: {
            reference: withdrawal.reference,
            idempotencyKey,
            traceId,
          },
        },
      });
      await tx.transaction.update({
        where: { id: withdrawal.transaction.id },
        data: { status: TransactionStatus.PROCESSING },
      });
      return { attempt, traceId };
    });
    return result;
  }

  private async persistProviderResult(
    withdrawal: any,
    claim: any,
    result: any,
  ) {
    const outcome = await (this.prisma as any).$transaction(async (tx: any) => {
      const status = result.status as TransactionStatus;
      const providerReference = normalizeProviderIdentifier(
        result.providerReference,
      );
      const providerTransactionId = normalizeProviderIdentifier(
        result.providerTransactionId,
      );
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
        const updated = await tx.withdrawal.updateMany({
          where: {
            id: withdrawal.id,
            status: {
              in: [
                TransactionStatus.PROCESSING,
                TransactionStatus.UNDER_REVIEW,
              ],
            },
          },
          data: {
            status: TransactionStatus.SUCCESSFUL,
            providerReference,
            providerTransactionId,
            completedAt: new Date(),
          },
        });
        await tx.transaction.updateMany({
          where: {
            id: withdrawal.transaction.id,
            status: {
              in: [
                TransactionStatus.PROCESSING,
                TransactionStatus.UNDER_REVIEW,
              ],
            },
          },
          data: {
            status: TransactionStatus.SUCCESSFUL,
            providerReference,
            providerTransactionId,
          },
        });
        if (updated.count === 1) {
          await this.wallets.finalizeHeldFunds(
            {
              userId: withdrawal.userId,
              walletId: withdrawal.walletId,
              currencyCode: withdrawal.sourceCurrencyCode,
              amount: withdrawal.sourceAmount,
              transactionId: withdrawal.transaction.id,
              reference: withdrawal.reference,
            },
            tx,
          );
          if (withdrawal.quoteId) {
            const quote = await tx.withdrawalQuote.findUnique({
              where: { id: withdrawal.quoteId },
              select: {
                sourceCurrencyCode: true,
                nobleCardsFee: true,
              },
            });
            if (quote?.sourceCurrencyCode === 'USD' && quote.nobleCardsFee) {
              await recordPlatformEarning(tx, {
                sourceType: 'WITHDRAWAL',
                sourceId: withdrawal.id,
                amount: quote.nobleCardsFee,
                currencyCode: quote.sourceCurrencyCode,
                usdAmount: quote.nobleCardsFee,
                occurredAt: new Date(),
              });
            }
          }
        }
        return { status, shouldSendSuccessEmail: updated.count === 1 };
      } else if (status === TransactionStatus.FAILED) {
        const updated = await tx.withdrawal.updateMany({
          where: {
            id: withdrawal.id,
            status: {
              in: [
                TransactionStatus.PROCESSING,
                TransactionStatus.UNDER_REVIEW,
              ],
            },
          },
          data: {
            status: TransactionStatus.FAILED,
            providerReference,
            providerTransactionId,
            failureReason:
              result.failureReason ?? 'Provider rejected the payout.',
          },
        });
        await tx.transaction.updateMany({
          where: {
            id: withdrawal.transaction.id,
            status: {
              in: [
                TransactionStatus.PROCESSING,
                TransactionStatus.UNDER_REVIEW,
              ],
            },
          },
          data: {
            status: TransactionStatus.FAILED,
            providerReference,
            providerTransactionId,
          },
        });
        if (updated.count === 1) {
          await this.wallets.releaseHeldFunds(
            {
              userId: withdrawal.userId,
              walletId: withdrawal.walletId,
              currencyCode: withdrawal.sourceCurrencyCode,
              amount: withdrawal.sourceAmount,
              transactionId: withdrawal.transaction.id,
              reference: withdrawal.reference,
            },
            tx,
          );
        }
      } else if (status === TransactionStatus.PROCESSING) {
        await tx.withdrawal.updateMany({
          where: {
            id: withdrawal.id,
            status: {
              in: [
                TransactionStatus.PROCESSING,
                TransactionStatus.UNDER_REVIEW,
              ],
            },
          },
          data: {
            status: TransactionStatus.PROCESSING,
            providerReference,
            providerTransactionId,
          },
        });
        await tx.transaction.updateMany({
          where: {
            id: withdrawal.transaction.id,
            status: {
              in: [
                TransactionStatus.PROCESSING,
                TransactionStatus.UNDER_REVIEW,
              ],
            },
          },
          data: {
            status: TransactionStatus.PROCESSING,
            providerReference,
            providerTransactionId,
          },
        });
      } else {
        await tx.withdrawal.updateMany({
          where: {
            id: withdrawal.id,
            status: {
              in: [
                TransactionStatus.PROCESSING,
                TransactionStatus.UNDER_REVIEW,
              ],
            },
          },
          data: {
            status: TransactionStatus.UNDER_REVIEW,
            providerReference,
            providerTransactionId,
          },
        });
        await tx.transaction.updateMany({
          where: {
            id: withdrawal.transaction.id,
            status: {
              in: [
                TransactionStatus.PROCESSING,
                TransactionStatus.UNDER_REVIEW,
              ],
            },
          },
          data: {
            status: TransactionStatus.UNDER_REVIEW,
            providerReference,
            providerTransactionId,
          },
        });
      }
      return { status, shouldSendSuccessEmail: false };
    });
    if (outcome.shouldSendSuccessEmail && this.email) {
      await this.sendWithdrawalSuccessEmail(withdrawal).catch(() => undefined);
    }
    return outcome.status;
  }

  private async sendWithdrawalSuccessEmail(withdrawal: any) {
    const user = await (this.prisma as any).user.findUnique({
      where: { id: withdrawal.userId },
      select: { email: true },
    });
    if (!user?.email) return;

    let accountLast4 = withdrawal.beneficiary?.accountLast4;
    if (
      !accountLast4 &&
      typeof withdrawal.beneficiary?.encryptedDetails === 'string'
    ) {
      const details = this.encryption.decrypt<
        Record<string, string | undefined>
      >(withdrawal.beneficiary.encryptedDetails);
      accountLast4 = details.accountNumber?.slice(-4);
    }
    const destination = accountLast4
      ? `Bank account ending in ${accountLast4}`
      : 'Bank account';
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
    const existingAttempt = await (this.prisma as any).payoutAttempt.findFirst({
      where: { withdrawalId: withdrawal.id },
      orderBy: { attemptNumber: 'desc' },
    });
    if (existingAttempt) {
      if (!existingAttempt.providerTransactionId) {
        throw new ConflictException(
          'Payout outcome is under review. No provider transfer ID is available; manual reconciliation is required and the payout will not be resubmitted.',
        );
      }
      if (TERMINAL_STATUSES.has(withdrawal.status)) {
        return {
          withdrawalId,
          status: withdrawal.status,
          providerReference: existingAttempt.providerReference ?? null,
          providerTransactionId: existingAttempt.providerTransactionId,
        };
      }
      const result = await this.getConfirmedProviderStatus(
        String(existingAttempt.providerTransactionId),
        withdrawal.reference,
      );
      if (
        existingAttempt.providerReference &&
        existingAttempt.providerReference !== result.providerReference
      ) {
        throw new ConflictException(
          'Provider status identifiers do not match this withdrawal; manual reconciliation is required.',
        );
      }
      await this.persistProviderResult(
        withdrawal,
        { attempt: existingAttempt },
        result,
      );
      return {
        withdrawalId,
        status: result.status,
        providerReference: normalizeProviderIdentifier(
          result.providerReference,
        ),
        providerTransactionId: normalizeProviderIdentifier(
          result.providerTransactionId,
        ),
      };
    }

    this.validateEligibility(withdrawal);
    if (!this.provider.supportsPayout(this.capabilityInput(withdrawal))) {
      throw new BadRequestException(
        `PROVIDER_CAPABILITY_UNSUPPORTED: ${PaymentProvider.FLUTTERWAVE} payout capability is not available for this withdrawal route.`,
      );
    }
    const request = this.buildTransferRequest(withdrawal);
    const idempotencyKey = this.idempotencyKey(withdrawal);
    const claim = await this.claimAttempt(userId, withdrawal, idempotencyKey);
    try {
      const result = await this.provider.createTransfer({
        request,
        idempotencyKey,
        traceId: claim.traceId,
      });
      if (
        !result.accepted ||
        !result.providerTransactionId ||
        !result.providerReference
      ) {
        throw new BadRequestException(
          'PAYOUT_PROVIDER_RESPONSE_INVALID: No confirmed transfer identifiers were returned; manual reconciliation is required.',
        );
      }
      await this.persistProviderResult(withdrawal, claim, {
        status: TransactionStatus.PROCESSING,
        providerReference: result.providerReference,
        providerTransactionId: result.providerTransactionId,
        metadata: result.metadata,
      });
      const confirmedResult = await this.getConfirmedProviderStatus(
        result.providerTransactionId,
        withdrawal.reference,
      );
      await this.persistProviderResult(withdrawal, claim, confirmedResult);
      return {
        withdrawalId,
        status: confirmedResult.status,
        providerReference: confirmedResult.providerReference,
        providerTransactionId: confirmedResult.providerTransactionId,
      };
    } catch (error) {
      await (this.prisma as any).payoutAttempt.update({
        where: { id: claim.attempt.id },
        data: {
          status: TransactionStatus.UNDER_REVIEW,
          errorMessage:
            'Provider outcome is ambiguous; reconciliation required.',
        },
      });
      await (this.prisma as any).withdrawal.updateMany({
        where: { id: withdrawal.id, status: TransactionStatus.PROCESSING },
        data: { status: TransactionStatus.UNDER_REVIEW },
      });
      await (this.prisma as any).transaction.updateMany({
        where: {
          id: withdrawal.transaction.id,
          status: TransactionStatus.PROCESSING,
        },
        data: { status: TransactionStatus.UNDER_REVIEW },
      });
      throw error;
    }
  }

  async reconcile(userId: string, withdrawalId: string) {
    const withdrawal = await this.getOwnedWithdrawal(userId, withdrawalId);
    if (
      withdrawal.status !== TransactionStatus.UNDER_REVIEW &&
      withdrawal.status !== TransactionStatus.PROCESSING
    ) {
      throw new ConflictException(
        'Withdrawal is not awaiting provider reconciliation.',
      );
    }

    const attempt = await (this.prisma as any).payoutAttempt.findFirst({
      where: { withdrawalId: withdrawal.id },
      orderBy: { attemptNumber: 'desc' },
    });
    if (!attempt?.providerTransactionId)
      throw new BadRequestException(
        'PAYOUT_RECONCILIATION_UNAVAILABLE: Provider transfer ID is not available. The payout remains held for manual reconciliation and will not be resubmitted.',
      );
    const result = await this.getConfirmedProviderStatus(
      String(attempt.providerTransactionId),
      withdrawal.reference,
    );
    if (
      attempt.providerReference &&
      attempt.providerReference !== result.providerReference
    ) {
      throw new ConflictException(
        'Provider status identifiers do not match this withdrawal; manual reconciliation is required.',
      );
    }
    await this.persistProviderResult(withdrawal, { attempt }, result);
    return result;
  }

  async handleWebhook(signature: string | undefined, rawBody: string) {
    const verification = await this.provider.verifyWebhook(signature, rawBody);
    if (
      !verification.valid ||
      !verification.eventId ||
      !verification.eventType
    ) {
      throw new BadRequestException(
        'PAYOUT_WEBHOOK_INVALID: Flutterwave payout webhook verification failed.',
      );
    }
    const prisma = this.prisma as any;
    const eventType = verification.eventType;
    const transferId = verification.providerTransactionId;
    const transferReference = verification.providerReference;
    if (eventType !== 'transfer.completed') {
      try {
        await prisma.providerWebhookEvent.create({
          data: {
            provider: PaymentProvider.FLUTTERWAVE,
            eventId: verification.eventId,
            eventType,
            providerReference: transferReference ?? null,
            providerTransactionId: transferId ?? null,
            status: ProviderWebhookEventStatus.IGNORED,
            processedAt: new Date(),
          },
        });
        return { processed: false, ignored: true };
      } catch (error) {
        if ((error as { code?: string })?.code === 'P2002')
          return { processed: false, duplicate: true };
        throw error;
      }
    }
    if (!transferId || !transferReference) {
      throw new BadRequestException(
        'PAYOUT_WEBHOOK_INVALID: A completed transfer event must contain its transfer ID and reference.',
      );
    }

    const attempt = await prisma.payoutAttempt.findFirst({
      where: {
        provider: PaymentProvider.FLUTTERWAVE,
        providerTransactionId: transferId,
      },
      orderBy: { attemptNumber: 'desc' },
    });
    if (!attempt) {
      try {
        await prisma.providerWebhookEvent.create({
          data: {
            provider: PaymentProvider.FLUTTERWAVE,
            eventId: verification.eventId,
            eventType,
            providerReference: transferReference,
            providerTransactionId: transferId,
            status: ProviderWebhookEventStatus.IGNORED,
            processedAt: new Date(),
          },
        });
        return { processed: false, ignored: true };
      } catch (error) {
        if ((error as { code?: string })?.code === 'P2002')
          return { processed: false, duplicate: true };
        throw error;
      }
    }
    const withdrawal = await prisma.withdrawal.findUnique({
      include: { transaction: true },
      where: { id: attempt.withdrawalId },
    });
    if (
      !withdrawal ||
      withdrawal.reference !== transferReference ||
      (attempt.providerReference &&
        attempt.providerReference !== transferReference)
    ) {
      try {
        await prisma.providerWebhookEvent.create({
          data: {
            provider: PaymentProvider.FLUTTERWAVE,
            eventId: verification.eventId,
            eventType,
            providerReference: transferReference,
            providerTransactionId: transferId,
            status: ProviderWebhookEventStatus.IGNORED,
            processedAt: new Date(),
            withdrawalId: withdrawal?.id ?? null,
            errorMessage:
              'Transfer reference did not match the payout attempt.',
          },
        });
        return { processed: false, ignored: true };
      } catch (error) {
        if ((error as { code?: string })?.code === 'P2002')
          return { processed: false, duplicate: true };
        throw error;
      }
    }

    const providerResult = await this.getConfirmedProviderStatus(
      transferId,
      transferReference,
    );
    if (
      (attempt.providerReference &&
        attempt.providerReference !== providerResult.providerReference) ||
      withdrawal.reference !== providerResult.providerReference
    ) {
      throw new ConflictException(
        'Provider status identifiers do not match the webhook; the event was not applied.',
      );
    }
    try {
      const event = await prisma.providerWebhookEvent.create({
        data: {
          provider: PaymentProvider.FLUTTERWAVE,
          eventId: verification.eventId,
          eventType,
          providerReference: transferReference,
          providerTransactionId: transferId,
          status: ProviderWebhookEventStatus.RECEIVED,
          metadata: { status: providerResult.status },
        },
      });
      const status = await this.persistProviderResult(
        withdrawal,
        { attempt },
        {
          status: providerResult.status,
          providerReference: providerResult.providerReference,
          providerTransactionId: providerResult.providerTransactionId,
          failureReason: providerResult.failureReason,
          metadata: providerResult.metadata,
        },
      );
      await prisma.providerWebhookEvent.update({
        where: { id: event.id },
        data: {
          status: ProviderWebhookEventStatus.PROCESSED,
          processedAt: new Date(),
          withdrawalId: withdrawal.id,
        },
      });
      return { processed: true, status };
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002')
        return { processed: false, duplicate: true };
      throw error;
    }
  }
}
