import { Injectable } from '@nestjs/common';
import {
  BuyGiftCardCatalogFilters,
  BuyGiftCardCatalogProduct,
  BuyGiftCardProvider,
} from './buy-gift-card-provider.interface';
import { TopupmateClient } from './topupmate.client';

@Injectable()
export class TopupmateProvider implements BuyGiftCardProvider {
  constructor(private readonly client: TopupmateClient) {}

  async getCatalog(filters: BuyGiftCardCatalogFilters): Promise<BuyGiftCardCatalogProduct[]> {
    const response = await this.client.getAvailableGiftCards(filters);
    return this.normalizeCatalog(response);
  }

  private normalizeCatalog(response: unknown): BuyGiftCardCatalogProduct[] {
    const rows = this.extractRows(response);
    return rows
      .map((row) => this.normalizeProduct(row))
      .filter((product): product is BuyGiftCardCatalogProduct => product !== null);
  }

  private extractRows(response: unknown): Record<string, unknown>[] {
    if (Array.isArray(response)) return response.filter(this.isRecord);
    if (!this.isRecord(response)) return [];
    for (const key of ['data', 'results', 'products', 'giftcards', 'gift_cards']) {
      if (Array.isArray(response[key])) return response[key].filter(this.isRecord);
    }
    if (this.isRecord(response.msg) && Array.isArray(response.msg.content)) {
      return response.msg.content.filter(this.isRecord);
    }
    return [response];
  }

  private normalizeProduct(row: Record<string, unknown>): BuyGiftCardCatalogProduct | null {
    const providerProductId = this.stringValue(row, ['product', 'product_id', 'productId', 'id']);
    const productName = this.stringValue(row, ['productName', 'product_name', 'name', 'title']);
    if (!providerProductId || !productName) return null;

    const countryObject = this.isRecord(row.country) ? row.country : undefined;
    const currencyObject = this.isRecord(row.currency) ? row.currency : undefined;
    const countryCode = this.stringValue(row, ['countryCode', 'country_code']) ??
      (countryObject ? this.stringValue(countryObject, ['code', 'isoName', 'countryCode']) : null);
    const country = this.stringValue(row, ['countryName', 'country_name']) ??
      (countryObject ? this.stringValue(countryObject, ['name', 'label']) : null);
    const currency = this.stringValue(row, ['currencyCode', 'currency_code', 'recipientCurrencyCode']) ??
      (currencyObject ? this.stringValue(currencyObject, ['code', 'currencyCode']) : null);
    const brandObject = this.isRecord(row.brand) ? row.brand : undefined;

    return {
      provider: 'TOPUPMATE',
      providerProductId,
      productName,
      brandName: this.stringValue(row, ['brandName', 'brand_name']) ??
        (brandObject ? this.stringValue(brandObject, ['brandName', 'name']) : null) ?? productName,
      country,
      countryCode,
      currency,
      denominationType: this.stringValue(row, ['denominationType', 'denomination_type', 'type']),
      minimumAmount: this.decimalString(row, ['minimumAmount', 'minimum_amount', 'minAmount', 'min_amount', 'min', 'minRecipientDenomination']),
      maximumAmount: this.decimalString(row, ['maximumAmount', 'maximum_amount', 'maxAmount', 'max_amount', 'max', 'maxRecipientDenomination']),
      denominations: this.stringArray(row, ['denominations', 'amounts', 'availableAmounts', 'available_amounts', 'fixedRecipientDenominations']),
      redemptionInstructions: this.stringValue(row, ['redemptionInstructions', 'redemption_instructions', 'redeemDetails', 'redeem_details', 'redeemInstruction']),
      status: this.stringValue(row, ['status', 'productStatus', 'product_status']),
      providerMetadata: row,
    };
  }

  private stringValue(row: Record<string, unknown>, keys: string[]): string | null {
    for (const key of keys) {
      const value = row[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
      if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    }
    return null;
  }

  private decimalString(row: Record<string, unknown>, keys: string[]): string | null {
    return this.stringValue(row, keys);
  }

  private stringArray(row: Record<string, unknown>, keys: string[]): string[] {
    for (const key of keys) {
      if (Array.isArray(row[key])) {
        return row[key]
          .filter((value): value is string | number => typeof value === 'string' || typeof value === 'number')
          .map(String);
      }
    }
    return [];
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
  }
}
