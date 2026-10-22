import { ConfigService } from '@nestjs/config';
import { FlutterwavePayoutAdapter } from './flutterwave-payout.adapter';

describe('FlutterwavePayoutAdapter provider identifier normalization', () => {
  const config = {
    get: jest.fn(
      (name: string) =>
        (
          ({
            FLUTTERWAVE_PAYOUT_ENABLED: 'true',
            FLUTTERWAVE_PAYOUT_ENVIRONMENT: 'sandbox',
            FLUTTERWAVE_PAYOUT_SUPPORTED_ROUTES: 'NG:NGN:BANK_TRANSFER',
            FLUTTERWAVE_WEBHOOK_SECRET_HASH: 'secret',
          }) as Record<string, string>
        )[name],
    ),
  } as unknown as ConfigService;

  it('converts a numeric transfer ID and reference to strings', async () => {
    const client = {
      post: jest.fn().mockResolvedValue({
        data: { id: 2240074, reference: 987654, status: 'NEW' },
      }),
    } as any;
    const adapter = new FlutterwavePayoutAdapter(config, client);

    await expect(
      adapter.createTransfer({
        request: {},
        idempotencyKey: 'key',
        traceId: 'trace',
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        providerTransactionId: '2240074',
        providerReference: '987654',
      }),
    );
  });

  it('keeps a missing status response identifier undefined and preserves alphanumeric IDs', async () => {
    const client = {
      get: jest.fn().mockResolvedValue({
        data: {
          id: 'trf_ABC-42',
          reference: 'ref_ABC-42',
          status: 'PENDING',
        },
      }),
    } as any;
    const adapter = new FlutterwavePayoutAdapter(config, client);

    await expect(
      adapter.getPayoutStatus({ transferId: '2240074' }),
    ).resolves.toEqual(
      expect.objectContaining({
        providerTransactionId: 'trf_ABC-42',
        providerReference: 'ref_ABC-42',
      }),
    );
  });

  it('verifies the configured V3 webhook hash and parses transfer.completed payloads', async () => {
    const adapter = new FlutterwavePayoutAdapter(config, {} as any);
    const rawBody = JSON.stringify({
      event: 'transfer.completed',
      data: {
        id: 2240074,
        reference: 'WD-123',
        status: 'SUCCESSFUL',
      },
    });

    await expect(adapter.verifyWebhook('secret', rawBody)).resolves.toEqual(
      expect.objectContaining({
        valid: true,
        eventType: 'transfer.completed',
        providerTransactionId: '2240074',
        providerReference: 'WD-123',
        status: 'SUCCESS',
      }),
    );
  });

  it.each([
    [undefined, JSON.stringify({ event: 'transfer.completed', data: {} })],
    ['wrong-secret', JSON.stringify({ event: 'transfer.completed', data: {} })],
    ['secret', '{invalid-json'],
    ['secret', JSON.stringify({ type: 'transfer.completed', data: {} })],
  ])(
    'rejects invalid or malformed webhook input',
    async (signature, rawBody) => {
      const adapter = new FlutterwavePayoutAdapter(config, {} as any);

      await expect(adapter.verifyWebhook(signature, rawBody)).resolves.toEqual({
        valid: false,
      });
    },
  );

  it('loads country-specific bank lists without substituting Nigerian banks for Ghana', async () => {
    const client = {
      get: jest
        .fn()
        .mockResolvedValueOnce({
          data: [
            {
              id: 44,
              code: '044',
              name: 'Access Bank',
              country: 'NG',
              currency: 'NGN',
              has_branches: false,
            },
          ],
        })
        .mockResolvedValueOnce({
          data: [
            {
              id: 501,
              code: 'GH001',
              name: 'Ghana Bank',
              country: 'GH',
              currency: 'GHS',
              has_branches: true,
            },
          ],
        })
        .mockResolvedValueOnce({
          data: [
            {
              id: 'branch-1',
              branch_code: 'BR-01',
              branch_name: 'Accra Central',
            },
          ],
        }),
    } as any;
    const adapter = new FlutterwavePayoutAdapter(config, client);

    await expect(
      adapter.getBanks({
        countryCode: 'NG',
        currencyCode: 'NGN',
        method: 'BANK_TRANSFER' as any,
      }),
    ).resolves.toEqual([
      expect.objectContaining({
        code: '044',
        name: 'Access Bank',
        country: 'NG',
        currency: 'NGN',
      }),
    ]);
    await expect(
      adapter.getBanks({
        countryCode: 'GH',
        currencyCode: 'GHS',
        method: 'BANK_TRANSFER' as any,
      }),
    ).resolves.toEqual([
      expect.objectContaining({
        code: 'GH001',
        name: 'Ghana Bank',
        country: 'GH',
        currency: 'GHS',
        hasBranches: true,
      }),
    ]);
    expect(client.get).toHaveBeenNthCalledWith(1, '/banks/NG');
    expect(client.get).toHaveBeenNthCalledWith(2, '/banks/GH');
    await expect(
      adapter.getBranches({
        countryCode: 'GH',
        currencyCode: 'GHS',
        method: 'BANK_TRANSFER' as any,
        bankId: '501',
      }),
    ).resolves.toEqual([
      expect.objectContaining({
        id: 'branch-1',
        code: 'BR-01',
        name: 'Accra Central',
        bankId: '501',
      }),
    ]);
    expect(client.get).toHaveBeenNthCalledWith(3, '/banks/501/branches');
  });

  it('rejects malformed bank and branch list payloads', async () => {
    const client = {
      get: jest
        .fn()
        .mockResolvedValueOnce({ data: null })
        .mockResolvedValueOnce({ data: null }),
    } as any;
    const adapter = new FlutterwavePayoutAdapter(config, client);

    await expect(
      adapter.getBanks({
        countryCode: 'NG',
        currencyCode: 'NGN',
        method: 'BANK_TRANSFER' as any,
      }),
    ).rejects.toThrow(/BANK_LIST_PROVIDER_RESPONSE_INVALID/);
    await expect(
      adapter.getBranches({
        countryCode: 'GH',
        currencyCode: 'GHS',
        method: 'BANK_TRANSFER' as any,
        bankId: '501',
      }),
    ).rejects.toThrow(/BRANCH_LIST_PROVIDER_RESPONSE_INVALID/);
  });

  it.each([
    ['GB', 'GBP'],
    ['US', 'USD'],
    ['CA', 'CAD'],
  ])(
    'does not call a bank-list endpoint for unsupported %s catalogs',
    async (countryCode, currencyCode) => {
      const client = { get: jest.fn() } as any;
      const adapter = new FlutterwavePayoutAdapter(config, client);

      await expect(
        adapter.getBanks({
          countryCode,
          currencyCode,
          method: 'BANK_TRANSFER' as any,
        }),
      ).rejects.toThrow(/BANK_LIST_LOOKUP_UNSUPPORTED/);
      expect(client.get).not.toHaveBeenCalled();
    },
  );

  it.each([
    ['GB', 'GBP'],
    ['US', 'USD'],
    ['CA', 'CAD'],
  ])(
    'supports verified %s payout corridor when enabled',
    (countryCode, currencyCode) => {
      const routes = [
        'NG:NGN:BANK_TRANSFER',
        'GB:GBP:BANK_TRANSFER',
        'US:USD:BANK_TRANSFER',
        'CA:CAD:BANK_TRANSFER',
      ].join(',');
      const enabledConfig = {
        get: jest.fn((name: string) => {
          if (name === 'FLUTTERWAVE_PAYOUT_ENABLED') return 'true';
          if (name === 'FLUTTERWAVE_PAYOUT_ENVIRONMENT') return 'sandbox';
          if (name === 'FLUTTERWAVE_PAYOUT_SUPPORTED_ROUTES') return routes;
          return undefined;
        }),
      } as unknown as ConfigService;
      const adapter = new FlutterwavePayoutAdapter(enabledConfig, {} as any);

      expect(
        adapter.supportsPayout({
          countryCode,
          currencyCode,
          paymentMethod: 'BANK_TRANSFER' as any,
          beneficiaryType: 'BANK_ACCOUNT',
        }),
      ).toBe(true);
    },
  );

  it.each([
    ['FR', 'EUR'],
    ['JP', 'JPY'],
  ])(
    'keeps unsupported %s payout corridor disabled',
    (countryCode, currencyCode) => {
      const routes = [
        'NG:NGN:BANK_TRANSFER',
        'GB:GBP:BANK_TRANSFER',
        'US:USD:BANK_TRANSFER',
        'CA:CAD:BANK_TRANSFER',
      ].join(',');
      const enabledConfig = {
        get: jest.fn((name: string) => {
          if (name === 'FLUTTERWAVE_PAYOUT_ENABLED') return 'true';
          if (name === 'FLUTTERWAVE_PAYOUT_ENVIRONMENT') return 'sandbox';
          if (name === 'FLUTTERWAVE_PAYOUT_SUPPORTED_ROUTES') return routes;
          return undefined;
        }),
      } as unknown as ConfigService;
      const adapter = new FlutterwavePayoutAdapter(enabledConfig, {} as any);

      expect(
        adapter.supportsPayout({
          countryCode,
          currencyCode,
          paymentMethod: 'BANK_TRANSFER' as any,
          beneficiaryType: 'BANK_ACCOUNT',
        }),
      ).toBe(false);
    },
  );
});
