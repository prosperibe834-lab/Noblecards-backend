import { BadGatewayException, RequestTimeoutException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TremendousClient } from './tremendous.client';

const response = (status: number, body: unknown) => ({
  ok: status >= 200 && status < 300,
  status,
  json: jest.fn().mockResolvedValue(body),
}) as any;

describe('TremendousClient', () => {
  const config = {
    get: jest.fn((name: string) => ({
      TREMENDOUS_API_BASE_URL: 'https://testflight.tremendous.com/api/v2',
      TREMENDOUS_API_KEY: 'sandbox-key',
    } as Record<string, string>)[name]),
  } as unknown as ConfigService;

  beforeEach(() => jest.restoreAllMocks());

  it('authenticates with ping and fetches products using Bearer auth', async () => {
    const fetchMock = jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce(response(200, { message: 'ok' }))
      .mockResolvedValueOnce(response(200, { products: [] }));
    const client = new TremendousClient(config);

    await expect(client.ping()).resolves.toEqual({ message: 'ok' });
    await expect(client.getProducts({ countryCode: 'US', currency: 'USD', subcategory: 'shopping' })).resolves.toEqual({ products: [] });
    expect(fetchMock.mock.calls[0][0]).toBe('https://testflight.tremendous.com/api/v2/ping');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer sandbox-key');
    expect(fetchMock.mock.calls[1][0]).toBe('https://testflight.tremendous.com/api/v2/products?country=US&currency=USD&subcategory=shopping');
  });

  it('sends the current v2 single-reward order shape', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(response(200, { order: { id: 'ORDER-1' } }));
    await new TremendousClient(config).createOrder({
      productId: 'PRODUCT-1', amount: 1, currencyCode: 'USD', email: 'buyer@example.com', sender: 'Buyer', units: 1, reference: 'NC-TEST-1',
    });
    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(request.body))).toEqual({
      external_id: 'NC-TEST-1',
      payment: { funding_source_id: 'BALANCE' },
      reward: {
        value: { denomination: 1, currency_code: 'USD' },
        recipient: { name: 'Buyer', email: 'buyer@example.com' },
        delivery: { method: 'EMAIL' },
        products: ['PRODUCT-1'],
      },
    });
  });

  it.each([401, 403, 429, 500])('maps HTTP %s without exposing credentials', async (status) => {
    jest.spyOn(global, 'fetch').mockResolvedValue(response(status, { error: { message: 'provider failure' } }));
    await expect(new TremendousClient(config).ping()).rejects.toMatchObject({
      response: expect.objectContaining({ message: 'provider failure', providerStatus: status }),
    });
    try { await new TremendousClient(config).ping(); } catch (error) {
      expect(JSON.stringify(error)).not.toContain('sandbox-key');
      expect(error).toBeInstanceOf(BadGatewayException);
    }
  });

  it('fails closed when the API key is missing', async () => {
    const missing = { get: jest.fn().mockReturnValue(undefined) } as unknown as ConfigService;
    await expect(new TremendousClient(missing).ping()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('maps timeouts', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(Object.assign(new Error('aborted'), { name: 'AbortError' }));
    await expect(new TremendousClient(config).ping()).rejects.toBeInstanceOf(RequestTimeoutException);
  });
});
