-- CreateTable
CREATE TABLE "TransactionPinResetChallenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verifiedAt" TIMESTAMP(3),
    "resetTokenHash" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionPinResetChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransactionPinResetChallenge_userId_expiresAt_idx"
ON "TransactionPinResetChallenge"("userId", "expiresAt");

-- AddForeignKey
ALTER TABLE "TransactionPinResetChallenge"
ADD CONSTRAINT "TransactionPinResetChallenge_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;