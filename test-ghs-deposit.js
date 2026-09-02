#!/usr/bin/env node

/**
 * GHS Bank Transfer Deposit Test
 * Tests the complete flow: Create test user -> Login -> Create GHS Bank Transfer Deposit
 */

const crypto = require('crypto');

const API = 'http://localhost:3000';

async function testGhsDeposit() {
  try {
    console.log('\n========== GHS BANK TRANSFER DEPOSIT TEST ==========\n');

    // Create test user credentials
    const testEmail = `ghs-test-${Date.now()}@test.com`;
    const password = 'TestPassword123!';
    
    console.log('Test User Credentials:');
    console.log(`  Email: ${testEmail}`);
    console.log(`  Password: ${password}\n`);

    // Step 1: Register
    console.log('STEP 1: Register user');
    const registerRes = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password,
        firstName: 'GHS',
        lastName: 'Tester',
      }),
    });
    const registerData = await registerRes.json();
    console.log(`Status: ${registerRes.status}`);
    if (!registerRes.ok) {
      console.log(`Error: ${JSON.stringify(registerData, null, 2)}`);
      return;
    }
    console.log(`✓ User registered\n`);

    // Step 2: Verify email (in test environment, usually auto-verified)
    console.log('STEP 2: Verify email');
    // Skip verification - try login directly
    console.log(`⊘ Skipping email verification, attempting login\n`);

    // Step 3: Login
    console.log('STEP 3: Login');
    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password }),
    });
    console.log(`Status: ${loginRes.status}`);
    const loginData = await loginRes.json();
    if (!loginData.accessToken) {
      console.log(`Error: ${JSON.stringify(loginData, null, 2)}`);
      return;
    }
    const token = loginData.accessToken;
    console.log(`✓ Token obtained\n`);

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Step 4: Create wallet
    console.log('STEP 4: Get/Create wallet');
    const walletRes = await fetch(`${API}/wallet`, {
      method: 'GET',
      headers,
    });
    const walletData = await walletRes.json();
    console.log(`Status: ${walletRes.status}`);
    console.log(`Wallet ID: ${walletData.wallet?.id || walletData.id}\n`);

    // Step 5: Get currencies
    console.log('STEP 5: Verify GHS currency exists');
    const currRes = await fetch(`${API}/currencies`, {
      method: 'GET',
      headers,
    });
    const currencies = await currRes.json();
    const ghsCurr = currencies.find((c) => c.code === 'GHS');
    console.log(`Status: ${currRes.status}`);
    console.log(`GHS Found: ${ghsCurr ? 'YES' : 'NO'}`);
    if (ghsCurr) {
      console.log(`  Enabled: ${ghsCurr.enabled}`);
      console.log(`  Deposit Enabled: ${ghsCurr.depositEnabled}\n`);
    }

    // ========== MAIN TEST: Create GHS Bank Transfer Deposit ==========
    console.log('========== STEP 6: CREATE GHS BANK TRANSFER DEPOSIT ==========\n');
    console.log('Request Body:');
    const depositBody = {
      amount: 500,
      currency: 'GHS',
      paymentMethod: 'BANK_TRANSFER',
      country: 'Ghana',
      countryCode: 'GH',
      idempotencyKey: `ghs-test-${Date.now()}`,
    };
    console.log(JSON.stringify(depositBody, null, 2));
    console.log();

    const depositRes = await fetch(`${API}/deposits`, {
      method: 'POST',
      headers,
      body: JSON.stringify(depositBody),
    });
    console.log(`HTTP Status: ${depositRes.status}`);
    const depositData = await depositRes.json();
    
    console.log('\n========== FULL DEPOSIT RESPONSE ==========\n');
    console.log(JSON.stringify(depositData, null, 2));

    // Parse response for key fields
    console.log('\n========== KEY FIELDS ANALYSIS ==========\n');
    
    console.log('DEPOSIT CORE:');
    console.log(`  ID: ${depositData.id || 'MISSING'}`);
    console.log(`  Status: ${depositData.status || 'MISSING'}`);
    console.log(`  Currency: ${depositData.currency || 'MISSING'}`);
    console.log(`  Amount: ${depositData.amount || 'MISSING'}`);
    console.log(`  Provider: ${depositData.provider || 'MISSING'}`);
    console.log(`  Payment Method: ${depositData.paymentMethod || 'MISSING'}`);

    console.log('\nBANK TRANSFER DETAILS (checking all possible locations):');
    const possibleBankNameFields = [
      depositData.bankName,
      depositData.bankTransfer?.bankName,
      depositData.metadata?.bankTransfer?.bankName,
      depositData.bankTransferDetails?.bankName,
    ];
    const bankName = possibleBankNameFields.find(v => v !== undefined && v !== null);
    console.log(`  Bank Name: ${bankName || 'NOT FOUND'}`);

    const possibleAccountNumberFields = [
      depositData.accountNumber,
      depositData.bankTransfer?.accountNumber,
      depositData.metadata?.bankTransfer?.accountNumber,
      depositData.bankTransferDetails?.accountNumber,
    ];
    const accountNumber = possibleAccountNumberFields.find(v => v !== undefined && v !== null);
    console.log(`  Account Number: ${accountNumber || 'NOT FOUND'}`);

    const possibleAccountNameFields = [
      depositData.accountName,
      depositData.bankTransfer?.accountName,
      depositData.metadata?.bankTransfer?.accountName,
      depositData.bankTransferDetails?.accountName,
    ];
    const accountName = possibleAccountNameFields.find(v => v !== undefined && v !== null);
    console.log(`  Account Name: ${accountName || 'NOT FOUND'}`);

    const possibleExpiryFields = [
      depositData.expiresAt,
      depositData.bankTransfer?.expiresAt,
      depositData.metadata?.bankTransfer?.expiresAt,
      depositData.bankTransferDetails?.expiresAt,
    ];
    const expiresAt = possibleExpiryFields.find(v => v !== undefined && v !== null);
    console.log(`  Expires At: ${expiresAt || 'NOT FOUND'}`);

    console.log('\nTRANSACTION INFO:');
    if (depositData.transaction) {
      console.log(`  ID: ${depositData.transaction.id || 'MISSING'}`);
      console.log(`  Reference: ${depositData.transaction.reference || 'MISSING'}`);
      console.log(`  Status: ${depositData.transaction.status || 'MISSING'}`);
    } else {
      console.log(`  Transaction: NOT PRESENT IN RESPONSE`);
    }

    console.log('\nMETADATA:');
    if (depositData.metadata) {
      console.log('  Keys:', Object.keys(depositData.metadata).join(', '));
      if (depositData.metadata.flutterwave) {
        console.log('  Flutterwave:', JSON.stringify(depositData.metadata.flutterwave, null, 2));
      }
      if (depositData.metadata.bankTransfer) {
        console.log('  Bank Transfer:', JSON.stringify(depositData.metadata.bankTransfer, null, 2));
      }
    } else {
      console.log(`  No metadata`);
    }

    console.log('\n========== RESULT ==========\n');
    if (bankName && accountNumber) {
      console.log('✓ SUCCESS: Bank transfer details ARE present');
      console.log(`  Bank: ${bankName}`);
      console.log(`  Account: ${accountNumber}`);
      console.log(`  Account Name: ${accountName || 'N/A'}`);
      console.log(`  Expires: ${expiresAt || 'N/A'}`);
    } else {
      console.log('✗ FAILURE: Bank transfer details NOT found in response');
      console.log('\nChecking if this is a Flutterwave API error:');
      if (depositData.message) {
        console.log(`  Message: ${depositData.message}`);
      }
      if (depositData.error) {
        console.log(`  Error: ${depositData.error}`);
      }
      console.log('\nFull response for debugging:');
      console.log(JSON.stringify(depositData, null, 2));
    }

    console.log('\n========== TEST COMPLETE ==========\n');

  } catch (err) {
    console.error('\n========== ERROR ==========\n');
    console.error(err);
  }
}

testGhsDeposit();
