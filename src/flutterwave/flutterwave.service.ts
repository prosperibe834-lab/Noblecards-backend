import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { TransactionsService } from '../transactions/transactions.service';
import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class FlutterwaveService {
  private readonly logger = new Logger(FlutterwaveService.name);
  private readonly baseUrl = 'https://api.flutterwave.com/v3';

  constructor(
    private readonly prisma: PrismaService,
    private readonly wallets: WalletsService,
    private readonly currencies: CurrenciesService,
    private readonly transactions: TransactionsService,
    private readonly ledger: LedgerService,
  ) {}

  private getSecretKey() {
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Flutterwave secret key is not configured.');
    }
    return secretKey;
  }

  private async request<T>(path: string, method: 'GET' | 'POST', body?: Record<string, unknown>) {
    const secretKey = this.getSecretKey();
    const url = `${this.baseUrl}${path}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let parsed: any = {};
    
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch (parseError) {
      this.logger.warn(`[request] Failed to parse response as JSON for ${method} ${path}`);
      this.logger.warn(`[request] Response text: ${text.substring(0, 500)}`);
    }

    if (!response.ok) {
      this.logger.error(`[request] FLUTTERWAVE HTTP ${response.status} for ${method} ${path}`);
      this.logger.error(`[request] Flutterwave endpoint: ${path}`);
      this.logger.error(`[request] Flutterwave response text: ${text.substring(0, 1000)}`);
      const message = parsed?.message ?? text ?? 'Flutterwave request failed.';
      this.logger.error(`[request] Parsed error message: ${message}`);
      throw new Error(`Flutterwave ${response.status}: ${message}`);
    }

    return parsed as T;
  }

  async createVirtualAccount(input: {
    amount: number;
    currency: string;
    reference: string;
    userId: string;
    walletId: string;
    depositId: string;
    country?: string;
    countryCode?: string;
  }) {
    this.logger.log(`[createVirtualAccount] Starting virtual account creation`);
    this.logger.log(`[createVirtualAccount] userId=${input.userId}, amount=${input.amount}, currency=${input.currency}, ref=${input.reference}`);
    
    const secretKey = this.getSecretKey();

    const user = await this.prisma.user.findUnique({ where: { id: input.userId } });
    if (!user) {
      this.logger.error(`[createVirtualAccount] User not found: ${input.userId}`);
      throw new NotFoundException('User not found for virtual account creation.');
    }

    this.logger.log(`[createVirtualAccount] User found: ${user.email}, firstName=${user.firstName}, lastName=${user.lastName}`);

    const payload = {
      tx_ref: input.reference,
      amount: Number(input.amount),
      currency: input.currency,
      email: user.email,
      customer: {
        email: user.email,
        firstname: user.firstName || 'NobleCards',
        lastname: user.lastName || 'User',
        phonenumber: user.phone ?? '',
      },
      meta: {
        deposit_id: input.depositId,
        wallet_id: input.walletId,
        user_id: input.userId,
        internal_reference: input.reference,
      },
    };

    this.logger.log(`[createVirtualAccount] Sending payload to Flutterwave /virtual-account-numbers`);
    this.logger.log(`[createVirtualAccount] Payload: ${JSON.stringify(payload)}`);

    let response;
    try {
      response = await this.request<{
        status: string;
        data: {
          id?: number | string;
          flw_ref?: string;
          account_number?: string;
          account_name?: string;
          bank_name?: string;
          bank_code?: string;
          currency?: string;
          amount?: number;
          tx_ref?: string;
          expiry_date?: string;
          status?: string;
          meta?: Record<string, any>;
        };
      }>('/virtual-account-numbers', 'POST', payload);
      this.logger.log(`[createVirtualAccount] Flutterwave raw response: ${JSON.stringify(response)}`);
      this.logger.log(`[createVirtualAccount] Flutterwave response received successfully`);
    } catch (error) {
      this.logger.error(`[createVirtualAccount] Flutterwave request failed`);
      this.logger.error(`[createVirtualAccount] Exception: ${error instanceof Error ? error.message : String(error)}`);
      if (error instanceof Error) {
        this.logger.error(`[createVirtualAccount] Stack: ${error.stack}`);
      }
      throw error;
    }

    const accountData = response.data ?? response;
    const rawAccountName = typeof accountData.account_name === 'string' ? accountData.account_name.trim() : '';
    const normalizedAccountName = rawAccountName || 'Account name unavailable';

    this.logger.log(`[createVirtualAccount] Virtual account created: accountNumber=${accountData.account_number}, bankName=${accountData.bank_name}, accountName=${normalizedAccountName}`);
    this.logger.log(`[createVirtualAccount] Provider transaction ID: ${accountData.id ?? accountData.flw_ref}`);

    return {
      bankName: accountData.bank_name ?? 'Bank',
      accountNumber: accountData.account_number ?? '',
      accountName: normalizedAccountName,
      amount: accountData.amount ?? input.amount,
      currency: accountData.currency ?? input.currency,
      expiresAt: accountData.expiry_date ?? null,
      providerReference: accountData.tx_ref ?? input.reference,
      providerTransactionId: String(accountData.id ?? accountData.flw_ref ?? ''),
      bankCode: accountData.bank_code ?? null,
      meta: {
        configured: true,
        paymentMethod: 'BANK_TRANSFER',
        reference: input.reference,
        provider: 'FLUTTERWAVE',
        accountNumber: accountData.account_number,
        accountName: normalizedAccountName,
        bankName: accountData.bank_name,
        expiresAt: accountData.expiry_date,
        providerTransactionId: accountData.id ?? accountData.flw_ref,
      },
    };
  }

  async createPayment(input: {
    amount: number;
    currency: string;
    reference: string;
    userId: string;
    walletId: string;
    depositId: string;
    paymentMethod: string;
    country?: string;
    countryCode?: string;
  }) {
    const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

    if (!publicKey || !secretKey) {
      this.logger.warn('Flutterwave credentials are not configured. Deposit remains pending until configuration is added.');
      throw new Error('Flutterwave credentials are not configured.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: input.userId } });
    if (!user) {
      throw new NotFoundException('User not found for deposit payment creation.');
    }

    const payload = {
      tx_ref: input.reference,
      amount: Number(input.amount).toFixed(2),
      currency: input.currency,
      redirect_url: process.env.FLUTTERWAVE_REDIRECT_URL ?? 'http://localhost:5173/deposit/callback',
      payment_options: input.paymentMethod,
      meta: {
        deposit_id: input.depositId,
        wallet_id: input.walletId,
        user_id: input.userId,
        internal_reference: input.reference,
      },
      customer: {
        email: user.email,
        phonenumber: user.phone ?? '',
        name: `${user.firstName} ${user.lastName}`.trim() || 'NobleCards User',
      },
      customizations: {
        title: 'NobleCards Deposit',
        description: 'Wallet funding deposit',
        logo: process.env.FLUTTERWAVE_LOGO_URL ?? 'https://example.com/logo.png',
      },
    };

    const response = await this.request<{ data: { link?: string; id?: number | string; tx_ref?: string; transaction_id?: number | string } }>(
      '/payments',
      'POST',
      payload,
    );

    const paymentData = response.data ?? response;
    return {
      paymentLink: paymentData.link ?? null,
      providerReference: paymentData.tx_ref ?? input.reference,
      providerTransactionId: String(paymentData.id ?? paymentData.transaction_id ?? ''),
      meta: {
        configured: true,
        paymentMethod: input.paymentMethod,
        reference: input.reference,
        provider: 'FLUTTERWAVE',
      },
    };
  }

  async verifyTransaction(providerTransactionIdOrReference: string, providerReference?: string) {
    if (!providerTransactionIdOrReference) {
      throw new BadRequestException('A Flutterwave transaction identifier is required for verification.');
    }

    const identifier = providerTransactionIdOrReference.trim();
    const isNumeric = /^\d+$/.test(identifier);
    const endpoint = isNumeric
      ? `/transactions/${encodeURIComponent(identifier)}/verify`
      : `/transactions/verify_by_reference?tx_ref=${encodeURIComponent(identifier)}`;

    const response = await this.request<{ data?: any }>(endpoint, 'GET');
    const data = response.data ?? response;
    const status = String(data?.status ?? 'pending').toLowerCase();
    const verified = status === 'successful' || status === 'success';

    return {
      status: data?.status ?? 'PENDING',
      verified,
      providerReference: data?.tx_ref ?? providerReference ?? identifier,
      providerTransactionId: String(data?.id ?? data?.transaction_id ?? identifier),
      amount: String(data?.amount ?? '0'),
      currency: data?.currency ?? 'USD',
      raw: data,
    };
  }

  async validateWebhookSignature(signature: string | undefined, _payload: string) {
    const webhookSecretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH?.trim();
    const providedSignature = signature?.trim();

    if (!webhookSecretHash || !providedSignature) {
      return false;
    }

    const input = Buffer.from(providedSignature, 'utf8');
    const expected = Buffer.from(webhookSecretHash, 'utf8');

    if (input.length !== expected.length) {
      return false;
    }

    return timingSafeEqual(input, expected);
  }

  async processWebhookEvent(payload: Record<string, any>) {
    const event = payload?.event ?? 'unknown';
    const data = payload?.data ?? payload;
    const providerTransactionId = data?.id ?? data?.transaction_id ?? data?.flw_ref ?? null;
    const providerReference = data?.tx_ref ?? data?.reference ?? null;

    this.logger.log(`Flutterwave webhook event received: ${event}`);

    if (!providerTransactionId && !providerReference) {
      this.logger.warn('Flutterwave webhook event had no transaction identifier.');
      return { ok: false, processed: false, message: 'Flutterwave event had no transaction identifier.' };
    }

    const prisma = this.prisma as any;
    const deposit = await prisma.deposit.findFirst({
      where: {
        OR: [
          ...(providerTransactionId ? [{ providerTransactionId: String(providerTransactionId) }] : []),
          ...(providerReference ? [{ providerReference: String(providerReference) }] : []),
        ],
      },
      include: { transaction: true },
    });

    if (!deposit) {
      this.logger.warn('Flutterwave webhook received for a transaction without a matching deposit record.');
      return { ok: false, processed: false, message: 'No matching NobleCards deposit was found for this Flutterwave event.' };
    }

    const verification = await this.verifyTransaction(
      String(providerTransactionId ?? providerReference ?? ''),
      String(providerReference ?? providerTransactionId ?? ''),
    );

    this.logger.log(`Flutterwave transaction verification result for deposit ${deposit.id}: ${verification.status} / verified=${verification.verified}`);

    if (!verification.verified) {
      this.logger.warn(`Flutterwave verification did not succeed for deposit ${deposit.id}.`);
      return { ok: true, processed: false, status: 'PENDING', depositId: deposit.id, providerReference: verification.providerReference };
    }

    if (verification.amount && Number(verification.amount) !== Number(deposit.amount.toString())) {
      this.logger.warn(`Flutterwave amount mismatch for deposit ${deposit.id}.`);
      return { ok: false, processed: false, message: 'Amount mismatch between Flutterwave and NobleCards deposit.', depositId: deposit.id };
    }

    if (verification.currency && verification.currency.toUpperCase() !== deposit.currencyCode) {
      this.logger.warn(`Flutterwave currency mismatch for deposit ${deposit.id}.`);
      return { ok: false, processed: false, message: 'Currency mismatch between Flutterwave and NobleCards deposit.', depositId: deposit.id };
    }

    const result = await this.verifyAndCreditDeposit({
      provider: 'FLUTTERWAVE',
      providerTransactionId: String(providerTransactionId ?? verification.providerTransactionId),
      providerReference: String(providerReference ?? verification.providerReference),
      amount: verification.amount,
      currency: verification.currency,
    });

    if (result.alreadyProcessed) {
      this.logger.log(`Flutterwave deposit ${deposit.id} was already processed; duplicate webhook ignored.`);
    } else {
      this.logger.log(`Flutterwave deposit ${deposit.id} was successfully credited to the wallet.`);
    }

    return {
      ok: true,
      processed: true,
      event,
      depositId: deposit.id,
      ...result,
    };
  }

  async verifyAndCreditDeposit(input: {
    provider: 'FLUTTERWAVE' | 'MANUAL' | 'INTERNAL';
    providerTransactionId: string;
    providerReference?: string;
    amount?: string;
    currency?: string;
  }) {
    const prisma = this.prisma as any;
    const deposit = await prisma.deposit.findFirst({
      where: {
        provider: input.provider,
        ...(input.providerTransactionId ? { providerTransactionId: input.providerTransactionId } : {}),
        ...(input.providerReference ? { providerReference: input.providerReference } : {}),
      },
      include: { transaction: true, wallet: true, user: true },
    });

    if (!deposit) {
      throw new NotFoundException('Matching deposit not found for provider transaction.');
    }

    if (deposit.status === 'SUCCESSFUL' || deposit.transaction?.status === 'SUCCESSFUL') {
      return { id: deposit.id, status: 'SUCCESSFUL', alreadyProcessed: true };
    }

    const reserved = await prisma.deposit.updateMany({
      where: { id: deposit.id, status: { in: ['PENDING', 'PROCESSING'] } },
      data: { status: 'PROCESSING' },
    });

    if (reserved.count === 0) {
      const current = await prisma.deposit.findUnique({ where: { id: deposit.id }, select: { status: true } });
      if (current?.status === 'SUCCESSFUL') {
        return { id: deposit.id, status: 'SUCCESSFUL', alreadyProcessed: true };
      }
      return {
        id: deposit.id,
        status: current?.status ?? deposit.status,
        alreadyProcessed: true,
        message: 'Deposit is already being processed or has already been credited.',
      };
    }

    const verification = await this.verifyTransaction(
      input.providerTransactionId || input.providerReference || '',
      input.providerReference,
    );

    if (!verification.verified) {
      await prisma.deposit.update({
        where: { id: deposit.id },
        data: {
          status: 'FAILED',
          metadata: {
            ...(deposit.metadata as Record<string, unknown> ?? {}),
            flutterwave: {
              verifiedAt: new Date().toISOString(),
              amount: verification.amount,
              currency: verification.currency,
              failure: 'Provider verification returned unsuccessful.',
            },
          },
        },
      });
      return { id: deposit.id, status: 'FAILED', alreadyProcessed: false, message: 'Flutterwave verification returned unsuccessful.' };
    }

    const expectedAmount = Number(deposit.amount.toString());
    const actualAmount = Number(verification.amount ?? deposit.amount.toString());
    if (actualAmount !== expectedAmount) {
      throw new BadRequestException('Amount mismatch. Flutterwave transaction does not match the NobleCards deposit amount.');
    }

    const expectedCurrency = deposit.currencyCode.toUpperCase();
    const actualCurrency = (verification.currency ?? deposit.currencyCode).toUpperCase();
    if (actualCurrency !== expectedCurrency) {
      throw new BadRequestException('Currency mismatch. Flutterwave transaction does not match the NobleCards deposit currency.');
    }

    const currency = await this.currencies.getCurrency(actualCurrency ?? deposit.currencyCode);
    const netAmount = Number(deposit.netAmount.toString());

    return prisma.$transaction(async (tx: any) => {
      const currentDeposit = await tx.deposit.findUnique({ where: { id: deposit.id }, include: { transaction: true } });
      if (!currentDeposit) {
        throw new NotFoundException('Matching deposit not found for provider transaction.');
      }

      if (currentDeposit.status === 'SUCCESSFUL') {
        return { id: deposit.id, status: 'SUCCESSFUL', alreadyProcessed: true };
      }

      const existingLedger = await tx.ledgerEntry.findFirst({
        where: {
          walletId: currentDeposit.walletId,
          currencyCode: currentDeposit.currencyCode,
          reference: `deposit-${currentDeposit.id}`,
        },
      });

      if (existingLedger) {
        await tx.transaction.update({
          where: { id: currentDeposit.transactionId ?? '' },
          data: { status: 'SUCCESSFUL' },
        });
        await tx.deposit.update({
          where: { id: currentDeposit.id },
          data: { status: 'SUCCESSFUL' },
        });
        return { id: currentDeposit.id, status: 'SUCCESSFUL', alreadyProcessed: true, ledgerEntryId: existingLedger.id };
      }

      const walletBalance = await tx.walletBalance.findUnique({
        where: { walletId_currencyCode: { walletId: currentDeposit.walletId, currencyCode: currency.code } },
      });

      if (!walletBalance) {
        throw new NotFoundException('Wallet balance is missing for the credited currency.');
      }

      const balanceBefore = new Decimal(walletBalance.availableBalance.toString());
      const balanceAfter = balanceBefore.plus(new Decimal(netAmount.toFixed(2)));

      await tx.walletBalance.update({
        where: { id: walletBalance.id },
        data: {
          availableBalance: balanceAfter,
        },
      });

      const ledgerEntry = await tx.ledgerEntry.create({
        data: {
          walletId: currentDeposit.walletId,
          currencyCode: currency.code,
          transactionId: currentDeposit.transactionId ?? null,
          type: 'CREDIT',
          amount: new Decimal(netAmount.toFixed(2)),
          balanceBefore: balanceBefore,
          balanceAfter: balanceAfter,
          reference: `deposit-${currentDeposit.id}`,
          reason: 'Flutterwave deposit verified and credited',
        },
      });

      await tx.transaction.update({
        where: { id: currentDeposit.transactionId ?? '' },
        data: {
          status: 'SUCCESSFUL',
          providerTransactionId: input.providerTransactionId,
          providerReference: input.providerReference ?? currentDeposit.transaction?.providerReference ?? null,
          metadata: {
            ...(currentDeposit.transaction?.metadata ?? {}),
            flutterwave: {
              verifiedAt: new Date().toISOString(),
              amount: verification.amount,
              currency: verification.currency,
            },
          },
        },
      });

      await tx.deposit.update({
        where: { id: currentDeposit.id },
        data: {
          status: 'SUCCESSFUL',
          providerTransactionId: input.providerTransactionId,
          providerReference: input.providerReference ?? deposit.providerReference ?? null,
          metadata: {
            ...(deposit.metadata as Record<string, unknown> ?? {}),
            flutterwave: {
              verifiedAt: new Date().toISOString(),
              amount: verification.amount,
              currency: verification.currency,
            },
          },
        },
      });

      return { id: currentDeposit.id, status: 'SUCCESSFUL', alreadyProcessed: false, ledgerEntryId: ledgerEntry.id };
    });
  }
}
