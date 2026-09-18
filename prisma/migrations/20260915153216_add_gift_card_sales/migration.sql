-- CreateEnum
CREATE TYPE "GiftCardSaleStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'FAILED', 'PAID', 'CANCELLED');

-- AlterEnum
ALTER TYPE "PaymentProvider" ADD VALUE 'SOGO';

-- CreateTable
CREATE TABLE "GiftCardSale" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'SOGO',
    "providerTradeId" TEXT,
    "providerStatus" TEXT,
    "status" "GiftCardSaleStatus" NOT NULL DEFAULT 'SUBMITTED',
    "idempotencyKey" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brandNameSnapshot" TEXT,
    "cardCountry" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "cardCurrency" TEXT NOT NULL,
    "cardAmount" DECIMAL(18,2) NOT NULL,
    "quotedPayoutAmount" DECIMAL(18,2),
    "quotedPayoutCurrency" TEXT,
    "quotedRate" DECIMAL(18,8),
    "providerFee" DECIMAL(18,2),
    "nobleCardsFee" DECIMAL(18,2),
    "finalPayoutAmount" DECIMAL(18,2),
    "payoutCurrency" TEXT,
    "additionalInfo" TEXT,
    "providerResponse" JSONB,
    "walletCreditedAt" TIMESTAMP(3),
    "walletCreditOperationKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftCardSale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardSale_transactionId_key" ON "GiftCardSale"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardSale_idempotencyKey_key" ON "GiftCardSale"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardSale_walletCreditOperationKey_key" ON "GiftCardSale"("walletCreditOperationKey");

-- CreateIndex
CREATE INDEX "GiftCardSale_userId_createdAt_idx" ON "GiftCardSale"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "GiftCardSale_userId_status_createdAt_idx" ON "GiftCardSale"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "GiftCardSale_provider_providerStatus_idx" ON "GiftCardSale"("provider", "providerStatus");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardSale_provider_providerTradeId_key" ON "GiftCardSale"("provider", "providerTradeId");

-- AddForeignKey
ALTER TABLE "GiftCardSale" ADD CONSTRAINT "GiftCardSale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftCardSale" ADD CONSTRAINT "GiftCardSale_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
