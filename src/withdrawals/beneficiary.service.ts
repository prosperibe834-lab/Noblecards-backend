import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { BeneficiaryType, PaymentMethod, BeneficiaryVerificationStatus } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { BeneficiaryEncryptionService } from '../security/beneficiary-encryption.service';
import { type AccountResolutionResult, type WithdrawalProvider, WITHDRAWAL_PROVIDER, type ProviderBank } from './beneficiary-provider.interface';

export type BeneficiaryRecord = {
  id: string;
  userId: string;
  country: string;
  countryCode: string;
  currencyCode: string;
  paymentMethod: PaymentMethod;
  type: BeneficiaryType;
  institutionName?: string | null;
  providerBankCode?: string | null;
  accountHolderName?: string | null;
  accountLast4?: string | null;
  mobileMoneyProvider?: string | null;
  providerRecipientReference?: string | null;
  encryptedDetails?: Record<string, unknown> | null;
  verificationStatus: BeneficiaryVerificationStatus;
  verifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
};

export type CreateBeneficiaryInput = {
  countryCode: string;
  currencyCode: string;
  method: PaymentMethod;
  type: BeneficiaryType | string;
  institutionCode?: string;
  institutionName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  routingNumber?: string;
  sortCode?: string;
  mobileMoneyNumber?: string;
  label?: string;
};

@Injectable()
export class BeneficiaryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: BeneficiaryEncryptionService,
    @Inject(WITHDRAWAL_PROVIDER) private readonly provider: WithdrawalProvider,
    @Optional() private readonly capabilityValidator?: {
      validateCountryCurrencyMethod: (input: { countryCode: string; currencyCode: string; method: PaymentMethod }) => { countryCode: string; currencyCode: string; method: PaymentMethod };
    },
  ) {}

  async getBanksForUser(_userId: string, countryCode: string, currencyCode: string): Promise<ProviderBank[]> {
    const capability = this.validateCapability({ countryCode, currencyCode, method: PaymentMethod.BANK_TRANSFER });
    return this.provider.getBanks(capability);
  }

  private normalizeCountryCode(value: string): string {
    if (!value) throw new BadRequestException('Country code is required.');
    const normalized = value.toUpperCase();
    if (!/^[A-Z]{2}$/.test(normalized)) throw new BadRequestException('Country code must be a two-letter ISO code.');
    return normalized;
  }

  private normalizeCurrencyCode(value: string): string {
    if (!value) throw new BadRequestException('Currency code is required.');
    const normalized = value.toUpperCase();
    if (!/^[A-Z]{3}$/.test(normalized)) throw new BadRequestException('Currency code must be a three-letter ISO code.');
    return normalized;
  }

  private getCountryName(countryCode: string): string {
    const names: Record<string, string> = { NG: 'Nigeria', GH: 'Ghana', GB: 'United Kingdom', US: 'United States', CA: 'Canada' };
    return names[countryCode] ?? countryCode;
  }

  private getSafePayload(record: any): any {
    return {
      id: record.id,
      country: record.country,
      countryCode: record.countryCode,
      currency: record.currencyCode,
      method: record.paymentMethod,
      type: record.type,
      institution: {
        code: record.providerBankCode ?? record.mobileMoneyProvider ?? null,
        name: record.institutionName ?? null,
      },
      accountHolderName: record.accountHolderName ?? null,
      maskedAccount: record.accountLast4 ? `******${record.accountLast4}` : null,
      verificationStatus: record.verificationStatus,
      verifiedAt: record.verifiedAt,
      isActive: record.isActive ?? true,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async resolveAccountForUser(userId: string, dto: {
    countryCode: string;
    currencyCode: string;
    method: PaymentMethod;
    institutionCode?: string;
    institutionName?: string;
    accountNumber?: string;
    routingNumber?: string;
    sortCode?: string;
    mobileMoneyNumber?: string;
  }): Promise<AccountResolutionResult & { maskedAccount?: string }> {
    const countryCode = this.normalizeCountryCode(dto.countryCode);
    const currencyCode = this.normalizeCurrencyCode(dto.currencyCode);
    const validated = this.validateCapability({ countryCode, currencyCode, method: dto.method });

    const request = {
      countryCode: validated.countryCode,
      currencyCode: validated.currencyCode,
      method: validated.method,
      institutionCode: dto.institutionCode,
      institutionName: dto.institutionName,
      accountNumber: dto.accountNumber,
      routingNumber: dto.routingNumber,
      sortCode: dto.sortCode,
      mobileMoneyNumber: dto.mobileMoneyNumber,
    };

    if (!this.isSupportedMethod(validated.method)) {
      throw new BadRequestException('Withdrawal method is not supported for this destination.');
    }

    const result = await this.provider.resolveAccount(request);
    if (!result || result.verificationStatus === 'FAILED') {
      throw new BadRequestException('Account verification failed. Please verify the bank or mobile money details and try again.');
    }

    const masked = result.maskedAccount ?? (result.accountHolderName ? this.encryption.maskIdentifier(request.accountNumber ?? request.mobileMoneyNumber ?? request.routingNumber ?? request.sortCode ?? '') : undefined);
    return { ...result, maskedAccount: masked ?? undefined };
  }

  private validateCapability(input: { countryCode: string; currencyCode: string; method: PaymentMethod }) {
    if (this.capabilityValidator) return this.capabilityValidator.validateCountryCurrencyMethod(input);
    const countryCode = input.countryCode.toUpperCase();
    const currencyCode = input.currencyCode.toUpperCase();
    if (countryCode !== 'NG' || currencyCode !== 'NGN' || input.method !== PaymentMethod.BANK_TRANSFER) {
      throw new BadRequestException('Only NG to NGN bank transfer beneficiary operations are currently supported.');
    }
    return { countryCode, currencyCode, method: input.method };
  }

  async createBeneficiary(userId: string, dto: CreateBeneficiaryInput): Promise<any> {
    const prisma = this.prisma as any;
    const countryCode = this.normalizeCountryCode(dto.countryCode);
    const currencyCode = this.normalizeCurrencyCode(dto.currencyCode);
    const method = dto.method;
    const capability = this.validateCapability({ countryCode, currencyCode, method });

    const normalizedCountryCode = capability.countryCode;
    const normalizedCurrencyCode = capability.currencyCode;
    const normalizedMethod = capability.method;
    const normalizedAccount = {
      countryCode: normalizedCountryCode,
      currencyCode: normalizedCurrencyCode,
      method: normalizedMethod,
      institutionCode: dto.institutionCode,
      institutionName: dto.institutionName,
      accountNumber: dto.accountNumber,
      routingNumber: dto.routingNumber,
      sortCode: dto.sortCode,
      mobileMoneyNumber: dto.mobileMoneyNumber,
    };

    const verification = await this.resolveAccountForUser(userId, {
      countryCode: normalizedCountryCode,
      currencyCode: normalizedCurrencyCode,
      method: normalizedMethod,
      institutionCode: dto.institutionCode,
      institutionName: dto.institutionName,
      accountNumber: dto.accountNumber,
      routingNumber: dto.routingNumber,
      sortCode: dto.sortCode,
      mobileMoneyNumber: dto.mobileMoneyNumber,
    });

    const accountNumber = this.encryption.normalizeIdentifier(dto.accountNumber ?? dto.mobileMoneyNumber ?? dto.routingNumber ?? dto.sortCode ?? '');
    const fingerprint = this.encryption.buildFingerprint({
      userId,
      countryCode: normalizedCountryCode,
      currencyCode: normalizedCurrencyCode,
      method: normalizedMethod,
      institutionCode: dto.institutionCode,
      accountNumber,
      routingNumber: dto.routingNumber,
      sortCode: dto.sortCode,
      mobileMoneyNumber: dto.mobileMoneyNumber,
    });

    const detailsFingerprint = this.encryption.buildFingerprint({
      userId,
      countryCode: normalizedCountryCode,
      currencyCode: normalizedCurrencyCode,
      method: normalizedMethod,
      institutionCode: dto.institutionCode,
      accountNumber,
      routingNumber: dto.routingNumber,
      sortCode: dto.sortCode,
      mobileMoneyNumber: dto.mobileMoneyNumber,
    });

    const existing = await prisma.beneficiary.findFirst({
      where: { userId, detailsFingerprint },
    });

    if (existing) {
      throw new ConflictException('This beneficiary already exists for this user.');
    }

    const encryptedDetails = this.encryption.encrypt({
      countryCode: normalizedCountryCode,
      currencyCode: normalizedCurrencyCode,
      method: normalizedMethod,
      institutionCode: dto.institutionCode,
      institutionName: dto.institutionName,
      accountNumber: dto.accountNumber,
      routingNumber: dto.routingNumber,
      sortCode: dto.sortCode,
      mobileMoneyNumber: dto.mobileMoneyNumber,
      accountHolderName: verification.accountHolderName ?? dto.accountHolderName,
    });

    const accountLast4 = this.encryption.getLast4(accountNumber);
    const type = dto.type === 'BANK_ACCOUNT' ? BeneficiaryType.BANK_ACCOUNT : BeneficiaryType.MOBILE_MONEY;
    const beneficiary = await prisma.beneficiary.create({
      data: {
        userId,
        country: this.getCountryName(normalizedCountryCode),
        countryCode: normalizedCountryCode,
        currencyCode: normalizedCurrencyCode,
        paymentMethod: normalizedMethod,
        type,
        institutionName: dto.institutionName ?? (dto.accountHolderName ?? 'Bank account'),
        providerBankCode: dto.institutionCode ?? null,
        accountHolderName: verification.accountHolderName ?? dto.accountHolderName ?? null,
        accountLast4,
        mobileMoneyProvider: dto.mobileMoneyNumber ? 'MOBILE_MONEY' : null,
        providerRecipientReference: verification.providerReference ?? null,
        encryptedDetails: encryptedDetails as any,
        detailsFingerprint,
        verificationStatus: verification.verificationStatus === 'VERIFIED' ? BeneficiaryVerificationStatus.VERIFIED : BeneficiaryVerificationStatus.UNVERIFIED,
        verifiedAt: verification.verificationStatus === 'VERIFIED' ? new Date() : null,
        isActive: true,
      } as any,
    });

    return this.getSafePayload(beneficiary);
  }

  async getBeneficiaryForUser(userId: string, beneficiaryId: string): Promise<any> {
    const prisma = this.prisma as any;
    const beneficiary = await prisma.beneficiary.findUnique({ where: { id: beneficiaryId } });
    if (!beneficiary || beneficiary.userId !== userId) {
      throw new NotFoundException('Beneficiary not found.');
    }

    return this.getSafePayload(beneficiary);
  }

  async listBeneficiaries(userId: string): Promise<any[]> {
    const prisma = this.prisma as any;
    const beneficiaries = await prisma.beneficiary.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return beneficiaries.map((beneficiary) => this.getSafePayload(beneficiary));
  }

  async deactivateBeneficiary(userId: string, beneficiaryId: string): Promise<any> {
    const prisma = this.prisma as any;
    const beneficiary = await prisma.beneficiary.findUnique({ where: { id: beneficiaryId } });
    if (!beneficiary || beneficiary.userId !== userId) {
      throw new NotFoundException('Beneficiary not found.');
    }

    const updated = await prisma.beneficiary.update({
      where: { id: beneficiaryId },
      data: { isActive: false },
    });

    return this.getSafePayload(updated);
  }

  private isSupportedMethod(method: PaymentMethod): boolean {
    const supportedMethods: PaymentMethod[] = [PaymentMethod.BANK_TRANSFER, PaymentMethod.MOBILE_MONEY];
    return supportedMethods.includes(method as (typeof supportedMethods)[number]);
  }
}
