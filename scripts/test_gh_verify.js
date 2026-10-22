const path = require('path');
const jwt = require(path.resolve('./node_modules/jsonwebtoken'));

const token = jwt.sign(
  {
    sub: 'fd7d5527-e0c4-4f9a-8a35-f9077838c7c1',
    email: 'prosperibe834@gmail.com'
  },
  process.env.JWT_SECRET || 'secret'
);

async function testLiveEndpoint() {
  const res = await fetch('http://localhost:3000/withdrawals/beneficiaries/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      countryCode: 'GH',
      currencyCode: 'GHS',
      method: 'BANK_TRANSFER',
      accountNumber: '0031625807099',
      institutionCode: 'GH280100',
      institutionName: 'Access Bank (Ghana) PLC',
      accountHolderName: 'Flutterwave Developers'
    })
  });

  console.log('Status code:', res.status);
  const data = await res.json();
  console.log('Response body:', data);
}

testLiveEndpoint().catch(console.error);
