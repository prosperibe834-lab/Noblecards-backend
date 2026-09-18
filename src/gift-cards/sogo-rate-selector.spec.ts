import { BadRequestException } from '@nestjs/common';
import { selectSogoRate } from './sogo-rate-selector';

const base = {
  slug: 'amazon',
  cardCurrency: 'USD',
  cardType: 'physical',
  payoutCurrency: 'NGN',
  cardAmount: 100,
};

describe('selectSogoRate', () => {
  it('selects an eCode rate', () => {
    expect(selectSogoRate({ amazon: { USD: { ecode: { NGN: 502 } } } }, { ...base, cardType: 'ecode' }).rate).toBe(502);
  });

  it.each([
    ['cash_receipt', 605],
    ['debit_receipt', 520],
    ['no_receipt', 502],
  ])('selects the physical %s rate', (receiptType, rate) => {
    const response = { amazon: { USD: { physical: { NGN: { [receiptType]: rate } } } } };
    expect(selectSogoRate(response, { ...base, receiptType }).rate).toBe(rate);
  });

  it('selects the matching denomination range', () => {
    const response = {
      apple: { USD: { ecode: { NGN: [
        { min_amount: 1, max_amount: 50, rate: 400 },
        { min_amount: 51, max_amount: 200, rate: 450 },
      ] } } },
    };
    expect(selectSogoRate(response, { ...base, slug: 'apple', cardType: 'ecode', cardAmount: 100 }).rate).toBe(450);
  });

  it.each([
    ['vertical', 560],
    ['horizontal', 550],
  ])('selects physical %s subtype arrays without treating structural keys as receipt types', (receiptType, rate) => {
    const response = {
      apple: { AUD: { physical: { NGN: { [receiptType]: [
        { min: 1, max: 99, rate },
        { min: 100, max: 9999, rate },
      ] } } } },
    };
    expect(selectSogoRate(response, { ...base, slug: 'apple', cardCurrency: 'AUD', receiptType }).rate).toBe(rate);
  });

  it('selects scalar physical rates without inventing a receipt type from payout currency', () => {
    const response = { amex: { USD: { physical: { NGN: 500, GHS: 4.1 } } } };
    expect(selectSogoRate(response, { ...base, slug: 'amex', receiptType: undefined }).rate).toBe(500);
  });

  it('rejects an unsupported combination without a fallback rate', () => {
    expect(() => selectSogoRate({ amazon: { USD: { ecode: { NGN: 502 } } } }, { ...base, cardType: 'physical', receiptType: 'cash_receipt' })).toThrow(BadRequestException);
  });
});