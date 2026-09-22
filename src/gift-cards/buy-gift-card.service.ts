import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { BuyGiftCardProvider } from './buy-gift-card-provider.interface';
import {
  BUY_GIFT_CARD_PROVIDER,
  BuyGiftCardCatalogFilters,
} from './buy-gift-card-provider.interface';

@Injectable()
export class BuyGiftCardService {
  constructor(
    @Inject(BUY_GIFT_CARD_PROVIDER)
    private readonly provider: BuyGiftCardProvider,
  ) {}

  async getCatalog(filters: BuyGiftCardCatalogFilters) {
    const products = await this.provider.getCatalog(filters);
    const normalizedCountry = filters.countryCode?.toUpperCase();
    const normalizedCurrency = filters.currency?.toUpperCase();
    const normalizedProduct = filters.productName?.trim().toLowerCase();

    return {
      provider: 'TOPUPMATE',
      products: products.filter((product) =>
        (!normalizedCountry || product.countryCode?.toUpperCase() === normalizedCountry) &&
        (!normalizedCurrency || product.currency?.toUpperCase() === normalizedCurrency) &&
        (!normalizedProduct || product.productName.toLowerCase().includes(normalizedProduct) || product.brandName?.toLowerCase().includes(normalizedProduct)),
      ),
    };
  }

  assertPurchaseDisabled(): never {
    throw new BadRequestException('Topupmate purchase flow is not enabled yet.');
  }
}
