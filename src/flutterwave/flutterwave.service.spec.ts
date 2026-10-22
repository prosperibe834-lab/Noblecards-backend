import { FlutterwaveService } from './flutterwave.service';

describe('FlutterwaveService read-only health check', () => {
  const originalSecret = process.env.FLUTTERWAVE_SECRET_KEY;
  let service: FlutterwaveService;

  beforeEach(() => {
    process.env.FLUTTERWAVE_SECRET_KEY = 'test-only-secret';
    service = new FlutterwaveService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalSecret === undefined) {
      delete process.env.FLUTTERWAVE_SECRET_KEY;
    } else {
      process.env.FLUTTERWAVE_SECRET_KEY = originalSecret;
    }
  });

  it('uses the existing read-only bank list endpoint without a payment request', async () => {
    const fetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ id: 1 }] }),
    } as Response);

    await expect(service.checkReadOnlyApiAvailability()).resolves.toBe(
      'API reachable',
    );
    expect(fetch).toHaveBeenCalledWith(
      'https://api.flutterwave.com/v3/banks/NG',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(fetch.mock.calls[0][1]).not.toHaveProperty('body');
  });

  it('reports missing configuration and provider failures without leaking details', async () => {
    delete process.env.FLUTTERWAVE_SECRET_KEY;
    await expect(service.checkReadOnlyApiAvailability()).resolves.toBe(
      'Not configured',
    );

    process.env.FLUTTERWAVE_SECRET_KEY = 'test-only-secret';
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('network detail'));
    service = new FlutterwaveService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
    await expect(service.checkReadOnlyApiAvailability()).resolves.toBe(
      'Unavailable',
    );
  });
});
