#!/usr/bin/env node

/**
 * Generate Test Auth Token
 * Creates a test user directly in the database and generates a JWT token for testing
 */

const axios = require('axios');
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
require('dotenv').config();

const BACKEND_URL = 'http://localhost:3000';
const EMAIL = `test-${Date.now()}@test.com`;
const PASSWORD = 'Test123456!';

const api = axios.create({
  baseURL: BACKEND_URL,
  validateStatus: () => true,
});

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

async function generateTestToken() {
  let dbClient;
  try {
    console.log('🔐 Generating test auth token...\n');

    // Create user directly in database
    dbClient = await getDbClient();
    await dbClient.connect();

    const userId = randomUUID();
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);

    await dbClient.query(
      `INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", "isEmailVerified", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [userId, EMAIL, hashedPassword, 'Test', 'User', true]
    );

    console.log('✅ Test user created in database');

    // Login to get token
    const loginResponse = await api.post('/auth/login', {
      email: EMAIL,
      password: PASSWORD,
    });

    if (loginResponse.status !== 200 && loginResponse.status !== 201) {
      console.log(`Login response: ${loginResponse.status}`, loginResponse.data);
      throw new Error('Login failed');
    }

    const token = loginResponse.data?.accessToken || loginResponse.data?.access_token;
    if (!token) {
      throw new Error('No access token in login response');
    }

    console.log('✅ Login successful');
    console.log(`\n📋 Test Token:`);
    console.log(token);
    console.log(`\n✅ Use this to set the environment variable:`);
    console.log(`   $env:TEST_AUTH_TOKEN="${token}"`);
    console.log(`   npm run test:gbp-deposit`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

generateTestToken();
