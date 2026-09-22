import { BadGatewayException, RequestTimeoutException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TopupmateClient } from './topupmate.client';

const response = (status: number, body: unknown) => ({
  ok: status >= 200 && status < 300,
  status,
  json: jest.fn().mockResolvedValue(body),
}) as any;

describe('TopupmateClient', () => {
  const config = {
    get: jest.fn((name: string) => ({
      TOPUPMATE_API_BASE_URL: 'https://connect.topupmate.com/api',
      TOPUPMATE_API_KEY: 'test-topupmate-key',
    } as Record<string, string>)[name]),
  } as unknown as ConfigService;

  beforeEach(() => jest.restoreAllMocks());

  it('gets the catalog with Token authentication and supported filters', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(response(200, { data: [] }));
    const client = new TopupmateClient(config);

    await expect(client.getAvailableGiftCards({ countryCode: 'US', productName: 'Amazon', productId: 'p-1' })).resolves.toEqual({ data: [] });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://connect.topupmate.com/api/giftcard/available/?countryCode=US&productName=Amazon&productId=p-1',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Token test-topupmate-key' }),
      }),
    );
  });

  it.each([400, 401, 403, 404, 409, 422, 429, 500, 503])('maps provider HTTP %s without exposing the API key', async (status) => {
    jest.spyOn(global, 'fetch').mockResolvedValue(response(status, { message: 'provider failure', secret: 'must-not-return' }));
    const client = new TopupmateClient(config);

    try {
      await client.getAvailableGiftCards({});
      throw new Error('expected request to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(BadGatewayException);
      expect(JSON.stringify(error)).not.toContain('test-topupmate-key');
    }
  });

  it('fails closed when configuration is missing', async () => {
    const missingConfig = { get: jest.fn().mockReturnValue(undefined) } as unknown as ConfigService;
    await expect(new TopupmateClient(missingConfig).getAvailableGiftCards({})).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('maps network timeouts', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(Object.assign(new Error('aborted'), { name: 'AbortError' }));
    await expect(new TopupmateClient(config).getAvailableGiftCards({})).rejects.toBeInstanceOf(RequestTimeoutException);
  });
});
