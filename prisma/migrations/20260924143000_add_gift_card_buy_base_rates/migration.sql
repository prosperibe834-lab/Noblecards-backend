-- CreateTable
CREATE TABLE "GiftCardBuyBaseRate" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'TREMENDOUS',
    "providerProductId" TEXT,
    "brandName" TEXT,
    "countryCode" TEXT,
    "currencyCode" TEXT,
    "minimumDenomination" DECIMAL(18,2),
    "maximumDenomination" DECIMAL(18,2),
    "ratePercent" DECIMAL(9,4) NOT NULL,
    "combinationKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftCardBuyBaseRate_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "GiftCardPurchase"
ADD COLUMN "baseBuyRatePercent" DECIMAL(9,4) NOT NULL DEFAULT 0.00,
ADD COLUMN "customerRatePercent" DECIMAL(9,4) NOT NULL DEFAULT 0.00;

-- CreateIndex
CREATE UNIQUE INDEX "GiftCardBuyBaseRate_combinationKey_key" ON "GiftCardBuyBaseRate"("combinationKey");

-- CreateIndex
CREATE INDEX "GiftCardBuyBaseRate_provider_providerProductId_countryCode_currencyCode_isActive_idx" ON "GiftCardBuyBaseRate"("provider", "providerProductId", "countryCode", "currencyCode", "isActive");

-- CreateIndex
CREATE INDEX "GiftCardBuyBaseRate_provider_brandName_countryCode_currencyCode_isActive_idx" ON "GiftCardBuyBaseRate"("provider", "brandName", "countryCode", "currencyCode", "isActive");