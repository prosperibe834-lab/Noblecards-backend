export type BuyGiftCardCatalogFilters = {
  countryCode?: string;
  currency?: string;
  productName?: string;
  productId?: string;
};

export type BuyGiftCardCatalogProduct = {
  provider: 'TOPUPMATE';
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

export interface BuyGiftCardProvider {
  getCatalog(filters: BuyGiftCardCatalogFilters): Promise<BuyGiftCardCatalogProduct[]>;
}

export const BUY_GIFT_CARD_PROVIDER = Symbol('BUY_GIFT_CARD_PROVIDER');
