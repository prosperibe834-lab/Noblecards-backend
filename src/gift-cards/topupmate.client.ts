import {
  BadGatewayException,
  Injectable,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BuyGiftCardCatalogFilters, BuyGiftCardPurchaseInput } from './buy-gift-card-provider.interface';

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
    return this.request('GET', `/giftcard/available/${suffix}`);
  }

  purchase(input: BuyGiftCardPurchaseInput): Promise<TopupmateResponse> {
    const { productId, reference, ...purchase } = input;
    return this.request('POST', '/giftcard/', {
      ...purchase,
      product: /^\d+$/.test(productId) ? Number(productId) : productId,
      ref: reference,
    });
  }

  retrieveVoucher(reference: string): Promise<TopupmateResponse> {
    return this.request('GET', `/giftcard/redeem/?ref=${encodeURIComponent(reference)}`);
  }

  private required(name: string): string {
    const value = this.config.get<string>(name)?.trim();
    if (!value) {
      throw new ServiceUnavailableException(`TOPUPMATE_CONFIGURATION_MISSING: ${name} is not configured.`);
    }
    return value;
  }

  private async request(method: 'GET' | 'POST', path: string, body?: Record<string, unknown>): Promise<TopupmateResponse> {
    const baseUrl = this.required('TOPUPMATE_API_BASE_URL').replace(/\/$/, '');
    const apiKey = this.required('TOPUPMATE_API_KEY');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Token ${apiKey}`,
          Accept: 'application/json',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
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
    const message = this.findProviderMessage(payload);
    if (message) return message;
    return `TOPUPMATE_REQUEST_FAILED_${status}`;
  }

  private providerCode(payload: unknown): string | undefined {
    if (!payload || typeof payload !== 'object') return undefined;
    const body = payload as Record<string, unknown>;
    if (typeof body.code === 'string') return body.code;
    for (const value of Object.values(body)) {
      const nestedCode = this.providerCode(value);
      if (nestedCode) return nestedCode;
    }
    return undefined;
  }

  private findProviderMessage(payload: unknown): string | undefined {
    if (typeof payload === 'string' && payload.trim()) return payload.trim();
    if (!payload || typeof payload !== 'object') return undefined;
    if (Array.isArray(payload)) {
      for (const item of payload) {
        const message = this.findProviderMessage(item);
        if (message) return message;
      }
      return undefined;
    }

    const body = payload as Record<string, unknown>;
    for (const key of ['message', 'msg', 'detail']) {
      if (typeof body[key] === 'string' && body[key].trim()) return body[key].trim();
    }
    for (const key of ['error', 'errors', 'data']) {
      const message = this.findProviderMessage(body[key]);
      if (message) return message;
    }
    return undefined;
  }
}
