const { Client } = require('pg');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const { config } = require('dotenv');
config({ path: require('path').resolve(__dirname, '.env') });

const API = 'http://localhost:3001';
const EMAIL = `gbp-trace-${Date.now()}@test.com`;
const PASSWORD = 'Test123456!';

const mask = (value) => {
  if (!value) return 'MISSING';
  if (value.length <= 8) return '****';
  return `${value.slice(0, 4)}****${value.slice(-4)}`;
};

function sanitize(obj) {
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (!obj || typeof obj !== 'object') return obj;

  return Object.fromEntries(Object.entries(obj).map(([key, value]) => {
    const lower = String(key).toLowerCase();
    if (
      lower.includes('secret') ||
      lower.includes('authorization') ||
      lower.includes('token') ||
      lower.includes('password') ||
      lower.includes('email') ||
      lower.includes('phone') ||
      lower.includes('name') ||
      lower.includes('link')
    ) {
      if (lower.includes('authorization') || lower.includes('token') || lower.includes('secret') || lower.includes('link')) {
        return [key, '[REDACTED]'];
      }
      return [key, typeof value === 'string' ? '[REDACTED]' : sanitize(value)];
    }
    if (value && typeof value === 'object') return [key, sanitize(value)];
    return [key, value];
  }));
}

async function getDbClient() {
  const fullUrl = process.env.DATABASE_URL;
  const dbUrl = fullUrl.replace(/^postgresql:\/\//, '');
  const [auth, hostPart] = dbUrl.split('@');
  const [user, dbPass] = auth.split(':');
  const [hostPort, database] = hostPart.split('/');
  const [host, port] = hostPort.split(':');
  return new Client({ host, port: Number(port), database, user, password: decodeURIComponent(dbPass) });
}

async function httpJson(url, method = 'GET', body, headers = {}) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed;
  try { parsed = JSON.parse(text); } catch { parsed = text; }
  return { status: res.status, body: parsed };
}

(async () => {
  console.log('========================================');
  console.log('NOBLECARDS GBP /DEPOSITS DIAGNOSTIC');
  console.log('========================================');
  console.log('API_BASE_URL:', API);
  console.log('USER_EMAIL:', EMAIL);

  const client = await getDbClient();
  await client.connect();
  try {
    const userId = randomUUID();
    const walletId = randomUUID();
    const now = new Date();
    const passwordHash = await bcrypt.hash(PASSWORD, 12);
    await client.query('DELETE FROM "User" WHERE email = $1', [EMAIL]);
    await client.query('DELETE FROM "Wallet" WHERE "userId" = $1', [userId]);
    await client.query(
      `INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", "isEmailVerified", "isActive", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, true, true, $6, $7)`,
      [userId, EMAIL, passwordHash, 'GBP', 'Tester', now, now],
    );
    await client.query(
      `INSERT INTO "Wallet" (id, "userId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4)`,
      [walletId, userId, now, now],
    );
    console.log('USER_ID:', userId);
    console.log('WALLET_ID:', walletId);
  } finally {
    await client.end();
  }

  const loginRes = await httpJson(`${API}/auth/login`, 'POST', { email: EMAIL, password: PASSWORD });
  console.log('LOGIN_STATUS:', loginRes.status);
  const token = loginRes.body && (loginRes.body.accessToken || loginRes.body.access_token);
  console.log('LOGIN_TOKEN_MASKED:', token ? mask(token) : 'MISSING');
  if (!token) {
    console.log('LOGIN_RESPONSE:', JSON.stringify(sanitize(loginRes.body), null, 2));
    process.exit(1);
  }

  const depositRes = await httpJson(`${API}/deposits`, 'POST', {
    amount: 300,
    currency: 'GBP',
    paymentMethod: 'BANK_TRANSFER',
    country: 'United Kingdom',
    countryCode: 'GB',
    idempotencyKey: `gbp-${Date.now()}`,
  }, { Authorization: `Bearer ${token}` });

  console.log('DEPOSIT_HTTP_STATUS:', depositRes.status);
  console.log('DEPOSIT_RESPONSE_SANITIZED:');
  console.log(JSON.stringify(sanitize(depositRes.body), null, 2));
})();
