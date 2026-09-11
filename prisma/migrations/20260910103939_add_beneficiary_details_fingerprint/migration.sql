-- AlterTable
ALTER TABLE "Beneficiary" ADD COLUMN     "detailsFingerprint" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
