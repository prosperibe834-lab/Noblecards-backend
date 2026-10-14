require('dotenv/config');

const { readFile } = require('node:fs/promises');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../src/generated/prisma');

const databaseUrl = process.env.NOBLECARDS_TEST_DATABASE_URL;
const password = process.env.REFERRAL_SMOKE_PASSWORD;
const baseUrl = (process.env.REFERRAL_SMOKE_API_URL || 'http://127.0.0.1:3011').replace(/\/+$/, '');
const manifestPath = process.env.REFERRAL_SMOKE_MANIFEST;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function requireTestDatabase(prisma) {
  if (!databaseUrl) throw new Error('Set NOBLECARDS_TEST_DATABASE_URL explicitly.');
  const configuredName = decodeURIComponent(
    new URL(databaseUrl).pathname.split('/').filter(Boolean).pop() || '',
  );
  if (configuredName !== 'noble_cards_test') {
    throw new Error('Refusing authenticated smoke checks outside noble_cards_test.');
  }
  const rows = await prisma.$queryRaw`SELECT current_database() AS name`;
  if (rows[0]?.name !== 'noble_cards_test') {
    throw new Error('Connected database is not noble_cards_test.');
  }
}

async function request(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: response.status, data };
}

async function login(prisma, user, role) {
  await requireTestDatabase(prisma);
  const response = await request('/auth/login', {
    method: 'POST',
    body: { email: user.email, password },
  });
  assert(response.status === 201 || response.status === 200, `${role} login failed with HTTP ${response.status}.`);
  assert(typeof response.data?.accessToken === 'string', `${role} login did not return an access token.`);
  return response.data.accessToken;
}

async function verifyDbReferral(prisma, id, status, rewardStatus) {
  const referral = await prisma.referralAttribution.findUnique({
    where: { id },
    include: { reward: true },
  });
  assert(referral, `Referral ${id} was not persisted.`);
  assert(referral.status === status, `Persisted referral status mismatch: ${referral.status}.`);
  assert(referral.reward?.status === rewardStatus, `Persisted reward status mismatch: ${referral.reward?.status}.`);
}

async function review(prisma, token, id, action) {
  await requireTestDatabase(prisma);
  const response = await request(`/admin/referrals/${id}/review`, {
    token,
    method: 'PATCH',
    body: { action, reason: `Disposable referral smoke-test ${action.toLowerCase()}` },
  });
  assert(response.status === 200, `${action} review failed with HTTP ${response.status}.`);
  return response.data;
}

async function main() {
  if (!password || !manifestPath) {
    throw new Error('Set REFERRAL_SMOKE_PASSWORD and REFERRAL_SMOKE_MANIFEST.');
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert(manifest.databaseName === 'noble_cards_test', 'Fixture manifest is not for noble_cards_test.');

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    await prisma.$connect();
    await requireTestDatabase(prisma);

    const [customerA, customerB, admin] = await Promise.all([
      login(prisma, manifest.users.customerA, 'Customer A'),
      login(prisma, manifest.users.customerB, 'Customer B'),
      login(prisma, manifest.users.admin, 'Administrator'),
    ]);
    const customerTokenByKey = {
      customerA,
      customerB,
    };

    const [summaryAResponse, summaryBResponse] = await Promise.all([
      request('/referrals/me', { token: customerA }),
      request('/referrals/me', { token: customerB }),
    ]);
    assert(summaryAResponse.status === 200, `Customer A summary returned HTTP ${summaryAResponse.status}.`);
    assert(summaryBResponse.status === 200, `Customer B summary returned HTTP ${summaryBResponse.status}.`);
    const summaryA = summaryAResponse.data;
    const summaryB = summaryBResponse.data;
    assert(summaryA.code === manifest.users.customerA.referralCode, 'Customer A received a different referral code.');
    assert(summaryA.invitedCount === 3, 'Customer A invited count does not match persisted fixtures.');
    assert(summaryA.qualifiedCount === 1, 'Customer A qualified count does not match persisted fixtures.');
    assert(summaryA.pendingRewardUsd === '1.25', 'Customer A pending reward total is incorrect.');
    assert(summaryA.heldRewardUsd === '2.5', 'Customer A held reward total is incorrect.');
    assert(summaryA.availableRewardUsd === '3.75', 'Customer A available reward total is incorrect.');
    assert(summaryA.link.endsWith(`/${encodeURIComponent(summaryA.code)}`), 'Customer A referral link does not use their code.');
    assert(summaryB.code === manifest.users.customerB.referralCode, 'Customer B received another user’s referral code.');
    assert(summaryB.code !== summaryA.code, 'Customer referral codes are not distinct.');
    assert(summaryB.invitedCount === 0 && summaryB.qualifiedCount === 0, 'Customer B saw Customer A referral counts.');
    assert(summaryB.pendingRewardUsd === '0' && summaryB.heldRewardUsd === '0' && summaryB.availableRewardUsd === '0', 'Customer B saw Customer A reward balances.');
    console.log('PASS: Customer A/B authenticated summaries are isolated and match persisted referral fixtures.');

    const customerAdminResponse = await request('/admin/referrals', { token: customerA });
    assert(customerAdminResponse.status === 403, `Customer access to admin referrals returned HTTP ${customerAdminResponse.status}, expected 403.`);
    console.log('PASS: Customer token is forbidden from protected admin referral routes.');

    const [list, stats] = await Promise.all([
      request('/admin/referrals?search=' + encodeURIComponent(summaryA.code) + '&page=1&limit=1', { token: admin }),
      request('/admin/referrals/stats', { token: admin }),
    ]);
    assert(list.status === 200, `Admin referral list returned HTTP ${list.status}.`);
    assert(list.data?.data?.length === 1 && list.data.pagination.total >= 3, 'Admin list search or pagination did not return persisted fixture records.');
    assert(stats.status === 200 && stats.data.totalReferrals >= 3, `Admin stats failed or omitted persisted fixtures (HTTP ${stats.status}).`);
    const heldFilter = await request('/admin/referrals?rewardStatus=HELD', { token: admin });
    assert(heldFilter.status === 200 && heldFilter.data.data.some((item) => item.id === manifest.referrals.held.id), 'Admin reward-status filter omitted the held fixture.');
    const details = await request(`/admin/referrals/${manifest.referrals.held.id}`, { token: admin });
    assert(details.status === 200 && details.data.id === manifest.referrals.held.id, 'Admin detail did not return the selected persisted referral.');
    assert(details.data.auditEvents.length >= 1, 'Admin detail omitted persisted review history.');
    console.log('PASS: Admin authenticated list, statistics, search/pagination, status filter, detail, and audit history.');

    const pendingId = manifest.referrals.pending.id;
    await review(prisma, admin, pendingId, 'HOLD');
    await verifyDbReferral(prisma, pendingId, 'HELD', 'HELD');
    await review(prisma, admin, pendingId, 'RELEASE');
    await verifyDbReferral(prisma, pendingId, 'REGISTERED', 'PENDING');
    await review(prisma, admin, pendingId, 'HOLD');
    await verifyDbReferral(prisma, pendingId, 'HELD', 'HELD');
    await review(prisma, admin, pendingId, 'REJECT');
    await verifyDbReferral(prisma, pendingId, 'REJECTED', 'REJECTED');
    const reviewedDetails = await request(`/admin/referrals/${pendingId}`, { token: admin });
    assert(reviewedDetails.status === 200 && reviewedDetails.data.auditEvents.length >= 4, 'Review actions were not persisted in audit history.');
    console.log('PASS: HOLD, RELEASE, and REJECT requests persisted status changes and audit history in PostgreSQL.');

    const unauthorizedReview = await request(`/admin/referrals/${manifest.referrals.held.id}/review`, {
      token: customerTokenByKey.customerB,
      method: 'PATCH',
      body: { action: 'REJECT', reason: 'Unauthorized smoke-test attempt' },
    });
    assert(unauthorizedReview.status === 403, `Customer review attempt returned HTTP ${unauthorizedReview.status}, expected 403.`);
    await verifyDbReferral(prisma, manifest.referrals.held.id, 'HELD', 'HELD');
    console.log('PASS: Customer review attempt was forbidden and did not alter the persisted referral.');
    console.log('Authenticated API smoke checks passed; access tokens were not printed.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Authenticated referral smoke checks failed.');
  process.exitCode = 1;
});
