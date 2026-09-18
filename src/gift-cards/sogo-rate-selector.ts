import { BadRequestException } from '@nestjs/common';

export interface SogoRateSelectionInput {
  slug: string;
  cardCurrency: string;
  cardType: string;
  receiptType?: string;
  payoutCurrency: string;
  cardAmount: number;
}

export interface SogoRateSelection {
  rate: number;
  raw: unknown;
}

const aliases = {
  slug: ['slug', 'brand_slug', 'brandSlug'],
  cardCurrency: ['card_currency', 'cardCurrency', 'currency'],
  cardType: ['card_type', 'cardType', 'type'],
  receiptType: ['receipt_type', 'receiptType', 'receipt'],
  payoutCurrency: ['payout_currency', 'payoutCurrency'],
};

const normalized = (value: unknown) => String(value ?? '').trim().toLowerCase().replace(/[-\s]/g, '_');

const valueFor = (object: Record<string, unknown>, keys: string[]) =>
  keys.map((key) => object[key]).find((value) => value !== undefined && value !== null);

const numberValue = (value: unknown) => {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : null;
};

const rangeValue = (object: Record<string, unknown>, names: string[]) => numberValue(valueFor(object, names));

function collectCandidates(value: unknown, inherited: Record<string, unknown> = {}, key?: string, expectedReceiptType?: string): Array<{ rate: number; raw: unknown; context: Record<string, unknown> }> {
  if (Array.isArray(value)) {
    const context = { ...inherited };
    if (key && /^[A-Za-z]{3}$/.test(key)) {
      if (context.cardCurrency === undefined) context.cardCurrency = key;
      else context.payoutCurrency = key;
    }
    if (key && expectedReceiptType && normalized(key) === normalized(expectedReceiptType)) context.receiptType = key;
    return value.flatMap((item) => collectCandidates(item, context, undefined, expectedReceiptType));
  }
  if (!value || typeof value !== 'object') {
    const rate = numberValue(value);
    const context = { ...inherited };
    if (key && /^[A-Za-z]{3}$/.test(key)) {
      if (context.cardCurrency === undefined) context.cardCurrency = key;
      else context.payoutCurrency = key;
    }
    if (key && ['cash_receipt', 'debit_receipt', 'no_receipt'].includes(normalized(key))) context.receiptType = key;
    if (key && expectedReceiptType && normalized(key) === normalized(expectedReceiptType)) context.receiptType = key;
    if (key && ['ecode', 'physical'].includes(normalized(key))) context.cardType = key;
    return rate == null ? [] : [{ rate, raw: value, context }];
  }

  const object = value as Record<string, unknown>;
  const context = { ...inherited };
  for (const [field, keys] of Object.entries(aliases)) {
    const fieldValue = valueFor(object, keys);
    if (fieldValue !== undefined) context[field] = fieldValue;
  }
  for (const field of ['min', 'min_amount', 'minAmount', 'minimum_amount', 'minimumAmount', 'max', 'max_amount', 'maxAmount', 'maximum_amount', 'maximumAmount']) {
    if (object[field] !== undefined) context[field] = object[field];
  }
  if (key && /^[A-Za-z]{3}$/.test(key)) {
    if (context.cardCurrency === undefined) context.cardCurrency = key;
    else context.payoutCurrency = key;
  }
  if (key && context.slug === undefined && !['data', 'rates', 'rate'].includes(normalized(key))) context.slug = key;
  if (key && ['cash_receipt', 'debit_receipt', 'no_receipt'].includes(normalized(key))) context.receiptType = key;
  if (key && ['ecode', 'physical'].includes(normalized(key))) context.cardType = key;
  if (key && expectedReceiptType && normalized(key) === normalized(expectedReceiptType)) context.receiptType = key;

  const directRate = numberValue(valueFor(object, ['rate', 'provider_rate', 'providerRate', 'value', 'payout_rate', 'payoutRate']));
  const candidates = directRate == null ? [] : [{ rate: directRate, raw: value, context }];
  if (candidates.length) return candidates;
  return [
    ...Object.entries(object).flatMap(([childKey, childValue]) => collectCandidates(childValue, context, childKey, expectedReceiptType)),
  ];
}

function matches(candidate: Record<string, unknown>, input: SogoRateSelectionInput) {
  const required = [
    ['slug', input.slug],
    ['cardCurrency', input.cardCurrency],
    ['cardType', input.cardType],
    ['payoutCurrency', input.payoutCurrency],
  ] as const;
  if (required.some(([field, expected]) => candidate[field] !== undefined && normalized(candidate[field]) !== normalized(expected))) return false;
  if (input.receiptType && candidate.receiptType !== undefined && normalized(candidate.receiptType) !== normalized(input.receiptType)) return false;
  if (input.receiptType && candidate.receiptType === undefined) return false;
  if (!input.receiptType && candidate.receiptType !== undefined) return false;
  return true;
}

export function selectSogoRate(response: unknown, input: SogoRateSelectionInput): SogoRateSelection {
  const candidates = collectCandidates(response, {}, undefined, input.receiptType)
    .filter(({ context }) => matches(context, input))
    .filter(({ context }) => {
      const minimum = rangeValue(context, ['min', 'min_amount', 'minAmount', 'minimum_amount', 'minimumAmount']);
      const maximum = rangeValue(context, ['max', 'max_amount', 'maxAmount', 'maximum_amount', 'maximumAmount']);
      return (minimum == null || input.cardAmount >= minimum) && (maximum == null || input.cardAmount <= maximum);
    });

  const ranged = candidates.filter(({ context }) => rangeValue(context, ['min', 'min_amount', 'minAmount', 'minimum_amount', 'minimumAmount']) != null || rangeValue(context, ['max', 'max_amount', 'maxAmount', 'maximum_amount', 'maximumAmount']) != null);
  const applicable = ranged.length ? ranged : candidates;
  if (applicable.length !== 1) {
    throw new BadRequestException('Unsupported gift card rate combination.');
  }
  return { rate: applicable[0].rate, raw: applicable[0].raw };
}