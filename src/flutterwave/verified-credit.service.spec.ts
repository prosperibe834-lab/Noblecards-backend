import { FlutterwaveService } from './flutterwave.service';

describe('FlutterwaveService verified deposit credit', () => {
  it('matches a webhook tx_ref when its completed transaction ID differs from creation ID', async () => {
    let depositStatus = 'PENDING';
    let balance = 0;
    let ledgerCreated = false;
    let ledgerCurrency = '';
    const deposit = {
      id: 'ab15b3e1-3e54-4d4d-8727-85a411584cb8',
      walletId: 'wallet-1',
      currencyCode: 'NGN',
      amount: 137258.56,
      netAmount: 100,
      exchangeRate: 1372.5856,
      status: depositStatus,
      provider: 'FLUTTERWAVE',
      providerTransactionId: 'MockFLWRef-1788373092506',
      providerReference: 'DPT-1788371714830-W4OBR2NP',
      transactionId: 'transaction-1',
      metadata: {},
      transaction: {
        id: 'transaction-1',
        status: depositStatus,
        reference: 'DPT-1788371714830-W4OBR2NP',
      },
    };
    const tx = {
      deposit: {
        findUnique: jest.fn(async () => ({
          ...deposit,
          status: depositStatus,
        })),
        update: jest.fn(async ({ data }: any) => {
          depositStatus = data.status;
          return { ...deposit, status: depositStatus };
        }),
      },
      ledgerEntry: {
        findFirst: jest.fn(async () =>
          ledgerCreated ? { id: 'ledger-1' } : null,
        ),
        create: jest.fn(async ({ data }: any) => {
          ledgerCreated = true;
          ledgerCurrency = data.currencyCode;
          return { id: 'ledger-1' };
        }),
      },
      walletBalance: {
        findUnique: jest.fn(async () => ({
          id: 'balance-1',
          availableBalance: balance,
        })),
        update: jest.fn(async ({ data }: any) => {
          balance = Number(data.availableBalance.toString());
          return {};
        }),
      },
      transaction: { update: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      deposit: {
        findFirst: jest.fn(async () => ({ ...deposit, status: depositStatus })),
        findUnique: jest.fn(async () => ({
          ...deposit,
          status: depositStatus,
        })),
        updateMany: jest.fn(async () => {
          if (depositStatus !== 'PENDING') return { count: 0 };
          depositStatus = 'PROCESSING';
          return { count: 1 };
        }),
      },
      $transaction: jest.fn(
        async (handler: (client: any) => Promise<unknown>) => handler(tx),
      ),
    } as any;
    const service = new FlutterwaveService(
      prisma,
      {} as any,
      { getCurrency: jest.fn().mockResolvedValue({ code: 'USD' }) } as any,
      {} as any,
      {} as any,
      {
        recordSuccessfulDeposit: jest.fn().mockResolvedValue(undefined),
      } as any,
    );
    const verify = jest.spyOn(service, 'verifyTransaction').mockResolvedValue({
      status: 'SUCCESSFUL',
      verified: true,
      providerReference: 'DPT-1788371714830-W4OBR2NP',
      providerTransactionId: '10467793',
      amount: '137258.56',
      currency: 'NGN',
      raw: {},
    });

    const payload = {
      event: 'charge.completed',
      data: {
        id: 10467793,
        tx_ref: 'DPT-1788371714830-W4OBR2NP',
        flw_ref: '6902041257291788373092538',
        amount: 137258.56,
        currency: 'NGN',
        status: 'successful',
      },
    };
    const result = await service.processWebhookEvent(payload);
    const duplicate = await service.processWebhookEvent(payload);

    expect(result).toMatchObject({
      status: 'SUCCESSFUL',
      alreadyProcessed: false,
    });
    expect(duplicate).toMatchObject({
      status: 'SUCCESSFUL',
      alreadyProcessed: true,
    });
    expect(verify).toHaveBeenCalledWith(
      '10467793',
      'DPT-1788371714830-W4OBR2NP',
    );
    expect(
      verify.mock.calls.every(
        ([id, reference]) =>
          id === '10467793' && reference === 'DPT-1788371714830-W4OBR2NP',
      ),
    ).toBe(true);
    expect(depositStatus).toBe('SUCCESSFUL');
    expect(balance).toBe(100);
    expect(ledgerCreated).toBe(true);
    expect(ledgerCurrency).toBe('USD');
    expect(prisma.deposit.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: expect.arrayContaining([
            { providerTransactionId: '10467793' },
            { providerReference: 'DPT-1788371714830-W4OBR2NP' },
          ]),
        },
      }),
    );
  });

  it.each(['NGN', 'GHS', 'GBP'])(
    'credits exactly $100 USD for a verified %s deposit once',
    async (currencyCode) => {
      let depositStatus = 'PENDING';
      let ledgerCreated = false;
      let balance = 0;

      const deposit = {
        id: `deposit-${currencyCode}`,
        walletId: `wallet-${currencyCode}`,
        currencyCode,
        amount: 100,
        netAmount: 100,
        status: 'PENDING',
        provider: 'FLUTTERWAVE',
        providerReference: `DPT-${currencyCode}`,
        transactionId: `transaction-${currencyCode}`,
        metadata: {},
        transaction: {
          id: `transaction-${currencyCode}`,
          status: 'PENDING',
          reference: `DPT-${currencyCode}`,
        },
      };

      const tx = {
        deposit: {
          findUnique: jest.fn(async () => ({
            ...deposit,
            status: depositStatus,
          })),
          update: jest.fn(async ({ data }: any) => {
            depositStatus = data.status;
            return { ...deposit, status: depositStatus };
          }),
        },
        ledgerEntry: {
          findFirst: jest.fn(async () =>
            ledgerCreated ? { id: `ledger-${currencyCode}` } : null,
          ),
          create: jest.fn(async () => {
            ledgerCreated = true;
            return { id: `ledger-${currencyCode}` };
          }),
        },
        walletBalance: {
          findUnique: jest.fn(async () => ({
            id: `balance-${currencyCode}`,
            availableBalance: balance,
          })),
          update: jest.fn(async ({ data }: any) => {
            balance = Number(data.availableBalance.toString());
            return {};
          }),
        },
        transaction: { update: jest.fn().mockResolvedValue({}) },
      };
      const prisma = {
        deposit: {
          findFirst: jest.fn(async () => ({
            ...deposit,
            status: depositStatus,
          })),
          findUnique: jest.fn(async () => ({
            ...deposit,
            status: depositStatus,
          })),
          updateMany: jest.fn(async () => {
            if (depositStatus !== 'PENDING') return { count: 0 };
            depositStatus = 'PROCESSING';
            return { count: 1 };
          }),
        },
        $transaction: jest.fn(
          async (handler: (client: any) => Promise<unknown>) => handler(tx),
        ),
      } as any;
      const currencies = {
        getCurrency: jest.fn().mockResolvedValue({ code: 'USD' }),
      } as any;
      const service = new FlutterwaveService(
        prisma,
        {} as any,
        currencies,
        {} as any,
        {} as any,
        {
          recordSuccessfulDeposit: jest.fn().mockResolvedValue(undefined),
        } as any,
      );
      jest.spyOn(service, 'verifyTransaction').mockResolvedValue({
        status: 'SUCCESSFUL',
        verified: true,
        providerReference: `DPT-${currencyCode}`,
        providerTransactionId: `charge-${currencyCode}`,
        amount: '100',
        currency: currencyCode,
        raw: {},
      });

      const input = {
        provider: 'FLUTTERWAVE' as const,
        providerTransactionId: `charge-${currencyCode}`,
        providerReference: `DPT-${currencyCode}`,
        amount: '100',
        currency: currencyCode,
      };

      const first = await service.verifyAndCreditDeposit(input);
      const second = await service.verifyAndCreditDeposit(input);

      expect(first).toMatchObject({
        status: 'SUCCESSFUL',
        alreadyProcessed: false,
      });
      expect(second).toMatchObject({
        status: 'SUCCESSFUL',
        alreadyProcessed: true,
      });
      expect(balance).toBe(100);
      expect(ledgerCreated).toBe(true);
      expect(currencies.getCurrency).toHaveBeenCalledWith('USD');
    },
  );
});
