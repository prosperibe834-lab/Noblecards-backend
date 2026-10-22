const path = require('path');
const { PrismaPg } = require(path.resolve('./node_modules/@prisma/adapter-pg'));
const { PrismaClient } = require(path.resolve('./src/generated/prisma/index.js'));
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const b = await prisma.beneficiary.findMany({
    where: { userId: 'fd7d5527-e0c4-4f9a-8a35-f9077838c7c1' }
  });
  console.log(JSON.stringify(b.map(x => ({
    id: x.id,
    countryCode: x.countryCode,
    institutionName: x.institutionName,
    accountHolderName: x.accountHolderName,
    accountLast4: x.accountLast4,
    providerBankCode: x.providerBankCode,
    verificationStatus: x.verificationStatus
  })), null, 2));
}
main().finally(() => prisma.$disconnect());
