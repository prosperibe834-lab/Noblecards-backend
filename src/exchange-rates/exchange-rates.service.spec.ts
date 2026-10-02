import { ConfigService } from '@nestjs/config';
import { ExchangeRatesService } from './exchange-rates.service';

const ratesPayload = {
  base_code: 'USD',
  rates: { USD: 1, EUR: 0.92, GBP: 0.79, CAD: 1.36, NGN: 1500 },
  time_last_update_utc: 'Wed, 30 Sep 2026 00:00:00 +0000',
};

function makeService(overrides: Record<string, string | number> = {}) {
  const values: Record<string, string | number> = {
    EXCHANGE_RATE_API_URL: 'https://open.er-api.com/v6/latest/USD',
    EXCHANGE_RATE_TIMEOUT_MS: 15_000,
    EXCHANGE_RATE_CACHE_TTL_MS: 60_000,
    ...overrides,
  };
  const config = {
    get: jest.fn((key: string, fallback?: string | number) => values[key] ?? fallback),
  } as unknown as ConfigService;
  return new ExchangeRatesService(config);
}

function providerResponse(payload = ratesPayload) {
  return {
    ok: true,
    status: 200,
    json: jest.fn().mockResolvedValue(payload),
  } as unknown as Response;
}

describe('ExchangeRatesService', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('successfully fetches and normalizes rates with a USD base', async () => {
    const service = makeService();
    const fetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(providerResponse());

    const result = await service.getRates();

    expect(result).toEqual({
      base: 'USD',
      rates: ratesPayload.rates,
      updatedAt: ratesPayload.time_last_update_utc,
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(service.getCachedRates()).toEqual(result);
  });

  it('reuses successful rates until the configured cache TTL expires', async () => {
    const service = makeService({ EXCHANGE_RATE_CACHE_TTL_MS: 100 });
    const fetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(providerResponse());

    const first = await service.getRates();
    const second = await service.getRates();

    expect(second).toBe(first);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('does not expose or reuse rates beyond the configured freshness window', async () => {
    jest.useFakeTimers();
    const service = makeService({
      EXCHANGE_RATE_CACHE_TTL_MS: 100,
      EXCHANGE_RATE_TIMEOUT_MS: 1000,
    });
    const fetch = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(providerResponse())
      .mockRejectedValueOnce(new Error('provider unavailable'));

    const cached = await service.getRates();
    await jest.advanceTimersByTimeAsync(101);

    expect(service.getCachedRates()).toBeNull();
    await expect(service.getRates()).rejects.toThrow('provider unavailable');
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(service.getCachedRates()).toBeNull();
    expect(cached.rates.EUR).toBe(0.92);
  });

  it('aborts an FX request at the configured timeout and propagates failure', async () => {
    jest.useFakeTimers();
    const service = makeService({ EXCHANGE_RATE_TIMEOUT_MS: 25 });
    let requestSignal: AbortSignal | undefined;
    jest.spyOn(globalThis, 'fetch').mockImplementation((async (_input, init) => {
      requestSignal = init?.signal ?? undefined;
      return new Promise<Response>((_resolve, reject) => {
        requestSignal?.addEventListener(
          'abort',
          () => reject(new DOMException('This operation was aborted', 'AbortError')),
          { once: true },
        );
      });
    }) as typeof fetch);

    const pending = service.getRates();
    const rejected = expect(pending).rejects.toThrow('This operation was aborted');
    await jest.advanceTimersByTimeAsync(25);

    await rejected;
    expect(requestSignal?.aborted).toBe(true);
    expect(service.getCachedRates()).toBeNull();
  });

  it('shares one in-flight provider fetch between concurrent callers', async () => {
    const service = makeService();
    let resolveFetch!: (rates: Awaited<ReturnType<ExchangeRatesService['fetchRatesFromProvider']>>) => void;
    const pendingFetch = new Promise<Awaited<ReturnType<ExchangeRatesService['fetchRatesFromProvider']>>>((resolve) => {
      resolveFetch = resolve;
    });
    const fetchRates = jest.spyOn(service, 'fetchRatesFromProvider').mockReturnValue(pendingFetch);

    const requests = [service.getRates(), service.getRates(), service.getRates()];
    expect(fetchRates).toHaveBeenCalledTimes(1);

    resolveFetch({ base: 'USD', rates: ratesPayload.rates, updatedAt: ratesPayload.time_last_update_utc });
    const results = await Promise.all(requests);

    expect(results).toHaveLength(3);
    expect(results.every((result) => result === results[0])).toBe(true);
    expect(fetchRates).toHaveBeenCalledTimes(1);
  });

  it('does not invent rates when the provider fails without a fresh cache', async () => {
    const service = makeService();
    jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('provider unavailable'));

    await expect(service.getRates()).rejects.toThrow('provider unavailable');
    expect(service.getCachedRates()).toBeNull();
  });

  it('rejects malformed provider responses', async () => {
    const service = makeService();
    expect(() => (service as any).validateRates('USD', { NGN: 'bad' })).toThrow(
      'Invalid exchange rate for NGN',
    );
  });
});
