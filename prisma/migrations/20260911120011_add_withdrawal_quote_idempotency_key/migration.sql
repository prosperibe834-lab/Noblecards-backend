/*
  Warnings:

  - A unique constraint covering the columns `[userId,idempotencyKey]` on the table `WithdrawalQuote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "WithdrawalQuote" ADD COLUMN     "idempotencyKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawalQuote_userId_idempotencyKey_key" ON "WithdrawalQuote"("userId", "idempotencyKey");
