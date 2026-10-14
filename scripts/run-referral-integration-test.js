require('dotenv/config');
const { spawnSync } = require('node:child_process');
const { resolve } = require('node:path');

const TARGET_DATABASE = 'noble_cards_test';

function getTestDatabaseUrl() {
  const suppliedTestUrl = process.env.NOBLECARDS_TEST_DATABASE_URL;
  const sourceUrl = suppliedTestUrl || process.env.DATABASE_URL;
  if (!sourceUrl) throw new Error('No database URL is configured.');

  const url = new URL(sourceUrl);
  const databaseName = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
  if (suppliedTestUrl) {
    if (databaseName !== TARGET_DATABASE) {
      throw new Error('NOBLECARDS_TEST_DATABASE_URL must target noble_cards_test.');
    }
  } else {
    if (databaseName !== TARGET_DATABASE && databaseName !== 'noble_cards') {
      throw new Error('Configured database is not an approved source for the test database.');
    }
    url.pathname = `/${TARGET_DATABASE}`;
  }

  const resolvedName = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
  if (resolvedName !== TARGET_DATABASE) {
    throw new Error('Safety check failed: refusing to run unless the target is noble_cards_test.');
  }
  return url.toString();
}

function run(command, args, env) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env,
    stdio: 'inherit',
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

try {
  const databaseUrl = getTestDatabaseUrl();
  const env = { ...process.env, DATABASE_URL: databaseUrl };
  const prismaCli = resolve('node_modules', 'prisma', 'build', 'index.js');
  const jestCli = resolve('node_modules', 'jest', 'bin', 'jest.js');

  console.log('Safety check passed: database target is noble_cards_test.');
  run(process.execPath, [prismaCli, 'migrate', 'deploy'], env);
  run(
    process.execPath,
    [
      jestCli,
      '--config',
      './test/jest-e2e.json',
      '--runInBand',
      '--runTestsByPath',
      './test/referral.integration-e2e-spec.ts',
    ],
    env,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Referral integration test runner failed.');
  process.exitCode = 1;
}
