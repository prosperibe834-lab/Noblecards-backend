import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { FlutterwavePayoutClient } from './flutterwave-payout.client';

describe('FlutterwavePayoutClient', () => {
  const config = {
    get: jest.fn(
      (name: string) =>
        (
          ({
            FLUTTERWAVE_PAYOUT_ENABLED: 'true',
            FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
            FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
            FLUTTERWAVE_SECRET_KEY: 'test-secret',
          }) as Record<string, string>
        )[name],
    ),
  } as any;

  afterEach(() => jest.restoreAllMocks());

  it('loads V3 bank catalogs when payouts are disabled', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    const fetch = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: [{ id: 44, code: '044' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(
      new FlutterwavePayoutClient(disabledConfig).get('/banks/NG'),
    ).resolves.toEqual({ data: [{ id: 44, code: '044' }] });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.flutterwave.com/v3/banks/NG',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-only-key',
        }),
      }),
    );
  });

  it('propagates provider authorization failures instead of returning empty data', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const client = new FlutterwavePayoutClient(disabledConfig);
    const error = await client
      .get('/banks/GH')
      .catch((requestError) => requestError);
    expect(error).toBeInstanceOf(BadGatewayException);
    expect((error as BadGatewayException).getStatus()).toBe(502);
    expect((error as BadGatewayException).message).toContain(
      'HTTP 401: Unauthorized',
    );
  });

  it('queries the V3 bank transfer fee endpoint with GET query parameters only', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    const fetch = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'success',
          message: 'Transfer fee fetched',
          data: [{ currency: 'GBP', fee_type: 'value', fee: 35 }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    await expect(
      new FlutterwavePayoutClient(disabledConfig).getTransferFee(100, 'gbp'),
    ).resolves.toEqual({ currency: 'GBP', feeType: 'value', fee: 35 });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe(
      'https://api.flutterwave.com/v3/transfers/fee?amount=100&currency=GBP&type=account',
    );
    const options = fetch.mock.calls[0][1] as RequestInit;
    expect(options.method).toBeUndefined();
    expect(options.body).toBeUndefined();
    expect(options.headers).toEqual(
      expect.objectContaining({
        Accept: 'application/json',
        Authorization: expect.any(String),
      }),
    );
    expect(
      Object.keys(options.headers as Record<string, string>).some(
        (header) => header.toLowerCase() === 'content-type',
      ),
    ).toBe(false);
  });

  it('parses a percentage transfer fee record from Flutterwave', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'success',
          message: 'Transfer fee fetched',
          data: [{ currency: 'GBP', fee_type: 'percentage', fee: 0.005 }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    await expect(
      new FlutterwavePayoutClient(disabledConfig).getTransferFee(100, 'gbp'),
    ).resolves.toEqual({ currency: 'GBP', feeType: 'percentage', fee: 0.005 });
  });

  it('returns no fee when Flutterwave has no record for the requested currency', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'success',
          data: [{ currency: 'GBP', fee_type: 'value', fee: 35 }],
        }),
        { status: 200 },
      ),
    );

    await expect(
      new FlutterwavePayoutClient(disabledConfig).getTransferFee(100, 'CAD'),
    ).resolves.toBeNull();
  });

  it('rejects invalid fee query amounts before making a provider request', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    const fetch = jest.spyOn(global, 'fetch');
    const client = new FlutterwavePayoutClient(disabledConfig);

    await expect(client.getTransferFee(100.5, 'GBP')).rejects.toThrow(
      /TRANSFER_FEE_REQUEST_INVALID/,
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('queries V3 transfer rates with the documented destination and source currencies', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    const fetch = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'success',
          data: {
            rate: 0.75,
            source: { currency: 'USD', amount: 1.33333333 },
            destination: { currency: 'GBP', amount: 1 },
          },
        }),
        { status: 200 },
      ),
    );

    await expect(
      new FlutterwavePayoutClient(disabledConfig).getTransferRates(
        1,
        'usd',
        'gbp',
      ),
    ).resolves.toEqual({
      rate: 0.75,
      source: { currency: 'USD', amount: 1.33333333 },
      destination: { currency: 'GBP', amount: 1 },
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe(
      'https://api.flutterwave.com/v3/transfers/rates?amount=1&destination_currency=GBP&source_currency=USD',
    );
    expect(options?.body).toBeUndefined();
    expect(options?.headers).toEqual(
      expect.objectContaining({ Accept: 'application/json' }),
    );
    expect(
      Object.keys(options?.headers as Record<string, string>).some(
        (header) => header.toLowerCase() === 'content-type',
      ),
    ).toBe(false);
  });

  it('rejects inconsistent V3 transfer-rate currency or amount data', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'success',
          data: {
            rate: 0.75,
            source: { currency: 'USD', amount: 1 },
            destination: { currency: 'GBP', amount: 2 },
          },
        }),
        { status: 200 },
      ),
    );

    await expect(
      new FlutterwavePayoutClient(disabledConfig).getTransferRates(
        1,
        'USD',
        'GBP',
      ),
    ).rejects.toThrow(/TRANSFER_RATES_PROVIDER_RESPONSE_INVALID/);
  });

  it('rejects malformed fee data rather than fabricating a fee', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', data: 'invalid' }), {
        status: 200,
      }),
    );

    await expect(
      new FlutterwavePayoutClient(disabledConfig).getTransferFee(100, 'USD'),
    ).rejects.toThrow(/TRANSFER_FEE_PROVIDER_RESPONSE_INVALID/);
  });

  it('propagates provider fee lookup failures instead of returning a zero fee', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Fee lookup unavailable' }), {
        status: 400,
      }),
    );

    await expect(
      new FlutterwavePayoutClient(disabledConfig).getTransferFee(100, 'GBP'),
    ).rejects.toThrow(/HTTP 400: Fee lookup unavailable/);
  });

  it('returns the safe upstream status and provider message for a bank-list failure', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'An error occurred' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const error = await new FlutterwavePayoutClient(disabledConfig)
      .get('/banks/NG')
      .catch((requestError) => requestError);
    expect(error).toBeInstanceOf(BadGatewayException);
    expect((error as BadGatewayException).message).toContain(
      'GET /banks/NG returned HTTP 400: An error occurred',
    );
  });

  it('does not include provider credentials in upstream error details', async () => {
    const secret = 'private-secret-for-test';
    const secretConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: secret,
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: `Rejected ${secret}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const error = await new FlutterwavePayoutClient(secretConfig)
      .get('/banks/NG')
      .catch((requestError) => requestError);
    expect(error).toBeInstanceOf(BadGatewayException);
    const exception = error as BadGatewayException;
    expect(exception.getStatus()).toBe(502);
    expect(JSON.stringify(exception.getResponse())).not.toContain(secret);
    expect(JSON.stringify(exception.getResponse())).toContain('[REDACTED]');
  });

  it('converts a provider network failure into a safe gateway error', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('socket failure'));

    const error = await new FlutterwavePayoutClient(disabledConfig)
      .get('/banks/NG')
      .catch((requestError) => requestError);
    expect(error).toBeInstanceOf(BadGatewayException);
    expect((error as BadGatewayException).message).toContain(
      'PAYOUT_PROVIDER_UNAVAILABLE',
    );
  });

  it('keeps transfer POST requests disabled when payouts are disabled', async () => {
    const disabledConfig = {
      get: jest.fn(
        (name: string) =>
          (
            ({
              FLUTTERWAVE_PAYOUT_ENABLED: 'false',
              FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
              FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
              FLUTTERWAVE_SECRET_KEY: 'test-only-key',
            }) as Record<string, string>
          )[name],
      ),
    } as any;
    const fetch = jest.spyOn(global, 'fetch');

    await expect(
      new FlutterwavePayoutClient(disabledConfig).post('/transfers', {}),
    ).rejects.toThrow(/PAYOUT_DISABLED/);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns the provider response for an accepted transfer', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'success',
          message: 'Transfer Queued Successfully',
          data: { id: 2240067, reference: 'NC-PROBE_PMCKDU_1', status: 'NEW' },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    await expect(
      new FlutterwavePayoutClient(config).post('/transfers', {
        account_bank: '044',
        account_number: '0690000040',
        amount: 1326029.54,
        currency: 'NGN',
        debit_currency: 'USD',
        beneficiary_name: 'Alexis Sanchez',
        reference: 'NC-PROBE_PMCKDU_1',
        narration: 'NobleCards withdrawal NC-PROBE_PMCKDU_1',
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'success' }));
  });

  it('preserves the safe provider rejection message', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      async () =>
        new Response(
          JSON.stringify({
            status: 'error',
            message: 'amount is required',
            data: null,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        ),
    );

    await expect(
      new FlutterwavePayoutClient(config).post('/transfers', {}),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      new FlutterwavePayoutClient(config).post('/transfers', {}),
    ).rejects.toThrow('amount is required');
  });
});
