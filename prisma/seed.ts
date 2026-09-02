import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter }) as any;

const currencies = [
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    country: 'Nigeria',
    region: 'Africa',
    flag: '🇳🇬',
    enabled: true,
    depositEnabled: true,
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    country: 'United States',
    region: 'North America',
    flag: '🇺🇸',
    enabled: true,
    depositEnabled: true,
  },
  {
    code: 'GBP',
    name: 'British Pound Sterling',
    symbol: '£',
    country: 'United Kingdom',
    region: 'Europe',
    flag: '🇬🇧',
    enabled: true,
    depositEnabled: true,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    country: 'Eurozone',
    region: 'Europe',
    flag: '🇪🇺',
    enabled: true,
    depositEnabled: false,
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    country: 'Canada',
    region: 'North America',
    flag: '🇨🇦',
    enabled: true,
    depositEnabled: false,
  },
  {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: '₵',
    country: 'Ghana',
    region: 'Africa',
    flag: '🇬🇭',
    enabled: true,
    depositEnabled: true,
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    country: 'Kenya',
    region: 'Africa',
    flag: '🇰🇪',
    enabled: true,
    depositEnabled: false,
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    country: 'South Africa',
    region: 'Africa',
    flag: '🇿🇦',
    enabled: true,
    depositEnabled: false,
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    country: 'Australia',
    region: 'Oceania',
    flag: '🇦🇺',
    enabled: true,
    depositEnabled: false,
  },
  {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    country: 'New Zealand',
    region: 'Oceania',
    flag: '🇳🇿',
    enabled: true,
    depositEnabled: false,
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    country: 'Japan',
    region: 'Asia',
    flag: '🇯🇵',
    enabled: true,
    depositEnabled: false,
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    country: 'Switzerland',
    region: 'Europe',
    flag: '🇨🇭',
    enabled: true,
    depositEnabled: false,
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    country: 'United Arab Emirates',
    region: 'Middle East',
    flag: '🇦🇪',
    enabled: true,
    depositEnabled: false,
  },
];

async function main() {
  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {
        name: currency.name,
        symbol: currency.symbol,
        country: currency.country,
        region: currency.region,
        flag: currency.flag,
        enabled: currency.enabled,
        depositEnabled: currency.depositEnabled,
      },
      create: currency,
    });
  }

  console.log(`Seeded ${currencies.length} currencies.`);
}

main()
  .catch((error) => {
    console.error('Currency seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
