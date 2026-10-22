import { randomUUID } from 'node:crypto';
import type { PrismaService } from '../prisma/prisma.service';

export type SecurityAuditEventInput = {
  eventType: string;
  event: string;
  outcome: 'SUCCESS' | 'FAILED' | 'BLOCKED' | 'SUSPICIOUS';
  actorType: 'USER' | 'ADMIN' | 'SYSTEM' | 'UNKNOWN' | 'API';
  actorUserId?: string | null;
  targetUserId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  country?: string | null;
  city?: string | null;
  deviceType?: string | null;
  operatingSystem?: string | null;
  browser?: string | null;
  risk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
  description: string;
  metadata?: Record<string, unknown> | null;
  createdAt?: Date;
};

type UserAgentDetails = {
  deviceType: string | null;
  operatingSystem: string | null;
  browser: string | null;
};

type AuditRecorder = {
  record(input: SecurityAuditEventInput): Promise<void>;
};

type SecurityAuditRequest = {
  user: { userId: string };
  headers?: { 'user-agent'?: string | string[] };
  ip?: string;
  method?: string;
  originalUrl?: string;
};

const SENSITIVE_KEY =
  /(password|pin|token|secret|credential|authorization|cookie|verification.?code|request.?body|payload|private.?key|api.?key)/i;

export async function recordAdminAccessDenied(
  audit: AuditRecorder | undefined,
  request: SecurityAuditRequest,
  role: string | undefined,
) {
  const userAgent = request.headers?.['user-agent'];
  await audit?.record({
    eventType: 'Admin',
    event: 'Admin Access Denied',
    outcome: 'BLOCKED',
    actorType:
      role === 'ADMIN' ? 'ADMIN' : role === 'USER' ? 'USER' : 'UNKNOWN',
    actorUserId: role ? request.user.userId : undefined,
    ipAddress: request.ip,
    userAgent: Array.isArray(userAgent) ? userAgent[0] : userAgent,
    description: 'Authenticated user was denied access to an admin endpoint.',
    metadata: {
      method: request.method ?? 'UNKNOWN',
      route: request.originalUrl?.split('?')[0] ?? 'unknown',
    },
  });
}

export function sanitizeAuditMetadata(
  metadata: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!metadata) return null;

  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata).slice(0, 40)) {
    if (SENSITIVE_KEY.test(key)) continue;
    if (
      value === null ||
      typeof value === 'boolean' ||
      typeof value === 'number'
    ) {
      safe[key.slice(0, 80)] = value;
    } else if (typeof value === 'string') {
      safe[key.slice(0, 80)] = value.slice(0, 500);
    }
  }
  return safe;
}

function parseUserAgent(value: string | null | undefined): UserAgentDetails {
  if (!value) {
    return { deviceType: null, operatingSystem: null, browser: null };
  }

  const userAgent = value.slice(0, 512);
  const browser = /Edg(?:e|A|iOS)?\//i.test(userAgent)
    ? 'Edge'
    : /OPR\//i.test(userAgent)
      ? 'Opera'
      : /SamsungBrowser\//i.test(userAgent)
        ? 'Samsung Internet'
        : /Firefox\//i.test(userAgent)
          ? 'Firefox'
          : /Chrome\//i.test(userAgent) && !/Chromium\//i.test(userAgent)
            ? 'Chrome'
            : /Safari\//i.test(userAgent) && /Version\//i.test(userAgent)
              ? 'Safari'
              : /(?:curl\/|PostmanRuntime\/|python-requests\/|Go-http-client\/|okhttp\/|Java\/)/i.test(
                    userAgent,
                  )
                ? 'API Client'
                : null;
  const operatingSystem = /Android/i.test(userAgent)
    ? 'Android'
    : /iPhone|iPad|iPod/i.test(userAgent)
      ? 'iOS'
      : /Windows NT/i.test(userAgent)
        ? 'Windows'
        : /Mac OS X|Macintosh/i.test(userAgent)
          ? 'macOS'
          : /Linux/i.test(userAgent)
            ? 'Linux'
            : null;
  const deviceType = /iPad|Tablet/i.test(userAgent)
    ? 'Tablet'
    : /Mobile|iPhone|iPod|Android/i.test(userAgent)
      ? 'Mobile'
      : browser
        ? 'Desktop'
        : /(?:curl\/|PostmanRuntime\/|python-requests\/|Go-http-client\/|okhttp\/|Java\/)/i.test(
              userAgent,
            )
          ? 'API Client'
          : null;

  return { deviceType, operatingSystem, browser };
}

export async function writeSecurityAuditEvent(
  prisma: PrismaService,
  input: SecurityAuditEventInput,
): Promise<void> {
  const metadata = sanitizeAuditMetadata(input.metadata);
  const userAgent = input.userAgent?.slice(0, 512) ?? null;
  const parsedAgent = parseUserAgent(userAgent);
  await prisma.$executeRawUnsafe(
    `INSERT INTO "SecurityAuditEvent" (
      "id", "eventType", "event", "outcome", "actorType", "actorUserId",
      "targetUserId", "ipAddress", "userAgent", "country", "city",
      "deviceType", "operatingSystem", "browser", "risk", "description",
      "metadata", "createdAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
      $16, $17::jsonb, $18
    )`,
    randomUUID(),
    input.eventType.slice(0, 80),
    input.event.slice(0, 200),
    input.outcome,
    input.actorType,
    input.actorUserId ?? null,
    input.targetUserId ?? null,
    input.ipAddress?.slice(0, 64) ?? null,
    userAgent,
    input.country?.slice(0, 100) ?? null,
    input.city?.slice(0, 100) ?? null,
    input.deviceType?.slice(0, 80) ?? parsedAgent.deviceType,
    input.operatingSystem?.slice(0, 100) ?? parsedAgent.operatingSystem,
    input.browser?.slice(0, 100) ?? parsedAgent.browser,
    input.risk ?? null,
    input.description.slice(0, 500),
    metadata ? JSON.stringify(metadata) : null,
    input.createdAt ?? new Date(),
  );
}
