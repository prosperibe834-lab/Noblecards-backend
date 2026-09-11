import { BadRequestException } from '@nestjs/common';
import { FlutterwavePayoutClient } from './flutterwave-payout.client';

describe('FlutterwavePayoutClient', () => {
  const config = {
    get: jest.fn((name: string) => ({
      FLUTTERWAVE_PAYOUT_ENABLED: 'true',
      FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
      FLUTTERWAVE_PAYOUT_BASE_URL: 'https://api.flutterwave.com/v3',
      FLUTTERWAVE_SECRET_KEY: 'test-secret',
    } as Record<string, string>)[name]),
  } as any;

  afterEach(() => jest.restoreAllMocks());

  it('returns the provider response for an accepted transfer', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      status: 'success',
      message: 'Transfer Queued Successfully',
      data: { id: 2240067, reference: 'NC-PROBE_PMCKDU_1', status: 'NEW' },
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));

    await expect(new FlutterwavePayoutClient(config).post('/transfers', {
      account_bank: '044',
      account_number: '0690000040',
      amount: 1326029.54,
      currency: 'NGN',
      debit_currency: 'USD',
      beneficiary_name: 'Alexis Sanchez',
      reference: 'NC-PROBE_PMCKDU_1',
      narration: 'NobleCards withdrawal NC-PROBE_PMCKDU_1',
    })).resolves.toEqual(expect.objectContaining({ status: 'success' }));
  });

  it('preserves the safe provider rejection message', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(async () => new Response(JSON.stringify({
      status: 'error',
      message: 'amount is required',
      data: null,
    }), { status: 400, headers: { 'Content-Type': 'application/json' } }));

    await expect(new FlutterwavePayoutClient(config).post('/transfers', {}))
      .rejects.toBeInstanceOf(BadRequestException);
    await expect(new FlutterwavePayoutClient(config).post('/transfers', {}))
      .rejects.toThrow('amount is required');
  });
});
