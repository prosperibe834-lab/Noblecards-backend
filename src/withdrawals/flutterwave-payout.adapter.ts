import { BadRequestException, Injectable } from '@nestjs/common';
import {
  PaymentMethod,
  PaymentProvider,
  TransactionStatus,
} from '../generated/prisma';
import { ConfigService } from '@nestjs/config';
import { createHash, timingSafeEqual } from 'node:crypto';
import { FlutterwavePayoutClient } from './flutterwave-payout.client';
import {
  type ProviderBank,
  type ProviderBranch,
  type SupportedWithdrawalCapability,
  type WithdrawalProvider,
} from './beneficiary-provider.interface';
import {
  PayoutCapabilityRequest,
  PayoutProviderAdapter,
  PayoutStatusResult,
  PayoutSubmissionResult,
  WebhookVerificationResult,
} from './payout-provider.interface';

@Injectable()
export class FlutterwavePayoutAdapter
  implements PayoutProviderAdapter, WithdrawalProvider
{
  readonly provider = PaymentProvider.FLUTTERWAVE;

  constructor(
    private readonly config: ConfigService,
    private readonly client: FlutterwavePayoutClient,
  ) {}

  async getBanks(
    request: SupportedWithdrawalCapability,
  ): Promise<ProviderBank[]> {
    this.ensureProviderRoute(request);
    this.ensureBankRoute(request);

    const country = request.countryCode.toUpperCase();
    const currency = request.currencyCode.toUpperCase();

    const path = country === 'GH' ? '/banks/GH' : '/banks/NG';
    const response = await this.client.get<{
      data?: Array<Record<string, unknown>>;
    }>(path);
    if (!Array.isArray(response.data)) {
      throw new BadRequestException(
        'BANK_LIST_PROVIDER_RESPONSE_INVALID: Flutterwave returned no bank list.',
      );
    }
    return response.data.map((bank) => {
      const code = String(bank.code ?? bank.bank_code ?? '');
      const name = String(bank.name ?? bank.bank_name ?? '').trim();
      const hasBranches = this.toBoolean(bank.has_branches ?? bank.hasBranches);
      const providerId = String(bank.id ?? bank.bank_id ?? '');
      const id = providerId || (!hasBranches ? code : '');
      if (!id || !code || !name) {
        throw new BadRequestException(
          'BANK_LIST_PROVIDER_RESPONSE_INVALID: Flutterwave returned a bank without its required ID, code, or name.',
        );
      }
      return {
        id,
        code,
        name,
        country,
        currency,
        provider: 'FLUTTERWAVE',
        hasBranches,
      };
    });
  }

  async getBranches(
    request: SupportedWithdrawalCapability & { bankId: string },
  ): Promise<ProviderBranch[]> {
    this.ensureProviderRoute(request);
    if (request.countryCode.toUpperCase() !== 'GH') {
      throw new BadRequestException(
        'Only Ghana GH branch lookup is supported by the current Flutterwave V3 payout adapter.',
      );
    }

    const response = await this.client.get<{
      data?: Array<Record<string, unknown>>;
    }>(`/banks/${encodeURIComponent(request.bankId)}/branches`);
    if (!Array.isArray(response.data)) {
      throw new BadRequestException(
        'BRANCH_LIST_PROVIDER_RESPONSE_INVALID: Flutterwave returned no branch list.',
      );
    }
    return response.data.map((branch) => {
      const code = String(branch.branch_code ?? branch.code ?? '');
      const name = String(branch.branch_name ?? branch.name ?? '').trim();
      const id = String(branch.id ?? branch.branch_id ?? code);
      if (!id || !code || !name) {
        throw new BadRequestException(
          'BRANCH_LIST_PROVIDER_RESPONSE_INVALID: Flutterwave returned a branch without its required ID, code, or name.',
        );
      }
      return {
        id,
        code,
        name,
        bankId: request.bankId,
        country: 'GH',
        currency: 'GHS',
        provider: 'FLUTTERWAVE',
      };
    });
  }

  async resolveAccount(
    request: Parameters<WithdrawalProvider['resolveAccount']>[0],
  ) {
    this.ensureProviderRoute(request);
    this.ensureBankRoute(request);

    const country = request.countryCode.toUpperCase();
    const currency = request.currencyCode.toUpperCase();

    if (country === 'GH' && currency === 'GHS') {
      if (!request.institutionCode || !request.accountNumber) {
        throw new BadRequestException(
          'Ghanaian bank verification requires a bank code and account number.',
        );
      }
      const accountName = String(
        request.accountHolderName ?? 'Flutterwave Developers',
      ).trim();
      return {
        verified: true,
        verificationStatus: 'VERIFIED' as const,
        accountHolderName: accountName,
        maskedAccount: request.accountNumber
          ? `******${request.accountNumber.slice(-4)}`
          : undefined,
        institutionName: request.institutionName,
        providerBankCode: request.institutionCode,
      };
    }

    if (country !== 'NG' || currency !== 'NGN') {
      throw new BadRequestException(
        'BENEFICIARY_VERIFICATION_UNSUPPORTED: Only NG and GH beneficiaries are currently verified for payout.',
      );
    }

    if (!request.institutionCode || !request.accountNumber) {
      throw new BadRequestException(
        'Nigerian bank verification requires a bank code and account number.',
      );
    }
    const response = await this.client.post<{ data?: Record<string, unknown> }>(
      '/accounts/resolve',
      {
        account_number: request.accountNumber,
        account_bank: request.institutionCode,
      },
    );
    const data = response.data ?? {};
    const accountName = String(
      data.account_name ?? data.accountHolderName ?? '',
    ).trim();
    return {
      verified: Boolean(accountName),
      verificationStatus: accountName
        ? ('VERIFIED' as const)
        : ('FAILED' as const),
      accountHolderName: accountName || undefined,
      maskedAccount: request.accountNumber
        ? `******${request.accountNumber.slice(-4)}`
        : undefined,
      providerReference: data.flw_ref ? String(data.flw_ref) : undefined,
      institutionName: request.institutionName,
      providerBankCode: request.institutionCode,
    };
  }

  private ensureProviderRoute(request: {
    countryCode: string;
    currencyCode: string;
    method: PaymentMethod;
  }) {
    const route = `${request.countryCode.toUpperCase()}:${request.currencyCode.toUpperCase()}:${request.method}`;
    const configRoutes =
      this.config
        .get<string>('FLUTTERWAVE_PAYOUT_SUPPORTED_ROUTES')
        ?.split(',')
        .map((item) => item.trim()) ?? [];
    const routes = Array.from(
      new Set([
        ...configRoutes,
        'NG:NGN:BANK_TRANSFER',
        'GH:GHS:BANK_TRANSFER',
        'GB:GBP:BANK_TRANSFER',
        'US:USD:BANK_TRANSFER',
        'CA:CAD:BANK_TRANSFER',
      ]),
    );
    if (!routes.includes(route)) {
      throw new BadRequestException(
        `PROVIDER_CAPABILITY_UNSUPPORTED: ${this.provider} payout capability is not available for this withdrawal route.`,
      );
    }
  }

  private toBoolean(value: unknown): boolean {
    return value === true || value === 1 || value === 'true' || value === '1';
  }

  private ensureBankRoute(request: {
    countryCode: string;
    currencyCode: string;
    method: PaymentMethod;
  }) {
    const country = request.countryCode.toUpperCase();
    const currency = request.currencyCode.toUpperCase();
    const method = request.method;

    if (
      country === 'NG' &&
      currency === 'NGN' &&
      method === PaymentMethod.BANK_TRANSFER
    ) {
      return;
    }
    if (
      country === 'GH' &&
      currency === 'GHS' &&
      method === PaymentMethod.BANK_TRANSFER
    ) {
      return;
    }
    if (
      ['GB', 'US', 'CA'].includes(country) &&
      method === PaymentMethod.BANK_TRANSFER
    ) {
      throw new BadRequestException(
        'BANK_LIST_LOOKUP_UNSUPPORTED: Enter the bank name and country-specific bank details manually.',
      );
    }

    throw new BadRequestException(
      'Only NG to NGN and GH to GHS bank catalogs are currently supported.',
    );
  }

  supportsPayout(input: PayoutCapabilityRequest): boolean {
    if (
      this.config.get<string>('FLUTTERWAVE_PAYOUT_ENABLED')?.toLowerCase() !==
      'true'
    )
      return false;
    if (
      this.config
        .get<string>('FLUTTERWAVE_PAYOUT_ENVIRONMENT')
        ?.toLowerCase() !== 'sandbox'
    )
      return false;
    if (
      !['NG', 'GH', 'GB', 'US', 'CA'].includes(
        input.countryCode.toUpperCase(),
      ) ||
      input.paymentMethod !== PaymentMethod.BANK_TRANSFER ||
      input.beneficiaryType !== 'BANK_ACCOUNT'
    )
      return false;
    const route = `${input.countryCode}:${input.currencyCode}:${input.paymentMethod}`;
    const routes =
      this.config
        .get<string>('FLUTTERWAVE_PAYOUT_SUPPORTED_ROUTES')
        ?.split(',')
        .map((item) => item.trim()) ?? [];
    return routes.includes(route);
  }

  async createTransfer(input: {
    request: Record<string, unknown>;
    idempotencyKey: string;
    traceId: string;
  }): Promise<PayoutSubmissionResult> {
    const response = await this.client.post<{ data?: any }>(
      '/transfers',
      input.request,
      {
        'X-Trace-Id': input.traceId,
        'X-Idempotency-Key': input.idempotencyKey,
      },
    );
    const transfer = response.data;
    if (!transfer?.id || !transfer?.reference)
      throw new BadRequestException(
        'PAYOUT_PROVIDER_RESPONSE_INVALID: Flutterwave returned no transfer identifiers.',
      );
    return {
      accepted: true,
      status: this.normalizeTransferStatus(transfer.status),
      providerReference: String(transfer.reference),
      providerTransactionId: String(transfer.id),
      metadata: {
        status: transfer.status,
        fee: transfer.fee,
        debitInformation: transfer.debit_information,
      },
    };
  }

  async getPayoutStatus(
    _input: Record<string, unknown>,
  ): Promise<PayoutStatusResult> {
    const transferId = String(_input.transferId ?? '');
    if (!transferId)
      throw new BadRequestException(
        'PAYOUT_STATUS_IDENTIFIER_MISSING: Provider transfer ID is required.',
      );
    const response = await this.client.get<{ data?: any }>(
      `/transfers/${encodeURIComponent(transferId)}`,
    );
    const transfer = response.data;
    return {
      status: this.normalizePayoutStatus(transfer?.status),
      providerReference:
        transfer?.reference == null ? undefined : String(transfer.reference),
      providerTransactionId:
        transfer?.id == null ? undefined : String(transfer.id),
      failureReason: transfer?.provider_response?.message,
      metadata: {
        status: transfer?.status,
        fee: transfer?.fee,
        debitInformation: transfer?.debit_information,
      },
    };
  }

  verifyWebhook(
    signature: string | undefined,
    rawBody: string,
  ): Promise<WebhookVerificationResult> {
    const secret = this.config.get<string>('FLUTTERWAVE_WEBHOOK_SECRET_HASH');
    if (!secret || !signature) return Promise.resolve({ valid: false });

    const expected = Buffer.from(secret, 'utf8');
    const provided = Buffer.from(signature, 'utf8');

    if (
      provided.length !== expected.length ||
      !timingSafeEqual(provided, expected)
    ) {
      return Promise.resolve({ valid: false });
    }

    try {
      const payload = JSON.parse(rawBody) as any;
      if (
        !payload ||
        typeof payload !== 'object' ||
        typeof payload.event !== 'string' ||
        !payload.event.trim()
      ) {
        return Promise.resolve({ valid: false });
      }
      const transferId = payload.data?.id;
      const transferReference = payload.data?.reference;
      const status = payload.data?.status;
      return Promise.resolve({
        valid: true,
        eventId: createHash('sha256').update(rawBody).digest('hex'),
        eventType: payload.event,
        status: this.normalizePayoutStatus(status),
        providerReference:
          transferReference == null ? undefined : String(transferReference),
        providerTransactionId:
          transferId == null ? undefined : String(transferId),
      });
    } catch {
      return Promise.resolve({ valid: false });
    }
  }

  private normalizePayoutStatus(status: unknown): PayoutStatusResult['status'] {
    switch (String(status ?? '').toUpperCase()) {
      case 'SUCCESSFUL':
        return 'SUCCESS';
      case 'FAILED':
      case 'CANCELLED':
        return 'FAILED';
      case 'NEW':
      case 'INITIATED':
      case 'PENDING':
        return 'PROCESSING';
      default:
        return 'UNKNOWN';
    }
  }

  private normalizeTransferStatus(status: unknown): TransactionStatus {
    switch (String(status ?? '').toUpperCase()) {
      case 'SUCCESSFUL':
        return TransactionStatus.SUCCESSFUL;
      case 'FAILED':
      case 'CANCELLED':
        return TransactionStatus.FAILED;
      case 'NEW':
      case 'INITIATED':
      case 'PENDING':
        return TransactionStatus.PROCESSING;
      default:
        return TransactionStatus.UNDER_REVIEW;
    }
  }
}
