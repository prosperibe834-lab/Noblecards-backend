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
    this.ensureBankRoute(request);
    const response = await this.client.get<{ data?: Array<Record<string, unknown>> }>('/banks/NG');
    return (response.data ?? []).map((bank, index) => ({
      id: String(bank.id ?? bank.code ?? index),
      code: String(bank.code ?? bank.bank_code ?? ''),
      name: String(bank.name ?? bank.bank_name ?? ''),
      country: 'NG',
      currency: 'NGN',
      provider: 'FLUTTERWAVE',
    })).filter((bank) => bank.code && bank.name);
  }

  async resolveAccount(request: Parameters<WithdrawalProvider['resolveAccount']>[0]) {
    this.ensureBankRoute(request);
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

  private ensureBankRoute(request: { countryCode: string; currencyCode: string; method: PaymentMethod }) {
    if (request.countryCode.toUpperCase() !== 'NG' || request.currencyCode.toUpperCase() !== 'NGN' || request.method !== PaymentMethod.BANK_TRANSFER) {
      throw new BadRequestException('Only NG to NGN bank transfer beneficiary operations are currently supported.');
    }
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
    return { accepted: true, status: this.normalizeTransferStatus(transfer.status), providerReference: transfer.reference, providerTransactionId: transfer.id, metadata: { status: transfer.status, fee: transfer.fee, debitInformation: transfer.debit_information } };
  }

  async getPayoutStatus(_input: Record<string, unknown>): Promise<PayoutStatusResult> {
    const transferId = String(_input.transferId ?? '');
    if (!transferId) throw new BadRequestException('PAYOUT_STATUS_IDENTIFIER_MISSING: Provider transfer ID is required.');
    const response = await this.client.get<{ data?: any }>(`/transfers/${encodeURIComponent(transferId)}`);
    const transfer = response.data;
    return { status: this.normalizePayoutStatus(transfer?.status), providerReference: transfer?.reference, providerTransactionId: transfer?.id, failureReason: transfer?.provider_response?.message, metadata: { status: transfer?.status, fee: transfer?.fee, debitInformation: transfer?.debit_information } };
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
        providerReference: payload.data?.reference,
        providerTransactionId: payload.data?.id,
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
