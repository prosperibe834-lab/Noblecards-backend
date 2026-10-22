import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type FlutterwaveTransferFee = {
  currency: string;
  feeType: string;
  fee: number;
};

export type FlutterwaveTransferRates = {
  rate: number;
  source: { currency: string; amount: number };
  destination: { currency: string; amount: number };
};

@Injectable()
export class FlutterwavePayoutClient {
  constructor(private readonly config: ConfigService) {}

  private required(name: string) {
    const value = this.config.get<string>(name)?.trim();
    if (!value) throw new BadRequestException(`PAYOUT_CONFIGURATION_MISSING: ${name} is not configured.`);
    return value;
  }

  private validateV3Config(requirePayoutEnabled = true) {
    if (
      requirePayoutEnabled &&
      this.config.get<string>('FLUTTERWAVE_PAYOUT_ENABLED')?.toLowerCase() !==
        'true'
    ) {
      throw new BadRequestException('PAYOUT_DISABLED: External payouts are disabled.');
    }

    const environment = this.required('FLUTTERWAVE_PAYOUT_ENVIRONMENT').toLowerCase();
    if (environment !== 'sandbox') {
      throw new BadRequestException('PAYOUT_CONFIGURATION_INVALID: Active V3 payout mode is sandbox-only.');
    }

    const baseUrl = this.required('FLUTTERWAVE_PAYOUT_BASE_URL').replace(/\/$/, '');
    const expectedBaseUrl = 'https://api.flutterwave.com/v3';
    if (baseUrl !== expectedBaseUrl) {
      throw new BadRequestException('PAYOUT_CONFIGURATION_INVALID: V3 payout base URL must be https://api.flutterwave.com/v3.');
    }

    this.required('FLUTTERWAVE_SECRET_KEY');
  }

  private getAuthorizationHeader() {
    return { Authorization: `Bearer ${this.required('FLUTTERWAVE_SECRET_KEY')}` };
  }

  async post<T>(path: string, body: Record<string, unknown>, headers: Record<string, string> = {}) {
    this.validateV3Config();
    const response = await fetch(`${this.required('FLUTTERWAVE_PAYOUT_BASE_URL').replace(/\/$/, '')}${path}`, {
      method: 'POST',
      headers: { ...this.getAuthorizationHeader(), 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerMessage = typeof payload?.message === 'string'
        ? payload.message
        : typeof payload?.data?.message === 'string'
          ? payload.data.message
          : 'Flutterwave rejected the payout request.';
      throw new BadRequestException(`PAYOUT_PROVIDER_REQUEST_FAILED: ${providerMessage}`);
    }
    return payload as T;
  }

  async get<T>(path: string, headers: Record<string, string> = {}) {
    this.validateV3Config(false);
    let response: Response;
    try {
      response = await fetch(
        `${this.required('FLUTTERWAVE_PAYOUT_BASE_URL').replace(/\/$/, '')}${path}`,
        {
          headers: {
            ...this.getAuthorizationHeader(),
            Accept: 'application/json',
            ...headers,
          },
        },
      );
    } catch {
      throw new BadGatewayException(
        'PAYOUT_PROVIDER_UNAVAILABLE: Flutterwave could not be reached for the bank catalog request.',
      );
    }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerMessage = typeof payload?.message === 'string'
        ? payload.message
        : 'Flutterwave returned no error details.';
      const safeMessage = providerMessage
        .replace(/[\r\n]+/g, ' ')
        .replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]')
        .replace(
          this.config.get<string>('FLUTTERWAVE_SECRET_KEY') ?? '\u0000',
          '[REDACTED]',
        )
        .slice(0, 200);
      throw new BadGatewayException(
        `PAYOUT_PROVIDER_REQUEST_FAILED: Flutterwave GET ${path} returned HTTP ${response.status}: ${safeMessage}`,
      );
    }
    return payload as T;
  }

  async getTransferFee(
    amount: number,
    currency: string,
  ): Promise<FlutterwaveTransferFee | null> {
    const normalizedCurrency = currency.trim().toUpperCase();
    if (
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      !/^[A-Z]{3}$/.test(normalizedCurrency)
    ) {
      throw new BadRequestException(
        'TRANSFER_FEE_REQUEST_INVALID: A positive whole-unit amount and valid currency are required.',
      );
    }

    const query = new URLSearchParams({
      amount: String(amount),
      currency: normalizedCurrency,
      type: 'account',
    });
    const response = await this.get<{
      status?: unknown;
      data?: unknown;
    }>(`/transfers/fee?${query.toString()}`);
    if (response.status !== 'success' || !Array.isArray(response.data)) {
      throw new BadGatewayException(
        'TRANSFER_FEE_PROVIDER_RESPONSE_INVALID: Flutterwave returned an invalid transfer-fee response.',
      );
    }

    const fee = response.data.find(
      (entry): entry is Record<string, unknown> =>
        typeof entry === 'object' &&
        entry !== null &&
        String((entry as Record<string, unknown>).currency ?? '')
          .toUpperCase() === normalizedCurrency,
    );
    if (!fee) return null;

    const feeType =
      typeof fee.fee_type === 'string' ? fee.fee_type.trim().toLowerCase() : '';
    const feeAmount =
      typeof fee.fee === 'number' || typeof fee.fee === 'string'
        ? Number(fee.fee)
        : Number.NaN;
    if (!feeType || !Number.isFinite(feeAmount) || feeAmount < 0) {
      throw new BadGatewayException(
        'TRANSFER_FEE_PROVIDER_RESPONSE_INVALID: Flutterwave returned an invalid fee record.',
      );
    }

    return {
      currency: normalizedCurrency,
      feeType,
      fee: feeAmount,
    };
  }

  async getTransferRates(
    amount: number,
    sourceCurrency: string,
    destinationCurrency: string,
  ): Promise<FlutterwaveTransferRates> {
    const normalizedSourceCurrency = sourceCurrency.trim().toUpperCase();
    const normalizedDestinationCurrency =
      destinationCurrency.trim().toUpperCase();
    if (
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      !/^[A-Z]{3}$/.test(normalizedSourceCurrency) ||
      !/^[A-Z]{3}$/.test(normalizedDestinationCurrency)
    ) {
      throw new BadRequestException(
        'TRANSFER_RATES_REQUEST_INVALID: A positive whole-unit amount and valid source/destination currencies are required.',
      );
    }

    const query = new URLSearchParams({
      amount: String(amount),
      destination_currency: normalizedDestinationCurrency,
      source_currency: normalizedSourceCurrency,
    });
    const response = await this.get<{
      status?: unknown;
      data?: unknown;
    }>(`/transfers/rates?${query.toString()}`);
    if (
      response.status !== 'success' ||
      typeof response.data !== 'object' ||
      response.data === null
    ) {
      throw new BadGatewayException(
        'TRANSFER_RATES_PROVIDER_RESPONSE_INVALID: Flutterwave returned an invalid transfer-rates response.',
      );
    }

    const data = response.data as Record<string, unknown>;
    const source =
      typeof data.source === 'object' && data.source !== null
        ? (data.source as Record<string, unknown>)
        : null;
    const destination =
      typeof data.destination === 'object' && data.destination !== null
        ? (data.destination as Record<string, unknown>)
        : null;
    const rate = Number(data.rate);
    const sourceAmount = Number(source?.amount);
    const destinationAmount = Number(destination?.amount);
    if (
      String(source?.currency ?? '').toUpperCase() !==
        normalizedSourceCurrency ||
      String(destination?.currency ?? '').toUpperCase() !==
        normalizedDestinationCurrency ||
      !Number.isFinite(rate) ||
      rate <= 0 ||
      !Number.isFinite(sourceAmount) ||
      sourceAmount <= 0 ||
      !Number.isFinite(destinationAmount) ||
      destinationAmount <= 0 ||
      Math.abs(destinationAmount - amount) > 0.000001 ||
      Math.abs(sourceAmount * rate - destinationAmount) > 0.01
    ) {
      throw new BadGatewayException(
        'TRANSFER_RATES_PROVIDER_RESPONSE_INVALID: Flutterwave returned inconsistent currencies, amounts, or rate data.',
      );
    }

    return {
      rate,
      source: {
        currency: normalizedSourceCurrency,
        amount: sourceAmount,
      },
      destination: {
        currency: normalizedDestinationCurrency,
        amount: destinationAmount,
      },
    };
  }
}