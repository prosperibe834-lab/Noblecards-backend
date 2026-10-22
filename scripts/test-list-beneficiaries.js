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

  console.log('Testing GET /withdrawals/beneficiaries?countryCode=NG ...');
  const res = await fetch('http://localhost:3000/withdrawals/beneficiaries?countryCode=NG', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  console.log('Status code:', res.status);
  const data = await res.json();
  console.log('Beneficiaries:', data);
}

main().catch(console.error);
