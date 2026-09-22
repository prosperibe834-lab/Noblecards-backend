-- AlterEnum
ALTER TYPE "SupportMessageSenderType" ADD VALUE 'SYSTEM';

-- AlterTable
ALTER TABLE "SupportMessage" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "SupportTicket" ADD COLUMN     "userClearedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "SupportAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "uploadedByUserId" TEXT,
    "uploadedByAdminId" TEXT,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storagePath" TEXT NOT NULL,
    "publicUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SupportAttachment_messageId_createdAt_idx" ON "SupportAttachment"("messageId", "createdAt");

-- CreateIndex
CREATE INDEX "SupportAttachment_uploadedByUserId_idx" ON "SupportAttachment"("uploadedByUserId");

-- CreateIndex
CREATE INDEX "SupportAttachment_uploadedByAdminId_idx" ON "SupportAttachment"("uploadedByAdminId");

-- AddForeignKey
ALTER TABLE "SupportAttachment" ADD CONSTRAINT "SupportAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "SupportMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportAttachment" ADD CONSTRAINT "SupportAttachment_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportAttachment" ADD CONSTRAINT "SupportAttachment_uploadedByAdminId_fkey" FOREIGN KEY ("uploadedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
