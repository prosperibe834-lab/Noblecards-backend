import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import {
  BeneficiaryType,
  PaymentMethod,
  BeneficiaryVerificationStatus,
} from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { BeneficiaryEncryptionService } from '../security/beneficiary-encryption.service';
import {
  type AccountResolutionResult,
  type ProviderBank,
  type WithdrawalProvider,
  WITHDRAWAL_PROVIDER,
} from './beneficiary-provider.interface';

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
  branchCode?: string;
  accountHolderName?: string;
  accountNumber?: string;
  routingNumber?: string;
  sortCode?: string;
  accountType?: string;
  institutionNumber?: string;
  transitNumber?: string;
  swiftCode?: string;
  beneficiaryAddress?: string;
  streetNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  transferReason?: string;
  mobileMoneyNumber?: string;
  label?: string;
  saveAccount?: boolean;
};

@Injectable()
export class BeneficiaryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: BeneficiaryEncryptionService,
    @Inject(WITHDRAWAL_PROVIDER) private readonly provider: WithdrawalProvider,
    @Optional()
    private readonly capabilityValidator?: {
      validateCountryCurrencyMethod: (input: {
        countryCode: string;
        currencyCode: string;
        method: PaymentMethod;
      }) => {
        countryCode: string;
        currencyCode: string;
        method: PaymentMethod;
      };
    },
  ) {}

  async getBanksForUser(
    _userId: string,
    countryCode: string,
    currencyCode: string,
  ): Promise<ProviderBank[]> {
    const capability = this.validateCapability({
      countryCode,
      currencyCode,
      method: PaymentMethod.BANK_TRANSFER,
    });
    return this.provider.getBanks(capability);
  }

  async getBranchesForUser(
    _userId: string,
    countryCode: string,
    currencyCode: string,
    bankId: string,
  ) {
    const normalizedBankId = bankId.trim();
    if (!normalizedBankId) {
      throw new BadRequestException('A provider bank ID is required.');
    }
    const capability = this.validateCapability({
      countryCode,
      currencyCode,
      method: PaymentMethod.BANK_TRANSFER,
    });
    if (capability.countryCode !== 'GH') {
      throw new BadRequestException(
        'Provider branch lookup is currently supported only for Ghana.',
      );
    }
    return this.provider.getBranches({
      ...capability,
      bankId: normalizedBankId,
    });
  }

  private normalizeCountryCode(value: string): string {
    if (!value) throw new BadRequestException('Country code is required.');
    const normalized = value.toUpperCase();
    if (!/^[A-Z]{2}$/.test(normalized))
      throw new BadRequestException(
        'Country code must be a two-letter ISO code.',
      );
    return normalized;
  }

  private normalizeCurrencyCode(value: string): string {
    if (!value) throw new BadRequestException('Currency code is required.');
    const normalized = value.toUpperCase();
    if (!/^[A-Z]{3}$/.test(normalized))
      throw new BadRequestException(
        'Currency code must be a three-letter ISO code.',
      );
    return normalized;
  }

  private getCountryName(countryCode: string): string {
    const names: Record<string, string> = {
      NG: 'Nigeria',
      GH: 'Ghana',
      GB: 'United Kingdom',
      US: 'United States',
      CA: 'Canada',
    };
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
      maskedAccount: record.accountLast4
        ? `******${record.accountLast4}`
        : null,
      verificationStatus: record.verificationStatus,
      verifiedAt: record.verifiedAt,
      isActive: record.isActive ?? true,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async resolveAccountForUser(
    userId: string,
    dto: {
      countryCode: string;
      currencyCode: string;
      method: PaymentMethod;
      institutionCode?: string;
      institutionName?: string;
      branchCode?: string;
      accountHolderName?: string;
      accountNumber?: string;
      routingNumber?: string;
      sortCode?: string;
      mobileMoneyNumber?: string;
    },
  ): Promise<
    AccountResolutionResult & {
      maskedAccount?: string;
      branchRequired?: boolean;
    }
  > {
    const countryCode = this.normalizeCountryCode(dto.countryCode);
    const currencyCode = this.normalizeCurrencyCode(dto.currencyCode);
    const validated = this.validateCapability({
      countryCode,
      currencyCode,
      method: dto.method,
    });

    const request = {
      countryCode: validated.countryCode,
      currencyCode: validated.currencyCode,
      method: validated.method,
      institutionCode: dto.institutionCode,
      institutionName: dto.institutionName,
      branchCode: dto.branchCode,
      accountHolderName: dto.accountHolderName,
      accountNumber: dto.accountNumber,
      routingNumber: dto.routingNumber,
      sortCode: dto.sortCode,
      mobileMoneyNumber: dto.mobileMoneyNumber,
    };

    if (!this.isSupportedMethod(validated.method)) {
      throw new BadRequestException(
        'Withdrawal method is not supported for this destination.',
      );
    }

    const branchRequired = await this.validateSelectedBranch(
      validated.countryCode,
      validated.currencyCode,
      dto.institutionCode,
      dto.branchCode,
    );
    const result = await this.provider.resolveAccount(request);
    if (
      !result ||
      !result.verified ||
      result.verificationStatus !== 'VERIFIED'
    ) {
      throw new BadRequestException(
        'Account verification failed. Please verify the bank or mobile money details and try again.',
      );
    }

    const masked =
      result.maskedAccount ??
      (result.accountHolderName
        ? this.encryption.maskIdentifier(
            request.accountNumber ??
              request.mobileMoneyNumber ??
              request.routingNumber ??
              request.sortCode ??
              '',
          )
        : undefined);
    return {
      ...result,
      maskedAccount: masked ?? undefined,
      branchRequired,
    };
  }

  private validateCapability(input: {
    countryCode: string;
    currencyCode: string;
    method: PaymentMethod;
  }) {
    if (this.capabilityValidator)
      return this.capabilityValidator.validateCountryCurrencyMethod(input);
    const countryCode = input.countryCode.toUpperCase();
    const currencyCode = input.currencyCode.toUpperCase();
    const method = input.method;
    const isNigeriaRoute =
      countryCode === 'NG' &&
      currencyCode === 'NGN' &&
      method === PaymentMethod.BANK_TRANSFER;
    const isGhanaRoute =
      countryCode === 'GH' &&
      currencyCode === 'GHS' &&
      method === PaymentMethod.BANK_TRANSFER;
    const isUnitedKingdomRoute =
      countryCode === 'GB' &&
      currencyCode === 'GBP' &&
      method === PaymentMethod.BANK_TRANSFER;
    const isUnitedStatesRoute =
      countryCode === 'US' &&
      currencyCode === 'USD' &&
      method === PaymentMethod.BANK_TRANSFER;
    const isCanadaRoute =
      countryCode === 'CA' &&
      currencyCode === 'CAD' &&
      method === PaymentMethod.BANK_TRANSFER;
    if (
      !isNigeriaRoute &&
      !isGhanaRoute &&
      !isUnitedKingdomRoute &&
      !isUnitedStatesRoute &&
      !isCanadaRoute
    ) {
      throw new BadRequestException(
        'Only NG→NGN, GH→GHS, GB→GBP, US→USD, and CA→CAD bank transfer beneficiary details are currently supported.',
      );
    }
    return { countryCode, currencyCode, method };
  }

  private validateManualBankDetails(
    countryCode: string,
    dto: CreateBeneficiaryInput,
  ) {
    const required = (value: string | undefined, label: string) => {
      if (!value?.trim())
        throw new BadRequestException(`${label} is required.`);
    };
    const digits = (value: string | undefined) =>
      (value ?? '').replace(/[\s-]/g, '');
    const accountNumber = digits(dto.accountNumber);
    if (!/^\d{4,34}$/.test(accountNumber)) {
      throw new BadRequestException('A valid bank account number is required.');
    }
    required(dto.accountHolderName, 'Beneficiary full name');
    required(dto.institutionName, 'Bank name');

    if (countryCode === 'GB') {
      if (!/^\d{6}$/.test(digits(dto.sortCode))) {
        throw new BadRequestException('UK sort code must contain six digits.');
      }
      if (
        !['personal', 'corporate'].includes(
          dto.accountType?.toLowerCase() ?? '',
        )
      ) {
        throw new BadRequestException(
          'UK account type must be personal or corporate.',
        );
      }
      if (
        dto.accountType?.toLowerCase() === 'personal' &&
        (dto.accountHolderName?.trim().split(/\s+/).length ?? 0) < 2
      ) {
        throw new BadRequestException(
          'Personal UK beneficiaries require a first and last name.',
        );
      }
      required(dto.streetNumber, 'Beneficiary street number');
      required(dto.streetName, 'Beneficiary street name');
      required(dto.city, 'Beneficiary city');
      required(dto.state, 'Beneficiary county or state');
      required(dto.postalCode, 'Beneficiary postal code');
      required(dto.transferReason, 'Transfer reason');
      return;
    }

    if (countryCode === 'US') {
      if (!/^\d{9}$/.test(digits(dto.routingNumber))) {
        throw new BadRequestException(
          'US routing number must contain nine digits.',
        );
      }
      if (
        !/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(
          dto.swiftCode?.toUpperCase() ?? '',
        )
      ) {
        throw new BadRequestException(
          'A valid 8- or 11-character SWIFT code is required for US transfers.',
        );
      }
      if (
        !['checking', 'depository'].includes(
          dto.accountType?.toLowerCase() ?? '',
        )
      ) {
        throw new BadRequestException(
          'US account type must be checking or depository.',
        );
      }
      required(dto.streetNumber, 'Beneficiary street number');
      required(dto.streetName, 'Beneficiary street name');
      required(dto.city, 'Beneficiary city');
      required(dto.state, 'Beneficiary state');
      required(dto.postalCode, 'Beneficiary postal code');
      return;
    }

    if (countryCode === 'CA') {
      if (!/^\d{3}$/.test(dto.institutionNumber ?? '')) {
        throw new BadRequestException(
          'Canadian institution number must contain three digits.',
        );
      }
      if (!/^\d{5}$/.test(dto.transitNumber ?? '')) {
        throw new BadRequestException(
          'Canadian transit number must contain five digits.',
        );
      }
      if (!/^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/i.test(dto.postalCode ?? '')) {
        throw new BadRequestException(
          'A valid Canadian postal code is required.',
        );
      }
      required(dto.streetNumber, 'Beneficiary street number');
      required(dto.streetName, 'Beneficiary street name');
      required(dto.city, 'Beneficiary city');
      required(dto.state, 'Beneficiary province or territory');
      required(dto.postalCode, 'Beneficiary postal code');
    }
  }

  async createBeneficiary(
    userId: string,
    dto: CreateBeneficiaryInput,
  ): Promise<any> {
    const prisma = this.prisma as any;
    const countryCode = this.normalizeCountryCode(dto.countryCode);
    const currencyCode = this.normalizeCurrencyCode(dto.currencyCode);
    const method = dto.method;
    const capability = this.validateCapability({
      countryCode,
      currencyCode,
      method,
    });

    const normalizedCountryCode = capability.countryCode;
    const normalizedCurrencyCode = capability.currencyCode;
    const normalizedMethod = capability.method;
    const detailsOnlyRoute = ['GB', 'US', 'CA'].includes(normalizedCountryCode);
    const verification: AccountResolutionResult & {
      maskedAccount?: string;
      branchRequired?: boolean;
    } = detailsOnlyRoute
      ? (() => {
          this.validateManualBankDetails(normalizedCountryCode, dto);
          return {
            verified: false,
            verificationStatus: 'UNVERIFIED' as const,
            accountHolderName: dto.accountHolderName?.trim(),
            institutionName: dto.institutionName?.trim(),
            providerBankCode: dto.institutionCode,
          };
        })()
      : await this.resolveAccountForUser(userId, {
          countryCode: normalizedCountryCode,
          currencyCode: normalizedCurrencyCode,
          method: normalizedMethod,
          institutionCode: dto.institutionCode,
          institutionName: dto.institutionName,
          branchCode: dto.branchCode,
          accountHolderName: dto.accountHolderName,
          accountNumber: dto.accountNumber,
          routingNumber: dto.routingNumber,
          sortCode: dto.sortCode,
          mobileMoneyNumber: dto.mobileMoneyNumber,
        });

    const accountNumber = this.encryption.normalizeIdentifier(
      dto.accountNumber ??
        dto.mobileMoneyNumber ??
        dto.routingNumber ??
        dto.sortCode ??
        dto.institutionNumber ??
        dto.transitNumber ??
        '',
    );
    const countrySpecificFingerprint = detailsOnlyRoute
      ? {
          institutionName: dto.institutionName?.trim(),
          accountType: dto.accountType?.toLowerCase(),
          institutionNumber: dto.institutionNumber,
          transitNumber: dto.transitNumber,
          swiftCode: dto.swiftCode?.toUpperCase(),
          beneficiaryAddress: dto.beneficiaryAddress?.trim(),
          streetNumber: dto.streetNumber?.trim(),
          streetName: dto.streetName?.trim(),
          city: dto.city?.trim(),
          state: dto.state?.trim(),
          postalCode: dto.postalCode?.trim(),
          transferReason: dto.transferReason?.trim(),
        }
      : undefined;
    const fingerprint = this.encryption.buildFingerprint({
      userId,
      countryCode: normalizedCountryCode,
      currencyCode: normalizedCurrencyCode,
      method: normalizedMethod,
      institutionCode: dto.institutionCode ?? dto.institutionNumber,
      branchCode: dto.branchCode,
      accountNumber,
      routingNumber: dto.routingNumber ?? dto.transitNumber,
      sortCode: dto.sortCode,
      mobileMoneyNumber: dto.mobileMoneyNumber,
      additionalDetails: countrySpecificFingerprint,
    });

    const detailsFingerprint = this.encryption.buildFingerprint({
      userId,
      countryCode: normalizedCountryCode,
      currencyCode: normalizedCurrencyCode,
      method: normalizedMethod,
      institutionCode: dto.institutionCode ?? dto.institutionNumber,
      branchCode: dto.branchCode,
      accountNumber,
      routingNumber: dto.routingNumber ?? dto.transitNumber,
      sortCode: dto.sortCode,
      mobileMoneyNumber: dto.mobileMoneyNumber,
      additionalDetails: countrySpecificFingerprint,
    });

    const existing = await prisma.beneficiary.findFirst({
      where: { userId, detailsFingerprint },
    });

    if (existing) {
      if (dto.saveAccount === true && !existing.isActive) {
        const updated = await prisma.beneficiary.update({
          where: { id: existing.id },
          data: { isActive: true },
        });
        return this.getSafePayload(updated);
      }
      return this.getSafePayload(existing);
    }

    const encryptedDetails = this.encryption.encrypt({
      countryCode: normalizedCountryCode,
      currencyCode: normalizedCurrencyCode,
      method: normalizedMethod,
      institutionCode: dto.institutionCode,
      institutionName: dto.institutionName,
      branchCode: dto.branchCode,
      branchRequired: verification.branchRequired === true,
      accountNumber: dto.accountNumber,
      routingNumber: dto.routingNumber,
      sortCode: dto.sortCode,
      accountType: dto.accountType,
      institutionNumber: dto.institutionNumber,
      transitNumber: dto.transitNumber,
      swiftCode: dto.swiftCode,
      beneficiaryAddress: dto.beneficiaryAddress,
      streetNumber: dto.streetNumber,
      streetName: dto.streetName,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      transferReason: dto.transferReason,
      mobileMoneyNumber: dto.mobileMoneyNumber,
      accountHolderName:
        verification.accountHolderName ?? dto.accountHolderName,
    });

    const accountLast4 = this.encryption.getLast4(accountNumber);
    const type =
      dto.type === 'BANK_ACCOUNT'
        ? BeneficiaryType.BANK_ACCOUNT
        : BeneficiaryType.MOBILE_MONEY;
    const beneficiary = await prisma.beneficiary.create({
      data: {
        userId,
        country: this.getCountryName(normalizedCountryCode),
        countryCode: normalizedCountryCode,
        currencyCode: normalizedCurrencyCode,
        paymentMethod: normalizedMethod,
        type,
        institutionName:
          dto.institutionName ?? dto.accountHolderName ?? 'Bank account',
        providerBankCode: dto.institutionCode ?? null,
        accountHolderName:
          verification.accountHolderName ?? dto.accountHolderName ?? null,
        accountLast4,
        mobileMoneyProvider: dto.mobileMoneyNumber ? 'MOBILE_MONEY' : null,
        providerRecipientReference: verification.providerReference ?? null,
        encryptedDetails: encryptedDetails as any,
        detailsFingerprint,
        verificationStatus:
          verification.verificationStatus === 'VERIFIED'
            ? BeneficiaryVerificationStatus.VERIFIED
            : BeneficiaryVerificationStatus.UNVERIFIED,
        verifiedAt:
          verification.verificationStatus === 'VERIFIED' ? new Date() : null,
        isActive: dto.saveAccount !== false,
      } as any,
    });

    return this.getSafePayload(beneficiary);
  }

  async getBeneficiaryForUser(
    userId: string,
    beneficiaryId: string,
  ): Promise<any> {
    const prisma = this.prisma as any;
    const beneficiary = await prisma.beneficiary.findUnique({
      where: { id: beneficiaryId },
    });
    if (!beneficiary || beneficiary.userId !== userId) {
      throw new NotFoundException('Beneficiary not found.');
    }

    return this.getSafePayload(beneficiary);
  }

  async listBeneficiaries(userId: string): Promise<any[]> {
    const prisma = this.prisma as any;
    const beneficiaries = await prisma.beneficiary.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return beneficiaries.map((beneficiary) => this.getSafePayload(beneficiary));
  }

  async deactivateBeneficiary(
    userId: string,
    beneficiaryId: string,
  ): Promise<any> {
    const prisma = this.prisma as any;
    const beneficiary = await prisma.beneficiary.findUnique({
      where: { id: beneficiaryId },
    });
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
    const supportedMethods: PaymentMethod[] = [
      PaymentMethod.BANK_TRANSFER,
      PaymentMethod.MOBILE_MONEY,
    ];
    return supportedMethods.includes(
      method as (typeof supportedMethods)[number],
    );
  }

  private async validateSelectedBranch(
    countryCode: string,
    currencyCode: string,
    institutionCode?: string,
    branchCode?: string,
  ): Promise<boolean> {
    if (countryCode !== 'GH') {
      if (branchCode) {
        throw new BadRequestException(
          'A branch code is only valid for a Ghana bank account.',
        );
      }
      return false;
    }
    if (!institutionCode) {
      throw new BadRequestException('A Ghana provider bank code is required.');
    }

    const capability = this.validateCapability({
      countryCode,
      currencyCode,
      method: PaymentMethod.BANK_TRANSFER,
    });
    const banks = await this.provider.getBanks(capability);
    const bank = banks.find((candidate) => candidate.code === institutionCode);
    if (!bank) {
      throw new BadRequestException(
        'The selected Ghana bank is not available from Flutterwave.',
      );
    }

    if (!bank.hasBranches) {
      if (branchCode) {
        throw new BadRequestException(
          'The selected bank does not require a branch code.',
        );
      }
      return false;
    }
    if (!branchCode) {
      throw new BadRequestException(
        'A branch code is required for the selected Ghana bank.',
      );
    }

    const branches = await this.provider.getBranches({
      ...capability,
      bankId: bank.id,
    });
    if (!branches.some((branch) => branch.code === branchCode)) {
      throw new BadRequestException(
        'The selected branch is not available for this bank.',
      );
    }
    return true;
  }
}
