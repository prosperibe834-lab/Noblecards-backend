ALTER TABLE "Deposit"
  ADD COLUMN "nobleCardsFee" DECIMAL(18,2),
  ADD COLUMN "nobleCardsFeeUsd" DECIMAL(18,8);

CREATE TABLE "PlatformAccountingEntry" (
  "id" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "entryType" TEXT NOT NULL,
  "amount" DECIMAL(20,8) NOT NULL,
  "currencyCode" TEXT NOT NULL,
  "usdAmount" DECIMAL(20,8) NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PlatformAccountingEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PlatformAccountingEntry_idempotencyKey_key"
  ON "PlatformAccountingEntry"("idempotencyKey");
CREATE INDEX "PlatformAccountingEntry_occurredAt_entryType_idx"
  ON "PlatformAccountingEntry"("occurredAt", "entryType");
CREATE INDEX "PlatformAccountingEntry_sourceType_sourceId_idx"
  ON "PlatformAccountingEntry"("sourceType", "sourceId");
