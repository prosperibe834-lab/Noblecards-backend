/*
  Warnings:

  - A unique constraint covering the columns `[operationKey]` on the table `LedgerEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LedgerEntry" ADD COLUMN     "operationKey" TEXT,
ADD COLUMN     "pendingBalanceAfter" DECIMAL(18,2),
ADD COLUMN     "pendingBalanceBefore" DECIMAL(18,2);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "transactionPinFailedAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "transactionPinLockedUntil" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_operationKey_key" ON "LedgerEntry"("operationKey");
