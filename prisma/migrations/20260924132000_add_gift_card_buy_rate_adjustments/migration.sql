-- CreateTable
CREATE TABLE "GiftCardBuyRateAdjustment" (
    "id" TEXT NOT NULL,
    "providerProductId" TEXT,
    "brandName" TEXT,
    "countryCode" TEXT,
    "currencyCode" TEXT,
    "minimumDenomination" DECIMAL(18,2),
    "maximumDenomination" DECIMAL(18,2),
    "adjustmentPercent" DECIMAL(9,4) NOT NULL,
    "combinationKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftCardBuyRateAdjustment_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "GiftCardPurchase"
ADD COLUMN "buyAdjustmentPercent" DECIMAL(9,4) NOT NULL DEFAULT 0.00,
ADD COLUMN "buyAdjustmentAmount" DECIMAL(18,2) NOT NULL DEFAULT 0.00;

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardBuyRateAdjustment_combinationKey_key" ON "GiftCardBuyRateAdjustment"("combinationKey");

-- CreateIndex
CREATE INDEX "GiftCardBuyRateAdjustment_providerProductId_countryCode_currencyCode_isActive_idx" ON "GiftCardBuyRateAdjustment"("providerProductId", "countryCode", "currencyCode", "isActive");

-- CreateIndex
CREATE INDEX "GiftCardBuyRateAdjustment_brandName_countryCode_currencyCode_isActive_idx" ON "GiftCardBuyRateAdjustment"("brandName", "countryCode", "currencyCode", "isActive");