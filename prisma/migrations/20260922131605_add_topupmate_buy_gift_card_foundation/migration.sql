-- CreateEnum
CREATE TYPE "GiftCardPurchaseStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESSFUL', 'FAILED', 'UNDER_REVIEW');

-- AlterEnum
ALTER TYPE "PaymentProvider" ADD VALUE 'TOPUPMATE';

-- CreateTable
CREATE TABLE "GiftCardPurchase" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "transactionId" TEXT,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'TOPUPMATE',
    "providerProductId" TEXT NOT NULL,
    "providerReference" TEXT,
    "redeemId" TEXT,
    "brandNameSnapshot" TEXT,
    "productNameSnapshot" TEXT,
    "countryCode" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "denominationType" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "amount" DECIMAL(18,2) NOT NULL,
    "providerAmount" DECIMAL(18,2),
    "fee" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    "customerPrice" DECIMAL(18,2) NOT NULL,
    "status" "GiftCardPurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "providerStatus" TEXT,
    "providerMessage" TEXT,
    "voucherCiphertext" TEXT,
    "redeemDetails" JSONB,
    "providerMetadata" JSONB,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "GiftCardPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardPurchase_reference_key" ON "GiftCardPurchase"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardPurchase_idempotencyKey_key" ON "GiftCardPurchase"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardPurchase_transactionId_key" ON "GiftCardPurchase"("transactionId");

-- CreateIndex
CREATE INDEX "GiftCardPurchase_userId_createdAt_idx" ON "GiftCardPurchase"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "GiftCardPurchase_userId_status_createdAt_idx" ON "GiftCardPurchase"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "GiftCardPurchase_provider_providerStatus_idx" ON "GiftCardPurchase"("provider", "providerStatus");

-- CreateIndex
CREATE INDEX "GiftCardPurchase_providerProductId_countryCode_currencyCode_idx" ON "GiftCardPurchase"("providerProductId", "countryCode", "currencyCode");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardPurchase_provider_providerReference_key" ON "GiftCardPurchase"("provider", "providerReference");

-- AddForeignKey
ALTER TABLE "GiftCardPurchase" ADD CONSTRAINT "GiftCardPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftCardPurchase" ADD CONSTRAINT "GiftCardPurchase_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftCardPurchase" ADD CONSTRAINT "GiftCardPurchase_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
