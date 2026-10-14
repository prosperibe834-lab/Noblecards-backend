ALTER TABLE "User" ADD COLUMN "referralCode" TEXT;
ALTER TABLE "PendingRegistration" ADD COLUMN "referralCode" TEXT;

DO $$
DECLARE
  target_user RECORD;
  generated_code TEXT;
BEGIN
  FOR target_user IN
    SELECT "id" FROM "User" WHERE "referralCode" IS NULL
  LOOP
    LOOP
      generated_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT || target_user."id") FROM 1 FOR 10));
      EXIT WHEN NOT EXISTS (SELECT 1 FROM "User" WHERE "referralCode" = generated_code);
    END LOOP;
    UPDATE "User" SET "referralCode" = generated_code WHERE "id" = target_user."id";
  END LOOP;
END $$;

ALTER TABLE "User" ALTER COLUMN "referralCode" SET NOT NULL;
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

ALTER TABLE "WalletBalance"
  ADD COLUMN "referralCreditAvailable" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN "referralCreditPending" DECIMAL(18,2) NOT NULL DEFAULT 0.00;

ALTER TABLE "LedgerEntry"
  ADD COLUMN "referralBalanceBefore" DECIMAL(18,2),
  ADD COLUMN "referralBalanceAfter" DECIMAL(18,2),
  ADD COLUMN "referralPendingBefore" DECIMAL(18,2),
  ADD COLUMN "referralPendingAfter" DECIMAL(18,2);

ALTER TABLE "GiftCardPurchase"
  ADD COLUMN "giftCardValueUsd" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN "referralCreditAmount" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN "referralCreditUsdAmount" DECIMAL(18,2) NOT NULL DEFAULT 0.00;

ALTER TYPE "LedgerEntryType" ADD VALUE IF NOT EXISTS 'REFERRAL_CREDIT';
ALTER TYPE "LedgerEntryType" ADD VALUE IF NOT EXISTS 'REFERRAL_DEBIT';

CREATE TYPE "ReferralStatus" AS ENUM ('REGISTERED', 'DEPOSIT_QUALIFIED', 'QUALIFIED', 'HELD', 'REJECTED');
CREATE TYPE "ReferralRewardStatus" AS ENUM ('PENDING', 'AVAILABLE', 'HELD', 'REJECTED', 'REVERSED');

CREATE TABLE "ReferralAttribution" (
  "id" TEXT NOT NULL,
  "referrerId" TEXT NOT NULL,
  "referredUserId" TEXT NOT NULL,
  "referralCode" TEXT NOT NULL,
  "status" "ReferralStatus" NOT NULL DEFAULT 'REGISTERED',
  "firstDepositId" TEXT,
  "firstDepositAmountUsd" DECIMAL(18,2),
  "qualifyingPurchaseId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReferralAttribution_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ReferralAttribution_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ReferralAttribution_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ReferralAttribution_firstDepositId_fkey" FOREIGN KEY ("firstDepositId") REFERENCES "Deposit"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ReferralAttribution_qualifyingPurchaseId_fkey" FOREIGN KEY ("qualifyingPurchaseId") REFERENCES "GiftCardPurchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "ReferralReward" (
  "id" TEXT NOT NULL,
  "referralId" TEXT NOT NULL,
  "referrerId" TEXT NOT NULL,
  "amountUsd" DECIMAL(18,2) NOT NULL,
  "status" "ReferralRewardStatus" NOT NULL DEFAULT 'PENDING',
  "creditedAt" TIMESTAMP(3),
  "reviewReason" TEXT,
  "reviewedById" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReferralReward_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ReferralReward_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "ReferralAttribution"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ReferralReward_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "ReferralAuditEvent" (
  "id" TEXT NOT NULL,
  "referralId" TEXT NOT NULL,
  "adminUserId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "previousStatus" TEXT,
  "newStatus" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReferralAuditEvent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ReferralAuditEvent_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "ReferralAttribution"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ReferralAuditEvent_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "ReferralAttribution_referredUserId_key" ON "ReferralAttribution"("referredUserId");
CREATE UNIQUE INDEX "ReferralAttribution_firstDepositId_key" ON "ReferralAttribution"("firstDepositId");
CREATE UNIQUE INDEX "ReferralAttribution_qualifyingPurchaseId_key" ON "ReferralAttribution"("qualifyingPurchaseId");
CREATE INDEX "ReferralAttribution_referrerId_createdAt_idx" ON "ReferralAttribution"("referrerId", "createdAt");
CREATE INDEX "ReferralAttribution_status_createdAt_idx" ON "ReferralAttribution"("status", "createdAt");

CREATE UNIQUE INDEX "ReferralReward_referralId_key" ON "ReferralReward"("referralId");
CREATE INDEX "ReferralReward_referrerId_status_createdAt_idx" ON "ReferralReward"("referrerId", "status", "createdAt");
CREATE INDEX "ReferralReward_status_createdAt_idx" ON "ReferralReward"("status", "createdAt");

CREATE INDEX "ReferralAuditEvent_referralId_createdAt_idx" ON "ReferralAuditEvent"("referralId", "createdAt");
CREATE INDEX "ReferralAuditEvent_adminUserId_createdAt_idx" ON "ReferralAuditEvent"("adminUserId", "createdAt");
