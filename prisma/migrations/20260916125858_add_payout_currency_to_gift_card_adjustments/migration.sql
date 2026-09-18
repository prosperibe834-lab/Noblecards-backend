/*
  Warnings:

  - Added the required column `payoutCurrency` to the `GiftCardSellRateAdjustment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GiftCardSellRateAdjustment_slug_cardCountry_cardCurrency_ca_idx";

-- AlterTable
ALTER TABLE "GiftCardSellRateAdjustment" ADD COLUMN     "payoutCurrency" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "GiftCardSellRateAdjustment_slug_cardCountry_cardCurrency_pa_idx" ON "GiftCardSellRateAdjustment"("slug", "cardCountry", "cardCurrency", "payoutCurrency", "cardType", "isActive");
