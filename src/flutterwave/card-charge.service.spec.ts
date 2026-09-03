import { FlutterwaveService } from './flutterwave.service';
import { createDecipheriv } from 'node:crypto';

describe('FlutterwaveService card charges', () => {
  it('sends the v3 card charge contract without logging or storing card data', async () => {
    const originalEncryptionKey = process.env.FLW_ENCRYPTION_KEY;
    process.env.FLW_ENCRYPTION_KEY = '123456789012345678901234';

    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'user@example.com',
          phone: '+15551234567',
          firstName: 'Test',
          lastName: 'User',
        }),
      },
    } as any;
    const service = new FlutterwaveService(
      prisma,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
    const request = jest.spyOn(service as any, 'request').mockResolvedValue({
      status: 'success',
      data: {
        id: 987654,
        tx_ref: 'DPT-CARD-1',
        flw_ref: 'FLW-CARD-1',
        amount: 154500,
        currency: 'NGN',
        meta: { authorization: { redirect: 'https://secure.flutterwave.com/authorize/1' } },
      },
    });
    const logger = jest.spyOn((service as any).logger, 'log');

    try {
      const result = await service.createCardCharge({
        amount: 154500,
        currency: 'NGN',
        reference: 'DPT-CARD-1',
        userId: 'user-1',
        walletId: 'wallet-1',
        depositId: 'deposit-1',
        card: {
          cardNumber: '4242424242424242',
          cvv: '123',
          expiryMonth: '12',
          expiryYear: '30',
          cardHolderName: 'Test User',
        },
      });

      const requestBody = request.mock.calls[0][2] as { client: string };
      const decipher = createDecipheriv(
        'des-ede3',
        Buffer.from(process.env.FLW_ENCRYPTION_KEY!, 'utf8'),
        null,
      );
      const decryptedPayload = JSON.parse(Buffer.concat([
        decipher.update(Buffer.from(requestBody.client, 'base64')),
        decipher.final(),
      ]).toString('utf8'));

      expect(request).toHaveBeenCalledWith('/charges?type=card', 'POST', {
        client: expect.any(String),
      });
      expect(decryptedPayload).toMatchObject({
        card_number: '4242424242424242',
        cvv: '123',
        expiry_month: '12',
        expiry_year: '30',
        card_holder_name: 'Test User',
        email: 'user@example.com',
        phone_number: '+15551234567',
        amount: 154500,
        currency: 'NGN',
        tx_ref: 'DPT-CARD-1',
      });
      expect(result).toMatchObject({
        providerReference: 'DPT-CARD-1',
        providerTransactionId: '987654',
        authorizationUrl: 'https://secure.flutterwave.com/authorize/1',
      });
      expect(logger.mock.calls.flat().join(' ')).not.toContain('4242424242424242');
      expect(logger.mock.calls.flat().join(' ')).not.toContain('cvv');
      expect(logger.mock.calls.flat().join(' ')).not.toContain('expiry_month');
    } finally {
      if (originalEncryptionKey === undefined) {
        delete process.env.FLW_ENCRYPTION_KEY;
      } else {
        process.env.FLW_ENCRYPTION_KEY = originalEncryptionKey;
      }
    }
  });

  it('fails clearly when FLW_ENCRYPTION_KEY is missing', async () => {
    const originalEncryptionKey = process.env.FLW_ENCRYPTION_KEY;
    delete process.env.FLW_ENCRYPTION_KEY;

    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'user@example.com',
        }),
      },
    } as any;
    const service = new FlutterwaveService(prisma, {} as any, {} as any, {} as any, {} as any);

    try {
      await expect(service.createCardCharge({
        amount: 100,
        currency: 'NGN',
        reference: 'DPT-CARD-2',
        userId: 'user-1',
        walletId: 'wallet-1',
        depositId: 'deposit-2',
        card: {
          cardNumber: '4242424242424242',
          cvv: '123',
          expiryMonth: '12',
          expiryYear: '30',
          cardHolderName: 'Test User',
        },
      })).rejects.toThrow(/FLW_ENCRYPTION_KEY/i);
    } finally {
      if (originalEncryptionKey === undefined) {
        delete process.env.FLW_ENCRYPTION_KEY;
      } else {
        process.env.FLW_ENCRYPTION_KEY = originalEncryptionKey;
      }
    }
  });
});
