import { Injectable } from '@nestjs/common';
import {
  BuyGiftCardCatalogFilters,
  BuyGiftCardCatalogProduct,
  BuyGiftCardProvider,
  BuyGiftCardProviderPurchase,
  BuyGiftCardPurchaseInput,
} from './buy-gift-card-provider.interface';
import { TremendousClient, TremendousResponse } from './tremendous.client';

@Injectable()
export class TremendousProvider implements BuyGiftCardProvider {
  constructor(private readonly client: TremendousClient) {}

  async getCatalog(filters: BuyGiftCardCatalogFilters): Promise<BuyGiftCardCatalogProduct[]> {
    const response = await this.client.getProducts(filters);
    return this.normalizeCatalog(response, filters);
  }

  async purchase(input: BuyGiftCardPurchaseInput): Promise<BuyGiftCardProviderPurchase> {
    return this.normalizePurchase(await this.client.createOrder({ ...input, currencyCode: input.currencyCode ?? 'USD' }));
  }

  async retrieveVoucher(reference: string): Promise<BuyGiftCardProviderPurchase> {
    return this.normalizePurchase(await this.client.getOrder(reference));
  }

  private normalizeCatalog(response: TremendousResponse, filters: BuyGiftCardCatalogFilters): BuyGiftCardCatalogProduct[] {
    const products = this.isRecord(response) && Array.isArray(response.products) ? response.products.filter(this.isRecord) : [];
    return products.flatMap((product) => this.normalizeProduct(product, filters));
  }

  private normalizeProduct(product: Record<string, unknown>, filters: BuyGiftCardCatalogFilters): BuyGiftCardCatalogProduct[] {
    const productId = this.stringValue(product, ['id']);
    const productName = this.stringValue(product, ['name']);
    if (!productId || !productName) return [];
    const countries = Array.isArray(product.countries) ? product.countries.filter(this.isRecord) : [];
    const countryCodes = countries.map((country) => this.stringValue(country, ['abbr'])).filter((value): value is string => Boolean(value));
    const selectedCountries = filters.countryCode ? countryCodes.filter((code) => code.toUpperCase() === filters.countryCode!.toUpperCase()) : countryCodes;
    const skus = Array.isArray(product.skus) ? product.skus.filter(this.isRecord) : [];
    const selectedSkus = filters.currency ? skus.filter((sku) => this.stringValue(sku, ['currency_code'])?.toUpperCase() === filters.currency!.toUpperCase()) : skus;
    const currencies = [...new Set((selectedSkus.length ? selectedSkus : skus)
      .map((sku) => this.stringValue(sku, ['currency_code']))
      .filter((value): value is string => Boolean(value)))];
    const fallbackCurrency = this.stringArray(product, ['currency_codes'])[0] ?? null;
    const normalizedCurrencies = currencies.length ? currencies : (fallbackCurrency ? [fallbackCurrency] : [null]);
    const rows: BuyGiftCardCatalogProduct[] = [];

    for (const countryCode of selectedCountries.length ? selectedCountries : [null]) {
      for (const currency of normalizedCurrencies) {
        if (filters.currency && currency?.toUpperCase() !== filters.currency.toUpperCase()) continue;
        const currencySkus = skus.filter((sku) => this.stringValue(sku, ['currency_code']) === currency);
        const fixedValues = this.fixedDenominations(currencySkus, currency);
        const ranges = this.rangeForSkus(currencySkus);
        rows.push({
          provider: 'TREMENDOUS',
          providerProductId: productId,
          productName,
          brandName: productName,
          country: countryCode,
          countryCode,
          currency,
          denominationType: fixedValues.length ? 'FIXED' : ranges.minimumAmount || ranges.maximumAmount ? 'RANGE' : null,
          minimumAmount: ranges.minimumAmount,
          maximumAmount: ranges.maximumAmount,
          denominations: fixedValues,
          redemptionInstructions: this.stringValue(product, ['usage_instructions', 'disclosure']),
          status: 'ACTIVE',
          providerMetadata: {
            category: product.category,
            subcategory: product.subcategory,
            images: product.images,
            disclosure: product.disclosure,
            usage_instructions: product.usage_instructions,
            description: product.description,
            skus: currencySkus,
            logoUrl: this.logoUrl(product),
          },
        });
      }
    }
    return rows;
  }

  private fixedDenominations(skus: Record<string, unknown>[], currency: string | null): string[] {
    return skus
      .filter((sku) => this.stringValue(sku, ['currency_code']) === currency)
      .map((sku) => ({ min: Number(sku.min), max: Number(sku.max) }))
      .filter((sku) => Number.isFinite(sku.min) && sku.min === sku.max)
      .map((sku) => String(sku.min));
  }

  private rangeForSkus(skus: Record<string, unknown>[]) {
    const ranges = skus
      .map((sku) => ({ min: Number(sku.min), max: Number(sku.max) }))
      .filter((sku) => Number.isFinite(sku.min) && Number.isFinite(sku.max) && sku.min !== sku.max);
    if (!ranges.length) return { minimumAmount: null, maximumAmount: null };
    return {
      minimumAmount: String(Math.min(...ranges.map((range) => range.min))),
      maximumAmount: String(Math.max(...ranges.map((range) => range.max))),
    };
  }

  private normalizePurchase(response: unknown): BuyGiftCardProviderPurchase {
    const responseRoot = this.isRecord(response) ? response : {};
    const root = this.isRecord(responseRoot.order) ? responseRoot.order : responseRoot;
    const reward = this.firstRecord(root.rewards) ?? this.firstRecord(root.reward) ?? root;
    const voucherCode = this.findString(reward, ['code', 'pin', 'number', 'redemption_code', 'redemptionCode']);
    return {
      providerReference: this.findString(root, ['id', 'external_id', 'externalId', 'order_id', 'orderId']),
      providerStatus: this.findString(root, ['status', 'state']) ?? this.findString(reward, ['status', 'state']),
      providerMessage: this.findString(root, ['message', 'detail', 'error']),
      redeemId: this.findString(reward, ['id', 'reward_id', 'rewardId']),
      voucherCode,
      redeemDetails: this.sanitize(reward),
      providerAmount: this.findString(reward, ['amount', 'denomination']),
      providerMetadata: this.sanitize(root),
    };
  }

  private logoUrl(product: Record<string, unknown>): string | null {
    const images = Array.isArray(product.images) ? product.images.filter(this.isRecord) : [];
    return images.find((image) => this.stringValue(image, ['type']) === 'logo')?.src as string ?? null;
  }

  private firstRecord(value: unknown): Record<string, unknown> | null {
    if (Array.isArray(value)) return value.find(this.isRecord) ?? null;
    return this.isRecord(value) ? value : null;
  }

  private stringValue(value: Record<string, unknown>, keys: string[]): string | null {
    for (const key of keys) if (typeof value[key] === 'string' && value[key]) return value[key] as string;
    return null;
  }

  private stringArray(value: Record<string, unknown>, keys: string[]): string[] {
    for (const key of keys) if (Array.isArray(value[key])) return value[key].filter((item): item is string => typeof item === 'string');
    return [];
  }

  private findString(value: unknown, keys: string[]): string | null {
    if (!value || typeof value !== 'object') return null;
    if (Array.isArray(value)) {
      for (const item of value) { const result = this.findString(item, keys); if (result) return result; }
      return null;
    }
    const object = value as Record<string, unknown>;
    for (const key of keys) if (typeof object[key] === 'string' && object[key]) return object[key] as string;
    for (const child of Object.values(object)) { const result = this.findString(child, keys); if (result) return result; }
    return null;
  }

  private sanitize(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object') return {};
    if (Array.isArray(value)) return { items: value.slice(0, 10).map((item) => this.sanitize(item)) };
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
      if (/code|pin|token|secret|password|authorization/i.test(key)) return [];
      return [[key, child && typeof child === 'object' ? this.sanitize(child) : child]];
    }));
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
  }
}
