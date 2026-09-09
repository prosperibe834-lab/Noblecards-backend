import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FlutterwavePayoutClient } from './flutterwave-payout.client';

describe('FlutterwavePayoutClient', () => {
  const config = (values: Record<string, string>) => ({
    get: jest.fn((key: string) => values[key]),
  }) as unknown as ConfigService;

  afterEach(() => jest.restoreAllMocks());

  it('uses the V3 secret-key bearer header without OAuth credentials', async () => {
    const client = new FlutterwavePayoutClient(config({
      FLUTTERWAVE_PAYOUT_ENABLED: 'true',
      FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
      FLUTTERWAVE_SECRET_KEY: 'FLWSECK_TEST_SECRET',
      FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
    }));
    const fetchMock = jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: 'success', data: { id: 'trf-1' } }), { status: 201 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: 'success', data: { id: 'trf-2' } }), { status: 201 }));

    await client.post('/transfers', { reference: 'WD-1' }, { 'X-Trace-Id': 'trace-123456', 'X-Idempotency-Key': 'key-123456' });
    await client.post('/transfers', { reference: 'WD-1' }, { 'X-Trace-Id': 'trace-123456', 'X-Idempotency-Key': 'key-123456' });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.flutterwave.com/v3/transfers');
    expect(fetchMock.mock.calls[0][1]).toEqual(expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer FLWSECK_TEST_SECRET',
        'X-Trace-Id': 'trace-123456',
        'X-Idempotency-Key': 'key-123456',
      }),
    }));
  });

  it('fails closed when payout is disabled', async () => {
    const client = new FlutterwavePayoutClient(config({
      FLUTTERWAVE_PAYOUT_ENABLED: 'false',
      FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
      FLUTTERWAVE_SECRET_KEY: 'FLWSECK_TEST_SECRET',
      FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
    }));
    await expect(client.get('/transfers/trf-1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a sandbox environment paired with a non-sandbox base URL', async () => {
    const client = new FlutterwavePayoutClient(config({
      FLUTTERWAVE_PAYOUT_ENABLED: 'true',
      FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
      FLUTTERWAVE_SECRET_KEY: 'FLWSECK_TEST_SECRET',
      FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v1',
    }));

    await expect(client.get('/transfers/trf-1')).rejects.toMatchObject({
      response: expect.objectContaining({ message: expect.stringContaining('PAYOUT_CONFIGURATION_INVALID') }),
    });
  });

  it('rejects a non-sandbox environment for the active V3 payout path', async () => {
    const client = new FlutterwavePayoutClient(config({
      FLUTTERWAVE_PAYOUT_ENABLED: 'true',
      FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'production',
      FLUTTERWAVE_SECRET_KEY: 'FLWSECK_LIVE_SECRET',
      FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
    }));

    await expect(client.get('/transfers/trf-1')).rejects.toMatchObject({
      response: expect.objectContaining({ message: expect.stringContaining('PAYOUT_CONFIGURATION_INVALID') }),
    });
  });

  it('fails closed when the secret key is missing', async () => {
    const client = new FlutterwavePayoutClient(config({
      FLUTTERWAVE_PAYOUT_ENABLED: 'true',
      FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
      FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
    }));

    await expect(client.get('/transfers/trf-1')).rejects.toMatchObject({
      response: expect.objectContaining({ message: expect.stringContaining('PAYOUT_CONFIGURATION_MISSING') }),
    });
  });
});
