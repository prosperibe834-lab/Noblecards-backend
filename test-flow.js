#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
require('dotenv').config();

const email = `test-${Date.now()}@example.com`;
const password = 'Test123456!';

console.log('\n========== DEPOSIT FLOW TEST ==========\n');

// Step 1: Register user
console.log('STEP 1: Register user');
console.log(`Email: ${email}`);

const regPayload = JSON.stringify({
  email,
  password,
  firstName: 'Deposit',
  lastName: 'Tester'
});

try {
  const regRes = execSync(`curl -s -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '${regPayload.replace(/'/g, "'\\''")}'`);
  const regData = JSON.parse(regRes.toString());
  console.log(`✓ Status: ${regData.email ? '201' : 'unknown'}`);
} catch (err) {
  console.error('✗ Registration failed:', err.message);
}

// Step 2: Update database to mark email as verified
console.log('\nSTEP 2: Mark email as verified in database');
const dbUrl = process.env.DATABASE_URL;
const updateCmd = `UPDATE "User" SET "isEmailVerified" = true WHERE email = '${email}';`;

try {
  // Parse the connection string
  const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
  if (!match) throw new Error('Invalid DATABASE_URL format');
  
  const [, user, pass, host, port, database] = match;
  
  // Decode URL-encoded password
  const decodedPass = decodeURIComponent(pass);
  
  // Use psql to update
  process.env.PGPASSWORD = decodedPass;
  const result = execSync(`psql -U ${user} -h ${host} -p ${port} -d ${database} -c "${updateCmd}"`, {
    stdio: 'pipe',
    encoding: 'utf8'
  });
  
  console.log('✓ User marked as verified');
} catch (err) {
  console.error('✗ Database update failed:', err.message);
  console.error('Continuing anyway...');
}

// Step 3: Login
console.log('\nSTEP 3: Login');
const loginPayload = JSON.stringify({ email, password });

try {
  const loginRes = execSync(`curl -s -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '${loginPayload.replace(/'/g, "'\\''")}'`);
  const loginData = JSON.parse(loginRes.toString());
  
  if (loginData.accessToken) {
    console.log(`✓ Login successful`);
    console.log(`  Token: ${loginData.accessToken.substring(0, 40)}...`);
    
    const token = loginData.accessToken;
    
    // Step 4: Test endpoints
    console.log('\n========== API TESTS ==========\n');
    
    const headers = `Authorization: Bearer ${token}`;
    
    // Get wallet
    console.log('TEST 1: GET /wallet');
    try {
      const walletRes = execSync(`curl -s -X GET http://localhost:3000/wallet -H "${headers}" -H "Content-Type: application/json"`);
      const walletData = JSON.parse(walletRes.toString());
      console.log(`✓ Wallet: ${walletData.wallet.id}`);
    } catch (err) {
      console.error('✗ Error:', err.message);
    }
    
    // Get currencies
    console.log('\nTEST 2: GET /currencies');
    try {
      const currRes = execSync(`curl -s -X GET http://localhost:3000/currencies -H "${headers}" -H "Content-Type: application/json"`);
      const currData = JSON.parse(currRes.toString());
      console.log(`✓ Currencies: ${currData.length} found`);
      const ngn = currData.find(c => c.code === 'NGN');
      console.log(`  NGN: ${ngn ? 'FOUND' : 'NOT FOUND'}`);
    } catch (err) {
      console.error('✗ Error:', err.message);
    }
    
    // Create deposit
    console.log('\nTEST 3: POST /deposits');
    const depositPayload = JSON.stringify({
      amount: 10000,
      currency: 'NGN',
      paymentMethod: 'BANK_TRANSFER',
      country: 'Nigeria',
      countryCode: 'NG',
      idempotencyKey: `test-${Date.now()}`
    });
    
    try {
      const depositRes = execSync(`curl -s -X POST http://localhost:3000/deposits -H "${headers}" -H "Content-Type: application/json" -d '${depositPayload.replace(/'/g, "'\\''")}'`);
      const depositData = JSON.parse(depositRes.toString());
      console.log(`✓ Deposit created: ${depositData.id}`);
      console.log(`  Status: ${depositData.status}`);
      console.log(`  Amount: ${depositData.amount} ${depositData.currency}`);
      if (depositData.bankTransfer) {
        console.log(`  Bank: ${depositData.bankTransfer.bankName}`);
        console.log(`  Account: ${depositData.bankTransfer.accountNumber}`);
      }
      if (depositData.transaction) {
        console.log(`  Transaction: ${depositData.transaction.id}`);
      }
    } catch (err) {
      console.error('✗ Error:', err.message);
      console.error('Response:', err.stderr?.toString() || err.stdout?.toString());
    }
    
    console.log('\n========== TEST COMPLETE ==========\n');
  } else {
    console.error('✗ Login failed:', loginData.message);
  }
} catch (err) {
  console.error('✗ Login request failed:', err.message);
}
