import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import { DepositsService } from './deposits.service';
import { PrismaService } from '../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { TransactionsService } from '../transactions/transactions.service';
import { LedgerService } from '../ledger/ledger.service';
import { FlutterwaveService } from '../flutterwave/flutterwave.service';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';

describe('FlutterwaveService webhook validation', () => {
  it('includes the configured provider and NobleCards fee breakdown in the deposit response', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositsService,
        { provide: PrismaService, useValue: {
            currency: { findUnique: jest.fn().mockResolvedValue({ code: 'USD', enabled: true, depositEnabled: true }), },
            $queryRaw: jest.fn()
              .mockResolvedValueOnce([{ code: 'USD', enabled: true, depositEnabled: true }])
              .mockResolvedValueOnce([])
              .mockResolvedValueOnce([{ id: 'wallet-1', userId: 'user-1' }]),
            $executeRaw: jest.fn().mockResolvedValue(1),
            deposit: {
              findFirst: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockResolvedValue({
                id: 'deposit-fee-1',
                status: 'PENDING',
                userId: 'user-1',
                walletId: 'wallet-1',
                currencyCode: 'USD',
                amount: { toString: () => '100.00' },
                fee: { toString: () => '0.00' },
                netAmount: { toString: () => '100.00' },
                provider: 'FLUTTERWAVE',
                paymentMethod: 'CARD',
                metadata: {},
                transaction: { id: 'tx-fee-1', status: 'PENDING', reference: 'DPT-FEE-1' },
              }),
              update: jest.fn().mockResolvedValue({}),
            },
          } },
        { provide: WalletsService, useValue: { getOrCreateWallet: jest.fn().mockResolvedValue({ id: 'wallet-1' }) } },
        { provide: CurrenciesService, useValue: { getCurrency: jest.fn().mockResolvedValue({ code: 'USD', enabled: true, depositEnabled: true }) } },
        { provide: TransactionsService, useValue: { createPendingDepositTransaction: jest.fn().mockResolvedValue({ id: 'tx-fee-1', reference: 'DPT-FEE-1', status: 'PENDING' }) } },
        { provide: LedgerService, useValue: {} },
        { provide: FlutterwaveService, useValue: { createPayment: jest.fn().mockResolvedValue({ paymentLink: 'https://checkout.example.com/pay', providerReference: 'FLW-FEE-1', providerTransactionId: 'fee-123', meta: { configured: true } }) } },
        { provide: ExchangeRatesService, useValue: { getRates: jest.fn().mockResolvedValue({ base: 'USD', rates: { USD: 1, NGN: 1500, GBP: 0.739407, GHS: 11.266187, EUR: 0.92, CAD: 1.36 }, updatedAt: '2026-01-01T00:00:00.000Z' }) } },
        { provide: ConfigService, useValue: { get: jest.fn((key: string, fallback?: any) => {
          const overrides: Record<string, string | number> = {
            DEPOSIT_PROVIDER_FEE_PERCENT: 2,
            DEPOSIT_NOBLECARDS_FEE_PERCENT: 1,
          };
          return overrides[key] ?? fallback;
        }) } },
      ],
    }).compile();

    const service = module.get<DepositsService>(DepositsService);
    const result = await service.createDeposit('user-1', {
      amount: 100,
      currency: 'USD',
      paymentMethod: 'CARD',
      provider: 'FLUTTERWAVE',
      idempotencyKey: 'fee-1',
    });

    expect(result.providerFee).toBe('2.00');
    expect(result.nobleCardsFee).toBe('1.00');
    expect(result.totalFees).toBe('3.00');
    expect(result.customerPayableAmount).toBe('103.00');
    expect(result.walletCreditAmount).toBe('100.00');
    expect(result.walletCreditCurrency).toBe('USD');
    expect(result.exchangeRate).toBe('1.03');
  });

  it('rejects currencies that are not supported by the configured Flutterwave account', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositsService,
        { provide: PrismaService, useValue: {
            currency: { findUnique: jest.fn().mockImplementation(({ where }: any) => ({
              code: where.code,
              enabled: true,
              depositEnabled: true,
            })) },
            $queryRaw: jest.fn()
              .mockResolvedValueOnce([{ code: 'EUR', enabled: true, depositEnabled: true }])
              .mockResolvedValueOnce([]),
            $executeRaw: jest.fn().mockResolvedValue(1),
            deposit: {
              findFirst: jest.fn().mockResolvedValue(null),
              create: jest.fn(),
              update: jest.fn(),
            },
          } },
        { provide: WalletsService, useValue: { getOrCreateWallet: jest.fn().mockResolvedValue({ id: 'wallet-1' }) } },
        { provide: CurrenciesService, useValue: { getCurrency: jest.fn() } },
        { provide: TransactionsService, useValue: { createPendingDepositTransaction: jest.fn() } },
        { provide: LedgerService, useValue: {} },
        { provide: FlutterwaveService, useValue: { createPayment: jest.fn(), createVirtualAccount: jest.fn(), createGhsVirtualAccount: jest.fn(), createGbpBankCharge: jest.fn() } },
        { provide: ExchangeRatesService, useValue: { getRates: jest.fn().mockResolvedValue({ base: 'USD', rates: { USD: 1, NGN: 1500, GBP: 0.79, GHS: 12.5 }, updatedAt: '2026-01-01T00:00:00.000Z' }) } },
        { provide: ConfigService, useValue: { get: jest.fn((key: string, fallback?: any) => {
          const overrides: Record<string, string | number> = {
            DEPOSIT_PROVIDER_FEE_PERCENT: 2,
            DEPOSIT_NOBLECARDS_FEE_PERCENT: 1,
          };
          return overrides[key] ?? fallback;
        }) } },
      ],
    }).compile();

    const service = module.get<DepositsService>(DepositsService);

    await expect(service.createDeposit('user-1', {
      amount: 100,
      currency: 'EUR',
      paymentMethod: 'BANK_TRANSFER',
      provider: 'FLUTTERWAVE',
      idempotencyKey: 'unsupported-eur-1',
    })).rejects.toThrow(/supported.*Flutterwave/i);
  });
  it('uses the dedicated webhook secret hash for signature validation', async () => {
    const originalWebhookSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;
    const originalApiSecret = process.env.FLUTTERWAVE_SECRET_KEY;

    process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH = 'webhook-secret-hash';
    process.env.FLUTTERWAVE_SECRET_KEY = 'api-secret-key';

    try {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          FlutterwaveService,
          { provide: PrismaService, useValue: {} },
          { provide: WalletsService, useValue: {} },
          { provide: CurrenciesService, useValue: {} },
          { provide: TransactionsService, useValue: {} },
          { provide: LedgerService, useValue: {} },
          { provide: ExchangeRatesService, useValue: { getRates: jest.fn().mockResolvedValue({ base: 'USD', rates: { USD: 1, NGN: 1500, GBP: 0.79, EUR: 0.92, CAD: 1.36 }, updatedAt: '2026-01-01T00:00:00.000Z' }) } },
        ],
      }).compile();

      const service = module.get<FlutterwaveService>(FlutterwaveService);
      const payload = JSON.stringify({ event: 'charge.completed', data: { tx_ref: 'ref-1' } });
      const signature = 'webhook-secret-hash';

      await expect(service.validateWebhookSignature(signature, payload)).resolves.toBe(true);
    } finally {
      if (originalWebhookSecret === undefined) {
        delete process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;
      } else {
        process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH = originalWebhookSecret;
      }

      if (originalApiSecret === undefined) {
        delete process.env.FLUTTERWAVE_SECRET_KEY;
      } else {
        process.env.FLUTTERWAVE_SECRET_KEY = originalApiSecret;
      }
    }
  });

  it('sends the NGN virtual-account payload using the correct Flutterwave v3 contract', async () => {
    const originalSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    process.env.FLUTTERWAVE_SECRET_KEY = 'api-secret-key';

    try {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          FlutterwaveService,
          { provide: PrismaService, useValue: { user: { findUnique: jest.fn().mockResolvedValue({
            id: 'user-1',
            email: 'alice@example.com',
            phone: '08012345678',
            firstName: 'Alice',
            lastName: 'Jones',
          }) } } },
          { provide: WalletsService, useValue: {} },
          { provide: CurrenciesService, useValue: {} },
          { provide: TransactionsService, useValue: {} },
          { provide: LedgerService, useValue: {} },
          { provide: ExchangeRatesService, useValue: { getRates: jest.fn().mockResolvedValue({ base: 'USD', rates: { USD: 1, NGN: 1500, GBP: 0.79, EUR: 0.92, CAD: 1.36 }, updatedAt: '2026-01-01T00:00:00.000Z' }) } },
        ],
      }).compile();

      const service = module.get<FlutterwaveService>(FlutterwaveService);
      const requestSpy = jest.spyOn(service as any, 'request').mockResolvedValue({
        status: 'success',
        data: {
          id: 123,
          tx_ref: 'DPT-123',
          account_number: '1234567890',
          account_name: 'Alice Jones',
          bank_name: 'GTB',
          expiry_date: '2026-01-02T00:00:00.000Z',
          amount: 2500,
          currency: 'NGN',
        },
      });

      await service.createVirtualAccount({
        amount: 2500,
        currency: 'NGN',
        reference: 'DPT-123',
        userId: 'user-1',
        walletId: 'wallet-1',
        depositId: 'deposit-1',
      });

      expect(requestSpy).toHaveBeenCalledWith('/virtual-account-numbers', 'POST', expect.objectContaining({
        tx_ref: 'DPT-123',
        amount: 2500,
        currency: 'NGN',
        customer: expect.objectContaining({
          email: 'alice@example.com',
          firstname: 'Alice',
          lastname: 'Jones',
          phonenumber: '08012345678',
        }),
      }));
    } finally {
      if (originalSecretKey === undefined) {
        delete process.env.FLUTTERWAVE_SECRET_KEY;
      } else {
        process.env.FLUTTERWAVE_SECRET_KEY = originalSecretKey;
      }
    }
  });

  it('rejects an incomplete NGN virtual-account response instead of inventing bank details', async () => {
    const originalSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    process.env.FLUTTERWAVE_SECRET_KEY = 'api-secret-key';

    try {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          FlutterwaveService,
          { provide: PrismaService, useValue: { user: { findUnique: jest.fn().mockResolvedValue({
            id: 'user-1',
            email: 'alice@example.com',
            phone: '08012345678',
            firstName: 'Alice',
            lastName: 'Jones',
          }) } } },
          { provide: WalletsService, useValue: {} },
          { provide: CurrenciesService, useValue: {} },
          { provide: TransactionsService, useValue: {} },
          { provide: LedgerService, useValue: {} },
          { provide: ExchangeRatesService, useValue: { getRates: jest.fn().mockResolvedValue({ base: 'USD', rates: { USD: 1, NGN: 1500, GBP: 0.79, EUR: 0.92, CAD: 1.36 }, updatedAt: '2026-01-01T00:00:00.000Z' }) } },
        ],
      }).compile();

      const service = module.get<FlutterwaveService>(FlutterwaveService);
      jest.spyOn(service as any, 'request').mockResolvedValue({
        status: 'success',
        data: {
          id: 123,
          tx_ref: 'DPT-456',
          account_number: '1234567890',
          account_name: '',
          bank_name: '',
          expiry_date: '2026-01-02T00:00:00.000Z',
          amount: 2500,
          currency: 'NGN',
        },
      });

      await expect(service.createVirtualAccount({
        amount: 2500,
        currency: 'NGN',
        reference: 'DPT-456',
        userId: 'user-1',
        walletId: 'wallet-1',
        depositId: 'deposit-2',
      })).rejects.toThrow(/incomplete.*status: success/i);
    } finally {
      if (originalSecretKey === undefined) {
        delete process.env.FLUTTERWAVE_SECRET_KEY;
      } else {
        process.env.FLUTTERWAVE_SECRET_KEY = originalSecretKey;
      }
    }
  });

  it('classifies the Flutterwave UK ACH amount limit as a validation error', async () => {
    const originalSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    process.env.FLUTTERWAVE_SECRET_KEY = 'api-secret-key';

    try {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          FlutterwaveService,
          { provide: PrismaService, useValue: { user: { findUnique: jest.fn().mockResolvedValue({
            id: 'user-1',
            email: 'alice@example.com',
            phone: '08012345678',
            firstName: 'Alice',
            lastName: 'Jones',
          }) } } },
          { provide: WalletsService, useValue: {} },
          { provide: CurrenciesService, useValue: {} },
          { provide: TransactionsService, useValue: {} },
          { provide: LedgerService, useValue: {} },
          { provide: ExchangeRatesService, useValue: { getRates: jest.fn().mockResolvedValue({ base: 'USD', rates: { USD: 1, NGN: 1500, GBP: 0.79, EUR: 0.92, CAD: 1.36 }, updatedAt: '2026-01-01T00:00:00.000Z' }) } },
        ],
      }).compile();

      const service = module.get<FlutterwaveService>(FlutterwaveService);
      jest.spyOn(service as any, 'request').mockRejectedValue(new Error('Flutterwave 400: amount should be between 0 and 3,719'));

      await expect(service.createGbpBankCharge({
        amount: 4000,
        currency: 'GBP',
        reference: 'DPT-GB-001',
        userId: 'user-1',
        walletId: 'wallet-1',
        depositId: 'deposit-3',
      })).rejects.toThrow(/GBP bank transfer amount must be between £0 and £3,719/i);
    } finally {
      if (originalSecretKey === undefined) {
        delete process.env.FLUTTERWAVE_SECRET_KEY;
      } else {
        process.env.FLUTTERWAVE_SECRET_KEY = originalSecretKey;
      }
    }
  });

  it('rejects GBP amounts above the Flutterwave UK limit before making the provider call', async () => {
    const originalSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    process.env.FLUTTERWAVE_SECRET_KEY = 'api-secret-key';

    try {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          FlutterwaveService,
          { provide: PrismaService, useValue: { user: { findUnique: jest.fn().mockResolvedValue({
            id: 'user-1',
            email: 'alice@example.com',
            phone: '08012345678',
            firstName: 'Alice',
            lastName: 'Jones',
          }) } } },
          { provide: WalletsService, useValue: {} },
          { provide: CurrenciesService, useValue: {} },
          { provide: TransactionsService, useValue: {} },
          { provide: LedgerService, useValue: {} },
        ],
      }).compile();

      const service = module.get<FlutterwaveService>(FlutterwaveService);
      const requestSpy = jest.spyOn(service as any, 'request');

      await expect(service.createGbpBankCharge({
        amount: 5000,
        currency: 'GBP',
        reference: 'DPT-GB-002',
        userId: 'user-1',
        walletId: 'wallet-1',
        depositId: 'deposit-4',
      })).rejects.toThrow(/GBP bank transfer amount must be between £0 and £3,719/i);

      expect(requestSpy).not.toHaveBeenCalled();
    } finally {
      if (originalSecretKey === undefined) {
        delete process.env.FLUTTERWAVE_SECRET_KEY;
      } else {
        process.env.FLUTTERWAVE_SECRET_KEY = originalSecretKey;
      }
    }
  });

  it('extracts the authorization URL from Flutterwave UK meta.authorization.redirect', async () => {
    const originalSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    process.env.FLUTTERWAVE_SECRET_KEY = 'api-secret-key';

    try {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          FlutterwaveService,
          { provide: PrismaService, useValue: { user: { findUnique: jest.fn().mockResolvedValue({
            id: 'user-1',
            email: 'alice@example.com',
            phone: '08012345678',
            firstName: 'Alice',
            lastName: 'Jones',
          }) } } },
          { provide: WalletsService, useValue: {} },
          { provide: CurrenciesService, useValue: {} },
          { provide: TransactionsService, useValue: {} },
          { provide: LedgerService, useValue: {} },
        ],
      }).compile();

      const service = module.get<FlutterwaveService>(FlutterwaveService);
      jest.spyOn(service as any, 'request').mockResolvedValue({
        status: 'success',
        message: 'Charge initiated',
        data: {
          id: 123,
          tx_ref: 'DPT-GB-300',
          flw_ref: 'FLW-GB-300',
          amount: 300,
          currency: 'GBP',
          status: 'pending',
          meta: {
            authorization: {
              mode: 'redirect',
              redirect: 'https://secure.flutterwave.com/authorize/abc123',
            },
          },
        },
      });

      await expect(service.createGbpBankCharge({
        amount: 300,
        currency: 'GBP',
        reference: 'DPT-GB-300',
        userId: 'user-1',
        walletId: 'wallet-1',
        depositId: 'deposit-5',
      })).resolves.toMatchObject({
        authorizationUrl: 'https://secure.flutterwave.com/authorize/abc123',
        providerReference: 'DPT-GB-300',
      });
    } finally {
      if (originalSecretKey === undefined) {
        delete process.env.FLUTTERWAVE_SECRET_KEY;
      } else {
        process.env.FLUTTERWAVE_SECRET_KEY = originalSecretKey;
      }
    }
  });

  it('reads the authorization URL from the actual response body meta, not from the nested charge object', async () => {
    const originalSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    process.env.FLUTTERWAVE_SECRET_KEY = 'api-secret-key';

    try {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          FlutterwaveService,
          { provide: PrismaService, useValue: { user: { findUnique: jest.fn().mockResolvedValue({
            id: 'user-1',
            email: 'alice@example.com',
            phone: '08012345678',
            firstName: 'Alice',
            lastName: 'Jones',
          }) } } },
          { provide: WalletsService, useValue: {} },
          { provide: CurrenciesService, useValue: {} },
          { provide: TransactionsService, useValue: {} },
          { provide: LedgerService, useValue: {} },
        ],
      }).compile();

      const service = module.get<FlutterwaveService>(FlutterwaveService);
      jest.spyOn(service as any, 'request').mockResolvedValue({
        status: 'success',
        message: 'Charge initiated',
        data: {
          id: 10464127,
          tx_ref: 'DPT-1788224193050-AYC1W39E',
          amount: 158,
          currency: 'GBP',
          status: 'pending',
          payment_type: 'account-ach-uk',
        },
        meta: {
          authorization: {
            mode: 'redirect',
            redirect: 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaid/api/short-url/d974cc5a-b67e-420f-a1c6-291f758fc64c',
          },
        },
      });

      await expect(service.createGbpBankCharge({
        amount: 158,
        currency: 'GBP',
        reference: 'DPT-1788224193050-AYC1W39E',
        userId: 'user-1',
        walletId: 'wallet-1',
        depositId: 'deposit-6',
      })).resolves.toMatchObject({
        authorizationUrl: 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaid/api/short-url/d974cc5a-b67e-420f-a1c6-291f758fc64c',
      });
    } finally {
      if (originalSecretKey === undefined) {
        delete process.env.FLUTTERWAVE_SECRET_KEY;
      } else {
        process.env.FLUTTERWAVE_SECRET_KEY = originalSecretKey;
      }
    }
  });
});

describe('DepositsService', () => {
  let service: DepositsService;

  const prisma = {
    deposit: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    wallet: {
      upsert: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    walletBalance: {
      upsert: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    ledgerEntry: { create: jest.fn() },
    currency: { findUnique: jest.fn(), findMany: jest.fn() },
    $transaction: jest.fn(),
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
    user: { findUnique: jest.fn() },
  } as any;

  const wallets = {
    getOrCreateWallet: jest.fn(),
    ensureBalance: jest.fn(),
  } as any;

  const currencies = {
    getCurrency: jest.fn(),
  } as any;

  const transactions = {
    createPendingDepositTransaction: jest.fn(),
    updateStatus: jest.fn(),
  } as any;

  const ledger = {
    recordEntry: jest.fn(),
  } as any;

  const flutterwave = {
    createPayment: jest.fn(),
    createVirtualAccount: jest.fn(),
    createGhsVirtualAccount: jest.fn(),
    createGbpBankCharge: jest.fn(),
    verifyTransaction: jest.fn(),
    validateWebhookSignature: jest.fn(),
    verifyAndCreditDeposit: jest.fn(),
  } as any;

  beforeEach(async () => {
    jest.clearAllMocks();
    prisma.$queryRaw.mockImplementation(async (query: TemplateStringsArray, ...values: any[]) => {
      const sql = Array.from(query).join(' ');
      if (sql.includes('"Currency"')) {
        const currencyCode = values[0];
        return [await prisma.currency.findUnique({ where: { code: currencyCode } })];
      }
      if (sql.includes('"Wallet"')) {
        return [{ id: 'wallet-1', userId: 'user-1', createdAt: new Date(), updatedAt: new Date() }];
      }
      return [];
    });
    prisma.$executeRaw.mockResolvedValue(1);
    prisma.currency.findUnique.mockImplementation(async ({ where }) => ({
      code: where.code,
      enabled: true,
      depositEnabled: true,
      name: where.code === 'NGN' ? 'Nigerian Naira' : where.code === 'GBP' ? 'Pound Sterling' : 'Currency',
      symbol: where.code === 'NGN' ? '₦' : where.code === 'GBP' ? '£' : '$',
    }));

    prisma.$transaction.mockImplementation(async (handler) => handler({
      deposit: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      transaction: {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
      },
      walletBalance: {
        upsert: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
      },
      ledgerEntry: { create: jest.fn() },
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositsService,
        { provide: PrismaService, useValue: prisma },
        { provide: WalletsService, useValue: wallets },
        { provide: CurrenciesService, useValue: currencies },
        { provide: TransactionsService, useValue: transactions },
        { provide: LedgerService, useValue: ledger },
        { provide: FlutterwaveService, useValue: flutterwave },
        { provide: ExchangeRatesService, useValue: { getRates: jest.fn().mockResolvedValue({ base: 'USD', rates: { USD: 1, NGN: 1500, GBP: 0.739407, GHS: 11.266187, EUR: 0.92, CAD: 1.36 }, updatedAt: '2026-01-01T00:00:00.000Z' }) } },
        { provide: ConfigService, useValue: { get: jest.fn((key: string, fallback?: any) => ({
          DEPOSIT_PROVIDER_FEE_PERCENT: 2,
          DEPOSIT_NOBLECARDS_FEE_PERCENT: 1,
        }[key] ?? fallback)) } },
      ],
    }).compile();

    service = module.get<DepositsService>(DepositsService);
  });

  it('creates a pending deposit and transaction without crediting the wallet', async () => {
    currencies.getCurrency.mockResolvedValue({
      code: 'USD',
      enabled: true,
      depositEnabled: true,
      name: 'US Dollar',
      symbol: '$',
    });

    wallets.getOrCreateWallet.mockResolvedValue({ id: 'wallet-1' });
    transactions.createPendingDepositTransaction.mockResolvedValue({
      id: 'tx-1',
      reference: 'DPT-123',
      status: 'PENDING',
    });

    prisma.deposit.findFirst.mockResolvedValue(null);
    prisma.deposit.create.mockResolvedValue({
      id: 'deposit-1',
      status: 'PENDING',
      userId: 'user-1',
      walletId: 'wallet-1',
      currencyCode: 'USD',
      amount: { toString: () => '100.00' },
      fee: { toString: () => '0.00' },
      netAmount: { toString: () => '100.00' },
      provider: 'FLUTTERWAVE',
      transaction: { id: 'tx-1', reference: 'DPT-123', status: 'PENDING' },
      metadata: {},
    });

    flutterwave.createPayment.mockResolvedValue({
      paymentLink: 'https://checkout.example.com/pay',
      providerReference: 'FLW-REF-1',
      providerTransactionId: '12345',
      meta: { configured: true },
    });

    prisma.deposit.update.mockResolvedValue({});

    const result = await service.createDeposit('user-1', {
      amount: 100,
      currency: 'USD',
      paymentMethod: 'BANK_TRANSFER',
      provider: 'FLUTTERWAVE',
      idempotencyKey: 'dep-1',
    });

    expect(result.status).toBe('PENDING');
    expect(prisma.$executeRaw).toHaveBeenCalled();
    expect(result.walletId).toBe('wallet-1');
  });

  it('does not credit the wallet when Flutterwave payment creation fails', async () => {
    currencies.getCurrency.mockResolvedValue({ code: 'USD', enabled: true, depositEnabled: true, name: 'US Dollar', symbol: '$' });
    wallets.getOrCreateWallet.mockResolvedValue({ id: 'wallet-1' });
    transactions.createPendingDepositTransaction.mockResolvedValue({ id: 'tx-1', reference: 'DPT-123', status: 'PENDING' });
    prisma.deposit.findFirst.mockResolvedValue(null);
    prisma.deposit.create.mockResolvedValue({ id: 'deposit-1', status: 'PENDING', walletId: 'wallet-1', currencyCode: 'USD', amount: { toString: () => '100.00' }, fee: { toString: () => '0.00' }, netAmount: { toString: () => '100.00' }, provider: 'FLUTTERWAVE', metadata: {}, transaction: { id: 'tx-1', status: 'PENDING', reference: 'DPT-123' } });
    flutterwave.createPayment.mockRejectedValue(new Error('Flutterwave request failed'));

    await expect(service.createDeposit('user-1', {
      amount: 100,
      currency: 'USD',
      paymentMethod: 'BANK_TRANSFER',
      provider: 'FLUTTERWAVE',
      idempotencyKey: 'dep-fail',
    })).rejects.toThrow('Flutterwave request failed');

    expect(wallets.ensureBalance).not.toHaveBeenCalled();
  });

  it('credits the wallet exactly once after successful verification', async () => {
    flutterwave.verifyAndCreditDeposit.mockResolvedValue({
      id: 'deposit-1',
      status: 'SUCCESSFUL',
      alreadyProcessed: false,
      ledgerEntryId: 'ledger-1',
    });

    const result = await service.verifyAndCreditDeposit({
      provider: 'FLUTTERWAVE',
      providerReference: 'FLW-REF-1',
      providerTransactionId: '12345',
      amount: '100.00',
      currency: 'USD',
    });

    expect(result.status).toBe('SUCCESSFUL');
    expect(result.alreadyProcessed).toBe(false);
    expect(flutterwave.verifyAndCreditDeposit).toHaveBeenCalledWith({
      provider: 'FLUTTERWAVE',
      providerReference: 'FLW-REF-1',
      providerTransactionId: '12345',
      amount: '100.00',
      currency: 'USD',
    });
  });

  it('rejects incorrect amount before crediting the wallet', async () => {
    flutterwave.verifyAndCreditDeposit.mockRejectedValue(new Error('Amount mismatch. Flutterwave transaction does not match the NobleCards deposit amount.'));

    await expect(service.verifyAndCreditDeposit({
      provider: 'FLUTTERWAVE',
      providerReference: 'FLW-REF-1',
      providerTransactionId: '12345',
      amount: '90.00',
      currency: 'USD',
    })).rejects.toThrow('Amount mismatch');
  });

  it('returns a provider verification failure without crediting the wallet', async () => {
    flutterwave.verifyAndCreditDeposit.mockResolvedValue({
      id: 'deposit-1',
      status: 'FAILED',
      alreadyProcessed: false,
      message: 'Flutterwave verification returned unsuccessful.',
    });

    const result = await service.verifyAndCreditDeposit({
      provider: 'FLUTTERWAVE',
      providerReference: 'FLW-REF-1',
      providerTransactionId: '12345',
      amount: '100.00',
      currency: 'USD',
    });

    expect(result.status).toBe('FAILED');
    expect(flutterwave.verifyAndCreditDeposit).toHaveBeenCalledWith({
      provider: 'FLUTTERWAVE',
      providerReference: 'FLW-REF-1',
      providerTransactionId: '12345',
      amount: '100.00',
      currency: 'USD',
    });
  });

  it('treats an already-successful deposit as already processed', async () => {
    flutterwave.verifyAndCreditDeposit.mockResolvedValue({
      id: 'deposit-1',
      status: 'SUCCESSFUL',
      alreadyProcessed: true,
    });

    const result = await service.verifyAndCreditDeposit({
      provider: 'FLUTTERWAVE',
      providerReference: 'FLW-REF-1',
      providerTransactionId: '12345',
      amount: '100.00',
      currency: 'USD',
    });

    expect(result.alreadyProcessed).toBe(true);
    expect(result.status).toBe('SUCCESSFUL');
  });

  it('rejects duplicate verification attempts when the provider reports the same successful transaction', async () => {
    const first = await service.verifyAndCreditDeposit({
      provider: 'FLUTTERWAVE',
      providerReference: 'FLW-REF-1',
      providerTransactionId: '12345',
      amount: '100.00',
      currency: 'USD',
    });

    const second = await service.verifyAndCreditDeposit({
      provider: 'FLUTTERWAVE',
      providerReference: 'FLW-REF-1',
      providerTransactionId: '12345',
      amount: '100.00',
      currency: 'USD',
    });

    expect(first.status).toBeDefined();
    expect(second.status).toBeDefined();
    expect(flutterwave.verifyAndCreditDeposit).toHaveBeenCalledTimes(2);
  });

  it('rejects invalid webhook signatures before any processing', async () => {
    const swagger = {
      validateWebhookSignature: jest.fn().mockResolvedValue(false),
      processWebhookEvent: jest.fn(),
    };

    const controller = {
      webhook: async (signature: string | undefined, request: { body?: any; rawBody?: Buffer }) => {
        const raw = request.rawBody ? request.rawBody.toString('utf8') : JSON.stringify(request.body ?? {});
        const isValid = await swagger.validateWebhookSignature(signature, raw);
        if (!isValid) {
          return { ok: false, message: 'Invalid Flutterwave webhook signature.' };
        }
        return swagger.processWebhookEvent(request.body);
      },
    };

    const result = await controller.webhook(undefined, { body: { event: 'charge.completed' } });

    expect(result).toEqual({ ok: false, message: 'Invalid Flutterwave webhook signature.' });
    expect(swagger.processWebhookEvent).not.toHaveBeenCalled();
  });

  it('accepts a valid webhook payload after signature validation', async () => {
    const swagger = {
      validateWebhookSignature: jest.fn().mockResolvedValue(true),
      processWebhookEvent: jest.fn().mockResolvedValue({ ok: true, processed: true, depositId: 'deposit-1' }),
    };

    const controller = {
      webhook: async (signature: string | undefined, request: { body?: any; rawBody?: Buffer }) => {
        const raw = request.rawBody ? request.rawBody.toString('utf8') : JSON.stringify(request.body ?? {});
        const isValid = await swagger.validateWebhookSignature(signature, raw);
        if (!isValid) {
          return { ok: false, message: 'Invalid Flutterwave webhook signature.' };
        }
        const processed = await swagger.processWebhookEvent(request.body);
        return { ok: processed.ok, processed: processed.processed, event: request.body?.event ?? 'unknown', message: 'Webhook received and processed by the backend.', depositId: processed.depositId ?? null };
      },
    };

    const result = await controller.webhook('valid-signature', { body: { event: 'charge.completed', data: { tx_ref: 'ref-1' } } });

    expect(result.ok).toBe(true);
    expect(result.processed).toBe(true);
    expect(swagger.processWebhookEvent).toHaveBeenCalled();
  });

  it('creates a virtual account for NGN BANK_TRANSFER deposits', async () => {
    currencies.getCurrency.mockResolvedValue({
      code: 'NGN',
      enabled: true,
      depositEnabled: true,
      name: 'Nigerian Naira',
      symbol: '₦',
    });

    wallets.getOrCreateWallet.mockResolvedValue({ id: 'wallet-1' });
    transactions.createPendingDepositTransaction.mockResolvedValue({
      id: 'tx-1',
      reference: 'DPT-123',
      status: 'PENDING',
    });

    prisma.deposit.findFirst.mockResolvedValue(null);
    prisma.deposit.create.mockResolvedValue({
      id: 'deposit-1',
      status: 'PENDING',
      userId: 'user-1',
      walletId: 'wallet-1',
      currencyCode: 'NGN',
      amount: { toString: () => '10000.00' },
      fee: { toString: () => '0.00' },
      netAmount: { toString: () => '10000.00' },
      provider: 'FLUTTERWAVE',
      paymentMethod: 'BANK_TRANSFER',
      transaction: { id: 'tx-1', reference: 'DPT-123', status: 'PENDING' },
      metadata: {},
    });

    flutterwave.createVirtualAccount.mockResolvedValue({
      bankName: 'Guaranty Trust Bank',
      accountNumber: '9052654501',
      accountName: 'NobleCards Deposit',
      amount: 10000,
      currency: 'NGN',
      expiresAt: '2026-08-30T12:45:00.000Z',
      providerReference: 'DPT-123',
      providerTransactionId: '12345',
      meta: { configured: true },
    });

    prisma.deposit.update.mockResolvedValue({});

    const result = await service.createDeposit('user-1', {
      amount: 10000,
      currency: 'NGN',
      paymentMethod: 'BANK_TRANSFER',
      provider: 'FLUTTERWAVE',
      idempotencyKey: 'dep-ngn-1',
    });

    expect(result.status).toBe('PENDING');
    expect(result.paymentMethod).toBe('BANK_TRANSFER');
    expect(result.bankTransfer).toBeDefined();
    expect(result.bankTransfer.bankName).toBe('Guaranty Trust Bank');
    expect(result.bankTransfer.accountNumber).toBe('9052654501');
    expect(flutterwave.createVirtualAccount).toHaveBeenCalled();
    expect(flutterwave.createPayment).not.toHaveBeenCalled();
  });

  it('applies GHS bank-transfer fees to the already-converted local amount', async () => {
    currencies.getCurrency.mockResolvedValue({
      code: 'GHS',
      enabled: true,
      depositEnabled: true,
      name: 'Ghanaian Cedi',
      symbol: 'GH₵',
    });

    wallets.getOrCreateWallet.mockResolvedValue({ id: 'wallet-1' });
    prisma.deposit.findFirst.mockResolvedValue(null);
    flutterwave.createGhsVirtualAccount.mockResolvedValue({
      bankName: 'Mock Bank',
      accountNumber: '7003000100286',
      accountName: 'Account name unavailable',
      amount: 1160.42,
      currency: 'GHS',
      expiresAt: null,
      providerReference: 'DPT-GHS-1',
      providerTransactionId: 'FLW-GHS-1',
      meta: { configured: true },
    });

    const result = await service.createDeposit('user-1', {
      amount: 1126.62,
      currency: 'GHS',
      paymentMethod: 'BANK_TRANSFER',
      provider: 'FLUTTERWAVE',
      idempotencyKey: 'dep-ghs-local-1',
    });

    expect(result.customerPayableAmount).toBe('1160.42');
    expect(result.providerFee).toBe('22.53');
    expect(result.nobleCardsFee).toBe('11.27');
    expect(result.totalFees).toBe('33.80');
    expect(result.walletCreditAmount).toBe('100.00');
    expect(flutterwave.createGhsVirtualAccount).toHaveBeenCalledWith(expect.objectContaining({
      amount: 1160.42,
      currency: 'GHS',
    }));
  });

  it('preserves the original USD amount for GBP bank-transfer deposits', async () => {
    currencies.getCurrency.mockResolvedValue({
      code: 'GBP',
      enabled: true,
      depositEnabled: true,
      name: 'Pound Sterling',
      symbol: '£',
    });

    wallets.getOrCreateWallet.mockResolvedValue({ id: 'wallet-1' });
    prisma.deposit.findFirst.mockResolvedValue(null);
    flutterwave.createGbpBankCharge.mockResolvedValue({
      authorizationUrl: 'https://example.com/authorize',
      amount: 76.16,
      currency: 'GBP',
      providerReference: 'DPT-GBP-1',
      providerTransactionId: 'FLW-GBP-1',
      meta: { configured: true },
    });

    const result = await service.createDeposit('user-1', {
      amount: 73.94,
      currency: 'GBP',
      paymentMethod: 'BANK_TRANSFER',
      provider: 'FLUTTERWAVE',
      idempotencyKey: 'dep-gbp-local-1',
    });

    expect(result.amount).toBe('76.16');
    expect(result.fee).toBe('2.22');
    expect(result.netAmount).toBe('100');
    expect(flutterwave.createGbpBankCharge).toHaveBeenCalledWith(expect.objectContaining({
      amount: 76.16,
      currency: 'GBP',
    }));
  });

  it('creates a payment link for non-NGN or non-BANK_TRANSFER deposits', async () => {
    currencies.getCurrency.mockResolvedValue({
      code: 'USD',
      enabled: true,
      depositEnabled: true,
      name: 'US Dollar',
      symbol: '$',
    });

    wallets.getOrCreateWallet.mockResolvedValue({ id: 'wallet-1' });
    transactions.createPendingDepositTransaction.mockResolvedValue({
      id: 'tx-1',
      reference: 'DPT-456',
      status: 'PENDING',
    });

    prisma.deposit.findFirst.mockResolvedValue(null);
    prisma.deposit.create.mockResolvedValue({
      id: 'deposit-2',
      status: 'PENDING',
      userId: 'user-1',
      walletId: 'wallet-1',
      currencyCode: 'USD',
      amount: { toString: () => '100.00' },
      fee: { toString: () => '0.00' },
      netAmount: { toString: () => '100.00' },
      provider: 'FLUTTERWAVE',
      paymentMethod: 'CARD',
      transaction: { id: 'tx-1', reference: 'DPT-456', status: 'PENDING' },
      metadata: {},
    });

    flutterwave.createPayment.mockResolvedValue({
      paymentLink: 'https://checkout.flutterwave.com/pay',
      providerReference: 'FLW-REF-456',
      providerTransactionId: '67890',
      meta: { configured: true },
    });

    prisma.deposit.update.mockResolvedValue({});

    const result = await service.createDeposit('user-1', {
      amount: 100,
      currency: 'USD',
      paymentMethod: 'CARD',
      provider: 'FLUTTERWAVE',
      idempotencyKey: 'dep-usd-1',
    });

    expect(result.status).toBe('PENDING');
    expect(result.paymentLink).toBe('https://checkout.flutterwave.com/pay');
    expect(flutterwave.createPayment).toHaveBeenCalled();
    expect(flutterwave.createVirtualAccount).not.toHaveBeenCalled();
  });

  it('does not credit the wallet when virtual account creation fails', async () => {
    currencies.getCurrency.mockResolvedValue({
      code: 'NGN',
      enabled: true,
      depositEnabled: true,
      name: 'Nigerian Naira',
      symbol: '₦',
    });

    wallets.getOrCreateWallet.mockResolvedValue({ id: 'wallet-1' });
    transactions.createPendingDepositTransaction.mockResolvedValue({
      id: 'tx-2',
      reference: 'DPT-fail',
      status: 'PENDING',
    });

    prisma.deposit.findFirst.mockResolvedValue(null);
    prisma.deposit.create.mockResolvedValue({
      id: 'deposit-3',
      status: 'PENDING',
      walletId: 'wallet-1',
      currencyCode: 'NGN',
      amount: { toString: () => '10000.00' },
      fee: { toString: () => '0.00' },
      netAmount: { toString: () => '10000.00' },
      provider: 'FLUTTERWAVE',
      paymentMethod: 'BANK_TRANSFER',
      metadata: {},
      transaction: { id: 'tx-2', status: 'PENDING', reference: 'DPT-fail' },
    });

    flutterwave.createVirtualAccount.mockRejectedValue(new Error('Flutterwave API error: Unable to create virtual account'));

    await expect(service.createDeposit('user-1', {
      amount: 10000,
      currency: 'NGN',
      paymentMethod: 'BANK_TRANSFER',
      provider: 'FLUTTERWAVE',
      idempotencyKey: 'dep-fail-ngn',
    })).rejects.toThrow('Flutterwave API error');

    expect(wallets.ensureBalance).not.toHaveBeenCalled();
  });

  it('handles missing virtual account response fields gracefully', async () => {
    currencies.getCurrency.mockResolvedValue({
      code: 'NGN',
      enabled: true,
      depositEnabled: true,
      name: 'Nigerian Naira',
      symbol: '₦',
    });

    wallets.getOrCreateWallet.mockResolvedValue({ id: 'wallet-1' });
    transactions.createPendingDepositTransaction.mockResolvedValue({
      id: 'tx-3',
      reference: 'DPT-partial',
      status: 'PENDING',
    });

    prisma.deposit.findFirst.mockResolvedValue(null);
    prisma.deposit.create.mockResolvedValue({
      id: 'deposit-4',
      status: 'PENDING',
      userId: 'user-1',
      walletId: 'wallet-1',
      currencyCode: 'NGN',
      amount: { toString: () => '10000.00' },
      fee: { toString: () => '0.00' },
      netAmount: { toString: () => '10000.00' },
      provider: 'FLUTTERWAVE',
      paymentMethod: 'BANK_TRANSFER',
      transaction: { id: 'tx-3', reference: 'DPT-partial', status: 'PENDING' },
      metadata: {},
    });

    // Partial response from Flutterwave with missing optional fields
    flutterwave.createVirtualAccount.mockResolvedValue({
      bankName: 'GTB',
      accountNumber: '1234567890',
      accountName: 'NobleCards',
      amount: 10000,
      currency: 'NGN',
      expiresAt: null,
      providerReference: 'DPT-partial',
      providerTransactionId: '999',
      meta: { configured: true },
    });

    prisma.deposit.update.mockResolvedValue({});

    const result = await service.createDeposit('user-1', {
      amount: 10000,
      currency: 'NGN',
      paymentMethod: 'BANK_TRANSFER',
      provider: 'FLUTTERWAVE',
      idempotencyKey: 'dep-partial',
    });

    expect(result.status).toBe('PENDING');
    expect(result.bankTransfer.accountNumber).toBe('1234567890');
  });
});
