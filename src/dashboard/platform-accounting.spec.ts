import { Decimal } from '@prisma/client-runtime-utils';
import {
  recordPlatformEarning,
  recordPlatformBuySettlement,
  reversePlatformEarning,
  type PlatformAccountingCreateManyArgs,
  type PlatformAccountingReversalTransaction,
  type PlatformAccountingTransaction,
} from './platform-accounting';

describe('recordPlatformEarning', () => {
  it('writes an idempotent USD-equivalent fee record', async () => {
    const writes: PlatformAccountingCreateManyArgs[] = [];
    const tx: PlatformAccountingTransaction = {
      platformAccountingEntry: {
        createMany: (args) => {
          writes.push(args);
          return Promise.resolve({ count: 1 });
        },
      },
    };
    const occurredAt = new Date('2026-10-14T12:00:00.000Z');

    await recordPlatformEarning(tx, {
      sourceType: 'DEPOSIT',
      sourceId: 'deposit-1',
      amount: '2.50',
      currencyCode: 'NGN',
      usdAmount: '0.00192308',
      occurredAt,
    });

    expect(writes).toHaveLength(1);
    expect(writes[0]).toMatchObject({
      data: [
        {
          idempotencyKey: 'DEPOSIT:deposit-1:fee-revenue',
          sourceType: 'DEPOSIT',
          sourceId: 'deposit-1',
          entryType: 'FEE_REVENUE',
          currencyCode: 'NGN',
          occurredAt,
        },
      ],
      skipDuplicates: true,
    });
    expect(writes[0].data[0].amount.toFixed(2)).toBe('2.50');
    expect(writes[0].data[0].usdAmount.toFixed(8)).toBe('0.00192308');
  });

  it('does not record zero or invalid amounts', async () => {
    let wasCalled = false;
    const tx: PlatformAccountingTransaction = {
      platformAccountingEntry: {
        createMany: () => {
          wasCalled = true;
          return Promise.resolve({ count: 1 });
        },
      },
    };
    await recordPlatformEarning(tx, {
      sourceType: 'DEPOSIT',
      sourceId: 'deposit-1',
      amount: '0',
      currencyCode: 'USD',
      usdAmount: '0',
      occurredAt: new Date(),
    });

    expect(wasCalled).toBe(false);
  });
});

describe('recordPlatformBuySettlement', () => {
  it('records the actual USD provider cost and the net purchase margin idempotently', async () => {
    const writes: PlatformAccountingCreateManyArgs[] = [];
    const tx: PlatformAccountingTransaction = {
      platformAccountingEntry: {
        createMany: (args) => {
          writes.push(args);
          return Promise.resolve({ count: 2 });
        },
      },
    };
    const occurredAt = new Date('2026-10-16T10:00:00.000Z');

    await recordPlatformBuySettlement(tx, {
      sourceId: 'purchase-1',
      customerAmountUsd: new Decimal('12.50'),
      providerCostUsd: '10.13',
      occurredAt,
    });

    expect(writes).toHaveLength(1);
    expect(writes[0]).toMatchObject({
      data: [
        {
          idempotencyKey: 'GIFT_CARD_PURCHASE:purchase-1:provider-cost',
          sourceType: 'GIFT_CARD_PURCHASE',
          sourceId: 'purchase-1',
          entryType: 'PROVIDER_COST',
          currencyCode: 'USD',
          occurredAt,
        },
        {
          idempotencyKey: 'GIFT_CARD_PURCHASE:purchase-1:platform-margin',
          sourceType: 'GIFT_CARD_PURCHASE',
          sourceId: 'purchase-1',
          entryType: 'PLATFORM_MARGIN',
          currencyCode: 'USD',
          occurredAt,
        },
      ],
      skipDuplicates: true,
    });
    expect(writes[0].data[0].amount.toFixed(2)).toBe('10.13');
    expect(writes[0].data[0].usdAmount.toFixed(2)).toBe('10.13');
    expect(writes[0].data[1].amount.toFixed(2)).toBe('2.37');
    expect(writes[0].data[1].usdAmount.toFixed(2)).toBe('2.37');
  });

  it('records a negative margin when actual provider cost exceeds the USD customer charge', async () => {
    const writes: PlatformAccountingCreateManyArgs[] = [];
    const tx: PlatformAccountingTransaction = {
      platformAccountingEntry: {
        createMany: (args) => {
          writes.push(args);
          return Promise.resolve({ count: 2 });
        },
      },
    };

    await recordPlatformBuySettlement(tx, {
      sourceId: 'purchase-loss',
      customerAmountUsd: '9.99',
      providerCostUsd: '10.01',
      occurredAt: new Date(),
    });

    expect(writes[0].data[1].amount.toFixed(2)).toBe('-0.02');
    expect(writes[0].data[1].usdAmount.toFixed(2)).toBe('-0.02');
  });

  it('does not record invalid or non-positive customer charges and settlement costs', async () => {
    const createMany = jest.fn();
    const tx: PlatformAccountingTransaction = {
      platformAccountingEntry: { createMany },
    };

    await recordPlatformBuySettlement(tx, {
      sourceId: 'purchase-invalid',
      customerAmountUsd: '0',
      providerCostUsd: '10',
      occurredAt: new Date(),
    });
    await recordPlatformBuySettlement(tx, {
      sourceId: 'purchase-invalid',
      customerAmountUsd: '10',
      providerCostUsd: '0',
      occurredAt: new Date(),
    });

    expect(createMany).not.toHaveBeenCalled();
  });
});

describe('reversePlatformEarning', () => {
  it('writes one idempotent negative entry only for a previously recorded earning', async () => {
    const writes: PlatformAccountingCreateManyArgs[] = [];
    const tx: PlatformAccountingReversalTransaction = {
      platformAccountingEntry: {
        findUnique: jest.fn().mockResolvedValue({
          amount: new Decimal('1.00'),
          currencyCode: 'USD',
          usdAmount: new Decimal('1.00'),
        }),
        createMany: (args: PlatformAccountingCreateManyArgs) => {
          writes.push(args);
          return Promise.resolve({ count: 1 });
        },
      },
    };
    const occurredAt = new Date('2026-10-16T10:00:00.000Z');

    await reversePlatformEarning(tx, {
      sourceType: 'WITHDRAWAL',
      sourceId: 'withdrawal-1',
      occurredAt,
    });

    expect(tx.platformAccountingEntry.findUnique).toHaveBeenCalledWith({
      where: { idempotencyKey: 'WITHDRAWAL:withdrawal-1:fee-revenue' },
    });
    expect(writes).toHaveLength(1);
    expect(writes[0]).toMatchObject({
      data: [
        {
          idempotencyKey: 'WITHDRAWAL:withdrawal-1:fee-reversal',
          sourceType: 'WITHDRAWAL',
          sourceId: 'withdrawal-1',
          entryType: 'FEE_REVERSAL',
          currencyCode: 'USD',
          occurredAt,
        },
      ],
      skipDuplicates: true,
    });
    expect(writes[0].data[0].amount.toFixed(2)).toBe('-1.00');
    expect(writes[0].data[0].usdAmount.toFixed(2)).toBe('-1.00');
  });

  it('does not create a reversal when no original earning exists', async () => {
    const createMany = jest.fn();
    const tx = {
      platformAccountingEntry: {
        findUnique: jest.fn().mockResolvedValue(null),
        createMany,
      },
    };

    await reversePlatformEarning(tx, {
      sourceType: 'WITHDRAWAL',
      sourceId: 'withdrawal-1',
      occurredAt: new Date(),
    });

    expect(createMany).not.toHaveBeenCalled();
  });
});
