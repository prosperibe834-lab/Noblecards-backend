export type BuyGiftCardCatalogFilters = {
  countryCode?: string;
  currency?: string;
  subcategory?: string;
  productName?: string;
  productId?: string;
};

export type BuyGiftCardCatalogProduct = {
  provider: string;
  providerProductId: string;
  productName: string;
  brandName: string | null;
  country: string | null;
  countryCode: string | null;
  currency: string | null;
  denominationType: string | null;
  minimumAmount: string | null;
  maximumAmount: string | null;
  denominations: string[];
  redemptionInstructions: string | null;
  status: string | null;
  providerMetadata: Record<string, unknown>;
};

export type BuyGiftCardPurchaseInput = {
  productId: string;
  amount: number;
  currencyCode?: string;
  email: string;
  sender: string;
  units: number;
  reference: string;
};

export type BuyGiftCardProviderPurchase = {
  providerReference: string | null;
  providerStatus: string | null;
  providerMessage: string | null;
  redeemId: string | null;
  voucherCode: string | null;
  redeemDetails: Record<string, unknown> | null;
  providerAmount: string | null;
  providerMetadata: Record<string, unknown>;
};

export interface BuyGiftCardProvider {
  getCatalog(filters: BuyGiftCardCatalogFilters): Promise<BuyGiftCardCatalogProduct[]>;
  purchase(input: BuyGiftCardPurchaseInput): Promise<BuyGiftCardProviderPurchase>;
  retrieveVoucher(reference: string): Promise<BuyGiftCardProviderPurchase>;
}

export const BUY_GIFT_CARD_PROVIDER = Symbol('BUY_GIFT_CARD_PROVIDER');
