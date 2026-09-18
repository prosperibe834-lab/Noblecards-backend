import { BadGatewayException, RequestTimeoutException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SogoClient } from './sogo.client';

const response = (status: number, body: unknown) => ({
  ok: status >= 200 && status < 300,
  status,
  json: jest.fn().mockResolvedValue(body),
}) as any;

describe('SogoClient', () => {
  const config = {
    get: jest.fn((name: string) => ({
      SOGO_BASE_URL: 'https://sandbox.sogo.africa/v1',
      SOGO_SECRET_KEY: 'sandbox-secret-for-test-only',
    } as Record<string, string>)[name]),
  } as unknown as ConfigService;

  beforeEach(() => jest.restoreAllMocks());

  it('requests the sell catalog with server-side bearer authentication', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(response(200, { data: ['amazon'] }));
    const client = new SogoClient(config);

    await expect(client.getSellCatalog()).resolves.toEqual({ data: ['amazon'] });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://sandbox.sogo.africa/v1/gift-cards/sell/catalog',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer sandbox-secret-for-test-only' }),
      }),
    );
  });

  it('requests rates and submits a sell with an idempotency header', async () => {
    const fetchMock = jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce(response(200, { rates: [] }))
      .mockResolvedValueOnce(response(200, { message: 'submitted', trade_id: 'trade-1' }));
    const client = new SogoClient(config);

    await expect(client.getSellRates()).resolves.toEqual({ rates: [] });
    await expect(client.submitSell({
      slug: 'amazon',
      card_country: 'US',
      card_type: 'ecode',
      card_currency: 'USD',
      card_amount: 100,
      additional_info: 'masked-test-reference',
      idempotencyKey: 'sale-key-1',
    })).resolves.toEqual({ message: 'submitted', trade_id: 'trade-1' });
    expect(fetchMock.mock.calls[1][1]).toEqual(expect.objectContaining({
      headers: expect.objectContaining({ 'Idempotency-Key': 'sale-key-1' }),
      body: JSON.stringify({
        slug: 'amazon',
        card_country: 'US',
        card_type: 'ecode',
        card_currency: 'USD',
        card_amount: 100,
        additional_info: 'masked-test-reference',
      }),
    }));
  });

  it.each([400, 500])('normalizes Sogo HTTP %s errors without exposing credentials', async (status) => {
    jest.spyOn(global, 'fetch').mockResolvedValue(response(status, { message: 'provider failure', secret: 'must-not-return' }));
    const client = new SogoClient(config);

    await expect(client.getSellRates()).rejects.toBeInstanceOf(BadGatewayException);
    try {
      await client.getSellRates();
    } catch (error) {
      expect(JSON.stringify(error)).not.toContain('sandbox-secret-for-test-only');
    }
  });

  it('preserves the provider error message for sell failures', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(response(422, {
      code: 'INVALID_CARD_CODE',
      message: 'The gift card redemption code is invalid.',
    }));
    const client = new SogoClient(config);

    try {
      await client.submitSell({
        slug: 'apple',
        card_country: 'US',
        card_type: 'ecode',
        card_currency: 'USD',
        card_amount: 50,
        additional_info: 'invalid-code',
        idempotencyKey: 'sale-key-2',
      });
    } catch (error) {
      expect(JSON.stringify(error)).toContain('The gift card redemption code is invalid.');
      expect(JSON.stringify(error)).toContain('INVALID_CARD_CODE');
    }
  });

  it('fails closed when credentials are missing', async () => {
    const missingConfig = { get: jest.fn().mockReturnValue(undefined) } as unknown as ConfigService;
    const client = new SogoClient(missingConfig);

    await expect(client.getSellRates()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('maps request timeouts to RequestTimeoutException', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(Object.assign(new Error('aborted'), { name: 'AbortError' }));
    const client = new SogoClient(config);

    await expect(client.getSellRates()).rejects.toBeInstanceOf(RequestTimeoutException);
  });
});
