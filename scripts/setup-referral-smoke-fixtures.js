require('dotenv/config');

const { randomBytes } = require('node:crypto');
const { writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const bcrypt = require('bcrypt');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../src/generated/prisma');

const databaseUrl = process.env.NOBLECARDS_TEST_DATABASE_URL;
const password = process.env.REFERRAL_SMOKE_PASSWORD;
const manifestPath =
  process.env.REFERRAL_SMOKE_MANIFEST ||
  join(tmpdir(), 'noblecards-referral-smoke-fixtures.json');

function requireTestDatabaseUrl() {
  if (!databaseUrl) {
    throw new Error('Set NOBLECARDS_TEST_DATABASE_URL explicitly.');
  }
  const databaseName = decodeURIComponent(
    new URL(databaseUrl).pathname.split('/').filter(Boolean).pop() || '',
  );
  if (databaseName !== 'noble_cards_test') {
    throw new Error('Refusing fixture setup unless target is noble_cards_test.');
  }
}

async function assertTestDatabase(tx) {
  const rows = await tx.$queryRaw`SELECT current_database() AS name`;
  if (rows[0]?.name !== 'noble_cards_test') {
    throw new Error('Database write blocked: current database is not noble_cards_test.');
  }
}

async function guardedWrite(prisma, write) {
  return prisma.$transaction(async (tx) => {
    await assertTestDatabase(tx);
    return write(tx);
  });
}

async function main() {
  requireTestDatabaseUrl();
  if (!password || password.length < 8) {
    throw new Error('Set REFERRAL_SMOKE_PASSWORD to a test-only password of at least 8 characters.');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    await prisma.$connect();
    const rows = await prisma.$queryRaw`SELECT current_database() AS name`;
    if (rows[0]?.name !== 'noble_cards_test') {
      throw new Error('Connected database is not noble_cards_test; no fixtures created.');
    }
    if (!(await prisma.currency.findUnique({ where: { code: 'USD' } }))) {
      await guardedWrite(prisma, (tx) =>
        tx.currency.create({
          data: {
            code: 'USD',
            name: 'US Dollar',
            symbol: '$',
            enabled: true,
            depositEnabled: false,
          },
        }),
      );
    }

    const tag = `${Date.now()}${randomBytes(3).toString('hex')}`.toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);
    const referralCode = randomBytes(5).toString('hex').toUpperCase();
    const definitions = [
      { key: 'customerA', name: 'Smoke Customer A', role: 'USER', code: referralCode },
      { key: 'customerB', name: 'Smoke Customer B', role: 'USER' },
      { key: 'heldInvitee', name: 'Smoke Held Invitee', role: 'USER' },
      { key: 'availableInvitee', name: 'Smoke Available Invitee', role: 'USER' },
      { key: 'admin', name: 'Smoke Referral Admin', role: 'ADMIN' },
    ];
    const users = {};

    for (const definition of definitions) {
      const [firstName, lastName] = definition.name.split(' ');
      const email = `referral-smoke-${definition.key}-${tag}@noblecards.invalid`;
      const code = definition.code || randomBytes(5).toString('hex').toUpperCase();
      const user = await guardedWrite(prisma, (tx) =>
        tx.user.create({
          data: {
            email,
            passwordHash,
            firstName,
            lastName,
            isEmailVerified: true,
            isActive: true,
            role: definition.role,
            referralCode: code,
            wallet: {
              create: {
                balances: {
                  create: {
                    currencyCode: 'USD',
                    ...(definition.key === 'customerA'
                      ? {
                          referralCreditAvailable: '3.75',
                          referralCreditPending: '2.50',
                        }
                      : {}),
                  },
                },
              },
            },
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            referralCode: true,
          },
        }),
      );
      users[definition.key] = user;
    }

    const referralDefinitions = [
      { key: 'pending', userKey: 'customerB', status: 'REGISTERED', amount: '1.25', rewardStatus: 'PENDING' },
      { key: 'held', userKey: 'heldInvitee', status: 'HELD', amount: '2.50', rewardStatus: 'HELD' },
      { key: 'available', userKey: 'availableInvitee', status: 'QUALIFIED', amount: '3.75', rewardStatus: 'AVAILABLE' },
    ];
    const referrals = {};

    for (const definition of referralDefinitions) {
      const referral = await guardedWrite(prisma, (tx) =>
        tx.referralAttribution.create({
          data: {
            referrerId: users.customerA.id,
            referredUserId: users[definition.userKey].id,
            referralCode: users.customerA.referralCode,
            status: definition.status,
          },
        }),
      );
      const reward = await guardedWrite(prisma, (tx) =>
        tx.referralReward.create({
          data: {
            referralId: referral.id,
            referrerId: users.customerA.id,
            amountUsd: definition.amount,
            status: definition.rewardStatus,
            ...(definition.rewardStatus === 'AVAILABLE'
              ? { creditedAt: new Date() }
              : {}),
            ...(definition.rewardStatus === 'HELD'
              ? {
                  reviewReason: 'Disposable smoke-test held fixture',
                  reviewedById: users.admin.id,
                  reviewedAt: new Date(),
                }
              : {}),
          },
        }),
      );
      referrals[definition.key] = { id: referral.id, rewardId: reward.id };

      if (definition.rewardStatus === 'HELD' || definition.rewardStatus === 'AVAILABLE') {
        await guardedWrite(prisma, (tx) =>
          tx.referralAuditEvent.create({
            data: {
              referralId: referral.id,
              adminUserId: users.admin.id,
              action: definition.rewardStatus === 'HELD' ? 'HOLD' : 'RELEASE',
              reason: 'Initial disposable smoke-test fixture state',
              previousStatus: definition.rewardStatus === 'HELD' ? 'PENDING' : 'HELD',
              newStatus: definition.rewardStatus,
            },
          }),
        );
      }
    }

    const manifest = {
      createdAt: new Date().toISOString(),
      databaseName: 'noble_cards_test',
      users,
      referrals,
    };
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2), {
      flag: 'wx',
    });
    console.log(`Created disposable referral smoke fixtures in ${manifestPath}`);
    console.log(JSON.stringify({
      databaseName: manifest.databaseName,
      customerA: { email: users.customerA.email, referralCode: users.customerA.referralCode },
      customerB: { email: users.customerB.email },
      admin: { email: users.admin.email, role: users.admin.role },
      referrals,
      additionalInvitees: 2,
    }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Fixture setup failed.');
  process.exitCode = 1;
});
