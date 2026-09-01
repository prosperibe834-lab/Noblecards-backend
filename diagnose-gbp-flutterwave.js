const fs = require('fs');
const path = require('path');
const { config } = require('dotenv');

config({ path: path.resolve(__dirname, '.env') });

const mask = (value) => {
  if (!value) return 'MISSING';
  if (value.length <= 8) return '****';
  return `${value.slice(0, 4)}****${value.slice(-4)}`;
};

const findAuthorizationUrl = (value, currentPath = '$') => {
  if (!value || typeof value !== 'object') return null;

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      const found = findAuthorizationUrl(value[i], `${currentPath}[${i}]`);
      if (found) return found;
    }
    return null;
  }

  const keys = Object.keys(value);
  for (const key of keys) {
    const lowerKey = String(key).toLowerCase();
    const next = value[key];
    const nextPath = `${currentPath}.${key}`;

    if (typeof next === 'string') {
      const candidate = next.trim();
      if ((lowerKey.includes('authorization') || lowerKey.includes('redirect') || lowerKey.includes('url')) && candidate.startsWith('http')) {
        return { path: nextPath, value: candidate };
      }
      if (lowerKey === 'redirect' && candidate.startsWith('http')) {
        return { path: nextPath, value: candidate };
      }
      if ((lowerKey === 'authorization_url' || lowerKey === 'authorizationurl' || lowerKey === 'redirect_url') && candidate.startsWith('http')) {
        return { path: nextPath, value: candidate };
      }
    }

    if (next && typeof next === 'object') {
      const found = findAuthorizationUrl(next, nextPath);
      if (found) return found;
    }
  }

  return null;
};

const redactJson = (obj) => {
  if (Array.isArray(obj)) return obj.map(redactJson);
  if (!obj || typeof obj !== 'object') return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const lowerKey = String(key).toLowerCase();
      if (
        lowerKey.includes('authorization') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('token') ||
        lowerKey.includes('password') ||
        lowerKey.includes('api_key') ||
        lowerKey.includes('key') && !lowerKey.includes('currency') && !lowerKey.includes('meta')
      ) {
        return [key, '[REDACTED]'];
      }
      if (lowerKey.includes('email') || lowerKey.includes('phone') || lowerKey.includes('name')) {
        return [key, typeof value === 'string' ? '[REDACTED]' : redactJson(value)];
      }
      return [key, typeof value === 'object' ? redactJson(value) : value];
    })
  );
};

(async () => {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
  const baseUrl = 'https://api.flutterwave.com/v3';
  const payload = {
    type: 'account-ach-uk',
    amount: 300,
    currency: 'GBP',
    email: 'demo.user@example.com',
    tx_ref: `GBP-TERMINAL-TRACE-${Date.now()}`,
    fullname: 'Demo User',
    redirect_url: 'https://example.com/callback',
    meta: {
      deposit_id: 'diag-deposit',
      wallet_id: 'diag-wallet',
      user_id: 'diag-user',
      internal_reference: 'diag-ref',
    },
  };

  console.log('========================================');
  console.log('GBP FLUTTERWAVE DIAGNOSTIC');
  console.log('========================================');
  console.log('ENV FILE:', path.resolve(__dirname, '.env'));
  console.log('FLUTTERWAVE_SECRET_KEY configured:', !!secretKey);
  console.log('FLUTTERWAVE_SECRET_KEY masked:', mask(secretKey));
  console.log('FLUTTERWAVE_SECRET_KEY type:', secretKey ? (secretKey.startsWith('FLWSECK_TEST') ? 'TEST' : secretKey.startsWith('FLWSECK_LIVE') ? 'LIVE' : 'UNKNOWN') : 'MISSING');
  console.log('FLUTTERWAVE_PUBLIC_KEY configured:', !!publicKey);
  console.log('FLUTTERWAVE_PUBLIC_KEY masked:', mask(publicKey));
  console.log('BASE URL:', baseUrl);
  console.log('TARGET:', `${baseUrl}/charges?type=account-ach-uk`);
  console.log('');

  try {
    const response = await fetch(`${baseUrl}/charges?type=account-ach-uk`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }

    console.log('========================================');
    console.log('GBP FLUTTERWAVE TEST RESULT');
    console.log('========================================');
    console.log('HTTP STATUS:', response.status);

    if (!response.ok || !parsed || parsed.status === 'error') {
      console.log('GBP FLUTTERWAVE TEST FAILED');
      console.log('PROVIDER MESSAGE:', parsed && parsed.message ? parsed.message : 'Unknown provider error');
      console.log('PROVIDER RESPONSE:');
      console.log(JSON.stringify(parsed ? redactJson(parsed) : text, null, 2));
      if (String(parsed && parsed.message || '').toLowerCase().includes('invalid authorization key')) {
        console.log('');
        console.log('Flutterwave credentials are invalid, so a real GBP provider test cannot continue.');
      }
      return;
    }

    const authCheck = findAuthorizationUrl(parsed);
    const status = parsed.status || parsed.data?.status || 'unknown';
    const amount = parsed.data?.amount ?? parsed.amount ?? 300;
    const currency = parsed.data?.currency ?? parsed.currency ?? 'GBP';
    const txRef = parsed.data?.tx_ref ?? parsed.tx_ref ?? 'UNKNOWN';

    console.log('STATUS:', status);
    console.log('CURRENCY:', currency);
    console.log('AMOUNT:', amount);
    console.log('TRANSACTION STATUS:', parsed.data?.status || parsed.status || 'pending');
    console.log('PROVIDER REFERENCE:', txRef);

    if (authCheck) {
      console.log('AUTHORIZATION URL PATH:', authCheck.path);
      console.log('AUTHORIZATION URL:', authCheck.value);
    } else {
      console.log('AUTHORIZATION URL PATH: NOT FOUND');
      console.log('AUTHORIZATION URL: NOT FOUND');
    }

    console.log('RAW REDACTED RESPONSE:');
    console.log(JSON.stringify(redactJson(parsed), null, 2));

    console.log('========================================');
  } catch (error) {
    console.log('========================================');
    console.log('GBP FLUTTERWAVE TEST FAILED');
    console.log('========================================');
    console.log('ERROR:', error && error.message ? error.message : String(error));
    console.log('PROVIDER RESPONSE:');
    console.log(String(error));
  }
})();
