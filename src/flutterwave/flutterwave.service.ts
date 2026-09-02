import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { Prisma } from '../generated/prisma/client';
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

  private classifyFlutterwaveError(message: string, path: string) {
    const normalized = String(message).toLowerCase();

    if (/amount should be between 0 and 3719|amount.*between 0.*3719|3719/i.test(normalized)) {
      return 'amount_limit';
    }

    if (/merchant is not enabled to accept uk ach transactions|uk ach|account-ach-uk/i.test(normalized)) {
      return 'merchant_not_enabled';
    }

    if (/authentication|auth|invalid key|secret key|unauthorized|forbidden|api key/i.test(normalized)) {
      return 'auth_error';
    }

    if (/invalid request|validation|required field|missing|bad request/i.test(normalized) || /status=error/i.test(normalized)) {
      return 'invalid_request';
    }

    if (/charges\?type=account-ach-uk|\/charges\?type=account-ach-uk/i.test(path)) {
      return 'merchant_not_enabled';
    }

    return 'other';
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
      const classification = this.classifyFlutterwaveError(message, path);
      this.logger.error(`[request] Flutterwave classification: ${classification}`);
      this.logger.error(`[request] Parsed error message: ${message}`);

      if (classification === 'amount_limit') {
        throw new BadRequestException('GBP bank transfer amount must be between £0 and £3,719.');
      }

      if (classification === 'merchant_not_enabled') {
        throw new BadRequestException('GBP bank transfer is currently unavailable. This payment method has not yet been enabled for this merchant account.');
      }

      if (classification === 'auth_error') {
        throw new BadRequestException('GBP bank transfer is currently unavailable because Flutterwave authentication is not configured correctly.');
      }

      if (classification === 'invalid_request') {
        throw new BadRequestException('GBP bank transfer request was invalid. Please check the payment details and try again.');
      }

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
    const providerStatus = response.status ?? accountData.status ?? 'unknown';
    if (!accountData.bank_name || !accountData.account_number || accountData.amount == null) {
      this.logger.error(`[createVirtualAccount] Flutterwave returned incomplete bank details: ${JSON.stringify(response)}`);
      throw new Error(`Flutterwave virtual account response is incomplete (status: ${providerStatus}). No bank details were returned.`);
    }
    const normalizedAccountName = rawAccountName || 'Account name unavailable';

    this.logger.log(`[createVirtualAccount] Virtual account created: accountNumber=${accountData.account_number}, bankName=${accountData.bank_name}, accountName=${normalizedAccountName}`);
    this.logger.log(`[createVirtualAccount] Provider transaction ID: ${accountData.id ?? accountData.flw_ref}`);

    return {
      bankName: accountData.bank_name,
      accountNumber: accountData.account_number,
      accountName: normalizedAccountName,
      amount: accountData.amount,
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

  async createGhsVirtualAccount(input: {
    amount: number;
    currency: string;
    reference: string;
    userId: string;
    walletId: string;
    depositId: string;
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

    this.logger.log(`[createGhsVirtualAccount] Creating virtual account for user ${input.userId} with amount: ${input.amount} ${input.currency}`);
    this.logger.debug(`[createGhsVirtualAccount] Reference: ${input.reference}`);
    this.logger.debug(`[createGhsVirtualAccount] Deposit ID: ${input.depositId}`);

    const payload = {
      tx_ref: input.reference,
      amount: Math.round(input.amount * 100) / 100,
      currency: input.currency,
      email: user.email,
      customer: {
        email: user.email,
        phonenumber: user.phone ?? 'N/A',
        name: user.displayName ?? user.email,
      },
      meta: {
        userId: input.userId,
        walletId: input.walletId,
        depositId: input.depositId,
        country: input.country,
        countryCode: input.countryCode,
      },
    };

    this.logger.debug(`[createGhsVirtualAccount] Sending payload: ${JSON.stringify(payload)}`);

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
      this.logger.log(`[createGhsVirtualAccount] Flutterwave raw response: ${JSON.stringify(response)}`);
      this.logger.log(`[createGhsVirtualAccount] Flutterwave response received successfully`);
    } catch (error) {
      this.logger.error(`[createGhsVirtualAccount] Flutterwave request failed`);
      this.logger.error(`[createGhsVirtualAccount] Exception: ${error instanceof Error ? error.message : String(error)}`);
      if (error instanceof Error) {
        this.logger.error(`[createGhsVirtualAccount] Stack: ${error.stack}`);
      }
      throw error;
    }

    if (!response?.data) {
      this.logger.error(`[createGhsVirtualAccount] Invalid Flutterwave response: ${JSON.stringify(response)}`);
      throw new Error('Invalid response from Flutterwave virtual account endpoint. No data returned.');
    }

    const accountData = response.data ?? response;
    const rawAccountName = typeof accountData.account_name === 'string' ? accountData.account_name.trim() : '';
    const providerStatus = response.status ?? accountData.status ?? 'unknown';
    if (!accountData.bank_name || !accountData.account_number || accountData.amount == null) {
      this.logger.error(`[createGhsVirtualAccount] Flutterwave returned incomplete bank details: ${JSON.stringify(response)}`);
      throw new Error(`Flutterwave virtual account response is incomplete (status: ${providerStatus}). No bank details were returned.`);
    }
    const normalizedAccountName = rawAccountName || 'Account name unavailable';

    this.logger.log(`[createGhsVirtualAccount] Virtual account created: accountNumber=${accountData.account_number}, bankName=${accountData.bank_name}, accountName=${normalizedAccountName}`);
    this.logger.log(`[createGhsVirtualAccount] Provider transaction ID: ${accountData.id ?? accountData.flw_ref}`);
    this.logger.log(`[createGhsVirtualAccount] Full Flutterwave response: ${JSON.stringify(accountData)}`);

    return {
      bankName: accountData.bank_name,
      accountNumber: accountData.account_number,
      accountName: normalizedAccountName,
      amount: accountData.amount,
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

  async createGbpBankCharge(input: {
    amount: number;
    currency: string;
    reference: string;
    userId: string;
    walletId: string;
    depositId: string;
    country?: string;
    countryCode?: string;
  }) {
    const amount = Number(input.amount);
    this.logger.log(`[createGbpBankCharge] Starting GBP bank charge creation`);
    this.logger.log(`[createGbpBankCharge] userId=${input.userId}, amount=${amount}, currency=${input.currency}, ref=${input.reference}`);

    if (input.currency?.toUpperCase() === 'GBP' && (!Number.isFinite(amount) || amount <= 0 || amount > 3719)) {
      this.logger.warn(`[createGbpBankCharge] GBP amount validation failed. Amount=${amount} is outside allowed range 0-3719.`);
      throw new BadRequestException('GBP bank transfer amount must be between £0 and £3,719.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: input.userId } });
    if (!user) {
      this.logger.error(`[createGbpBankCharge] User not found: ${input.userId}`);
      throw new NotFoundException('User not found for GBP bank charge creation.');
    }

    const payload = {
      type: 'account-ach-uk',
      amount: Number(input.amount),
      currency: input.currency,
      email: user.email,
      tx_ref: input.reference,
      fullname: `${user.firstName || 'NobleCards'} ${user.lastName || 'User'}`.trim(),
      redirect_url: process.env.FLUTTERWAVE_REDIRECT_URL ?? 'http://localhost:5173/deposit/callback',
      meta: {
        deposit_id: input.depositId,
        wallet_id: input.walletId,
        user_id: input.userId,
        internal_reference: input.reference,
      },
    };

    this.logger.log(`[createGbpBankCharge] Sending payload to Flutterwave /charges`);
    this.logger.log(`[createGbpBankCharge] Payload: ${JSON.stringify(payload)}`);

    let response;
    try {
      response = await this.request<{
        status: string;
        data: {
          id?: number | string;
          flw_ref?: string;
          link?: string;
          redirect_url?: string;
          tx_ref?: string;
          amount?: number;
          currency?: string;
          status?: string;
          meta?: Record<string, any>;
        };
      }>('/charges?type=account-ach-uk', 'POST', payload);
      this.logger.log(`[createGbpBankCharge] Flutterwave raw response: ${JSON.stringify(response)}`);
      this.logger.log(`[createGbpBankCharge] Flutterwave response received successfully`);
    } catch (error) {
      this.logger.error(`[createGbpBankCharge] Flutterwave request failed`);
      this.logger.error(`[createGbpBankCharge] Exception: ${error instanceof Error ? error.message : String(error)}`);
      if (error instanceof Error) {
        this.logger.error(`[createGbpBankCharge] Stack: ${error.stack}`);
      }

      if (error instanceof BadRequestException) {
        const message = error.getResponse && typeof error.getResponse === 'function' ? String(error.getResponse()) : error.message;
        const classification = this.classifyFlutterwaveError(message, '/charges?type=account-ach-uk');
        this.logger.error(`[createGbpBankCharge] Flutterwave error classification: ${classification}`);
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      const classification = this.classifyFlutterwaveError(message, '/charges?type=account-ach-uk');
      this.logger.error(`[createGbpBankCharge] Flutterwave error classification: ${classification}`);

      if (classification === 'amount_limit') {
        throw new BadRequestException('GBP bank transfer amount must be between £0 and £3,719.');
      }

      if (classification === 'merchant_not_enabled') {
        throw new BadRequestException('GBP bank transfer is currently unavailable. This payment method has not yet been enabled for this merchant account.');
      }

      if (classification === 'auth_error') {
        throw new BadRequestException('GBP bank transfer is currently unavailable because Flutterwave authentication is not configured correctly.');
      }

      if (classification === 'invalid_request') {
        throw new BadRequestException('GBP bank transfer request was invalid. Please check the payment details and try again.');
      }

      throw error;
    }

    const responseBody = response ?? {};
    const chargeData = responseBody.data ?? responseBody;
    const authorizationUrl =
      responseBody?.meta?.authorization?.redirect ??
      responseBody?.meta?.authorization?.url ??
      responseBody?.meta?.authorization_url ??
      chargeData?.meta?.authorization?.redirect ??
      chargeData?.meta?.authorization?.url ??
      chargeData?.meta?.authorization_url ??
      chargeData?.authorization?.redirect ??
      chargeData?.authorization?.url ??
      chargeData?.authorization_url ??
      chargeData?.link ??
      chargeData?.redirect_url ??
      null;

    this.logger.log(`[GBP DEBUG 1] Raw Flutterwave response: ${JSON.stringify(response)}`);
    this.logger.log(`[createGbpBankCharge] GBP provider response body keys: ${JSON.stringify(Object.keys(responseBody || {}))}`);
    this.logger.log(`[createGbpBankCharge] GBP provider meta: ${JSON.stringify(responseBody?.meta ?? null)}`);
    this.logger.log(`[createGbpBankCharge] GBP bank charge created: id=${chargeData.id}, ref=${chargeData.tx_ref}`);
    this.logger.log(`[GBP DEBUG 2] Extracted authorization URL: ${authorizationUrl ?? 'NONE'}`);
    this.logger.log(`[GBP DEBUG 3] createGbpBankCharge return value: ${JSON.stringify({
      authorizationUrl,
      providerReference: chargeData.tx_ref ?? input.reference,
      providerTransactionId: String(chargeData.id ?? chargeData.flw_ref ?? ''),
      amount: chargeData.amount ?? input.amount,
      currency: chargeData.currency ?? input.currency,
      meta: {
        configured: true,
        paymentMethod: 'BANK_TRANSFER',
        reference: input.reference,
        provider: 'FLUTTERWAVE',
        chargeType: 'account-ach-uk',
        providerTransactionId: chargeData.id ?? chargeData.flw_ref,
        authorizationUrl,
      },
    })}`);
    this.logger.log(`[createGbpBankCharge] Authorization URL type: ${typeof authorizationUrl}`);

    if (!authorizationUrl) {
      this.logger.warn('[createGbpBankCharge] Flutterwave returned a successful GBP charge without an authorization URL. Logging the raw provider response for inspection.');
      this.logger.warn(`[createGbpBankCharge] Raw provider response: ${JSON.stringify(response)}`);
    }

    return {
      authorizationUrl,
      providerReference: chargeData.tx_ref ?? input.reference,
      providerTransactionId: String(chargeData.id ?? chargeData.flw_ref ?? ''),
      amount: chargeData.amount ?? input.amount,
      currency: chargeData.currency ?? input.currency,
      meta: {
        configured: true,
        paymentMethod: 'BANK_TRANSFER',
        reference: input.reference,
        provider: 'FLUTTERWAVE',
        chargeType: 'account-ach-uk',
        providerTransactionId: chargeData.id ?? chargeData.flw_ref,
        authorizationUrl,
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

    const depositRows = await this.prisma.$queryRaw<Array<any>>`
      SELECT d.*, t.id AS "transactionId", t.status AS "transactionStatus", t.reference AS "transactionReference"
      FROM "Deposit" d
      LEFT JOIN "Transaction" t ON t.id = d."transactionId"
      WHERE ${providerReference
        ? Prisma.sql`d."providerReference" = ${String(providerReference)}`
        : providerTransactionId
          ? Prisma.sql`d."providerTransactionId" = ${String(providerTransactionId)}`
          : Prisma.sql`FALSE`}
      LIMIT 1
    `;
    const deposit = depositRows[0] ? {
      ...depositRows[0],
      transaction: depositRows[0].transactionId ? {
        id: depositRows[0].transactionId,
        status: depositRows[0].transactionStatus,
        reference: depositRows[0].transactionReference,
      } : null,
    } : null;

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
    const depositRows = await this.prisma.$queryRaw<Array<any>>`
      SELECT d.*, t.id AS "transactionId", t.status AS "transactionStatus", t.reference AS "transactionReference"
      FROM "Deposit" d
      LEFT JOIN "Transaction" t ON t.id = d."transactionId"
      WHERE d."provider" = ${input.provider}
        AND (
          ${input.providerTransactionId ? Prisma.sql`d."providerTransactionId" = ${input.providerTransactionId}` : Prisma.sql`FALSE`}
          OR ${input.providerReference ? Prisma.sql`d."providerReference" = ${input.providerReference}` : Prisma.sql`FALSE`}
        )
      LIMIT 1
    `;
    const deposit = depositRows[0] ? {
      ...depositRows[0],
      transaction: depositRows[0].transactionId ? {
        id: depositRows[0].transactionId,
        status: depositRows[0].transactionStatus,
        reference: depositRows[0].transactionReference,
      } : null,
    } : null;

    if (!deposit) {
      throw new NotFoundException('Matching deposit not found for provider transaction.');
    }

    if (deposit.status === 'SUCCESSFUL' || deposit.transaction?.status === 'SUCCESSFUL') {
      return { id: deposit.id, status: 'SUCCESSFUL', alreadyProcessed: true };
    }

    const reserved = await this.prisma.$queryRaw<Array<any>>`
      UPDATE "Deposit"
      SET "status" = 'PROCESSING', "updatedAt" = NOW()
      WHERE "id" = ${deposit.id} AND "status" IN ('PENDING', 'PROCESSING')
      RETURNING "id"
    `;

    if (reserved.length === 0) {
      const currentRows = await this.prisma.$queryRaw<Array<any>>`
        SELECT "status" FROM "Deposit" WHERE "id" = ${deposit.id}
      `;
      const current = currentRows[0] ?? null;
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
      await this.prisma.$executeRaw`
        UPDATE "Deposit"
        SET "status" = 'FAILED', "metadata" = ${JSON.stringify({
          ...(deposit.metadata as Record<string, unknown> ?? {}),
          flutterwave: {
            verifiedAt: new Date().toISOString(),
            amount: verification.amount,
            currency: verification.currency,
            failure: 'Provider verification returned unsuccessful.',
          },
        })}::jsonb, "updatedAt" = NOW()
        WHERE "id" = ${deposit.id}
      `;
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

    const currency = await this.currencies.getCurrency('USD');
    const netAmount = Number(deposit.netAmount.toString());

    return this.prisma.$transaction(async (tx: any) => {
      const currentRows = await tx.$queryRaw<Array<any>>`
        SELECT d.*, t.id AS "transactionId", t.status AS "transactionStatus", t.reference AS "transactionReference"
        FROM "Deposit" d
        LEFT JOIN "Transaction" t ON t.id = d."transactionId"
        WHERE d."id" = ${deposit.id}
        LIMIT 1
      `;
      const currentDeposit = currentRows[0] ? {
        ...currentRows[0],
        transaction: currentRows[0].transactionId ? {
          id: currentRows[0].transactionId,
          status: currentRows[0].transactionStatus,
          reference: currentRows[0].transactionReference,
        } : null,
      } : null;
      if (!currentDeposit) {
        throw new NotFoundException('Matching deposit not found for provider transaction.');
      }

      if (currentDeposit.status === 'SUCCESSFUL') {
        return { id: deposit.id, status: 'SUCCESSFUL', alreadyProcessed: true };
      }

      const existingLedgerRows = await tx.$queryRaw<Array<any>>`
        SELECT "id" FROM "LedgerEntry"
        WHERE "walletId" = ${currentDeposit.walletId}
          AND "currencyCode" = 'USD'
          AND "reference" = ${`deposit-${currentDeposit.id}`}
        LIMIT 1
      `;
      const existingLedger = existingLedgerRows[0] ?? null;

      if (existingLedger) {
        await tx.$executeRaw`UPDATE "Transaction" SET "status" = 'SUCCESSFUL', "updatedAt" = NOW() WHERE "id" = ${currentDeposit.transactionId}`;
        await tx.$executeRaw`UPDATE "Deposit" SET "status" = 'SUCCESSFUL', "updatedAt" = NOW() WHERE "id" = ${currentDeposit.id}`;
        return { id: currentDeposit.id, status: 'SUCCESSFUL', alreadyProcessed: true, ledgerEntryId: existingLedger.id };
      }

      await tx.$executeRaw`
        INSERT INTO "WalletBalance" (
          "id", "walletId", "currencyCode", "availableBalance", "pendingBalance", "createdAt", "updatedAt"
        ) VALUES (${randomUUID()}, ${currentDeposit.walletId}, 'USD', 0, 0, NOW(), NOW())
        ON CONFLICT ("walletId", "currencyCode") DO NOTHING
      `;

      const walletBalanceRows = await tx.$queryRaw<Array<any>>`
        SELECT * FROM "WalletBalance"
        WHERE "walletId" = ${currentDeposit.walletId} AND "currencyCode" = 'USD'
        LIMIT 1
      `;
      const walletBalance = walletBalanceRows[0] ?? null;

      if (!walletBalance) {
        throw new NotFoundException('Wallet balance is missing for the credited currency.');
      }

      const balanceBefore = new Decimal(walletBalance.availableBalance.toString());
      const balanceAfter = balanceBefore.plus(new Decimal(netAmount.toFixed(2)));

      await tx.$executeRaw`
        UPDATE "WalletBalance"
        SET "availableBalance" = ${balanceAfter.toString()}, "updatedAt" = NOW()
        WHERE "id" = ${walletBalance.id}
      `;

      const ledgerEntryRows = await tx.$queryRaw<Array<any>>`
        INSERT INTO "LedgerEntry" (
          "id", "walletId", "currencyCode", "transactionId", "type", "amount",
          "balanceBefore", "balanceAfter", "reference", "reason", "createdAt"
        )
        SELECT ${randomUUID()}, ${currentDeposit.walletId}, ${currency.code}, ${currentDeposit.transactionId ?? null}, 'CREDIT',
          ${netAmount.toFixed(2)}, ${balanceBefore.toString()}, ${balanceAfter.toString()}, ${`deposit-${currentDeposit.id}`},
          'Flutterwave deposit verified and credited', NOW()
        WHERE NOT EXISTS (
          SELECT 1 FROM "LedgerEntry" WHERE "reference" = ${`deposit-${currentDeposit.id}`}
        )
        RETURNING "id"
      `;
      const ledgerEntry = ledgerEntryRows[0];
      if (!ledgerEntry) {
        return { id: currentDeposit.id, status: 'SUCCESSFUL', alreadyProcessed: true };
      }

      await tx.$executeRaw`
        UPDATE "Transaction"
        SET "status" = 'SUCCESSFUL', "providerTransactionId" = ${input.providerTransactionId},
            "providerReference" = ${input.providerReference ?? null},
            "metadata" = ${JSON.stringify({
              flutterwave: { verifiedAt: new Date().toISOString(), amount: verification.amount, currency: verification.currency },
            })}::jsonb, "updatedAt" = NOW()
        WHERE "id" = ${currentDeposit.transactionId}
      `;

      await tx.$executeRaw`
        UPDATE "Deposit"
        SET "status" = 'SUCCESSFUL', "providerTransactionId" = ${input.providerTransactionId},
            "providerReference" = ${input.providerReference ?? deposit.providerReference ?? null},
            "metadata" = ${JSON.stringify({
              ...(deposit.metadata as Record<string, unknown> ?? {}),
              flutterwave: { verifiedAt: new Date().toISOString(), amount: verification.amount, currency: verification.currency },
            })}::jsonb, "updatedAt" = NOW()
        WHERE "id" = ${currentDeposit.id}
      `;

      return { id: currentDeposit.id, status: 'SUCCESSFUL', alreadyProcessed: false, ledgerEntryId: ledgerEntry.id };
    });
  }
}
