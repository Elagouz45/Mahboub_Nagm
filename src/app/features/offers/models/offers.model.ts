import { CatalogPageSize, AvailableCatalogFilters } from '@features/catalog/models/catalog.model';
import { ProductSummary } from '@shared/models/storefront.model';

export const OFFER_TYPES = ['all', 'today', 'big'] as const;
export type OfferType = (typeof OFFER_TYPES)[number];

export const OFFER_PAGE_SORTS = ['discount-desc', 'price-asc', 'price-desc', 'newest', 'relevance'] as const;
export type OfferPageSort = (typeof OFFER_PAGE_SORTS)[number];

export interface OffersQuery {
  readonly type: OfferType;
  readonly category: string;
  readonly brands: readonly string[];
  readonly minDiscount: number | null;
  readonly sort: OfferPageSort;
  readonly page: number;
  readonly pageSize: CatalogPageSize;
}

export interface OffersSearchResult {
  readonly items: readonly ProductSummary[];
  readonly total: number;
  readonly filters: AvailableCatalogFilters;
  readonly maxDiscountPercent: number;
  readonly endsAt: Date | null;
}

export const DEFAULT_OFFERS_QUERY: OffersQuery = {
  type: 'all',
  category: '',
  brands: [],
  minDiscount: null,
  sort: 'discount-desc',
  page: 1,
  pageSize: 12,
};

export const OFFER_TYPE_LABELS: Readonly<Record<OfferType, string>> = {
  all: 'كل العروض',
  today: 'عروض اليوم',
  big: 'خصومات كبيرة',
};

export const OFFER_SORT_LABELS: Readonly<Record<OfferPageSort, string>> = {
  'discount-desc': 'أكبر خصم',
  'price-asc': 'السعر: من الأقل للأعلى',
  'price-desc': 'السعر: من الأعلى للأقل',
  newest: 'الأحدث',
  relevance: 'الأكثر صلة',
};
