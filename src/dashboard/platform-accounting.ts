import { Decimal } from '@prisma/client-runtime-utils';

type PlatformEarning = {
  sourceType: string;
  sourceId: string;
  amount: Decimal | string;
  currencyCode: string;
  usdAmount: Decimal | string;
  occurredAt: Date;
};

export type PlatformAccountingCreateManyArgs = {
  data: {
    idempotencyKey: string;
    sourceType: string;
    sourceId: string;
    entryType: string;
    amount: Decimal;
    currencyCode: string;
    usdAmount: Decimal;
    occurredAt: Date;
  }[];
  skipDuplicates: boolean;
};

export type PlatformAccountingTransaction = {
  platformAccountingEntry: {
    createMany(
      args: PlatformAccountingCreateManyArgs,
    ): Promise<{ count: number }>;
  };
};

export type PlatformAccountingReversalTransaction = {
  platformAccountingEntry: {
    findUnique(args: {
      where: { idempotencyKey: string };
    }): Promise<{
      amount: Decimal;
      currencyCode: string;
      usdAmount: Decimal;
    } | null>;
    createMany(
      args: PlatformAccountingCreateManyArgs,
    ): Promise<{ count: number }>;
  };
};

export type PlatformAccountingSettlementTransaction = PlatformAccountingTransaction;

export async function recordPlatformEarning(
  tx: PlatformAccountingTransaction,
  earning: PlatformEarning,
) {
  const amount = new Decimal(earning.amount.toString());
  const usdAmount = new Decimal(earning.usdAmount.toString());
  if (
    !amount.isFinite() ||
    !usdAmount.isFinite() ||
    amount.lte(0) ||
    usdAmount.lte(0)
  ) {
    return;
  }

  await tx.platformAccountingEntry.createMany({
    data: [
      {
        idempotencyKey: `${earning.sourceType}:${earning.sourceId}:fee-revenue`,
        sourceType: earning.sourceType,
        sourceId: earning.sourceId,
        entryType: 'FEE_REVENUE',
        amount,
        currencyCode: earning.currencyCode,
        usdAmount,
        occurredAt: earning.occurredAt,
      },
    ],
    skipDuplicates: true,
  });
}

export async function recordPlatformBuySettlement(
  tx: PlatformAccountingSettlementTransaction,
  settlement: {
    sourceId: string;
    customerAmountUsd: Decimal | string;
    providerCostUsd: Decimal | string;
    occurredAt: Date;
  },
) {
  const customerAmountUsd = new Decimal(
    settlement.customerAmountUsd.toString(),
  );
  const providerCostUsd = new Decimal(settlement.providerCostUsd.toString());
  if (
    !customerAmountUsd.isFinite() ||
    !providerCostUsd.isFinite() ||
    customerAmountUsd.lte(0) ||
    providerCostUsd.lte(0)
  ) {
    return;
  }

  const platformMarginUsd = customerAmountUsd.minus(providerCostUsd);
  await tx.platformAccountingEntry.createMany({
    data: [
      {
        idempotencyKey: `GIFT_CARD_PURCHASE:${settlement.sourceId}:provider-cost`,
        sourceType: 'GIFT_CARD_PURCHASE',
        sourceId: settlement.sourceId,
        entryType: 'PROVIDER_COST',
        amount: providerCostUsd,
        currencyCode: 'USD',
        usdAmount: providerCostUsd,
        occurredAt: settlement.occurredAt,
      },
      {
        idempotencyKey: `GIFT_CARD_PURCHASE:${settlement.sourceId}:platform-margin`,
        sourceType: 'GIFT_CARD_PURCHASE',
        sourceId: settlement.sourceId,
        entryType: 'PLATFORM_MARGIN',
        amount: platformMarginUsd,
        currencyCode: 'USD',
        usdAmount: platformMarginUsd,
        occurredAt: settlement.occurredAt,
      },
    ],
    skipDuplicates: true,
  });
}

export async function reversePlatformEarning(
  tx: PlatformAccountingReversalTransaction,
  earning: Pick<PlatformEarning, 'sourceType' | 'sourceId' | 'occurredAt'>,
) {
  const idempotencyKey = `${earning.sourceType}:${earning.sourceId}:fee-revenue`;
  const original = await tx.platformAccountingEntry.findUnique({
    where: { idempotencyKey },
  });
  if (!original) return;

  const amount = new Decimal(original.amount.toString());
  const usdAmount = new Decimal(original.usdAmount.toString());
  if (
    !amount.isFinite() ||
    !usdAmount.isFinite() ||
    amount.lte(0) ||
    usdAmount.lte(0)
  ) {
    throw new Error(
      `Cannot reverse invalid platform earning ${idempotencyKey}.`,
    );
  }

  await tx.platformAccountingEntry.createMany({
    data: [
      {
        idempotencyKey: `${earning.sourceType}:${earning.sourceId}:fee-reversal`,
        sourceType: earning.sourceType,
        sourceId: earning.sourceId,
        entryType: 'FEE_REVERSAL',
        amount: amount.negated(),
        currencyCode: original.currencyCode,
        usdAmount: usdAmount.negated(),
        occurredAt: earning.occurredAt,
      },
    ],
    skipDuplicates: true,
  });
}
