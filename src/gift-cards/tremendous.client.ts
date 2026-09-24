import {
  BadGatewayException,
  Injectable,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BuyGiftCardCatalogFilters, BuyGiftCardPurchaseInput } from './buy-gift-card-provider.interface';

export type TremendousResponse = unknown;

@Injectable()
export class TremendousClient {
  private readonly timeoutMs = 15_000;

  constructor(private readonly config: ConfigService) {}

  ping(): Promise<TremendousResponse> {
    return this.request('GET', '/ping');
  }

  async getProducts(filters: BuyGiftCardCatalogFilters): Promise<TremendousResponse> {
    const query = new URLSearchParams();
    if (filters.productId) query.set('id', filters.productId);
    if (filters.countryCode) query.set('country', filters.countryCode);
    if (filters.currency) query.set('currency', filters.currency);
    if (filters.subcategory) query.set('subcategory', filters.subcategory);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return this.request('GET', `/products${suffix}`);
  }

  createOrder(input: BuyGiftCardPurchaseInput & { currencyCode: string }): Promise<TremendousResponse> {
    return this.request('POST', '/orders', {
      external_id: input.reference,
      payment: { funding_source_id: 'BALANCE' },
      reward: {
        value: { denomination: input.amount, currency_code: input.currencyCode },
        recipient: { name: input.sender, email: input.email },
        delivery: { method: 'EMAIL' },
        products: [input.productId],
      },
    });
  }

  getOrder(reference: string): Promise<TremendousResponse> {
    return this.request('GET', `/orders/${encodeURIComponent(reference)}`);
  }

  private required(name: string): string {
    const value = this.config.get<string>(name)?.trim();
    if (!value) throw new ServiceUnavailableException(`TREMENDOUS_CONFIGURATION_MISSING: ${name} is not configured.`);
    return value;
  }

  private async request(method: 'GET' | 'POST', path: string, body?: Record<string, unknown>): Promise<TremendousResponse> {
    const baseUrl = this.required('TREMENDOUS_API_BASE_URL').replace(/\/$/, '');
    const apiKey = this.required('TREMENDOUS_API_KEY');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${apiKey}`,
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
      if ((error as { name?: string })?.name === 'AbortError') throw new RequestTimeoutException('TREMENDOUS_REQUEST_TIMEOUT');
      throw new BadGatewayException('TREMENDOUS_REQUEST_UNAVAILABLE');
    } finally {
      clearTimeout(timeout);
    }
  }

  private providerMessage(payload: unknown, status: number): string {
    const message = this.findString(payload, ['message', 'detail', 'error', 'title']);
    return message ?? `TREMENDOUS_REQUEST_FAILED_${status}`;
  }

  private providerCode(payload: unknown): string | undefined {
    const code = this.findString(payload, ['code', 'error_code']);
    return code ?? undefined;
  }

  private findString(value: unknown, keys: string[]): string | null {
    if (!value || typeof value !== 'object') return null;
    if (Array.isArray(value)) {
      for (const item of value) {
        const result = this.findString(item, keys);
        if (result) return result;
      }
      return null;
    }
    const object = value as Record<string, unknown>;
    for (const key of keys) if (typeof object[key] === 'string' && object[key]) return object[key] as string;
    for (const child of Object.values(object)) {
      const result = this.findString(child, keys);
      if (result) return result;
    }
    return null;
  }
}
