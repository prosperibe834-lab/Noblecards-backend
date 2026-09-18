-- AlterTable
ALTER TABLE "GiftCardSale" ADD COLUMN     "adjustmentPercent" DECIMAL(9,4),
ADD COLUMN     "providerRate" DECIMAL(18,8),
ADD COLUMN     "receiptType" TEXT;

-- CreateTable
CREATE TABLE "GiftCardSellRateAdjustment" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cardCountry" TEXT NOT NULL,
    "cardCurrency" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "receiptType" TEXT,
    "minimumDenomination" DECIMAL(18,2),
    "maximumDenomination" DECIMAL(18,2),
    "adjustmentPercent" DECIMAL(9,4) NOT NULL,
    "combinationKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftCardSellRateAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardSellRateAdjustment_combinationKey_key" ON "GiftCardSellRateAdjustment"("combinationKey");

-- CreateIndex
CREATE INDEX "GiftCardSellRateAdjustment_slug_cardCountry_cardCurrency_ca_idx" ON "GiftCardSellRateAdjustment"("slug", "cardCountry", "cardCurrency", "cardType", "isActive");
