require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('./src/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');
(async () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const email = 'browser.admin@example.com';
  const passwordHash = await bcrypt.hash('AdminPass123!', 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, isEmailVerified: true, isActive: true, role: 'ADMIN' },
    create: { email, passwordHash, firstName: 'Browser', lastName: 'Admin', isEmailVerified: true, isActive: true, role: 'ADMIN' }
  });
  const wallet = await prisma.wallet.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id }
  });
  await prisma.walletBalance.upsert({
    where: { walletId_currencyCode: { walletId: wallet.id, currencyCode: 'NGN' } },
    update: {},
    create: { walletId: wallet.id, currencyCode: 'NGN', availableBalance: 0, pendingBalance: 0 }
  });
  console.log(JSON.stringify({ email, id: user.id, role: user.role }, null, 2));
  await prisma.$disconnect();
})().catch((err) => { console.error(err); process.exit(1); });
