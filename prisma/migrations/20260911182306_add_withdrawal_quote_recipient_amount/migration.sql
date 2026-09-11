/*
  Warnings:

  - Added the required column `recipientAmount` to the `WithdrawalQuote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WithdrawalQuote" ADD COLUMN     "recipientAmount" DECIMAL(18,2) NOT NULL;
