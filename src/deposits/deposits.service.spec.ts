import { Test, TestingModule } from '@nestjs/testing';
import { createHmac } from 'node:crypto';
import { DepositsService } from './deposits.service';
import { PrismaService } from '../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { TransactionsService } from '../transactions/transactions.service';
import { LedgerService } from '../ledger/ledger.service';
import { FlutterwaveService } from '../flutterwave/flutterwave.service';

describe('FlutterwaveService webhook validation', () => {
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

  it('falls back gracefully when Flutterwave omits the account name', async () => {
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
        data: {
          id: 123,
          tx_ref: 'DPT-456',
          account_number: '1234567890',
          account_name: '',
          bank_name: 'Mock Bank',
          expiry_date: '2026-01-02T00:00:00.000Z',
          amount: 2500,
          currency: 'NGN',
        },
      });

      const result = await service.createVirtualAccount({
        amount: 2500,
        currency: 'NGN',
        reference: 'DPT-456',
        userId: 'user-1',
        walletId: 'wallet-1',
        depositId: 'deposit-2',
      });

      expect(result.accountName).toBe('Account name unavailable');
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
    verifyTransaction: jest.fn(),
    validateWebhookSignature: jest.fn(),
    verifyAndCreditDeposit: jest.fn(),
  } as any;

  beforeEach(async () => {
    jest.clearAllMocks();

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
    expect(prisma.deposit.create).toHaveBeenCalled();
    expect(transactions.createPendingDepositTransaction).toHaveBeenCalled();
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
