import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient as GeneratedPrismaClient } from './generated/prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new GeneratedPrismaClient({ adapter }) as any;

async function testGhsDepositFlow() {
  try {
    console.log('\n========== GHS DEPOSIT FLOW TEST ==========\n');

    // Create test user directly in DB with verified email
    const testEmail = `ghs-test-${Date.now()}@test.com`;
    const password = 'TestPassword123!';
    const passwordHash = await bcrypt.hash(password, 12);

    console.log('STEP 1: Create test user in database');
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
    console.log(`  Password: ${password}\n`);

    // Create wallet
    console.log('STEP 2: Create wallet');
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
      },
    });
    console.log(`✓ Wallet created: ${wallet.id}\n`);

    // Get or create GHS balance
    console.log('STEP 3: Create initial GHS balance');
    let ghsBalance = await prisma.walletBalance.findUnique({
      where: {
        walletId_currencyCode: {
          walletId: wallet.id,
          currencyCode: 'GHS',
        },
      },
    });

    if (!ghsBalance) {
      ghsBalance = await prisma.walletBalance.create({
        data: {
          walletId: wallet.id,
          currencyCode: 'GHS',
          availableBalance: 0,
          pendingBalance: 0,
        },
      });
    }
    console.log(`✓ GHS Balance created: ${ghsBalance.availableBalance}\n`);

    // Verify currencies exist
    console.log('STEP 4: Verify currencies');
    const currencies = await prisma.currency.findMany();
    console.log(`✓ Total currencies in DB: ${currencies.length}`);
    const ghs = currencies.find((c) => c.code === 'GHS');
    console.log(`✓ GHS exists: ${ghs ? 'YES' : 'NO'}\n`);

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
    const ghsCurr = currData.find((c: any) => c.code === 'GHS');
    console.log(`GHS: ${ghsCurr ? 'FOUND' : 'NOT FOUND'}\n`);

    // ========== MAIN TEST: Create GHS Bank Transfer Deposit ==========
    console.log('TEST 4: Create GHS Bank Transfer Deposit');
    console.log('Request Details:');
    console.log('  - Currency: GHS');
    console.log('  - Payment Method: BANK_TRANSFER');
    console.log('  - Amount: 500 USD (equivalent to GHS at current rate)');
    console.log('  - Country: Ghana');
    console.log('  - Country Code: GH\n');

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
    console.log(`HTTP Status: ${depositRes.status}`);
    const depositData = await depositRes.json();
    
    console.log('\n========== DEPOSIT RESPONSE ==========\n');
    console.log('Core Fields:');
    console.log(`  ID: ${depositData.id}`);
    console.log(`  Status: ${depositData.status}`);
    console.log(`  Currency: ${depositData.currency}`);
    console.log(`  Amount: ${depositData.amount}`);
    console.log(`  Provider: ${depositData.provider}`);
    console.log(`  Payment Method: ${depositData.paymentMethod ?? 'N/A'}`);
    
    if (depositData.transaction) {
      console.log('\nTransaction Details:');
      console.log(`  ID: ${depositData.transaction.id}`);
      console.log(`  Reference: ${depositData.transaction.reference}`);
      console.log(`  Status: ${depositData.transaction.status}`);
    }

    console.log('\n========== BANK TRANSFER DETAILS ==========\n');
    
    // Check if bank details are in the root response
    const bankName = depositData.bankName || (depositData.metadata?.bankTransfer?.bankName) || depositData.bankTransferDetails?.bankName;
    const accountNumber = depositData.accountNumber || (depositData.metadata?.bankTransfer?.accountNumber) || depositData.bankTransferDetails?.accountNumber;
    const accountName = depositData.accountName || (depositData.metadata?.bankTransfer?.accountName) || depositData.bankTransferDetails?.accountName;
    const expiresAt = depositData.expiresAt || (depositData.metadata?.bankTransfer?.expiresAt) || depositData.bankTransferDetails?.expiresAt;

    if (bankName || accountNumber) {
      console.log('✓ Bank Transfer Details Found:');
      console.log(`  Bank Name: ${bankName || 'NOT PROVIDED'}`);
      console.log(`  Account Number: ${accountNumber || 'NOT PROVIDED'}`);
      console.log(`  Account Name: ${accountName || 'NOT PROVIDED'}`);
      console.log(`  Expires At: ${expiresAt || 'NOT PROVIDED'}`);
    } else {
      console.log('✗ Bank Transfer Details NOT FOUND in response');
      console.log('\nFull response object:');
      console.log(JSON.stringify(depositData, null, 2));
    }

    console.log('\n========== TEST COMPLETE ==========\n');

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
      console.log(`  Reference: ${txn.reference}`);
    }

    const deposit = await prisma.deposit.findFirst({
      where: { userId: user.id },
      include: { transaction: true, wallet: true },
    });
    console.log(`Deposit created: ${deposit ? 'YES' : 'NO'}`);
    if (deposit) {
      console.log(`  Currency: ${deposit.currencyCode}`);
      console.log(`  Amount: ${deposit.amount}`);
      console.log(`  Status: ${deposit.status}`);
      console.log(`  Payment Method: ${deposit.paymentMethod}`);
      console.log(`  Provider Reference: ${deposit.providerReference}`);
      console.log(`  Provider Transaction ID: ${deposit.providerTransactionId}`);
      if (deposit.metadata) {
        console.log(`  Metadata Keys: ${Object.keys(deposit.metadata).join(', ')}`);
        if ((deposit.metadata as any).bankTransfer) {
          console.log(`    Bank Transfer:`, (deposit.metadata as any).bankTransfer);
        }
        if ((deposit.metadata as any).flutterwave) {
          console.log(`    Flutterwave:`, (deposit.metadata as any).flutterwave);
        }
      }
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
    console.error('\n========== ERROR ==========\n');
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testGhsDepositFlow();
