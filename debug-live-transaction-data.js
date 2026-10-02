const http = require('http');

function request(method, url, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const urlObj = new URL(url);
    const req = http.request(
      {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: `${urlObj.pathname}${urlObj.search}`,
        method,
        headers: {
          ...headers,
          ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          let parsed;
          try {
            parsed = raw ? JSON.parse(raw) : {};
          } catch (error) {
            parsed = raw;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

(async () => {
  const email = `diag-${Date.now()}@test.com`;
  const password = 'Test@123';

  const createUser = await request('POST', 'http://localhost:3000/__test/create-user', {}, { email, password, firstName: 'Diag', lastName: 'User' });
  console.log('CREATE USER STATUS', createUser.status);

  const login = await request('POST', 'http://localhost:3000/auth/login', {}, { email, password });
  console.log('LOGIN STATUS', login.status);
  console.log('AUTH TOKEN PRESENT', !!(login.body && login.body.accessToken));

  const token = login.body && login.body.accessToken ? login.body.accessToken : null;
  if (!token) {
    console.log('NO ACCESS TOKEN; exiting');
    return;
  }

  const authHeaders = { Authorization: `Bearer ${token}` };

  const wallet = await request('GET', 'http://localhost:3000/wallet', authHeaders);
  console.log('WALLET STATUS', wallet.status);
  console.log('WALLET RESPONSE KEYS', wallet.body && typeof wallet.body === 'object' ? Object.keys(wallet.body) : typeof wallet.body);
  console.log('WALLET BODY', JSON.stringify(wallet.body, null, 2));

  const deposits = await request('GET', 'http://localhost:3000/deposits', authHeaders);
  console.log('DEPOSITS STATUS', deposits.status);
  console.log('DEPOSITS TYPE', Array.isArray(deposits.body) ? 'list' : typeof deposits.body);
  console.log('DEPOSITS BODY', JSON.stringify(deposits.body, null, 2));

  const withdrawals = await request('GET', 'http://localhost:3000/withdrawals', authHeaders);
  console.log('WITHDRAWALS STATUS', withdrawals.status);
  console.log('WITHDRAWALS TYPE', Array.isArray(withdrawals.body) ? 'list' : typeof withdrawals.body);
  console.log('WITHDRAWALS BODY', JSON.stringify(withdrawals.body, null, 2));
})().catch((error) => {
  console.error('DIAGNOSTIC ERROR', error);
  process.exit(1);
});
