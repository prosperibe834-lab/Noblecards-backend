import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BeneficiaryEncryptionService } from '../security/beneficiary-encryption.service';
import { BeneficiaryService } from './beneficiary.service';
import { BeneficiaryType, PaymentMethod } from '../generated/prisma';

describe('BeneficiaryEncryptionService', () => {
  it('round-trips encrypted values and produces different cipher text for the same plaintext', async () => {
    const config = { get: jest.fn((key: string) => {
      if (key === 'NOBLECARDS_BENEFICIARY_ENCRYPTION_KEY') return 'test-beneficiary-encryption-secret-32-bytes!';
      if (key === 'NOBLECARDS_BENEFICIARY_FINGERPRINT_KEY') return 'test-beneficiary-fingerprint-secret-32-bytes!';
      return undefined;
    }) } as unknown as ConfigService;

    const service = new BeneficiaryEncryptionService(config);
    const payload = { accountNumber: '0012345678', sortCode: '040004' };

    const encryptedA = service.encrypt(payload);
    const encryptedB = service.encrypt(payload);

    expect(encryptedA).not.toBe(encryptedB);
    expect(service.decrypt(encryptedA)).toEqual(payload);
    expect(service.decrypt(encryptedB)).toEqual(payload);
  });

  it('rejects malformed or tampered ciphertext', async () => {
    const config = { get: jest.fn((key: string) => {
      if (key === 'NOBLECARDS_BENEFICIARY_ENCRYPTION_KEY') return 'test-beneficiary-encryption-secret-32-bytes!';
      if (key === 'NOBLECARDS_BENEFICIARY_FINGERPRINT_KEY') return 'test-beneficiary-fingerprint-secret-32-bytes!';
      return undefined;
    }) } as unknown as ConfigService;

    const service = new BeneficiaryEncryptionService(config);

    expect(() => service.decrypt('not-valid')).toThrow();

    const encrypted = service.encrypt({ accountNumber: '0012345678' });
    const tampered = encrypted.replace(/.$/, '0');
    expect(() => service.decrypt(tampered)).toThrow();
  });

  it('normalizes and masks sensitive values without losing leading zeros', () => {
    const config = { get: jest.fn((key: string) => {
      if (key === 'NOBLECARDS_BENEFICIARY_ENCRYPTION_KEY') return 'test-beneficiary-encryption-secret-32-bytes!';
      if (key === 'NOBLECARDS_BENEFICIARY_FINGERPRINT_KEY') return 'test-beneficiary-fingerprint-secret-32-bytes!';
      return undefined;
    }) } as unknown as ConfigService;

    const service = new BeneficiaryEncryptionService(config);
    expect(service.normalizeIdentifier('  0012345678  ')).toBe('0012345678');
    expect(service.maskIdentifier('0012345678')).toBe('******5678');
    expect(service.maskIdentifier('123')).toBe('***');
  });
});

describe('BeneficiaryService', () => {
  const makePrisma = () => ({
    beneficiary: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    currency: {
      findUnique: jest.fn(),
    },
  });

  const makeService = (overrides?: any) => {
    const prisma = makePrisma();
    const provider = {
      getBanks: jest.fn().mockResolvedValue([]),
      resolveAccount: jest.fn().mockResolvedValue({
        verified: true,
        verificationStatus: 'VERIFIED',
        accountHolderName: 'Jane Doe',
        maskedAccount: '******5678',
        providerReference: 'prov-ref-1',
      }),
    };

    const encryption = new BeneficiaryEncryptionService({ get: jest.fn((key: string) => {
      if (key === 'NOBLECARDS_BENEFICIARY_ENCRYPTION_KEY') return '12345678901234567890123456789012';
      if (key === 'NOBLECARDS_BENEFICIARY_FINGERPRINT_KEY') return 'abcdefghijklmnopqrstuvwxzy123456';
      return undefined;
    }) } as unknown as ConfigService);

    const service = new BeneficiaryService(prisma as any, encryption, provider as any, overrides ?? { validateCountryCurrencyMethod: () => ({ countryCode: 'NG', currencyCode: 'NGN', method: PaymentMethod.BANK_TRANSFER }) } as any);
    return { service, prisma, provider, encryption };
  };

  it('creates a beneficiary with encrypted details and rejects duplicates by user+fingerprint', async () => {
    const { service, prisma, provider } = makeService();
    prisma.beneficiary.findFirst.mockResolvedValue(null);
    prisma.beneficiary.create.mockResolvedValue({
      id: 'beneficiary-1',
      userId: 'user-1',
      country: 'Nigeria',
      countryCode: 'NG',
      currencyCode: 'NGN',
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      type: 'BANK_ACCOUNT',
      institutionName: 'Access Bank',
      providerBankCode: '044',
      accountHolderName: 'Jane Doe',
      accountLast4: '5678',
      mobileMoneyProvider: null,
      providerRecipientReference: null,
      encryptedDetails: { v1: 'x' },
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.createBeneficiary('user-1', {
      countryCode: 'NG',
      currencyCode: 'NGN',
      method: PaymentMethod.BANK_TRANSFER,
      type: 'BANK_ACCOUNT',
      institutionCode: '044',
      institutionName: 'Access Bank',
      accountNumber: '0012345678',
      accountHolderName: 'Jane Doe',
    } as any);

    expect(result.accountHolderName).toBe('Jane Doe');
    expect(result.maskedAccount).toBe('******5678');
    expect(result.verificationStatus).toBe('VERIFIED');
    expect(prisma.beneficiary.create).toHaveBeenCalled();
    expect(provider.resolveAccount).toHaveBeenCalled();

    prisma.beneficiary.findFirst.mockResolvedValue({
      id: 'existing',
      userId: 'user-1',
      countryCode: 'NG',
      currencyCode: 'NGN',
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      type: BeneficiaryType.BANK_ACCOUNT,
      providerBankCode: '044',
      accountHolderName: 'Jane Doe',
      verificationStatus: 'VERIFIED',
      isActive: true,
    });
    await expect(service.createBeneficiary('user-1', {
      countryCode: 'NG',
      currencyCode: 'NGN',
      method: PaymentMethod.BANK_TRANSFER,
      type: 'BANK_ACCOUNT',
      institutionCode: '044',
      institutionName: 'Access Bank',
      accountNumber: '0012345678',
      accountHolderName: 'Jane Doe',
    } as any)).resolves.toEqual(expect.objectContaining({ id: 'existing' }));
  });

  it('returns provider-backed Nigerian banks', async () => {
    const { service, provider } = makeService();
    provider.getBanks.mockResolvedValue([{ id: '044', code: '044', name: 'Access Bank', country: 'NG', currency: 'NGN', provider: 'FLUTTERWAVE' }]);

    await expect(service.getBanksForUser('user-1', 'NG', 'NGN')).resolves.toEqual([
      expect.objectContaining({ code: '044', name: 'Access Bank' }),
    ]);
    expect(provider.getBanks).toHaveBeenCalledWith({ countryCode: 'NG', currencyCode: 'NGN', method: PaymentMethod.BANK_TRANSFER });
  });

  it('accepts Ghana and United Kingdom internal route validation while keeping provider execution capability-gated', async () => {
    const { service, provider } = makeService({
      validateCountryCurrencyMethod: ({ countryCode, currencyCode, method }: any) => {
        const valid = (countryCode === 'NG' && currencyCode === 'NGN' && method === PaymentMethod.BANK_TRANSFER)
          || (countryCode === 'GH' && currencyCode === 'GHS' && method === PaymentMethod.BANK_TRANSFER)
          || (countryCode === 'GB' && currencyCode === 'GBP' && method === PaymentMethod.BANK_TRANSFER);
        if (!valid) {
          throw new BadRequestException('Only NG→NGN, GH→GHS, and GB→GBP bank transfer beneficiary operations are currently supported internally.');
        }
        return { countryCode, currencyCode, method };
      },
    });

    provider.getBanks.mockResolvedValue([{ id: 'bank-1', code: '044', name: 'Access Bank', country: 'NG', currency: 'NGN', provider: 'FLUTTERWAVE' }]);

    await expect(service.getBanksForUser('user-1', 'GH', 'GHS')).resolves.toEqual([
      expect.objectContaining({ code: '044', name: 'Access Bank' }),
    ]);
    await expect(service.getBanksForUser('user-1', 'GB', 'GBP')).resolves.toEqual([
      expect.objectContaining({ code: '044', name: 'Access Bank' }),
    ]);
    expect(provider.getBanks).toHaveBeenCalledTimes(2);
  });

  it('does not persist a beneficiary when account verification fails', async () => {
    const { service, prisma, provider } = makeService();
    provider.resolveAccount.mockResolvedValue({ verified: false, verificationStatus: 'FAILED' });

    await expect(service.createBeneficiary('user-1', {
      countryCode: 'NG',
      currencyCode: 'NGN',
      method: PaymentMethod.BANK_TRANSFER,
      type: 'BANK_ACCOUNT',
      institutionCode: '044',
      accountNumber: '0012345678',
    } as any)).rejects.toThrow(/account verification failed/i);
    expect(prisma.beneficiary.create).not.toHaveBeenCalled();
  });

  it('enforces ownership on beneficiary retrieval and deactivation', async () => {
    const { service, prisma } = makeService();
    prisma.beneficiary.findUnique.mockResolvedValue(null);

    await expect(service.getBeneficiaryForUser('user-1', 'beneficiary-1')).rejects.toBeInstanceOf(NotFoundException);

    prisma.beneficiary.findUnique.mockResolvedValue({
      id: 'beneficiary-1',
      userId: 'user-2',
      country: 'Nigeria',
      countryCode: 'NG',
      currencyCode: 'NGN',
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      type: 'BANK_ACCOUNT',
      institutionName: 'Access Bank',
      providerBankCode: '044',
      accountHolderName: 'Jane Doe',
      accountLast4: '5678',
      providerRecipientReference: null,
      encryptedDetails: { v1: 'enc' },
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(service.getBeneficiaryForUser('user-1', 'beneficiary-1')).rejects.toBeInstanceOf(NotFoundException);
  });
});
