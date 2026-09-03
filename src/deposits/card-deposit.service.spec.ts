import { ConfigService } from '@nestjs/config';
import { DepositsService } from './deposits.service';
import { Decimal } from '@prisma/client-runtime-utils';

describe('DepositsService card deposits', () => {
  const card = {
    cardNumber: '4242424242424242',
    cvv: '123',
    expiryMonth: '12',
    expiryYear: '30',
    cardHolderName: 'Test User',
  };

  const cases = [
    ['NGN', 1500, 154500],
    ['GHS', 12.5, 1287.5],
    ['GBP', 0.79, 81.37],
  ] as const;

  function createService(currencyCode: string, rate: number) {
    const executeRaw = jest.fn().mockResolvedValue(1);
    const queryRaw = jest.fn()
      .mockResolvedValueOnce([{ code: currencyCode, enabled: true, depositEnabled: true }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: 'wallet-1', userId: 'user-1' }]);
    const createCardCharge = jest.fn().mockResolvedValue({
      authorizationUrl: 'https://secure.flutterwave.com/authorize/card-1',
      paymentLink: null,
      providerReference: 'DPT-CARD-1',
      providerTransactionId: 'charge-1',
      meta: { paymentMethod: 'CARD' },
    });
    const prisma = { $queryRaw: queryRaw, $executeRaw: executeRaw } as any;
    const service = new DepositsService(
      prisma,
      {} as any,
      {} as any,
      {} as any,
      { createCardCharge } as any,
      { getRates: jest.fn().mockResolvedValue({ base: 'USD', rates: { [currencyCode]: rate }, updatedAt: '2026-01-01' }) } as any,
      { get: jest.fn((key: string, fallback?: number) => key === 'DEPOSIT_PROVIDER_FEE_PERCENT' ? 2 : key === 'DEPOSIT_NOBLECARDS_FEE_PERCENT' ? 1 : fallback) } as ConfigService,
    );

    return { service, executeRaw, queryRaw, createCardCharge };
  }

  it.each(cases)('creates a PENDING %s card deposit using the final local payable amount', async (currency, rate, payable) => {
    const { service, createCardCharge } = createService(currency, rate);

    const result = await service.createCardDeposit('user-1', {
      requestedAmount: 100,
      amount: payable,
      currency,
      card,
      idempotencyKey: `card-${currency}`,
    });

    expect(result.status).toBe('PENDING');
    expect(result.currency).toBe(currency);
    expect(Number(result.amount)).toBe(payable);
    expect(result.requestedAmount).toBe('100.00');
    expect(result.walletCreditAmount).toBe('100.00');
    expect(result.walletCreditCurrency).toBe('USD');
    expect(createCardCharge).toHaveBeenCalledWith(expect.objectContaining({
      amount: payable,
      currency,
      card,
    }));
  });

  it('rejects a payable amount that would require double conversion', async () => {
    const { service, createCardCharge } = createService('NGN', 1500);

    await expect(service.createCardDeposit('user-1', {
      requestedAmount: 100,
      amount: 154500 * 1500,
      currency: 'NGN',
      card,
    })).rejects.toThrow(/payable amount does not match/i);
    expect(createCardCharge).not.toHaveBeenCalled();
  });

  it('does not persist raw card details', async () => {
    const { service, executeRaw } = createService('NGN', 1500);

    await service.createCardDeposit('user-1', {
      requestedAmount: 100,
      amount: 154500,
      currency: 'NGN',
      card,
    });

    const persistedMetadata = executeRaw.mock.calls
      .flatMap((call) => call.slice(1))
      .filter((value) => typeof value === 'string' && value.includes('deposit-creation'));
    const persistedText = JSON.stringify(persistedMetadata);
    expect(persistedText).not.toContain(card.cardNumber);
    expect(persistedText).not.toContain('cardNumber');
    expect(persistedText).not.toContain('cvv');
    expect(persistedText).not.toContain('expiryMonth');
    expect(persistedText).not.toContain('expiryYear');
  });

  it('keeps the intended wallet credit in USD instead of the local payable amount', async () => {
    const { service } = createService('GBP', 0.79);

    const result = await service.createCardDeposit('user-1', {
      requestedAmount: 100,
      amount: 81.37,
      currency: 'GBP',
      card,
    });

    expect(Number(result.netAmount)).toBe(100);
    expect(result.walletCreditAmount).toBe('100.00');
    expect(new Decimal(result.amount).toNumber()).toBe(81.37);
  });
});
