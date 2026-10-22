const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { AuthService } = require('../dist/auth/auth.service');
const { UsersService } = require('../dist/users/users.service');

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const users = app.get(UsersService);
  const auth = app.get(AuthService);

  const user = await users.findById('fd7d5527-e0c4-4f9a-8a35-f9077838c7c1');
  const session = await auth.issueSession(user);
  await app.close();

  console.log('Testing live verify on http://localhost:3000 ...');
  const res = await fetch('http://localhost:3000/withdrawals/beneficiaries/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      countryCode: 'GH',
      currencyCode: 'GHS',
      method: 'BANK_TRANSFER',
      accountNumber: '0031625807099',
      institutionCode: '26153374',
      institutionName: 'Access Bank (Ghana) PLC',
      accountHolderName: 'Flutterwave Developers'
    })
  });

  console.log('Status code:', res.status);
  const data = await res.json();
  console.log('Response body:', data);
}

main().catch(console.error);
