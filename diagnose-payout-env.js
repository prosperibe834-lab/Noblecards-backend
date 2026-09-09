const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const requiredKeys = [
  'FLUTTERWAVE_PAYOUT_ENABLED',
  'FLUTTERWAVE_PAYOUT_ENVIRONMENT',
  'FLUTTERWAVE_PAYOUT_BASE_URL',
  'FLUTTERWAVE_SECRET_KEY',
  'FLUTTERWAVE_WEBHOOK_SECRET_HASH',
  'FLUTTERWAVE_PAYOUT_SUPPORTED_ROUTES',
];

const cwd = process.cwd();
const envPath = path.resolve(cwd, '.env');
const results = {};

for (const key of requiredKeys) {
  const value = process.env[key];
  results[key] = value && String(value).trim() ? 'PRESENT' : 'MISSING';
}

console.log(`WORKING_DIRECTORY: ${cwd}`);
console.log(`ENV_FILE_PRESENT: ${fs.existsSync(envPath) ? 'YES' : 'NO'}`);
console.log(JSON.stringify(results, null, 2));
