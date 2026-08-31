const { Client } = require('pg');
const http = require('http');
require('dotenv').config();
const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');

const EMAIL = `test-${Date.now()}@test.com`;
const PASSWORD = 'Test123456!';

async function getDbClient() {
  const fullUrl = process.env.DATABASE_URL;
  const dbUrl = fullUrl.replace(/^postgresql:\/\//, '');
  const [auth, hostPart] = dbUrl.split('@');
  const [user, dbPass] = auth.split(':');
  const [hostPort, database] = hostPart.split('/');
  const [host, port] = hostPort.split(':');
  
  return new Client({
    host,
    port: parseInt(port),
    database,
    user,
    password: decodeURIComponent(dbPass)
  });
}

function httpPost(url, data, hdrs = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...hdrs
      }
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function httpGet(url, hdrs = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...hdrs
      }
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('\n========== DEPOSIT FLOW TEST ==========\n');
  
  // Step 1: Create user in database
  console.log('STEP 1: Create user in database');
  let userId, walletId;
  try {
    const client = await getDbClient();
    await client.connect();
    
    // Clean up any previous records
    await client.query('DELETE FROM "User" WHERE email = $1', [EMAIL]);
    await client.query('DELETE FROM "PendingRegistration" WHERE email = $1', [EMAIL]);
    
    // Create user
    const passwordHash = await bcrypt.hash(PASSWORD, 12);
    userId = randomUUID();
    const now = new Date();
    await client.query(
      `INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", "isEmailVerified", "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, true, true, $6, $7)`,
      [userId, EMAIL, passwordHash, 'Deposit', 'Tester', now, now]
    );
    
    // Create wallet
    walletId = randomUUID();
    await client.query(
      `INSERT INTO "Wallet" (id, "userId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4)`,
      [walletId, userId, now, now]
    );
    
    // Create wallet balance for NGN
    const balanceId = randomUUID();
    await client.query(
      `INSERT INTO "WalletBalance" (id, "walletId", "currencyCode", "availableBalance", "pendingBalance", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [balanceId, walletId, 'NGN', '0', '0', now, now]
    );
    
    console.log(`✓ User created: ${userId}`);
    console.log(`✓ Wallet created: ${walletId}`);
    console.log(`✓ NGN balance created\n`);
    
    await client.end();
  } catch (err) {
    console.log(`✗ Setup error: ${err.message}\n`);
    process.exit(1);
  }

  // Step 2: Login
  console.log('STEP 2: Login');
  const loginRes = await httpPost('http://localhost:3000/auth/login', {
    email: EMAIL,
    password: PASSWORD
  });
  console.log(`✓ Status: ${loginRes.statusCode}`);
  
  if (!loginRes.body.accessToken) {
    console.log(`✗ Login failed`);
    console.log(`  Response: ${JSON.stringify(loginRes.body)}\n`);
    process.exit(1);
  }
  
  const token = loginRes.body.accessToken;
  console.log(`✓ Token: ${token.substring(0, 30)}...\n`);

  const headers = { 'Authorization': `Bearer ${token}` };

  // Step 3: Get wallet
  console.log('STEP 3: Get wallet');
  const walletRes = await httpGet('http://localhost:3000/wallet', headers);
  console.log(`✓ Status: ${walletRes.statusCode}`);
  console.log(`✓ Wallet ID: ${walletRes.body.wallet.id}\n`);

  // Step 4: Get currencies
  console.log('STEP 4: Get currencies');
  const currRes = await httpGet('http://localhost:3000/currencies', headers);
  console.log(`✓ Status: ${currRes.statusCode}`);
  const ngn = currRes.body.find(c => c.code === 'NGN');
  console.log(`✓ NGN: ${ngn ? 'FOUND' : 'NOT FOUND'}\n`);

  // Step 5: Create deposit
  console.log('STEP 5: Create deposit');
  const depositRes = await httpPost('http://localhost:3000/deposits', {
    amount: 10000,
    currency: 'NGN',
    paymentMethod: 'BANK_TRANSFER',
    country: 'Nigeria',
    countryCode: 'NG',
    idempotencyKey: `test-${Date.now()}`
  }, headers);
  
  console.log(`✓ Status: ${depositRes.statusCode}`);
  
  if (depositRes.statusCode !== 201) {
    console.log(`✗ Deposit failed`);
    console.log(`  Response: ${JSON.stringify(depositRes.body)}\n`);
    process.exit(1);
  }
  
  const deposit = depositRes.body;
  console.log(`✓ Deposit ID: ${deposit.id}`);
  console.log(`  Amount: ${deposit.amount} ${deposit.currency}`);
  console.log(`  Status: ${deposit.status}`);
  console.log(`  Provider: ${deposit.provider}`);
  
  if (deposit.bankTransfer) {
    console.log(`  Bank: ${deposit.bankTransfer.bankName}`);
    console.log(`  Account: ${deposit.bankTransfer.accountNumber}`);
  }
  
  if (deposit.transaction) {
    console.log(`  Transaction: ${deposit.transaction.id}`);
    console.log(`  Reference: ${deposit.transaction.reference}`);
    console.log(`  TX Status: ${deposit.transaction.status}`);
  }

  // Step 6: Check wallet balances
  console.log('\nSTEP 6: Check wallet balances');
  const balancesRes = await httpGet('http://localhost:3000/wallet/balances', headers);
  console.log(`✓ Status: ${balancesRes.statusCode}`);
  balancesRes.body.forEach(b => {
    console.log(`  ${b.currency}: Available=${b.availableBalance}, Pending=${b.pendingBalance}`);
  });

  console.log('\n========== TEST COMPLETE ==========\n');
}

run().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
