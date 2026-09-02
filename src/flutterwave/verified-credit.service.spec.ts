import { FlutterwaveService } from './flutterwave.service';

describe('FlutterwaveService verified deposit credit', () => {
  it('matches a webhook tx_ref when its completed transaction ID differs from creation ID', async () => {
    let depositStatus = 'PENDING';
    let balance = 0;
    let ledgerCreated = false;
    let ledgerCurrency = '';
    const lookupValues: unknown[][] = [];
    const query = async (template: TemplateStringsArray, ...values: unknown[]) => {
      const sql = Array.from(template).join(' ');
      if (sql.includes('UPDATE "Deposit"') && sql.includes('PROCESSING')) {
        depositStatus = 'PROCESSING';
        return [{ id: 'ab15b3e1-3e54-4d4d-8727-85a411584cb8' }];
      }
      if (sql.includes('INSERT INTO "LedgerEntry"')) {
        ledgerCreated = true;
        ledgerCurrency = values.find((value) => value === 'USD') as string ?? '';
        return [{ id: 'ledger-1' }];
      }
      if (sql.includes('FROM "LedgerEntry"')) return ledgerCreated ? [{ id: 'ledger-1' }] : [];
      if (sql.includes('FROM "WalletBalance"')) return [{ id: 'balance-1', availableBalance: balance }];
      if (sql.includes('FROM "Deposit"')) {
        lookupValues.push(values.flatMap((value) => (
          value && typeof value === 'object' && 'values' in value
            ? (value as { values: unknown[] }).values
            : [value]
        )));
        return [{
          id: 'ab15b3e1-3e54-4d4d-8727-85a411584cb8', walletId: 'wallet-1', currencyCode: 'NGN',
          amount: 137258.56, netAmount: 100, status: depositStatus, provider: 'FLUTTERWAVE',
          providerTransactionId: 'MockFLWRef-1788373092506', providerReference: 'DPT-1788371714830-W4OBR2NP',
          transactionId: 'transaction-1', metadata: {},
          transaction: { id: 'transaction-1', status: depositStatus, reference: 'DPT-1788371714830-W4OBR2NP' },
        }];
      }
      return [];
    };
    const execute = async (template: TemplateStringsArray) => {
      const sql = Array.from(template).join(' ');
      if (sql.includes('SET "availableBalance"')) balance += 100;
      if (sql.includes('SET "status" = \'SUCCESSFUL\'')) depositStatus = 'SUCCESSFUL';
    };
    const prisma = {
      $queryRaw: jest.fn(query), $executeRaw: jest.fn(execute),
      $transaction: jest.fn(async (handler: (tx: any) => Promise<unknown>) => handler({ $queryRaw: query, $executeRaw: execute })),
    } as any;
    const service = new FlutterwaveService(
      prisma, {} as any, { getCurrency: jest.fn().mockResolvedValue({ code: 'USD' }) } as any,
      {} as any, {} as any, {} as any,
    );
    const verify = jest.spyOn(service, 'verifyTransaction').mockResolvedValue({
      status: 'SUCCESSFUL', verified: true, providerReference: 'DPT-1788371714830-W4OBR2NP',
      providerTransactionId: '10467793', amount: '137258.56', currency: 'NGN', raw: {},
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

    expect(result).toMatchObject({ status: 'SUCCESSFUL', alreadyProcessed: false });
    expect(duplicate).toMatchObject({ status: 'SUCCESSFUL', alreadyProcessed: true });
    expect(verify).toHaveBeenCalledWith('10467793', 'DPT-1788371714830-W4OBR2NP');
    expect(verify.mock.calls.every(([id, reference]) => id === '10467793' && reference === 'DPT-1788371714830-W4OBR2NP')).toBe(true);
    expect(depositStatus).toBe('SUCCESSFUL');
    expect(balance).toBe(100);
    expect(ledgerCreated).toBe(true);
    expect(ledgerCurrency).toBe('USD');
    expect(lookupValues[0]).toContain('DPT-1788371714830-W4OBR2NP');
    expect(lookupValues[0]).not.toContain('10467793');
    expect(prisma.$queryRaw.mock.calls.some((call: unknown[]) => call.some((part) => typeof part === 'object'))).toBe(true);
  });

  it.each(['NGN', 'GHS', 'GBP'])('credits exactly $100 USD for a verified %s deposit once', async (currencyCode) => {
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

    const query = async (template: TemplateStringsArray, ...values: unknown[]) => {
      const sql = Array.from(template).join(' ');
      if (sql.includes('FROM "Deposit"')) {
        return [{ ...deposit, status: depositStatus }];
      }
      if (sql.includes('UPDATE "Deposit"') && sql.includes('PROCESSING')) {
        if (depositStatus === 'PENDING') {
          depositStatus = 'PROCESSING';
          return [{ id: deposit.id }];
        }
        return [];
      }
      if (sql.includes('INSERT INTO "LedgerEntry"')) {
        if (ledgerCreated) return [];
        ledgerCreated = true;
        return [{ id: `ledger-${currencyCode}` }];
      }
      if (sql.includes('FROM "LedgerEntry"')) {
        return ledgerCreated ? [{ id: `ledger-${currencyCode}` }] : [];
      }
      if (sql.includes('FROM "WalletBalance"')) {
        return [{ id: `balance-${currencyCode}`, availableBalance: balance }];
      }
      return [];
    };

    const execute = async (template: TemplateStringsArray) => {
      const sql = Array.from(template).join(' ');
      if (sql.includes('SET "status" = \'PROCESSING\'')) {
        if (depositStatus === 'PENDING') depositStatus = 'PROCESSING';
        return;
      }
      if (sql.includes('SET "status" = \'SUCCESSFUL\'')) {
        depositStatus = 'SUCCESSFUL';
        return;
      }
      if (sql.includes('SET "availableBalance"')) {
        balance += 100;
        return;
      }
    };

    const prisma = {
      $queryRaw: jest.fn(query),
      $executeRaw: jest.fn(execute),
      $transaction: jest.fn(async (handler: (tx: any) => Promise<unknown>) => handler({
        $queryRaw: query,
        $executeRaw: execute,
      })),
    } as any;
    const currencies = { getCurrency: jest.fn().mockResolvedValue({ code: 'USD' }) } as any;
    const service = new FlutterwaveService(prisma, {} as any, currencies, {} as any, {} as any, {} as any);
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

    expect(first).toMatchObject({ status: 'SUCCESSFUL', alreadyProcessed: false });
    expect(second).toMatchObject({ status: 'SUCCESSFUL', alreadyProcessed: true });
    expect(balance).toBe(100);
    expect(ledgerCreated).toBe(true);
    expect(currencies.getCurrency).toHaveBeenCalledWith('USD');
  });
});
