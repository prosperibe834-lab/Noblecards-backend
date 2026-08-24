/*
  Warnings:

  - A unique constraint covering the columns `[existingUserId]` on the table `PendingRegistration` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PendingRegistration" ADD COLUMN     "existingUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistration_existingUserId_key" ON "PendingRegistration"("existingUserId");

-- AddForeignKey
ALTER TABLE "PendingRegistration" ADD CONSTRAINT "PendingRegistration_existingUserId_fkey" FOREIGN KEY ("existingUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
