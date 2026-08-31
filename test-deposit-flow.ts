import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function testDepositFlow() {
  try {
    console.log('\n========== DEPOSIT FLOW TEST ==========\n');

    // Create test user directly in DB with verified email
    const testEmail = `test-${Date.now()}@test.com`;
    const password = 'TestPassword123!';
    const passwordHash = await bcrypt.hash(password, 12);

    console.log('STEP 1: Create test user in database');
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash,
        firstName: 'Deposit',
        lastName: 'Tester',
        isEmailVerified: true,
        isActive: true,
      },
    });
    console.log(`✓ User created: ${user.id}`);
    console.log(`  Email: ${testEmail}`);
    console.log(`  Password: ${password}\n`);

    // Create wallet
    console.log('STEP 2: Create wallet');
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
      },
    });
    console.log(`✓ Wallet created: ${wallet.id}\n`);

    // Get or create NGN balance
    console.log('STEP 3: Create initial NGN balance');
    let ngnBalance = await prisma.walletBalance.findUnique({
      where: {
        walletId_currencyCode: {
          walletId: wallet.id,
          currencyCode: 'NGN',
        },
      },
    });

    if (!ngnBalance) {
      ngnBalance = await prisma.walletBalance.create({
        data: {
          walletId: wallet.id,
          currencyCode: 'NGN',
          availableBalance: 0,
          pendingBalance: 0,
        },
      });
    }
    console.log(`✓ NGN Balance created: ${ngnBalance.availableBalance}\n`);

    // Verify currencies exist
    console.log('STEP 4: Verify currencies');
    const currencies = await prisma.currency.findMany();
    console.log(`✓ Total currencies in DB: ${currencies.length}`);
    const ngn = currencies.find((c) => c.code === 'NGN');
    console.log(`✓ NGN exists: ${ngn ? 'YES' : 'NO'}\n`);

    // NOW TEST THE API
    console.log('========== API TESTS ==========\n');

    const API = 'http://localhost:3000';

    // Login
    console.log('TEST 1: Login');
    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password }),
    });
    console.log(`Status: ${loginRes.status}`);
    const loginData = await loginRes.json();
    if (loginData.accessToken) {
      console.log(`✓ Access Token obtained`);
    } else {
      console.log(`✗ No access token`);
      console.log(loginData);
      process.exit(1);
    }
    const token = loginData.accessToken;
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    console.log('');

    // Get wallet
    console.log('TEST 2: Get Wallet');
    const walletRes = await fetch(`${API}/wallet`, {
      method: 'GET',
      headers,
    });
    console.log(`Status: ${walletRes.status}`);
    const walletData = await walletRes.json();
    console.log(`Wallet ID: ${walletData.wallet.id}`);
    console.log('');

    // Get currencies
    console.log('TEST 3: Get Currencies');
    const currRes = await fetch(`${API}/currencies`, {
      method: 'GET',
      headers,
    });
    console.log(`Status: ${currRes.status}`);
    const currData = await currRes.json();
    console.log(`Total: ${currData.length}`);
    const ngnCurr = currData.find((c: any) => c.code === 'NGN');
    console.log(`NGN: ${ngnCurr ? 'FOUND' : 'NOT FOUND'}`);
    console.log('');

    // Create deposit
    console.log('TEST 4: Create Deposit');
    const depositRes = await fetch(`${API}/deposits`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: 10000,
        currency: 'NGN',
        paymentMethod: 'BANK_TRANSFER',
        country: 'Nigeria',
        countryCode: 'NG',
        idempotencyKey: `test-${Date.now()}`,
      }),
    });
    console.log(`Status: ${depositRes.status}`);
    const depositData = await depositRes.json();
    console.log(`Deposit ID: ${depositData.id}`);
    console.log(`Status: ${depositData.status}`);
    console.log(`Amount: ${depositData.amount} ${depositData.currency}`);
    console.log(`Provider: ${depositData.provider}`);
    if (depositData.bankTransfer) {
      console.log(`Bank: ${depositData.bankTransfer.bankName}`);
      console.log(`Account: ${depositData.bankTransfer.accountNumber}`);
    }
    if (depositData.transaction) {
      console.log(`Transaction: ${depositData.transaction.id}`);
      console.log(`Reference: ${depositData.transaction.reference}`);
    }
    console.log('');

    console.log('========== TEST COMPLETE ==========\n');

    // Check transaction in DB
    console.log('VERIFICATION: Check database records');
    const txn = await prisma.transaction.findFirst({
      where: { userId: user.id },
    });
    console.log(`Transaction created: ${txn ? 'YES' : 'NO'}`);
    if (txn) {
      console.log(`  Type: ${txn.type}`);
      console.log(`  Amount: ${txn.amount}`);
      console.log(`  Status: ${txn.status}`);
    }

    const ledger = await prisma.ledgerEntry.findFirst({
      where: { walletId: wallet.id },
    });
    console.log(`Ledger entry: ${ledger ? 'YES' : 'NO'}`);
    if (ledger) {
      console.log(`  Type: ${ledger.type}`);
      console.log(`  Amount: ${ledger.amount}`);
    }
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDepositFlow();
