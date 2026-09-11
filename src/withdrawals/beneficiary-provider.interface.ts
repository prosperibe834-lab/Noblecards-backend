import { PaymentMethod } from '../generated/prisma';

export type SupportedWithdrawalCapability = {
  countryCode: string;
  currencyCode: string;
  method: PaymentMethod;
};

export type ProviderBank = {
  id: string;
  code: string;
  name: string;
  country: string;
  currency: string;
  provider: string;
  hasBranches?: boolean;
};

export type ProviderBranch = {
  id: string;
  code: string;
  name: string;
  bankId?: string;
  country?: string;
  currency?: string;
  provider: string;
};

export const WITHDRAWAL_PROVIDER = Symbol('WITHDRAWAL_PROVIDER');

export type AccountResolutionResult = {
  verified: boolean;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'FAILED' | 'UNVERIFIED';
  accountHolderName?: string;
  maskedAccount?: string;
  providerReference?: string;
  institutionName?: string;
  providerBankCode?: string;
};

export interface WithdrawalProvider {
  getBanks(request: SupportedWithdrawalCapability): Promise<ProviderBank[]>;
  getBranches(request: SupportedWithdrawalCapability & { bankId: string }): Promise<ProviderBranch[]>;
  resolveAccount(request: {
    countryCode: string;
    currencyCode: string;
    method: PaymentMethod;
    institutionCode?: string;
    institutionName?: string;
    accountHolderName?: string;
    accountNumber?: string;
    routingNumber?: string;
    sortCode?: string;
    mobileMoneyNumber?: string;
  }): Promise<AccountResolutionResult>;
}
