import { ConfigService } from '@nestjs/config';
import { FlutterwavePayoutAdapter } from './flutterwave-payout.adapter';

describe('FlutterwavePayoutAdapter provider identifier normalization', () => {
  const config = {
    get: jest.fn((name: string) => ({
      FLUTTERWAVE_PAYOUT_ENABLED: 'true',
      FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
      FLUTTERWAVE_PAYOUT_SUPPORTED_ROUTES: 'NG:NGN:BANK_TRANSFER',
      FLUTTERWAVE_WEBHOOK_SECRET_HASH: 'secret',
    } as Record<string, string>)[name]),
  } as unknown as ConfigService;

  it('converts a numeric transfer ID and reference to strings', async () => {
    const client = {
      post: jest.fn().mockResolvedValue({ data: { id: 2240074, reference: 987654, status: 'NEW' } }),
    } as any;
    const adapter = new FlutterwavePayoutAdapter(config, client);

    await expect(adapter.createTransfer({ request: {}, idempotencyKey: 'key', traceId: 'trace' })).resolves.toEqual(expect.objectContaining({
      providerTransactionId: '2240074',
      providerReference: '987654',
    }));
  });

  it('keeps a missing status response identifier undefined and preserves alphanumeric IDs', async () => {
    const client = {
      get: jest.fn().mockResolvedValue({ data: { id: 'trf_ABC-42', reference: 'ref_ABC-42', status: 'PENDING' } }),
    } as any;
    const adapter = new FlutterwavePayoutAdapter(config, client);

    await expect(adapter.getPayoutStatus({ transferId: '2240074' })).resolves.toEqual(expect.objectContaining({
      providerTransactionId: 'trf_ABC-42',
      providerReference: 'ref_ABC-42',
    }));
  });

  it('loads country-specific bank lists without substituting Nigerian banks for Ghana', async () => {
    const client = {
      get: jest.fn()
        .mockResolvedValueOnce({ data: [{ id: 44, code: '044', name: 'Access Bank', country: 'NG', currency: 'NGN', has_branches: false }] })
        .mockResolvedValueOnce({ data: [{ id: 501, code: 'GH001', name: 'Ghana Bank', country: 'GH', currency: 'GHS', has_branches: true }] }),
    } as any;
    const adapter = new FlutterwavePayoutAdapter(config, client);

    await expect(adapter.getBanks({ countryCode: 'NG', currencyCode: 'NGN', method: 'BANK_TRANSFER' as any })).resolves.toEqual([
      expect.objectContaining({ code: '044', name: 'Access Bank', country: 'NG', currency: 'NGN' }),
    ]);
    await expect(adapter.getBanks({ countryCode: 'GH', currencyCode: 'GHS', method: 'BANK_TRANSFER' as any })).resolves.toEqual([
      expect.objectContaining({ code: 'GH001', name: 'Ghana Bank', country: 'GH', currency: 'GHS', hasBranches: true }),
    ]);
    expect(client.get).toHaveBeenNthCalledWith(1, '/banks/NG');
    expect(client.get).toHaveBeenNthCalledWith(2, '/banks/GH');
  });
});