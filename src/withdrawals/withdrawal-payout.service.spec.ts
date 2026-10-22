import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentMethod, TransactionStatus } from '../generated/prisma';
import { WithdrawalPayoutService } from './withdrawal-payout.service';

const makeWithdrawal = (overrides: Record<string, unknown> = {}) => ({
  id: 'withdrawal-1',
  userId: 'user-1',
  reference: 'WD-123',
  status: TransactionStatus.PENDING,
  sourceCurrencyCode: 'USD',
  destinationCurrencyCode: 'NGN',
  sourceAmount: '100.00',
  amountReceived: '147.00',
  paymentMethod: PaymentMethod.BANK_TRANSFER,
  countryCode: 'NG',
  beneficiary: {
    id: 'beneficiary-1',
    type: 'BANK_ACCOUNT',
    isActive: true,
    encryptedDetails: 'enc',
  },
  transaction: { id: 'transaction-1', status: TransactionStatus.PENDING },
  ...overrides,
});

describe('WithdrawalPayoutService', () => {
  const config = { get: jest.fn().mockReturnValue(undefined) } as any;

  const makeService = (
    withdrawal = makeWithdrawal(),
    providerOverrides: Record<string, unknown> = {},
  ) => {
    const prisma = {
      withdrawal: {
        findFirst: jest.fn().mockResolvedValue(withdrawal),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      payoutAttempt: {
        findFirst: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({}),
        aggregate: jest.fn().mockResolvedValue({ _max: { attemptNumber: 0 } }),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue({ email: 'user@example.com' }),
      },
      $transaction: jest.fn(async (cb: any) =>
        cb({
          withdrawal: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
          payoutAttempt: {
            create: jest.fn().mockResolvedValue({
              id: 'attempt-1',
              withdrawalId: 'withdrawal-1',
            }),
            update: jest.fn().mockResolvedValue({}),
            aggregate: jest
              .fn()
              .mockResolvedValue({ _max: { attemptNumber: 0 } }),
          },
          transaction: {
            update: jest.fn().mockResolvedValue({}),
            updateMany: jest.fn().mockResolvedValue({ count: 1 }),
          },
          wallet: { finalizeHeldFunds: jest.fn(), releaseHeldFunds: jest.fn() },
        }),
      ),
    } as any;
    const provider = {
      supportsPayout: jest.fn().mockReturnValue(false),
      createTransfer: jest.fn().mockResolvedValue({
        accepted: true,
        status: TransactionStatus.SUCCESSFUL,
        providerReference: 'WD-123',
        providerTransactionId: 'trf-1',
        metadata: {},
      }),
      getPayoutStatus: jest.fn(),
      verifyWebhook: jest.fn(),
      ...providerOverrides,
    };
    const wallets = {
      finalizeHeldFunds: jest.fn(),
      releaseHeldFunds: jest.fn(),
    } as any;
    const encryption = {
      decrypt: jest.fn().mockReturnValue({
        accountNumber: '1234567890',
        institutionCode: '044',
        accountHolderName: 'Jane Doe',
        institutionName: 'First Bank',
        branchCode: 'IB-01',
        routingNumber: '230001',
        sortCode: '123456',
        swiftCode: 'ABCDUS33',
      }),
    } as any;
    const email = {
      sendWithdrawalSuccessEmail: jest.fn().mockResolvedValue(undefined),
    } as any;
    return {
      service: new WithdrawalPayoutService(
        prisma,
        wallets,
        encryption,
        provider,
        config,
        email,
      ),
      prisma,
      provider,
      wallets,
      encryption,
      email,
    };
  };

  it('builds the flat V3 NGN transfer contract', () => {
    const { service } = makeService(
      makeWithdrawal({ destinationCurrencyCode: 'NGN', countryCode: 'NG' }),
    );
    const request = (service as any).buildTransferRequest(
      makeWithdrawal({ destinationCurrencyCode: 'NGN', countryCode: 'NG' }),
    );

    expect(request).toEqual(
      expect.objectContaining({
        action: 'instant',
        reference: 'WD-123',
        narration: 'NobleCards withdrawal WD-123',
        account_bank: '044',
        account_number: '1234567890',
        beneficiary_name: 'Jane Doe',
        amount: 147,
        currency: 'NGN',
        debit_currency: 'USD',
      }),
    );
    expect(request).not.toHaveProperty('payment_instruction');
  });

  it('builds the flat V3 GHS transfer contract', () => {
    const { service } = makeService(
      makeWithdrawal({ destinationCurrencyCode: 'GHS', countryCode: 'GH' }),
    );
    const request = (service as any).buildTransferRequest(
      makeWithdrawal({ destinationCurrencyCode: 'GHS', countryCode: 'GH' }),
    );

    expect(request).toEqual(
      expect.objectContaining({
        action: 'instant',
        reference: 'WD-123',
        narration: 'NobleCards withdrawal WD-123',
        account_bank: '044',
        account_number: '1234567890',
        beneficiary_name: 'Jane Doe',
        amount: 147,
        currency: 'GHS',
        debit_currency: 'USD',
        destination_branch_code: 'IB-01',
      }),
    );
    expect(request).not.toHaveProperty('payment_instruction');
  });

  it('builds the documented V3 GBP transfer request with UK beneficiary metadata', () => {
    const { service, encryption } = makeService(
      makeWithdrawal({ destinationCurrencyCode: 'GBP', countryCode: 'GB' }),
    );
    encryption.decrypt.mockReturnValue({
      accountNumber: '12345678',
      accountHolderName: 'Jane Doe',
      institutionName: 'Example Bank',
      sortCode: '12-34-56',
      accountType: 'personal',
      streetNumber: '1',
      streetName: 'Example Street',
      city: 'London',
      state: 'Greater London',
      postalCode: 'SW1A 1AA',
      transferReason: 'Personal transfer',
    });
    const request = (service as any).buildTransferRequest(
      makeWithdrawal({ destinationCurrencyCode: 'GBP', countryCode: 'GB' }),
    );

    expect(request).toEqual(
      expect.objectContaining({
        action: 'instant',
        reference: 'WD-123',
        account_number: '12345678',
        beneficiary_name: 'Jane Doe',
        amount: 147,
        currency: 'GBP',
        debit_currency: 'USD',
        narration: 'Personal transfer',
        meta: [
          expect.objectContaining({
            routing_number: '123456',
            bank_name: 'Example Bank',
            account_type: 'personal',
            first_name: 'Jane',
            last_name: 'Doe',
            beneficiary_address: expect.stringContaining('Greater London'),
            city: 'London',
            postal_code: 'SW1A 1AA',
          }),
        ],
      }),
    );
    expect(request).not.toHaveProperty('payment_instruction');
  });

  it('builds the documented V3 USD transfer request with US beneficiary metadata', () => {
    const { service, encryption } = makeService(
      makeWithdrawal({ destinationCurrencyCode: 'USD', countryCode: 'US' }),
    );
    encryption.decrypt.mockReturnValue({
      accountNumber: '1234567890',
      accountHolderName: 'Jane Doe',
      institutionName: 'Example Bank',
      routingNumber: '123456789',
      swiftCode: 'ABCDEF12',
      accountType: 'checking',
      streetNumber: '1',
      streetName: 'Example Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
    });
    const request = (service as any).buildTransferRequest(
      makeWithdrawal({ destinationCurrencyCode: 'USD', countryCode: 'US' }),
    );

    expect(request).toEqual(
      expect.objectContaining({
        account_number: '1234567890',
        beneficiary_name: 'Jane Doe',
        amount: 147,
        currency: 'USD',
        debit_currency: 'USD',
        meta: [
          expect.objectContaining({
            routing_number: '123456789',
            swift_code: 'ABCDEF12',
            bank_name: 'Example Bank',
            account_type: 'checking',
            street_number: '1',
            street_name: 'Example Street',
            city: 'New York',
            postal_code: '10001',
          }),
        ],
      }),
    );
    expect(request).not.toHaveProperty('payment_instruction');
  });

  it('rejects CAD transfer construction until V3 corridor support is verified', () => {
    const { service } = makeService(
      makeWithdrawal({ destinationCurrencyCode: 'CAD', countryCode: 'CA' }),
    );

    expect(() =>
      (service as any).buildTransferRequest(
        makeWithdrawal({ destinationCurrencyCode: 'CAD', countryCode: 'CA' }),
      ),
    ).toThrow(/PAYOUT_CORRIDOR_UNSUPPORTED/);
  });

  it('records the quoted NobleCards fee only when a withdrawal completes', async () => {
    const withdrawal = makeWithdrawal({
      quoteId: 'quote-1',
      status: TransactionStatus.PROCESSING,
    });
    const { service, prisma } = makeService(withdrawal);
    const tx = {
      payoutAttempt: { update: jest.fn().mockResolvedValue({}) },
      withdrawal: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      transaction: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      withdrawalQuote: {
        findUnique: jest.fn().mockResolvedValue({
          sourceCurrencyCode: 'USD',
          nobleCardsFee: '1.00',
        }),
      },
      platformAccountingEntry: {
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    prisma.$transaction.mockImplementation((callback: (client: any) => any) =>
      callback(tx),
    );
    (service as any).email = undefined;

    await (service as any).persistProviderResult(
      withdrawal,
      { attempt: { id: 'attempt-1' } },
      {
        status: TransactionStatus.SUCCESSFUL,
        providerReference: 'provider-ref',
        providerTransactionId: 'provider-tx',
      },
    );

    expect(tx.withdrawalQuote.findUnique).toHaveBeenCalledWith({
      where: { id: 'quote-1' },
      select: { sourceCurrencyCode: true, nobleCardsFee: true },
    });
    expect(tx.platformAccountingEntry.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          expect.objectContaining({
            idempotencyKey: 'WITHDRAWAL:withdrawal-1:fee-revenue',
            entryType: 'FEE_REVENUE',
            currencyCode: 'USD',
            usdAmount: expect.anything(),
          }),
        ],
        skipDuplicates: true,
      }),
    );
  });

  it('does not recognize a withdrawal fee when payout fails', async () => {
    const withdrawal = makeWithdrawal({
      quoteId: 'quote-1',
      status: TransactionStatus.PROCESSING,
    });
    const { service, prisma, wallets } = makeService(withdrawal);
    const quoteFindUnique = jest.fn();
    const entryCreateMany = jest.fn();
    prisma.$transaction.mockImplementation((callback: (client: any) => any) =>
      callback({
        payoutAttempt: { update: jest.fn().mockResolvedValue({}) },
        withdrawal: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
        transaction: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
        withdrawalQuote: { findUnique: quoteFindUnique },
        platformAccountingEntry: { createMany: entryCreateMany },
      }),
    );

    await (service as any).persistProviderResult(
      withdrawal,
      { attempt: { id: 'attempt-1' } },
      { status: TransactionStatus.FAILED, failureReason: 'Provider failed.' },
    );

    expect(wallets.releaseHeldFunds).toHaveBeenCalledTimes(1);
    expect(quoteFindUnique).not.toHaveBeenCalled();
    expect(entryCreateMany).not.toHaveBeenCalled();
  });

  it('keeps header preservation and route rejection semantics', async () => {
    const provider = {
      supportsPayout: jest.fn().mockReturnValue(true),
      createTransfer: jest.fn().mockResolvedValue({
        accepted: true,
        status: TransactionStatus.SUCCESSFUL,
        providerReference: 'WD-123',
        providerTransactionId: 'trf-1',
        metadata: {},
      }),
      getPayoutStatus: jest.fn().mockResolvedValue({
        status: 'SUCCESS',
        providerReference: 'WD-123',
        providerTransactionId: 'trf-1',
      }),
      verifyWebhook: jest.fn(),
    };
    const { service, prisma, wallets } = makeService(
      makeWithdrawal({ destinationCurrencyCode: 'NGN', countryCode: 'NG' }),
      provider,
    );
    prisma.$transaction = jest.fn(async (cb: any) =>
      cb({
        withdrawal: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
        payoutAttempt: {
          create: jest.fn().mockResolvedValue({
            id: 'attempt-1',
            withdrawalId: 'withdrawal-1',
          }),
          update: jest.fn().mockResolvedValue({}),
          aggregate: jest
            .fn()
            .mockResolvedValue({ _max: { attemptNumber: 0 } }),
        },
        transaction: {
          update: jest.fn().mockResolvedValue({}),
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
        wallet: { finalizeHeldFunds: jest.fn(), releaseHeldFunds: jest.fn() },
      }),
    );
    await service.execute('user-1', 'withdrawal-1');

    expect(provider.createTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        idempotencyKey: 'nc-payout-WD-123',
        traceId: expect.any(String),
      }),
    );
    expect(provider.createTransfer.mock.calls[0][0].request).toEqual(
      expect.objectContaining({
        reference: 'WD-123',
        account_bank: '044',
        account_number: '1234567890',
        currency: 'NGN',
        debit_currency: 'USD',
      }),
    );
    expect(wallets.finalizeHeldFunds).toHaveBeenCalled();
  });

  it('rejects an unsupported payout route before creating an attempt or calling a provider', async () => {
    const { service, provider } = makeService();

    await expect(
      service.execute('user-1', 'withdrawal-1'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        message: expect.stringContaining('PROVIDER_CAPABILITY_UNSUPPORTED'),
      }),
    });

    expect(provider.supportsPayout).toHaveBeenCalledWith({
      countryCode: 'NG',
      currencyCode: 'NGN',
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      beneficiaryType: 'BANK_ACCOUNT',
    });
    expect(provider.createTransfer).not.toHaveBeenCalled();
  });

  it('enforces ownership before capability checks', async () => {
    const { service, provider, prisma } = makeService(null as any);

    await expect(
      service.execute('user-2', 'withdrawal-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(provider.supportsPayout).not.toHaveBeenCalled();
    expect(prisma.withdrawal.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'withdrawal-1', userId: 'user-2' },
      }),
    );
  });

  it('does not execute a withdrawal already in processing or terminal state', async () => {
    const processing = makeService(
      makeWithdrawal({ status: TransactionStatus.PROCESSING }),
    );
    await expect(
      processing.service.execute('user-1', 'withdrawal-1'),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(processing.provider.supportsPayout).not.toHaveBeenCalled();

    const successful = makeService(
      makeWithdrawal({ status: TransactionStatus.SUCCESSFUL }),
    );
    await expect(
      successful.service.execute('user-1', 'withdrawal-1'),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(successful.provider.supportsPayout).not.toHaveBeenCalled();
  });

  it('does not reconcile unsupported provider status', async () => {
    const { service, provider } = makeService(
      makeWithdrawal({ status: TransactionStatus.UNDER_REVIEW }),
    );

    await expect(
      service.reconcile('user-1', 'withdrawal-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(provider.getPayoutStatus).not.toHaveBeenCalled();
  });

  it.each([
    {
      providerTransactionId: 2240074,
      providerReference: 'WD-1789163993808-ZJHPNP_PMCKDU_1',
      expectedId: '2240074',
      expectedReference: 'WD-1789163993808-ZJHPNP_PMCKDU_1',
    },
    {
      providerTransactionId: null,
      providerReference: null,
      expectedId: null,
      expectedReference: null,
    },
    {
      providerTransactionId: 'trf_ABC-42',
      providerReference: 'ref_ABC-42',
      expectedId: 'trf_ABC-42',
      expectedReference: 'ref_ABC-42',
    },
  ])(
    'normalizes provider identifiers before persistence',
    async ({
      providerTransactionId,
      providerReference,
      expectedId,
      expectedReference,
    }) => {
      const { service, prisma } = makeService(
        makeWithdrawal({ status: TransactionStatus.UNDER_REVIEW }),
      );
      const tx = {
        payoutAttempt: { update: jest.fn().mockResolvedValue({}) },
        withdrawal: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
        transaction: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      };
      prisma.$transaction = jest.fn(async (callback: any) => callback(tx));

      await (service as any).persistProviderResult(
        makeWithdrawal({ status: TransactionStatus.UNDER_REVIEW }),
        { attempt: { id: 'attempt-1' } },
        {
          status: TransactionStatus.UNDER_REVIEW,
          providerTransactionId,
          providerReference,
        },
      );

      expect(tx.payoutAttempt.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            providerTransactionId: expectedId,
            providerReference: expectedReference,
          }),
        }),
      );
    },
  );

  it('reconciles an existing provider transfer instead of creating another transfer', async () => {
    const { service, prisma, provider } = makeService(makeWithdrawal());
    prisma.payoutAttempt.findFirst = jest.fn().mockResolvedValue({
      id: 'attempt-1',
      withdrawalId: 'withdrawal-1',
      attemptNumber: 1,
      providerTransactionId: '2240074',
      providerReference: 'WD-123',
      status: TransactionStatus.UNDER_REVIEW,
    });
    provider.getPayoutStatus.mockResolvedValue({
      status: 'PROCESSING',
      providerTransactionId: 2240074,
      providerReference: 'WD-123',
    });

    const result = await service.execute('user-1', 'withdrawal-1');

    expect(result).toEqual(
      expect.objectContaining({
        status: TransactionStatus.PROCESSING,
        providerTransactionId: '2240074',
      }),
    );
    expect(provider.getPayoutStatus).toHaveBeenCalledWith({
      transferId: '2240074',
    });
    expect(provider.createTransfer).not.toHaveBeenCalled();
  });

  it('sends one success email only after successful finalization', async () => {
    const { service, prisma, email, wallets } = makeService(
      makeWithdrawal({ status: TransactionStatus.UNDER_REVIEW }),
    );
    let successTransitionOpen = true;
    prisma.$transaction = jest.fn(async (callback: any) =>
      callback({
        payoutAttempt: { update: jest.fn().mockResolvedValue({}) },
        withdrawal: {
          updateMany: jest.fn().mockImplementation(async () => ({
            count: successTransitionOpen ? 1 : 0,
          })),
        },
        transaction: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      }),
    );

    await (service as any).persistProviderResult(
      makeWithdrawal({ status: TransactionStatus.UNDER_REVIEW }),
      { attempt: { id: 'attempt-1' } },
      {
        status: TransactionStatus.SUCCESSFUL,
        providerTransactionId: '2240074',
        providerReference: 'WD-123',
      },
    );
    successTransitionOpen = false;
    await (service as any).persistProviderResult(
      makeWithdrawal({ status: TransactionStatus.UNDER_REVIEW }),
      { attempt: { id: 'attempt-1' } },
      {
        status: TransactionStatus.SUCCESSFUL,
        providerTransactionId: '2240074',
        providerReference: 'WD-123',
      },
    );

    expect(wallets.finalizeHeldFunds).toHaveBeenCalledTimes(1);
    expect(email.sendWithdrawalSuccessEmail).toHaveBeenCalledTimes(1);
  });

  it.each([
    TransactionStatus.FAILED,
    TransactionStatus.UNDER_REVIEW,
    TransactionStatus.PROCESSING,
  ])('does not send success email for %s', async (status) => {
    const { service, prisma, email } = makeService(makeWithdrawal({ status }));
    prisma.$transaction = jest.fn(async (callback: any) =>
      callback({
        payoutAttempt: { update: jest.fn().mockResolvedValue({}) },
        withdrawal: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
        transaction: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      }),
    );

    await (service as any).persistProviderResult(
      makeWithdrawal({ status }),
      { attempt: { id: 'attempt-1' } },
      {
        status,
        providerTransactionId:
          status === TransactionStatus.PROCESSING ? '2240074' : null,
        providerReference: null,
      },
    );

    expect(email.sendWithdrawalSuccessEmail).not.toHaveBeenCalled();
  });

  it('confirms a completed webhook with Flutterwave and finalizes a success once', async () => {
    const withdrawal = makeWithdrawal({ status: TransactionStatus.PROCESSING });
    const { service, provider, prisma, wallets } = makeService(withdrawal);
    (service as any).email = undefined;
    const event = { id: 'event-1' };
    const eventCreate = jest
      .fn()
      .mockResolvedValueOnce(event)
      .mockRejectedValueOnce({ code: 'P2002' });
    prisma.providerWebhookEvent = {
      create: eventCreate,
      update: jest.fn().mockResolvedValue(event),
    };
    prisma.payoutAttempt.findFirst = jest.fn().mockResolvedValue({
      id: 'attempt-1',
      withdrawalId: withdrawal.id,
      attemptNumber: 1,
      providerTransactionId: 'trf-1',
      providerReference: 'WD-123',
    });
    prisma.withdrawal.findUnique = jest.fn().mockResolvedValue(withdrawal);
    provider.verifyWebhook.mockResolvedValue({
      valid: true,
      eventId: 'event-1',
      eventType: 'transfer.completed',
      providerTransactionId: 'trf-1',
      providerReference: 'WD-123',
    });
    provider.getPayoutStatus.mockResolvedValue({
      status: 'SUCCESS',
      providerTransactionId: 'trf-1',
      providerReference: 'WD-123',
    });
    const tx = {
      payoutAttempt: { update: jest.fn().mockResolvedValue({}) },
      withdrawal: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      transaction: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
    };
    prisma.$transaction = jest.fn((callback: (client: any) => any) =>
      callback(tx),
    );
    const rawBody = JSON.stringify({
      event: 'transfer.completed',
      data: { id: 'trf-1', reference: 'WD-123', status: 'SUCCESSFUL' },
    });

    await expect(service.handleWebhook('signature', rawBody)).resolves.toEqual({
      processed: true,
      status: TransactionStatus.SUCCESSFUL,
    });
    await expect(service.handleWebhook('signature', rawBody)).resolves.toEqual({
      processed: false,
      duplicate: true,
    });

    expect(provider.getPayoutStatus).toHaveBeenCalledTimes(2);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(wallets.finalizeHeldFunds).toHaveBeenCalledTimes(1);
    expect(wallets.releaseHeldFunds).not.toHaveBeenCalled();
  });

  it('releases held funds only for a provider-confirmed failed transfer event', async () => {
    const withdrawal = makeWithdrawal({ status: TransactionStatus.PROCESSING });
    const { service, provider, prisma, wallets } = makeService(withdrawal);
    const event = { id: 'event-failed' };
    prisma.providerWebhookEvent = {
      create: jest.fn().mockResolvedValue(event),
      update: jest.fn().mockResolvedValue(event),
    };
    prisma.payoutAttempt.findFirst = jest.fn().mockResolvedValue({
      id: 'attempt-1',
      withdrawalId: withdrawal.id,
      attemptNumber: 1,
      providerTransactionId: 'trf-1',
      providerReference: 'WD-123',
    });
    prisma.withdrawal.findUnique = jest.fn().mockResolvedValue(withdrawal);
    provider.verifyWebhook.mockResolvedValue({
      valid: true,
      eventId: 'event-failed',
      eventType: 'transfer.completed',
      providerTransactionId: 'trf-1',
      providerReference: 'WD-123',
    });
    provider.getPayoutStatus.mockResolvedValue({
      status: 'FAILED',
      providerTransactionId: 'trf-1',
      providerReference: 'WD-123',
      failureReason: 'Provider rejected transfer.',
    });
    const tx = {
      payoutAttempt: { update: jest.fn().mockResolvedValue({}) },
      withdrawal: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      transaction: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
    };
    prisma.$transaction = jest.fn((callback: (client: any) => any) =>
      callback(tx),
    );

    await expect(
      service.handleWebhook(
        'signature',
        JSON.stringify({
          event: 'transfer.completed',
          data: { id: 'trf-1', reference: 'WD-123', status: 'FAILED' },
        }),
      ),
    ).resolves.toEqual({
      processed: true,
      status: TransactionStatus.FAILED,
    });

    expect(wallets.releaseHeldFunds).toHaveBeenCalledTimes(1);
    expect(wallets.finalizeHeldFunds).not.toHaveBeenCalled();
  });

  it('ignores a webhook whose reference does not match the stored withdrawal', async () => {
    const withdrawal = makeWithdrawal();
    const { service, provider, prisma } = makeService(withdrawal);
    prisma.providerWebhookEvent = {
      create: jest.fn().mockResolvedValue({ id: 'event-mismatch' }),
    };
    prisma.payoutAttempt.findFirst = jest.fn().mockResolvedValue({
      id: 'attempt-1',
      withdrawalId: withdrawal.id,
      attemptNumber: 1,
      providerTransactionId: 'trf-1',
      providerReference: 'WD-123',
    });
    prisma.withdrawal.findUnique = jest.fn().mockResolvedValue(withdrawal);
    provider.verifyWebhook.mockResolvedValue({
      valid: true,
      eventId: 'event-mismatch',
      eventType: 'transfer.completed',
      providerTransactionId: 'trf-1',
      providerReference: 'WD-OTHER',
    });

    await expect(
      service.handleWebhook(
        'signature',
        JSON.stringify({
          event: 'transfer.completed',
          data: { id: 'trf-1', reference: 'WD-OTHER', status: 'SUCCESSFUL' },
        }),
      ),
    ).resolves.toEqual({ processed: false, ignored: true });
    expect(provider.getPayoutStatus).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('ignores verified reversal events rather than mutating a completed payout', async () => {
    const withdrawal = makeWithdrawal({ status: TransactionStatus.SUCCESSFUL });
    const { service, provider, prisma } = makeService(withdrawal);
    const event = { id: 'event-1' };
    prisma.providerWebhookEvent = {
      create: jest.fn().mockResolvedValue(event),
      update: jest.fn().mockResolvedValue(event),
    };
    prisma.payoutAttempt = {
      findFirst: jest.fn().mockResolvedValue({
        id: 'attempt-1',
        withdrawalId: 'withdrawal-1',
        providerTransactionId: 'trf-1',
        attemptNumber: 1,
      }),
      update: jest.fn().mockResolvedValue({}),
    };
    prisma.withdrawal.findUnique = jest.fn().mockResolvedValue({
      ...withdrawal,
      transaction: withdrawal.transaction,
    });
    const platformAccountingEntry = {
      findUnique: jest.fn().mockResolvedValue({
        amount: '1.00',
        currencyCode: 'USD',
        usdAmount: '1.00',
      }),
      createMany: jest.fn().mockResolvedValue({ count: 1 }),
    };
    const tx = {
      payoutAttempt: { update: jest.fn().mockResolvedValue({}) },
      withdrawal: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      providerWebhookEvent: { update: jest.fn().mockResolvedValue(event) },
      platformAccountingEntry,
    };
    prisma.$transaction = jest.fn((callback: (client: any) => any) =>
      callback(tx),
    );
    provider.verifyWebhook.mockResolvedValue({
      valid: true,
      eventId: 'event-1',
      eventType: 'transfer.reversed',
      providerTransactionId: 'trf-1',
      providerReference: 'WD-123',
    });

    const result = await service.handleWebhook(
      'signature',
      JSON.stringify({
        type: 'transfer.reversal',
        data: { id: 'trf-1', reference: 'WD-123', status: 'SUCCESSFUL' },
      }),
    );

    expect(result).toEqual({ processed: false, ignored: true });
    expect(provider.verifyWebhook).toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.providerWebhookEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ eventType: 'transfer.reversed' }),
      }),
    );
    expect(platformAccountingEntry.findUnique).not.toHaveBeenCalled();
  });
});
