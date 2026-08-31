const { Client } = require('pg');
require('dotenv').config();
const https = require('https');
const { randomUUID } = require('crypto');

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

async function run() {
  console.log('\n========== DEPOSIT FLOW TEST ==========\n');
  
  // Step 1: Create test user
  console.log('STEP 1: Create test user');
  console.log(`  Email: ${EMAIL}`);

  // Step 2: Mark verified in database
  console.log('STEP 2: Create user in database');
  try {
    const bcrypt = require('bcrypt');
    // Parse DATABASE_URL manually to handle URL-encoded password
    const fullUrl = process.env.DATABASE_URL;
    const dbUrl = fullUrl.replace(/^postgresql:\/\//, '');
    const [auth, hostPart] = dbUrl.split('@');
    const [user, dbPass] = auth.split(':');
    const [hostPort, database] = hostPart.split('/');
    const [host, port] = hostPort.split(':');
    
    const client = new Client({
      host,
      port: parseInt(port),
      database,
      user,
      password: decodeURIComponent(dbPass)
    });
    await client.connect();
    
    // Delete any pending registration
    await client.query('DELETE FROM "PendingRegistration" WHERE email = $1', [EMAIL]);
    
    // Delete any existing user (if somehow created)
    await client.query('DELETE FROM "User" WHERE email = $1', [EMAIL]);
    
    // Create the user directly with verified email
    const passwordHash = await bcrypt.hash(PASSWORD, 12);
    const userId = randomUUID();
    const now = new Date();
    const result = await client.query(
      `INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", "isEmailVerified", "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, true, true, $6, $7)
       RETURNING id`,
      [userId, EMAIL, passwordHash, 'Deposit', 'Tester', now, now]
    );
    
    console.log(`✓ User created: ${result.rows[0].id}\n`);
    
    await client.end();
  } catch (err) {
    console.log(`✗ Database error: ${err.message}\n`);
    process.exit(1);
  }

  // Step 3: Login
  console.log('STEP 3: Login');
  const loginRes = await httpPost('http://localhost:3000/auth/login', {
    email: EMAIL,
    password: PASSWORD
  });
  console.log(`✓ Status: ${loginRes.statusCode}`);
  
  if (!loginRes.body.accessToken) {
    console.log(`✗ Login failed - no token`);
    console.log(`  Response: ${JSON.stringify(loginRes.body)}`);
    process.exit(1);
  }
  
  const token = loginRes.body.accessToken;
  console.log(`  Token: ${token.substring(0, 30)}...\n`);

  const headers = { 'Authorization': `Bearer ${token}` };

  // Step 3b: Create wallet balance for NGN
  console.log('STEP 3b: Create wallet balance');
  try {
    const fullUrl = process.env.DATABASE_URL;
    const dbUrl = fullUrl.replace(/^postgresql:\/\//, '');
    const [auth, hostPart] = dbUrl.split('@');
    const [user, dbPass] = auth.split(':');
    const [hostPort, database] = hostPart.split('/');
    const [host, port] = hostPort.split(':');
    
    const client = new Client({
      host,
      port: parseInt(port),
      database,
      user,
      password: decodeURIComponent(dbPass)
    });
    await client.connect();
    
    // Get the wallet ID that was created
    const walletResult = await client.query('SELECT id FROM "Wallet" WHERE "userId" = $1', [result.rows[0].id]);
    const walletId = walletResult.rows[0].id;
    
    // Get NGN currency ID
    const currResult = await client.query('SELECT id FROM "Currency" WHERE code = $1', ['NGN']);
    if (currResult.rows.length === 0) {
      console.log(`✗ NGN currency not found\n`);
      await client.end();
      process.exit(1);
    }
    const currencyId = currResult.rows[0].id;
    
    // Create wallet balance
    const balanceId = randomUUID();
    await client.query(
      `INSERT INTO "WalletBalance" (id, "walletId", "currencyCode", "availableBalance", "pendingBalance", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [balanceId, walletId, 'NGN', '0', '0', new Date(), new Date()]
    );
    console.log(`✓ NGN balance created\n`);
    
    await client.end();
  } catch (err) {
    console.log(`✗ Balance creation error: ${err.message}\n`);
  }

  // Step 4: Get Wallet
  console.log('STEP 4: Get wallet');
  const walletRes = await httpGet('http://localhost:3000/wallet', headers);
  console.log(`✓ Status: ${walletRes.statusCode}`);
  console.log(`  Wallet ID: ${walletRes.body.wallet.id}\n`);

  // Step 5: Get Currencies
  console.log('STEP 5: Get currencies');
  const currRes = await httpGet('http://localhost:3000/currencies', headers);
  console.log(`✓ Status: ${currRes.statusCode}`);
  const ngn = currRes.body.find(c => c.code === 'NGN');
  console.log(`  Total: ${currRes.body.length}`);
  console.log(`  NGN: ${ngn ? 'FOUND' : 'NOT FOUND'}\n`);

  // Step 6: Create Deposit
  console.log('STEP 6: Create deposit');
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
    console.log(`✗ Deposit creation failed`);
    console.log(`  Response: ${JSON.stringify(depositRes.body)}`);
  } else {
    const deposit = depositRes.body;
    console.log(`  Deposit ID: ${deposit.id}`);
    console.log(`  Status: ${deposit.status}`);
    console.log(`  Amount: ${deposit.amount} ${deposit.currency}`);
    console.log(`  Provider: ${deposit.provider}`);
    
    if (deposit.bankTransfer) {
      console.log(`  Bank Transfer:`);
      console.log(`    Bank: ${deposit.bankTransfer.bankName}`);
      console.log(`    Account: ${deposit.bankTransfer.accountNumber}`);
    }
    
    if (deposit.transaction) {
      console.log(`  Transaction:`);
      console.log(`    ID: ${deposit.transaction.id}`);
      console.log(`    Reference: ${deposit.transaction.reference}`);
      console.log(`    Status: ${deposit.transaction.status}`);
    }
  }

  console.log('\n========== TEST COMPLETE ==========\n');
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

    const req = require('http').request(url, options, (res) => {
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

    const req = require('http').request(url, options, (res) => {
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

run().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
