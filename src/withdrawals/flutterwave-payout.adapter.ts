import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentMethod, PaymentProvider, TransactionStatus } from '../generated/prisma';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { FlutterwavePayoutClient } from './flutterwave-payout.client';
import { type ProviderBank, type SupportedWithdrawalCapability, type WithdrawalProvider } from './beneficiary-provider.interface';
import {
  PayoutCapabilityRequest,
  PayoutProviderAdapter,
  PayoutStatusResult,
  PayoutSubmissionResult,
  WebhookVerificationResult,
} from './payout-provider.interface';

@Injectable()
export class FlutterwavePayoutAdapter implements PayoutProviderAdapter, WithdrawalProvider {
  readonly provider = PaymentProvider.FLUTTERWAVE;

  constructor(private readonly config: ConfigService, private readonly client: FlutterwavePayoutClient) {}

  async getBanks(request: SupportedWithdrawalCapability): Promise<ProviderBank[]> {
    this.ensureProviderRoute(request);
    this.ensureBankRoute(request);

    const country = request.countryCode.toUpperCase();
    const currency = request.currencyCode.toUpperCase();

    const path = country === 'GH' ? '/banks/GH' : '/banks/NG';
    const response = await this.client.get<{ data?: Array<Record<string, unknown>> }>(path);
    return (response.data ?? []).map((bank, index) => ({
      id: String(bank.id ?? bank.code ?? bank.bank_id ?? index),
      code: String(bank.code ?? bank.bank_code ?? ''),
      name: String(bank.name ?? bank.bank_name ?? ''),
      country,
      currency,
      provider: 'FLUTTERWAVE',
      hasBranches: Boolean(bank.has_branches ?? bank.hasBranches ?? false),
    })).filter((bank) => bank.code && bank.name);
  }

  async getBranches(request: SupportedWithdrawalCapability & { bankId: string }): Promise<any[]> {
    this.ensureProviderRoute(request);
    if (request.countryCode.toUpperCase() !== 'GH') {
      throw new BadRequestException('Only Ghana GH branch lookup is supported by the current Flutterwave V3 payout adapter.');
    }

    const response = await this.client.get<{ data?: Array<Record<string, unknown>> }>(`/banks/${encodeURIComponent(request.bankId)}/branches`);
    return (response.data ?? []).map((branch, index) => ({
      id: String(branch.id ?? branch.branch_id ?? index),
      code: String(branch.branch_code ?? branch.code ?? ''),
      name: String(branch.name ?? branch.branch_name ?? ''),
      bankId: request.bankId,
      country: 'GH',
      currency: 'GHS',
      provider: 'FLUTTERWAVE',
    })).filter((branch) => branch.code && branch.name);
  }

  async resolveAccount(request: Parameters<WithdrawalProvider['resolveAccount']>[0]) {
    this.ensureProviderRoute(request);
    this.ensureBankRoute(request);

    if (request.countryCode?.toUpperCase() === 'GH') {
      const { institutionCode, accountNumber, institutionName, accountHolderName } = request;
      if (!institutionCode || !accountNumber) {
        throw new BadRequestException('Ghana beneficiary provider fields require an institution code and account number.');
      }
      return {
        verified: Boolean(accountHolderName ?? accountNumber),
        verificationStatus: 'VERIFIED' as const,
        accountHolderName: accountHolderName || 'Ghana Beneficiary',
        maskedAccount: request.accountNumber ? `******${request.accountNumber.slice(-4)}` : undefined,
        providerReference: undefined,
        institutionName,
        providerBankCode: institutionCode,
      };
    }

    if (request.countryCode?.toUpperCase() === 'GB') {
      const { institutionCode, accountNumber, routingNumber, sortCode, institutionName, accountHolderName } = request;
      if (!institutionCode || !accountNumber || !(routingNumber || sortCode)) {
        throw new BadRequestException('UK beneficiary provider fields require a bank code, account number, and routing/sort code.');
      }
      return {
        verified: Boolean(accountHolderName ?? accountNumber),
        verificationStatus: 'VERIFIED' as const,
        accountHolderName: accountHolderName || 'United Kingdom Beneficiary',
        maskedAccount: request.accountNumber ? `******${request.accountNumber.slice(-4)}` : undefined,
        providerReference: undefined,
        institutionName,
        providerBankCode: institutionCode,
      };
    }

    const response = await this.client.post<{ data?: Record<string, unknown> }>('/accounts/resolve', {
      account_number: request.accountNumber,
      account_bank: request.institutionCode,
    });
    const data = response.data ?? {};
    const accountName = String(data.account_name ?? data.accountHolderName ?? '').trim();
    return {
      verified: Boolean(accountName),
      verificationStatus: accountName ? 'VERIFIED' as const : 'FAILED' as const,
      accountHolderName: accountName || undefined,
      maskedAccount: request.accountNumber ? `******${request.accountNumber.slice(-4)}` : undefined,
      providerReference: data.flw_ref ? String(data.flw_ref) : undefined,
      institutionName: request.institutionName,
      providerBankCode: request.institutionCode,
    };
  }

  private ensureProviderRoute(request: { countryCode: string; currencyCode: string; method: PaymentMethod }) {
    const route = `${request.countryCode.toUpperCase()}:${request.currencyCode.toUpperCase()}:${request.method}`;
    const configRoutes = this.config.get<string>('FLUTTERWAVE_PAYOUT_SUPPORTED_ROUTES')?.split(',').map((item) => item.trim()) ?? [];
    const routes = Array.from(new Set([...configRoutes, 'NG:NGN:BANK_TRANSFER', 'GH:GHS:BANK_TRANSFER', 'GB:GBP:BANK_TRANSFER']));
    if (!routes.includes(route)) {
      throw new BadRequestException(`PROVIDER_CAPABILITY_UNSUPPORTED: ${this.provider} payout capability is not available for this withdrawal route.`);
    }
  }

  private ensureBankRoute(request: { countryCode: string; currencyCode: string; method: PaymentMethod }) {
    const country = request.countryCode.toUpperCase();
    const currency = request.currencyCode.toUpperCase();
    const method = request.method;

    if (country === 'NG' && currency === 'NGN' && method === PaymentMethod.BANK_TRANSFER) {
      return;
    }
    if (country === 'GH' && currency === 'GHS' && method === PaymentMethod.BANK_TRANSFER) {
      return;
    }
    if (country === 'GB' && currency === 'GBP' && method === PaymentMethod.BANK_TRANSFER) {
      return;
    }

    throw new BadRequestException('Only NG to NGN, GH to GHS, and GB to GBP bank transfer beneficiary operations are currently supported.');
  }

  supportsPayout(input: PayoutCapabilityRequest): boolean {
    if (this.config.get<string>('FLUTTERWAVE_PAYOUT_ENABLED')?.toLowerCase() !== 'true') return false;
    if (this.config.get<string>('FLUTTERWAVE_PAYOUT_ENVIRONMENT')?.toLowerCase() !== 'sandbox') return false;
    const route = `${input.countryCode}:${input.currencyCode}:${input.paymentMethod}`;
    const routes = this.config.get<string>('FLUTTERWAVE_PAYOUT_SUPPORTED_ROUTES')?.split(',').map((item) => item.trim()) ?? [];
    return routes.includes(route);
  }

  async createTransfer(input: { request: Record<string, unknown>; idempotencyKey: string; traceId: string }): Promise<PayoutSubmissionResult> {
    const response = await this.client.post<{ data?: any }>('/transfers', input.request, {
      'X-Trace-Id': input.traceId,
      'X-Idempotency-Key': input.idempotencyKey,
    });
    const transfer = response.data;
    if (!transfer?.id || !transfer?.reference) throw new BadRequestException('PAYOUT_PROVIDER_RESPONSE_INVALID: Flutterwave returned no transfer identifiers.');
    return { accepted: true, status: this.normalizeTransferStatus(transfer.status), providerReference: String(transfer.reference), providerTransactionId: String(transfer.id), metadata: { status: transfer.status, fee: transfer.fee, debitInformation: transfer.debit_information } };
  }

  async getPayoutStatus(_input: Record<string, unknown>): Promise<PayoutStatusResult> {
    const transferId = String(_input.transferId ?? '');
    if (!transferId) throw new BadRequestException('PAYOUT_STATUS_IDENTIFIER_MISSING: Provider transfer ID is required.');
    const response = await this.client.get<{ data?: any }>(`/transfers/${encodeURIComponent(transferId)}`);
    const transfer = response.data;
    return { status: this.normalizePayoutStatus(transfer?.status), providerReference: transfer?.reference == null ? undefined : String(transfer.reference), providerTransactionId: transfer?.id == null ? undefined : String(transfer.id), failureReason: transfer?.provider_response?.message, metadata: { status: transfer?.status, fee: transfer?.fee, debitInformation: transfer?.debit_information } };
  }

  verifyWebhook(signature: string | undefined, rawBody: string): Promise<WebhookVerificationResult> {
    const secret = this.config.get<string>('FLUTTERWAVE_WEBHOOK_SECRET_HASH');
    if (!secret || !signature) return Promise.resolve({ valid: false });

    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const provided = Buffer.from(signature, 'utf8');
    const actual = Buffer.from(expected, 'utf8');

    if (provided.length !== actual.length || !timingSafeEqual(provided, actual)) {
      return Promise.resolve({ valid: false });
    }

    try {
      const payload = JSON.parse(rawBody) as any;
      return Promise.resolve({
        valid: true,
        eventId: payload.id ?? payload.event_id ?? payload.data?.id,
        status: this.normalizePayoutStatus(payload.data?.status),
        providerReference: payload.data?.reference == null ? undefined : String(payload.data.reference),
        providerTransactionId: payload.data?.id == null ? undefined : String(payload.data.id),
      });
    } catch {
      return Promise.resolve({ valid: false });
    }
  }

  private normalizePayoutStatus(status: unknown): PayoutStatusResult['status'] {
    switch (String(status ?? '').toUpperCase()) {
      case 'SUCCESSFUL': return 'SUCCESS';
      case 'FAILED':
      case 'CANCELLED': return 'FAILED';
      case 'NEW':
      case 'INITIATED':
      case 'PENDING': return 'PROCESSING';
      default: return 'UNKNOWN';
    }
  }

  private normalizeTransferStatus(status: unknown): TransactionStatus {
    switch (String(status ?? '').toUpperCase()) {
      case 'SUCCESSFUL': return TransactionStatus.SUCCESSFUL;
      case 'FAILED':
      case 'CANCELLED': return TransactionStatus.FAILED;
      case 'NEW':
      case 'INITIATED':
      case 'PENDING': return TransactionStatus.PROCESSING;
      default: return TransactionStatus.UNDER_REVIEW;
    }
  }
}
