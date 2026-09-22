import {
  BadGatewayException,
  Injectable,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BuyGiftCardCatalogFilters } from './buy-gift-card-provider.interface';

export type TopupmateResponse = unknown;

@Injectable()
export class TopupmateClient {
  private readonly timeoutMs = 15_000;

  constructor(private readonly config: ConfigService) {}

  async getAvailableGiftCards(filters: BuyGiftCardCatalogFilters): Promise<TopupmateResponse> {
    const query = new URLSearchParams();
    if (filters.countryCode) query.set('countryCode', filters.countryCode);
    if (filters.productName) query.set('productName', filters.productName);
    if (filters.productId) query.set('productId', filters.productId);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/giftcard/available/${suffix}`);
  }

  private required(name: string): string {
    const value = this.config.get<string>(name)?.trim();
    if (!value) {
      throw new ServiceUnavailableException(`TOPUPMATE_CONFIGURATION_MISSING: ${name} is not configured.`);
    }
    return value;
  }

  private async request(path: string): Promise<TopupmateResponse> {
    const baseUrl = this.required('TOPUPMATE_API_BASE_URL').replace(/\/$/, '');
    const apiKey = this.required('TOPUPMATE_API_KEY');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${apiKey}`,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new BadGatewayException({
          message: this.providerMessage(payload, response.status),
          providerStatus: response.status,
          providerCode: this.providerCode(payload),
        });
      }
      return payload;
    } catch (error) {
      if (error instanceof BadGatewayException || error instanceof ServiceUnavailableException) throw error;
      if ((error as { name?: string })?.name === 'AbortError') {
        throw new RequestTimeoutException('TOPUPMATE_REQUEST_TIMEOUT');
      }
      throw new BadGatewayException('TOPUPMATE_REQUEST_UNAVAILABLE');
    } finally {
      clearTimeout(timeout);
    }
  }

  private providerMessage(payload: unknown, status: number): string {
    if (payload && typeof payload === 'object') {
      const body = payload as Record<string, unknown>;
      for (const key of ['message', 'detail', 'error']) {
        if (typeof body[key] === 'string') return body[key] as string;
      }
    }
    return `TOPUPMATE_REQUEST_FAILED_${status}`;
  }

  private providerCode(payload: unknown): string | undefined {
    if (!payload || typeof payload !== 'object') return undefined;
    const code = (payload as Record<string, unknown>).code;
    return typeof code === 'string' ? code : undefined;
  }
}
