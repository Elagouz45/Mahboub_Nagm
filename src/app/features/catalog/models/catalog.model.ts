import { ProductSummary, StockStatus } from '@shared/models/storefront.model';

export const PRODUCT_SORTS = [
  'relevance',
  'newest',
  'bestselling',
  'rating',
  'price-asc',
  'price-desc',
  'discount',
] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];

export const PRODUCT_VIEWS = ['grid', 'list'] as const;
export type ProductViewMode = (typeof PRODUCT_VIEWS)[number];

export const PAGE_SIZES = [12, 24, 36] as const;
export type CatalogPageSize = (typeof PAGE_SIZES)[number];

export const OFFER_FILTERS = ['discounted', 'todays', 'bestselling'] as const;
export type OfferFilter = (typeof OFFER_FILTERS)[number];

export const RATING_FILTERS = [4, 3] as const;
export type RatingFilter = (typeof RATING_FILTERS)[number];

export const STOCK_STATUSES: readonly StockStatus[] = [
  'in-stock',
  'out-of-stock',
  'available-to-order',
  'coming-soon',
];

export interface CatalogAttributeSelection {
  readonly key: string;
  readonly value: string;
}

export interface CatalogQuery {
  readonly q: string;
  readonly category: string;
  readonly brands: readonly string[];
  readonly minPrice: number | null;
  readonly maxPrice: number | null;
  readonly minDiscount: number | null;
  readonly availability: StockStatus | null;
  readonly rating: RatingFilter | null;
  readonly offer: OfferFilter | null;
  readonly attributes: readonly CatalogAttributeSelection[];
  readonly sort: ProductSort;
  readonly page: number;
  readonly pageSize: CatalogPageSize;
  readonly view: ProductViewMode;
}

export interface FilterOption {
  readonly value: string;
  readonly label: string;
  readonly count?: number;
}

export interface AttributeFilterDefinition {
  readonly key: string;
  readonly label: string;
  readonly options: readonly FilterOption[];
}

export interface AvailableCatalogFilters {
  readonly categories: readonly FilterOption[];
  readonly brands: readonly FilterOption[];
  readonly priceMin: number;
  readonly priceMax: number;
  readonly availability: readonly FilterOption[];
  readonly offers: readonly FilterOption[];
  readonly ratings: readonly FilterOption[];
  readonly attributes: readonly AttributeFilterDefinition[];
}

export interface PaginatedProducts {
  readonly items: readonly ProductSummary[];
  readonly total: number;
}

export interface ActiveFilterChip {
  readonly id: string;
  readonly label: string;
}

export interface CatalogSearchResult {
  readonly items: readonly ProductSummary[];
  readonly total: number;
  readonly filters: AvailableCatalogFilters;
}

export type CatalogFilterState = Pick<
  CatalogQuery,
  | 'category'
  | 'brands'
  | 'minPrice'
  | 'maxPrice'
  | 'availability'
  | 'rating'
  | 'offer'
  | 'attributes'
>;

export const SORT_LABELS: Readonly<Record<ProductSort, string>> = {
  relevance: 'الأكثر صلة',
  newest: 'الأحدث',
  bestselling: 'الأكثر مبيعًا',
  rating: 'الأعلى تقييمًا',
  'price-asc': 'السعر: من الأقل للأعلى',
  'price-desc': 'السعر: من الأعلى للأقل',
  discount: 'أكبر خصم',
};

export const STOCK_LABELS: Readonly<Record<StockStatus, string>> = {
  'in-stock': 'متوفر',
  'out-of-stock': 'غير متوفر',
  'available-to-order': 'متاح للطلب',
  'coming-soon': 'متاح قريبًا',
};

export const OFFER_LABELS: Readonly<Record<OfferFilter, string>> = {
  discounted: 'المنتجات المخفضة',
  todays: 'عروض اليوم',
  bestselling: 'الأكثر مبيعًا',
};

export const CATEGORY_LABELS: Readonly<Record<string, string>> = {
  fridges: 'ثلاجات',
  washers: 'غسالات',
  tvs: 'تليفزيونات',
  acs: 'تكييفات',
  kitchen: 'بوتاجازات',
  ovens: 'أفران وميكروويف',
  'water-heaters': 'سخانات مياه',
  fans: 'مراوح',
  small: 'أجهزة صغيرة',
  'vacuum-cleaners': 'مكانس كهربائية',
};

export const VALID_CATEGORY_SLUGS = Object.keys(CATEGORY_LABELS);

export const VALID_BRAND_SLUGS = [
  'lg',
  'samsung',
  'fresh',
  'toshiba',
  'sharp',
  'carrier',
  'tornado',
  'philips',
  'tcl',
] as const;

export const BRAND_LABELS: Readonly<Record<string, string>> = {
  lg: 'LG',
  samsung: 'Samsung',
  fresh: 'Fresh',
  toshiba: 'Toshiba',
  sharp: 'Sharp',
  carrier: 'Carrier',
  tornado: 'Tornado',
  philips: 'Philips',
  tcl: 'TCL',
};

export const VIEW_STORAGE_KEY = 'mahbub-najm.shop.view';

export const EMPTY_AVAILABLE_FILTERS: AvailableCatalogFilters = {
  categories: [],
  brands: [],
  priceMin: 0,
  priceMax: 0,
  availability: [],
  offers: [],
  ratings: [],
  attributes: [],
};

export const DEFAULT_CATALOG_QUERY: CatalogQuery = {
  q: '',
  category: '',
  brands: [],
  minPrice: null,
  maxPrice: null,
  minDiscount: null,
  availability: null,
  rating: null,
  offer: null,
  attributes: [],
  sort: 'relevance',
  page: 1,
  pageSize: 12,
  view: 'grid',
};
