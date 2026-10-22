CREATE TABLE "SecurityAuditEvent" (
  "id" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "event" TEXT NOT NULL,
  "outcome" TEXT NOT NULL,
  "actorType" TEXT NOT NULL,
  "actorUserId" TEXT,
  "targetUserId" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "country" TEXT,
  "city" TEXT,
  "deviceType" TEXT,
  "operatingSystem" TEXT,
  "browser" TEXT,
  "risk" TEXT,
  "description" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SecurityAuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SecurityAuditEvent_createdAt_idx"
  ON "SecurityAuditEvent"("createdAt");
CREATE INDEX "SecurityAuditEvent_eventType_createdAt_idx"
  ON "SecurityAuditEvent"("eventType", "createdAt");
CREATE INDEX "SecurityAuditEvent_outcome_createdAt_idx"
  ON "SecurityAuditEvent"("outcome", "createdAt");
CREATE INDEX "SecurityAuditEvent_actorUserId_createdAt_idx"
  ON "SecurityAuditEvent"("actorUserId", "createdAt");
CREATE INDEX "SecurityAuditEvent_ipAddress_createdAt_idx"
  ON "SecurityAuditEvent"("ipAddress", "createdAt");
