#!/usr/bin/env node

/**
 * GHS Deposit Test using Compiled Code
 * Creates test user in database, authenticates, and tests GHS bank transfer
 */

const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./dist/generated/prisma/client');
const bcrypt = require('bcrypt');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log('\n========== GHS BANK TRANSFER DEPOSIT TEST ==========\n');

    // Step 1: Create test user directly in database
    console.log('STEP 1: Create test user in database');
    const testEmail = `ghs-test-${Date.now()}@test.com`;
    const testPassword = 'TestPassword123!';
    const passwordHash = await bcrypt.hash(testPassword, 12);

    const user = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash,
        firstName: 'GHS',
        lastName: 'Tester',
        isEmailVerified: true,
        isActive: true,
      },
    });
    console.log(`✓ User created: ${user.id}`);
    console.log(`  Email: ${testEmail}`);
    console.log(`  Password: ${testPassword}\n`);

    // Step 2: Create wallet
    console.log('STEP 2: Create wallet');
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
      },
    });
    console.log(`✓ Wallet created: ${wallet.id}\n`);

    // Step 3: Verify currencies
    console.log('STEP 3: Verify GHS currency');
    const ghsCurrency = await prisma.currency.findUnique({
      where: { code: 'GHS' },
    });
    console.log(`✓ GHS exists: ${ghsCurrency ? 'YES' : 'NO'}`);
    if (ghsCurrency) {
      console.log(`  Enabled: ${ghsCurrency.enabled}`);
      console.log(`  Deposit Enabled: ${ghsCurrency.depositEnabled}\n`);
    }

    // Step 4-6: Now test the HTTP API
    console.log('========== API TESTS ==========\n');

    const API = 'http://localhost:3000';

    // Login
    console.log('TEST 1: Login');
    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    console.log(`Status: ${loginRes.status}`);
    const loginData = await loginRes.json();
    if (!loginData.accessToken) {
      console.log(`✗ Login failed`);
      console.log(JSON.stringify(loginData, null, 2));
      process.exit(1);
    }
    const token = loginData.accessToken;
    console.log(`✓ Token obtained\n`);

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Get wallet
    console.log('TEST 2: Get Wallet');
    const walletRes = await fetch(`${API}/wallet`, {
      method: 'GET',
      headers,
    });
    console.log(`Status: ${walletRes.status}`);
    const walletData = await walletRes.json();
    console.log(`✓ Wallet ID: ${walletData.wallet.id}\n`);

    // Get currencies
    console.log('TEST 3: Get Currencies');
    const currRes = await fetch(`${API}/currencies`, {
      method: 'GET',
      headers,
    });
    const currData = await currRes.json();
    const ghsCurr = currData.find((c) => c.code === 'GHS');
    console.log(`Status: ${currRes.status}`);
    console.log(`✓ GHS: ${ghsCurr ? 'FOUND' : 'NOT FOUND'}\n`);

    // ========== MAIN TEST: Create GHS Bank Transfer Deposit ==========
    console.log('========== TEST 4: CREATE GHS BANK TRANSFER DEPOSIT ==========\n');
    console.log('Request Details:');
    console.log('  Currency: GHS');
    console.log('  Payment Method: BANK_TRANSFER');
    console.log('  Amount: 500 USD equivalent');
    console.log('  Country: Ghana');
    console.log('  Country Code: GH\n');

    const depositRes = await fetch(`${API}/deposits`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: 500,
        currency: 'GHS',
        paymentMethod: 'BANK_TRANSFER',
        country: 'Ghana',
        countryCode: 'GH',
        idempotencyKey: `ghs-test-${Date.now()}`,
      }),
    });
    console.log(`HTTP Status: ${depositRes.status}\n`);
    const depositData = await depositRes.json();

    console.log('========== FULL DEPOSIT RESPONSE ==========\n');
    console.log(JSON.stringify(depositData, null, 2));

    console.log('\n========== ANALYSIS ==========\n');

    // Check for bank transfer details
    const bankName = depositData.bankName || depositData.metadata?.bankTransfer?.bankName;
    const accountNumber = depositData.accountNumber || depositData.metadata?.bankTransfer?.accountNumber;
    const accountName = depositData.accountName || depositData.metadata?.bankTransfer?.accountName;
    const expiresAt = depositData.expiresAt || depositData.metadata?.bankTransfer?.expiresAt;

    console.log('CORE FIELDS:');
    console.log(`  Deposit ID: ${depositData.id}`);
    console.log(`  Status: ${depositData.status}`);
    console.log(`  Currency: ${depositData.currency}`);
    console.log(`  Amount: ${depositData.amount}`);
    console.log(`  Provider: ${depositData.provider}`);
    console.log(`  Payment Method: ${depositData.paymentMethod}`);

    if (depositData.transaction) {
      console.log('\nTRANSACTION:');
      console.log(`  ID: ${depositData.transaction.id}`);
      console.log(`  Reference: ${depositData.transaction.reference}`);
      console.log(`  Status: ${depositData.transaction.status}`);
    }

    console.log('\nBANK TRANSFER DETAILS:');
    if (bankName || accountNumber) {
      console.log(`✓ Bank Details Found:`);
      console.log(`  Bank Name: ${bankName || 'NOT PROVIDED'}`);
      console.log(`  Account Number: ${accountNumber || 'NOT PROVIDED'}`);
      console.log(`  Account Name: ${accountName || 'NOT PROVIDED'}`);
      console.log(`  Expires At: ${expiresAt || 'NOT PROVIDED'}`);
    } else {
      console.log(`✗ Bank Details NOT FOUND`);
      if (depositData.metadata) {
        console.log(`  Metadata keys: ${Object.keys(depositData.metadata).join(', ')}`);
        if (depositData.metadata.flutterwave) {
          console.log(`  Flutterwave data available:`, JSON.stringify(depositData.metadata.flutterwave, null, 2));
        }
      }
    }

    // Check database for deposit record
    console.log('\n========== DATABASE VERIFICATION ==========\n');
    const dbDeposit = await prisma.deposit.findFirst({
      where: { userId: user.id },
      include: { transaction: true },
    });

    if (dbDeposit) {
      console.log('Deposit in Database:');
      console.log(`  ID: ${dbDeposit.id}`);
      console.log(`  Currency: ${dbDeposit.currencyCode}`);
      console.log(`  Amount: ${dbDeposit.amount}`);
      console.log(`  Status: ${dbDeposit.status}`);
      console.log(`  Payment Method: ${dbDeposit.paymentMethod}`);
      console.log(`  Provider Reference: ${dbDeposit.providerReference}`);
      console.log(`  Provider Transaction ID: ${dbDeposit.providerTransactionId}`);

      if (dbDeposit.metadata) {
        console.log(`  Metadata keys: ${Object.keys(dbDeposit.metadata).join(', ')}`);
        if (dbDeposit.metadata.bankTransfer) {
          console.log(`  Bank Transfer (DB):`, JSON.stringify(dbDeposit.metadata.bankTransfer, null, 2));
        }
        if (dbDeposit.metadata.flutterwave) {
          console.log(`  Flutterwave (DB):`, JSON.stringify(dbDeposit.metadata.flutterwave, null, 2));
        }
      }
    }

    console.log('\n========== TEST COMPLETE ==========\n');

    if (bankName && accountNumber) {
      console.log('✓ SUCCESS: GHS bank transfer details are present in response');
    } else {
      console.log('✗ FAILURE: GHS bank transfer details are missing');
      if (depositData.error || depositData.message) {
        console.log(`  Error: ${depositData.error || depositData.message}`);
      }
    }

  } catch (err) {
    console.error('\nERROR:');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
