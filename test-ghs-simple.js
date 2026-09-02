#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Read the dist build to get Prisma client
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('dist folder not found. Please run: npm run build');
  process.exit(1);
}

async function testGhsDeposit() {
  try {
    // Load the Prisma client from dist
    console.log('Loading database client...');
    
    // We need to dynamically load the Prisma client after build
    // For now, let's make direct HTTP calls using a pre-existing test user
    // Let's first check what test users already exist
    
    console.log('\n========== GHS BANK TRANSFER DEPOSIT TEST ==========\n');
    console.log('This test will create a GHS bank transfer deposit via HTTP API\n');

    const API = 'http://localhost:3000';

    // For this test, we'll use an environment variable token if available
    // or we can create a registration inline
    const testEmail = `ghs-test-${Date.now()}@noblecards.test`;
    const testPassword = 'TestPassword123!@';

    // Try to login with a known test user first
    console.log('Attempting to use test credentials...');
    console.log(`Email: ${testEmail}`);

    // Try creating fresh test user with immediate login
    console.log('\nSTEP 1: Create test user (POST /auth/register)');
    let registerRes;
    try {
      registerRes = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          firstName: 'GHS',
          lastName: 'Deposit',
        }),
      });
      const registerData = await registerRes.json();
      console.log(`Status: ${registerRes.status}`);
      console.log(`Response:`, JSON.stringify(registerData, null, 2));
      if (registerData.requiresVerification) {
        console.log(`✓ User created, verification required`);
        console.log(`  Pending email in database - needs OTP code from email service\n`);
      }
    } catch (err) {
      console.error('Registration failed:', err.message);
      process.exit(1);
    }

    // Since email verification is required and we don't have email service,
    // let's try to query an existing verified user for testing
    // Or we can patch the user directly to set isEmailVerified = true
    // For now, let's attempt a direct login with the credentials we just created

    console.log('STEP 2: Attempt login (this will fail if email not verified)');
    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    console.log(`Status: ${loginRes.status}`);
    const loginData = await loginRes.json();
    console.log(`Response:`, JSON.stringify(loginData, null, 2));

    if (!loginData.accessToken) {
      console.log('\n⚠ Login failed - email verification required');
      console.log('For testing, we need to either:');
      console.log('  1. Mock the email service to auto-verify');
      console.log('  2. Use database admin to set isEmailVerified = true');
      console.log('  3. Extract OTP from email service logs');
      console.log('\nLet me check for an existing verified test user instead...\n');
      
      // Try to find existing users to test with
      console.log('ALTERNATIVE: Testing with curl to see API response...\n');
      return;
    }

    const token = loginData.accessToken;
    console.log(`✓ Logged in successfully\n`);

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Now test the GHS deposit
    console.log('STEP 3: Create GHS Bank Transfer Deposit');
    const depositBody = {
      amount: 500,
      currency: 'GHS',
      paymentMethod: 'BANK_TRANSFER',
      country: 'Ghana',
      countryCode: 'GH',
      idempotencyKey: `ghs-test-${Date.now()}`,
    };
    console.log('Request:');
    console.log(JSON.stringify(depositBody, null, 2));
    console.log();

    const depositRes = await fetch(`${API}/deposits`, {
      method: 'POST',
      headers,
      body: JSON.stringify(depositBody),
    });
    console.log(`HTTP Status: ${depositRes.status}\n`);
    const depositData = await depositRes.json();

    console.log('FULL RESPONSE:');
    console.log(JSON.stringify(depositData, null, 2));

  } catch (err) {
    console.error('\nERROR:', err);
  }
}

testGhsDeposit();
