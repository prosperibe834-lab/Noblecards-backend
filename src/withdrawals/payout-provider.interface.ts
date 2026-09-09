import { PaymentMethod, PaymentProvider, TransactionStatus } from '../generated/prisma';

export const PAYOUT_PROVIDER_ADAPTER = Symbol('PAYOUT_PROVIDER_ADAPTER');

export type PayoutCapabilityRequest = {
  countryCode: string;
  currencyCode: string;
  paymentMethod: PaymentMethod;
  beneficiaryType: string;
};

export type PayoutSubmissionResult = {
  accepted: boolean;
  status: TransactionStatus;
  providerReference?: string;
  providerTransactionId?: string;
  metadata?: Record<string, unknown>;
};

export type PayoutStatusResult = {
  status: 'SUCCESS' | 'FAILED' | 'PROCESSING' | 'UNKNOWN';
  providerReference?: string;
  providerTransactionId?: string;
  failureReason?: string;
  metadata?: Record<string, unknown>;
};

export type WebhookVerificationResult = {
  valid: boolean;
  eventId?: string;
  status?: PayoutStatusResult['status'];
  providerReference?: string;
  providerTransactionId?: string;
};

export interface PayoutProviderAdapter {
  readonly provider: PaymentProvider;
  supportsPayout(input: PayoutCapabilityRequest): boolean;
  createTransfer(input: { request: Record<string, unknown>; idempotencyKey: string; traceId: string }): Promise<PayoutSubmissionResult>;
  getPayoutStatus(input: Record<string, unknown>): Promise<PayoutStatusResult>;
  verifyWebhook(signature: string | undefined, rawBody: string): Promise<WebhookVerificationResult>;
}
