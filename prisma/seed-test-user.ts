import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter }) as any;

async function main() {
  const testEmail = `test-deposit-${Date.now()}@test.com`;
  
  console.log('\n=== CREATING TEST USER ===');
  console.log(`Email: ${testEmail}`);
  
  // Create a user directly verified
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash: '$2b$12$K2AwT8b/h.URNNX3kh2.OPST9/PgBkqquzi8Ss8KIUgO2neBf7NO2', // hashed "TestPassword123!"
      firstName: 'Deposit',
      lastName: 'Tester',
      isEmailVerified: true, // Mark as verified
      isActive: true,
    },
  });
  
  console.log(`✓ User created: ${user.id}`);
  
  // Ensure wallet exists
  const wallet = await prisma.wallet.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
  
  console.log(`✓ Wallet created: ${wallet.id}`);
  
  // Ensure NGN balance exists
  const balance = await prisma.walletBalance.upsert({
    where: {
      walletId_currencyCode: { walletId: wallet.id, currencyCode: 'NGN' },
    },
    update: {},
    create: {
      walletId: wallet.id,
      currencyCode: 'NGN',
      availableBalance: 0,
      pendingBalance: 0,
    },
  });
  
  console.log(`✓ NGN Balance created`);
  console.log(`\nTest user ready for API testing:`);
  console.log(`  Email: ${testEmail}`);
  console.log(`  Password: TestPassword123!`);
  console.log(`  User ID: ${user.id}`);
  console.log(`  Wallet ID: ${wallet.id}`);
  
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
