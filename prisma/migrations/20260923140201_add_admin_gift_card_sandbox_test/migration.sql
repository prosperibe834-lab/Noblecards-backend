-- CreateTable
CREATE TABLE "AdminGiftCardSandboxTest" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "providerProductId" TEXT NOT NULL,
    "productName" TEXT,
    "countryCode" TEXT,
    "currencyCode" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "recipientEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "providerReference" TEXT,
    "providerStatus" TEXT,
    "providerMessage" TEXT,
    "redeemId" TEXT,
    "voucherCiphertext" TEXT,
    "redeemDetails" JSONB,
    "providerMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AdminGiftCardSandboxTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminGiftCardSandboxTest_idempotencyKey_key" ON "AdminGiftCardSandboxTest"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "AdminGiftCardSandboxTest_reference_key" ON "AdminGiftCardSandboxTest"("reference");

-- CreateIndex
CREATE INDEX "AdminGiftCardSandboxTest_adminUserId_createdAt_idx" ON "AdminGiftCardSandboxTest"("adminUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminGiftCardSandboxTest_status_createdAt_idx" ON "AdminGiftCardSandboxTest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "AdminGiftCardSandboxTest_providerReference_idx" ON "AdminGiftCardSandboxTest"("providerReference");

-- AddForeignKey
ALTER TABLE "AdminGiftCardSandboxTest" ADD CONSTRAINT "AdminGiftCardSandboxTest_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
