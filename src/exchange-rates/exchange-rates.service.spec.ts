import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ExchangeRatesService } from './exchange-rates.service';

describe('ExchangeRatesService', () => {
  it('normalizes provider rates into a USD base map', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRatesService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, fallback?: string | number) => {
              const map: Record<string, string | number> = {
                EXCHANGE_RATE_API_URL: 'https://open.er-api.com/v6/latest/USD',
                EXCHANGE_RATE_TIMEOUT_MS: 8000,
                EXCHANGE_RATE_CACHE_TTL_MS: 600000,
              };
              return map[key] ?? fallback;
            }),
          },
        },
      ],
    }).compile();

    const service = module.get<ExchangeRatesService>(ExchangeRatesService);
    jest.spyOn(service as any, 'fetchRatesFromProvider').mockResolvedValue({
      base: 'USD',
      rates: { NGN: 1500, GBP: 0.79, EUR: 0.92, CAD: 1.36 },
      updatedAt: 'Mon, 01 Sep 2026 00:00:00 +0000',
    });

    const result = await service.getRates();

    expect(result.base).toBe('USD');
    expect(result.rates.NGN).toBe(1500);
    expect(result.rates.GBP).toBe(0.79);
    expect(result.rates.EUR).toBe(0.92);
    expect(result.rates.CAD).toBe(1.36);
    expect(result.updatedAt).toBeTruthy();
  });

  it('rejects malformed provider responses', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRatesService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, fallback?: string | number) => {
              const map: Record<string, string | number> = {
                EXCHANGE_RATE_API_URL: 'https://open.er-api.com/v6/latest/USD',
                EXCHANGE_RATE_TIMEOUT_MS: 8000,
                EXCHANGE_RATE_CACHE_TTL_MS: 600000,
              };
              return map[key] ?? fallback;
            }),
          },
        },
      ],
    }).compile();

    const service = module.get<ExchangeRatesService>(ExchangeRatesService);
    expect(() => (service as any).validateRates('USD', { NGN: 'bad' })).toThrow('Invalid exchange rate for NGN');
  });
});
