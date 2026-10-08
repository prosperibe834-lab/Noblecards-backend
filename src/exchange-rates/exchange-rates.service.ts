import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ExchangeRatesResponse {
  base: string;
  rates: Record<string, number>;
  updatedAt: string;
}

@Injectable()
export class ExchangeRatesService {
  private readonly logger = new Logger(ExchangeRatesService.name);
  private cache: ExchangeRatesResponse | null = null;
  private cacheExpiresAt = 0;
  private inFlightFetch: Promise<ExchangeRatesResponse> | null = null;

  constructor(private readonly config: ConfigService) {}

  private getDefaultEndpoint() {
    return this.config.get<string>('EXCHANGE_RATE_API_URL', 'https://open.er-api.com/v6/latest/USD');
  }

  private getTimeoutMs() {
    return Number(this.config.get<number | string>('EXCHANGE_RATE_TIMEOUT_MS', 15_000));
  }

  private getCacheTtlMs() {
    return Number(this.config.get<number | string>('EXCHANGE_RATE_CACHE_TTL_MS', 60 * 1000));
  }

  private isUsdBaseRateObject(raw: any): raw is { base_code?: string; rates?: Record<string, unknown>; time_last_update_utc?: string } {
    return !!raw && typeof raw === 'object' && typeof raw.base_code === 'string' && typeof raw.rates === 'object' && raw.rates !== null;
  }

  private normalizeRateValue(value: unknown, currencyCode: string) {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }

    throw new Error(`Invalid exchange rate for ${currencyCode}: ${String(value)}`);
  }

  private validateRates(base: string, rates: Record<string, unknown>) {
    if (!base || base.toUpperCase() !== 'USD') {
      throw new Error(`Unsupported exchange rate base: ${String(base)}`);
    }

    const normalized: Record<string, number> = {};
    for (const [currencyCode, value] of Object.entries(rates)) {
      const code = currencyCode.toUpperCase();
      normalized[code] = this.normalizeRateValue(value, code);
    }

    if (Object.keys(normalized).length === 0) {
      throw new Error('Exchange rate provider returned no supported currencies.');
    }

    return normalized;
  }

  private isCacheValid() {
    return this.cache !== null && Date.now() < this.cacheExpiresAt;
  }

  async fetchRatesFromProvider(): Promise<ExchangeRatesResponse> {
    const endpoint = this.getDefaultEndpoint();
    const timeoutMs = this.getTimeoutMs();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`External FX API responded with status ${response.status}`);
      }

      const payload = await response.json();
      if (!this.isUsdBaseRateObject(payload)) {
        throw new Error('Malformed exchange-rate provider response.');
      }

      const baseCode = payload.base_code;
      if (!baseCode) {
        throw new Error('Exchange-rate provider response is missing the base currency.');
      }

      const normalizedRates = this.validateRates(baseCode, payload.rates ?? {});
      const updatedAt = payload.time_last_update_utc ?? new Date().toISOString();

      const normalized: ExchangeRatesResponse = {
        base: 'USD',
        rates: normalizedRates,
        updatedAt,
      };

      this.cache = normalized;
      this.cacheExpiresAt = Date.now() + this.getCacheTtlMs();
      return normalized;
    } catch (error: unknown) {
      const failure = controller.signal.aborted
        ? new Error(`FX provider request timed out after ${timeoutMs} ms.`)
        : error;
      this.logger.warn(
        `FX provider fetch failed: ${failure instanceof Error ? failure.message : String(failure)}`,
      );
      if (this.isCacheValid()) {
        this.logger.warn('Using cached exchange rates after provider failure.');
        return this.cache!;
      }
      throw failure;
    } finally {
      clearTimeout(timeout);
    }
  }

  async getRates(): Promise<ExchangeRatesResponse> {
    if (this.isCacheValid()) {
      return this.cache!;
    }

    if (this.inFlightFetch) {
      return this.inFlightFetch;
    }

    const fetchPromise = this.fetchRatesFromProvider();
    this.inFlightFetch = fetchPromise;
    try {
      return await fetchPromise;
    } finally {
      if (this.inFlightFetch === fetchPromise) {
        this.inFlightFetch = null;
      }
    }
  }

  getCachedRates(): ExchangeRatesResponse | null {
    return this.isCacheValid() ? this.cache : null;
  }
}
