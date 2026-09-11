import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FlutterwavePayoutClient {
  constructor(private readonly config: ConfigService) {}

  private required(name: string) {
    const value = this.config.get<string>(name)?.trim();
    if (!value) throw new BadRequestException(`PAYOUT_CONFIGURATION_MISSING: ${name} is not configured.`);
    return value;
  }

  private validateV3Config() {
    if (this.config.get<string>('FLUTTERWAVE_PAYOUT_ENABLED')?.toLowerCase() !== 'true') {
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
    this.validateV3Config();
    const response = await fetch(`${this.required('FLUTTERWAVE_PAYOUT_BASE_URL').replace(/\/$/, '')}${path}`, {
      headers: { ...this.getAuthorizationHeader(), Accept: 'application/json', ...headers },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerMessage = typeof payload?.message === 'string'
        ? payload.message
        : 'Flutterwave status lookup failed.';
      throw new BadRequestException(`PAYOUT_PROVIDER_REQUEST_FAILED: ${providerMessage}`);
    }
    return payload as T;
  }
}