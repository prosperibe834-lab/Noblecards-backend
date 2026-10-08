import { ConfigService } from '@nestjs/config';
import { ExchangeRatesService } from './exchange-rates.service';

const ratesPayload = {
  base_code: 'USD',
  rates: { USD: 1, NGN: 1500, GBP: 0.79, EUR: 0.92, CAD: 1.36 },
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
    get: jest.fn(
      (key: string, fallback?: string | number) => values[key] ?? fallback,
    ),
  } as unknown as ConfigService;
  return new ExchangeRatesService(config);
}

function providerResponse(payload: unknown = ratesPayload) {
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

  it('fetches, parses, and normalizes USD-based rates from the provider', async () => {
    const service = makeService();
    const fetch = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(providerResponse());

    const result = await service.getRates();

    expect(result).toEqual({
      base: 'USD',
      rates: ratesPayload.rates,
      updatedAt: ratesPayload.time_last_update_utc,
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://open.er-api.com/v6/latest/USD',
      expect.objectContaining({
        method: 'GET',
        headers: { Accept: 'application/json' },
      }),
    );
    expect(result.rates.USD).toBe(1);
    expect(result.rates.EUR).toBe(0.92);
    expect(result.rates.GBP).toBe(0.79);
  });

  it('reports an explicit timeout when its AbortController cancels the fetch', async () => {
    jest.useFakeTimers();
    const service = makeService({ EXCHANGE_RATE_TIMEOUT_MS: 25 });
    let requestSignal: AbortSignal | undefined;
    jest
      .spyOn(globalThis, 'fetch')
      .mockImplementation(
        async (_input: RequestInfo | URL, init?: RequestInit) => {
          requestSignal = init?.signal ?? undefined;
          return new Promise<Response>((_resolve, reject) => {
            requestSignal?.addEventListener(
              'abort',
              () =>
                reject(
                  new DOMException('This operation was aborted', 'AbortError'),
                ),
              { once: true },
            );
          });
        },
      );

    const pending = service.getRates();
    const rejected = expect(pending).rejects.toThrow('timed out after 25 ms');
    await jest.advanceTimersByTimeAsync(25);

    await rejected;
    expect(requestSignal?.aborted).toBe(true);
    expect(service.getCachedRates()).toBeNull();
  });

  it('propagates provider network failures without inventing rates', async () => {
    const service = makeService();
    jest
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('provider unavailable'));

    await expect(service.getRates()).rejects.toThrow('provider unavailable');
    expect(service.getCachedRates()).toBeNull();
  });

  it('reuses cached rates within the TTL and does not expose expired rates', async () => {
    jest.useFakeTimers();
    const service = makeService({ EXCHANGE_RATE_CACHE_TTL_MS: 100 });
    const fetch = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(providerResponse())
      .mockRejectedValueOnce(new Error('provider unavailable'));

    const first = await service.getRates();
    expect(await service.getRates()).toBe(first);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(service.getCachedRates()).toBe(first);

    await jest.advanceTimersByTimeAsync(101);
    expect(service.getCachedRates()).toBeNull();
    await expect(service.getRates()).rejects.toThrow('provider unavailable');
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('shares one in-flight provider fetch between concurrent callers', async () => {
    const service = makeService();
    let resolveResponse!: (response: Response) => void;
    const pendingResponse = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });
    const fetch = jest
      .spyOn(globalThis, 'fetch')
      .mockReturnValue(pendingResponse);

    const requests = [
      service.getRates(),
      service.getRates(),
      service.getRates(),
    ];
    expect(fetch).toHaveBeenCalledTimes(1);
    resolveResponse(providerResponse());

    const results = await Promise.all(requests);
    expect(results.every((result) => result === results[0])).toBe(true);
  });

  it('rejects provider payloads with a non-USD base', async () => {
    const service = makeService();
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      providerResponse({
        ...ratesPayload,
        base_code: 'GBP',
      }),
    );

    await expect(service.getRates()).rejects.toThrow(
      'Unsupported exchange rate base: GBP',
    );
    expect(service.getCachedRates()).toBeNull();
  });
});
