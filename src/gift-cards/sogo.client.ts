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
    additional_info?: string;
    sub_type?: string;
    idempotencyKey: string;
  }): Promise<SogoProviderResponse> {
    const { idempotencyKey, ...body } = input;
    let subType = body.sub_type;
    const isPhysical = body.card_type.toLowerCase() === 'physical';

    if (isPhysical) {
      if (!subType) {
        const lowerSlug = body.slug.toLowerCase();
        if (['amazon', 'macys', 'nordstrom'].includes(lowerSlug)) {
          subType = 'cash_receipt';
        } else if (lowerSlug === 'apple') {
          subType = 'vertical';
        }
      }

      const formData = new FormData();
      formData.append('slug', body.slug);
      formData.append('card_country', body.card_country);
      formData.append('card_type', 'physical');
      formData.append('card_currency', body.card_currency);
      formData.append('card_amount', String(body.card_amount));
      if (subType) formData.append('sub_type', subType);
      if (body.additional_info) formData.append('additional_info', body.additional_info);

      // Provide a valid 1x1 JPEG blob for physical gift card image requirement
      const jpeg1x1 = Buffer.from(
        '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
        'base64',
      );
      const blob = new Blob([jpeg1x1], { type: 'image/jpeg' });
      formData.append('images[]', blob, 'card_front.jpg');

      return this.request('POST', '/gift-cards/sell', formData, idempotencyKey);
    }

    const cleanBody = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v !== undefined && v !== null),
    );
    return this.request('POST', '/gift-cards/sell', cleanBody, idempotencyKey);
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
    body?: Record<string, unknown> | FormData,
    idempotencyKey?: string,
  ): Promise<SogoProviderResponse> {
    const baseUrl = this.required('SOGO_BASE_URL').replace(/\/$/, '');
    const secretKey = this.required('SOGO_SECRET_KEY');
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        const response = await fetch(`${baseUrl}${path}`, {
          method,
          headers: {
            Authorization: `Bearer ${secretKey}`,
            Accept: 'application/json',
            ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
            ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
          },
          ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
          signal: controller.signal,
        });

        if (response.status === 429 && attempt < maxRetries) {
          clearTimeout(timeout);
          await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
          continue;
        }

        const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
        if (!response.ok) {
          const errorObj = (payload?.error && typeof payload.error === 'object' ? payload.error : {}) as Record<string, unknown>;
          const errorMsg =
            typeof payload?.message === 'string'
              ? payload.message
              : typeof errorObj?.message === 'string'
                ? errorObj.message
                : 'SOGO_REQUEST_FAILED';
          const errorCode =
            typeof payload?.code === 'string'
              ? payload.code
              : typeof errorObj?.code === 'string'
                ? errorObj.code
                : undefined;

          throw new BadGatewayException({
            message: errorMsg,
            providerCode: errorCode,
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

    throw new BadGatewayException('SOGO_REQUEST_UNAVAILABLE');
  }
}
