import { BadGatewayException, Injectable, RequestTimeoutException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type SogoProviderResponse = Record<string, unknown>;

@Injectable()
export class SogoClient {
  private readonly timeoutMs = 15_000;

  constructor(private readonly config: ConfigService) {}

  async getSellCatalog(): Promise<SogoProviderResponse> {
    return this.request('GET', '/gift-cards/sell/catalog');
  }

  async getSellRates(): Promise<SogoProviderResponse> {
    return this.request('GET', '/gift-cards/sell/rates');
  }

  async submitSell(input: {
    slug: string;
    card_country: string;
    card_type: string;
    card_currency: string;
    card_amount: number;
    additional_info: string;
    idempotencyKey: string;
  }): Promise<SogoProviderResponse> {
    const { idempotencyKey, ...body } = input;
    return this.request('POST', '/gift-cards/sell', body, idempotencyKey);
  }

  private required(name: string): string {
    const value = this.config.get<string>(name)?.trim();
    if (!value) {
      throw new ServiceUnavailableException(`SOGO_CONFIGURATION_MISSING: ${name} is not configured.`);
    }
    return value;
  }

  private async request(
    method: 'GET' | 'POST',
    path: string,
    body?: Record<string, unknown>,
    idempotencyKey?: string,
  ): Promise<SogoProviderResponse> {
    const baseUrl = this.required('SOGO_BASE_URL').replace(/\/$/, '');
    const secretKey = this.required('SOGO_SECRET_KEY');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${secretKey}`,
          Accept: 'application/json',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new BadGatewayException({
          message: typeof payload?.message === 'string' ? payload.message : 'SOGO_REQUEST_FAILED',
          providerCode: typeof payload?.code === 'string' ? payload.code : undefined,
          providerStatus: response.status,
          providerResponse: payload,
        });
      }
      return (payload && typeof payload === 'object' ? payload : {}) as SogoProviderResponse;
    } catch (error) {
      if (error instanceof BadGatewayException || error instanceof ServiceUnavailableException) throw error;
      if ((error as { name?: string })?.name === 'AbortError') {
        throw new RequestTimeoutException('SOGO_REQUEST_TIMEOUT');
      }
      throw new BadGatewayException('SOGO_REQUEST_UNAVAILABLE');
    } finally {
      clearTimeout(timeout);
    }
  }
}
