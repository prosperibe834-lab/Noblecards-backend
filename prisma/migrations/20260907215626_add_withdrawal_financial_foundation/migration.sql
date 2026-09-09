-- CreateEnum
CREATE TYPE "WithdrawalQuoteStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BeneficiaryType" AS ENUM ('BANK_ACCOUNT', 'MOBILE_MONEY');

-- CreateEnum
CREATE TYPE "BeneficiaryVerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "ProviderWebhookEventStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED', 'IGNORED');

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "sourceCurrencyCode" TEXT NOT NULL,
    "destinationCurrencyCode" TEXT NOT NULL,
    "sourceAmount" DECIMAL(18,2) NOT NULL,
    "destinationAmount" DECIMAL(18,2) NOT NULL,
    "exchangeRate" DECIMAL(18,8) NOT NULL,
    "fee" DECIMAL(18,2) NOT NULL,
    "amountReceived" DECIMAL(18,2) NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "provider" "PaymentProvider",
    "providerReference" TEXT,
    "providerTransactionId" TEXT,
    "quoteId" TEXT,
    "beneficiaryId" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalQuote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceCurrencyCode" TEXT NOT NULL,
    "destinationCurrencyCode" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "sourceAmount" DECIMAL(18,2) NOT NULL,
    "exchangeRate" DECIMAL(18,8) NOT NULL,
    "destinationAmount" DECIMAL(18,2) NOT NULL,
    "providerFee" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    "nobleCardsFee" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    "totalFee" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    "amountReceived" DECIMAL(18,2) NOT NULL,
    "status" "WithdrawalQuoteStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "WithdrawalQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "type" "BeneficiaryType" NOT NULL,
    "institutionName" TEXT,
    "providerBankCode" TEXT,
    "accountHolderName" TEXT,
    "accountLast4" TEXT,
    "mobileMoneyProvider" TEXT,
    "providerRecipientReference" TEXT,
    "encryptedDetails" JSONB,
    "verificationStatus" "BeneficiaryVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutAttempt" (
    "id" TEXT NOT NULL,
    "withdrawalId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerReference" TEXT,
    "providerTransactionId" TEXT,
    "attemptNumber" INTEGER NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "requestMetadata" JSONB,
    "responseMetadata" JSONB,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayoutAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderWebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "providerReference" TEXT,
    "providerTransactionId" TEXT,
    "withdrawalId" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "status" "ProviderWebhookEventStatus" NOT NULL DEFAULT 'RECEIVED',
    "errorMessage" TEXT,
    "metadata" JSONB,

    CONSTRAINT "ProviderWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Withdrawal_reference_key" ON "Withdrawal"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Withdrawal_transactionId_key" ON "Withdrawal"("transactionId");

-- CreateIndex
CREATE INDEX "Withdrawal_userId_status_createdAt_idx" ON "Withdrawal"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Withdrawal_walletId_status_createdAt_idx" ON "Withdrawal"("walletId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Withdrawal_status_createdAt_idx" ON "Withdrawal"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Withdrawal_provider_providerReference_idx" ON "Withdrawal"("provider", "providerReference");

-- CreateIndex
CREATE INDEX "Withdrawal_provider_providerTransactionId_idx" ON "Withdrawal"("provider", "providerTransactionId");

-- CreateIndex
CREATE INDEX "Withdrawal_quoteId_idx" ON "Withdrawal"("quoteId");

-- CreateIndex
CREATE INDEX "Withdrawal_beneficiaryId_idx" ON "Withdrawal"("beneficiaryId");

-- CreateIndex
CREATE UNIQUE INDEX "Withdrawal_userId_idempotencyKey_key" ON "Withdrawal"("userId", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Withdrawal_provider_providerReference_key" ON "Withdrawal"("provider", "providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "Withdrawal_provider_providerTransactionId_key" ON "Withdrawal"("provider", "providerTransactionId");

-- CreateIndex
CREATE INDEX "WithdrawalQuote_userId_createdAt_idx" ON "WithdrawalQuote"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "WithdrawalQuote_userId_status_expiresAt_idx" ON "WithdrawalQuote"("userId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "WithdrawalQuote_expiresAt_idx" ON "WithdrawalQuote"("expiresAt");

-- CreateIndex
CREATE INDEX "Beneficiary_userId_createdAt_idx" ON "Beneficiary"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Beneficiary_userId_countryCode_currencyCode_paymentMethod_idx" ON "Beneficiary"("userId", "countryCode", "currencyCode", "paymentMethod");

-- CreateIndex
CREATE INDEX "Beneficiary_verificationStatus_idx" ON "Beneficiary"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_userId_providerRecipientReference_key" ON "Beneficiary"("userId", "providerRecipientReference");

-- CreateIndex
CREATE INDEX "PayoutAttempt_withdrawalId_createdAt_idx" ON "PayoutAttempt"("withdrawalId", "createdAt");

-- CreateIndex
CREATE INDEX "PayoutAttempt_provider_providerReference_idx" ON "PayoutAttempt"("provider", "providerReference");

-- CreateIndex
CREATE INDEX "PayoutAttempt_provider_providerTransactionId_idx" ON "PayoutAttempt"("provider", "providerTransactionId");

-- CreateIndex
CREATE INDEX "PayoutAttempt_status_createdAt_idx" ON "PayoutAttempt"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutAttempt_withdrawalId_attemptNumber_key" ON "PayoutAttempt"("withdrawalId", "attemptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutAttempt_provider_providerReference_key" ON "PayoutAttempt"("provider", "providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutAttempt_provider_providerTransactionId_key" ON "PayoutAttempt"("provider", "providerTransactionId");

-- CreateIndex
CREATE INDEX "ProviderWebhookEvent_withdrawalId_receivedAt_idx" ON "ProviderWebhookEvent"("withdrawalId", "receivedAt");

-- CreateIndex
CREATE INDEX "ProviderWebhookEvent_provider_providerReference_idx" ON "ProviderWebhookEvent"("provider", "providerReference");

-- CreateIndex
CREATE INDEX "ProviderWebhookEvent_provider_providerTransactionId_idx" ON "ProviderWebhookEvent"("provider", "providerTransactionId");

-- CreateIndex
CREATE INDEX "ProviderWebhookEvent_status_receivedAt_idx" ON "ProviderWebhookEvent"("status", "receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderWebhookEvent_provider_eventId_key" ON "ProviderWebhookEvent"("provider", "eventId");

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_sourceCurrencyCode_fkey" FOREIGN KEY ("sourceCurrencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_destinationCurrencyCode_fkey" FOREIGN KEY ("destinationCurrencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "WithdrawalQuote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalQuote" ADD CONSTRAINT "WithdrawalQuote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalQuote" ADD CONSTRAINT "WithdrawalQuote_sourceCurrencyCode_fkey" FOREIGN KEY ("sourceCurrencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalQuote" ADD CONSTRAINT "WithdrawalQuote_destinationCurrencyCode_fkey" FOREIGN KEY ("destinationCurrencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutAttempt" ADD CONSTRAINT "PayoutAttempt_withdrawalId_fkey" FOREIGN KEY ("withdrawalId") REFERENCES "Withdrawal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderWebhookEvent" ADD CONSTRAINT "ProviderWebhookEvent_withdrawalId_fkey" FOREIGN KEY ("withdrawalId") REFERENCES "Withdrawal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
