import { ParamMap, Params } from '@angular/router';
import { StockStatus } from '@shared/models/storefront.model';
import {
  ActiveFilterChip,
  BRAND_LABELS,
  CatalogAttributeSelection,
  CatalogPageSize,
  CatalogQuery,
  CATEGORY_LABELS,
  DEFAULT_CATALOG_QUERY,
  OfferFilter,
  OFFER_FILTERS,
  OFFER_LABELS,
  PAGE_SIZES,
  PRODUCT_SORTS,
  PRODUCT_VIEWS,
  ProductSort,
  ProductViewMode,
  RATING_FILTERS,
  RatingFilter,
  STOCK_LABELS,
  STOCK_STATUSES,
  VALID_BRAND_SLUGS,
  VALID_CATEGORY_SLUGS,
} from '../models/catalog.model';
import { attributeValueLabel, findAttributeDefinition } from './catalog-attributes';

function isSort(value: string | null): value is ProductSort {
  return !!value && (PRODUCT_SORTS as readonly string[]).includes(value);
}

function isView(value: string | null): value is ProductViewMode {
  return !!value && (PRODUCT_VIEWS as readonly string[]).includes(value);
}

function isPageSize(value: number): value is CatalogPageSize {
  return (PAGE_SIZES as readonly number[]).includes(value);
}

function isOffer(value: string | null): value is OfferFilter {
  return !!value && (OFFER_FILTERS as readonly string[]).includes(value);
}

function isStock(value: string | null): value is StockStatus {
  return !!value && (STOCK_STATUSES as readonly string[]).includes(value);
}

function parsePositiveInt(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }
  return Math.floor(parsed);
}

function parsePrice(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

function parseBrands(params: ParamMap): readonly string[] {
  const allowed = new Set<string>(VALID_BRAND_SLUGS);
  const fromList = (raw: string | null): readonly string[] => {
    if (!raw || raw === '1') {
      return [];
    }
    return raw
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter((item) => allowed.has(item));
  };

  const multi = fromList(params.get('brands'));
  if (multi.length > 0) {
    return multi;
  }

  return fromList(params.get('brand'));
}

function parseOffer(params: ParamMap): OfferFilter | null {
  const offer = params.get('offer');
  if (isOffer(offer)) {
    return offer;
  }
  if (params.get('offers') === '1') {
    return 'todays';
  }
  return null;
}

function parseSort(value: string | null): ProductSort {
  if (isSort(value)) {
    return value;
  }
  return DEFAULT_CATALOG_QUERY.sort;
}

function parseRating(value: string | null): RatingFilter | null {
  const parsed = Number(value);
  if ((RATING_FILTERS as readonly number[]).includes(parsed)) {
    return parsed as RatingFilter;
  }
  return null;
}

function parseAttributes(value: string | null): readonly CatalogAttributeSelection[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((pair) => {
      const [key, raw] = pair.split(':');
      const trimmedKey = key?.trim() ?? '';
      const trimmedValue = raw?.trim() ?? '';
      if (!trimmedKey || !trimmedValue) {
        return null;
      }
      return { key: trimmedKey, value: trimmedValue };
    })
    .filter((item): item is CatalogAttributeSelection => item !== null);
}

const CATEGORY_SLUG_ALIASES: Readonly<Record<string, string>> = {
  refrigerators: 'fridges',
};

function parseCategory(value: string | null): string {
  const slug = CATEGORY_SLUG_ALIASES[(value ?? '').trim()] ?? (value ?? '').trim();
  return VALID_CATEGORY_SLUGS.includes(slug) ? slug : '';
}

export function parseCatalogQuery(params: ParamMap, storedView?: ProductViewMode | null): CatalogQuery {
  const page = parsePositiveInt(params.get('page')) ?? DEFAULT_CATALOG_QUERY.page;
  const pageSizeRaw = parsePositiveInt(params.get('pageSize')) ?? DEFAULT_CATALOG_QUERY.pageSize;
  const pageSize = isPageSize(pageSizeRaw) ? pageSizeRaw : DEFAULT_CATALOG_QUERY.pageSize;
  const availabilityParam = params.get('availability');
  const viewParam = params.get('view');
  const view = isView(viewParam) ? viewParam : (storedView ?? DEFAULT_CATALOG_QUERY.view);
  let minPrice = parsePrice(params.get('minPrice'));
  let maxPrice = parsePrice(params.get('maxPrice'));
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    minPrice = null;
    maxPrice = null;
  }

  return {
    q: (params.get('q') ?? '').trim(),
    category: parseCategory(params.get('category')),
    brands: parseBrands(params),
    minPrice,
    maxPrice,
    minDiscount: null,
    availability: isStock(availabilityParam) ? availabilityParam : null,
    rating: parseRating(params.get('rating')),
    offer: parseOffer(params),
    attributes: parseAttributes(params.get('attrs')),
    sort: parseSort(params.get('sort')),
    page,
    pageSize,
    view,
  };
}

export function catalogQueryToParams(query: CatalogQuery, extras?: ParamMap): Params {
  const params: Params = {};
  if (query.q) {
    params['q'] = query.q;
  }
  if (query.category) {
    params['category'] = query.category;
  }
  if (query.brands.length > 0) {
    params['brands'] = query.brands.join(',');
  }
  if (query.minPrice !== null) {
    params['minPrice'] = String(query.minPrice);
  }
  if (query.maxPrice !== null) {
    params['maxPrice'] = String(query.maxPrice);
  }
  if (query.availability) {
    params['availability'] = query.availability;
  }
  if (query.rating) {
    params['rating'] = String(query.rating);
  }
  if (query.offer) {
    params['offer'] = query.offer;
  }
  if (query.attributes.length > 0) {
    params['attrs'] = query.attributes.map((item) => `${item.key}:${item.value}`).join(',');
  }
  if (query.sort !== DEFAULT_CATALOG_QUERY.sort) {
    params['sort'] = query.sort;
  }
  if (query.page !== DEFAULT_CATALOG_QUERY.page) {
    params['page'] = String(query.page);
  }
  if (query.pageSize !== DEFAULT_CATALOG_QUERY.pageSize) {
    params['pageSize'] = String(query.pageSize);
  }
  if (query.view !== DEFAULT_CATALOG_QUERY.view) {
    params['view'] = query.view;
  }
  const bundle = extras?.get('bundle');
  if (bundle) {
    params['bundle'] = bundle;
  }
  return params;
}

export function queriesEqual(left: CatalogQuery, right: CatalogQuery): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function isPurchasable(status: StockStatus | undefined): boolean {
  return status !== 'out-of-stock' && status !== 'coming-soon';
}

export function clearCatalogFilters(query: CatalogQuery): CatalogQuery {
  return {
    ...DEFAULT_CATALOG_QUERY,
    q: query.q,
    sort: query.sort,
    pageSize: query.pageSize,
    view: query.view,
    page: 1,
  };
}

export function formatResultRange(total: number, page: number, pageSize: number): string {
  if (total === 0) {
    return 'لا توجد منتجات للعرض';
  }
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return `عرض ${from}–${to} من ${total} منتجًا`;
}

export function buildActiveChips(query: CatalogQuery): readonly ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  if (query.category) {
    chips.push({
      id: `category:${query.category}`,
      label: CATEGORY_LABELS[query.category] ?? query.category,
    });
  }
  for (const brand of query.brands) {
    chips.push({ id: `brand:${brand}`, label: BRAND_LABELS[brand] ?? brand });
  }
  if (query.minPrice !== null) {
    chips.push({ id: 'minPrice', label: `من ${query.minPrice.toLocaleString('ar-EG')} ج.م` });
  }
  if (query.maxPrice !== null) {
    chips.push({ id: 'maxPrice', label: `حتى ${query.maxPrice.toLocaleString('ar-EG')} ج.م` });
  }
  if (query.availability) {
    chips.push({ id: `availability:${query.availability}`, label: STOCK_LABELS[query.availability] });
  }
  if (query.rating) {
    chips.push({ id: `rating:${query.rating}`, label: `${query.rating}+ نجوم` });
  }
  if (query.offer) {
    chips.push({ id: `offer:${query.offer}`, label: OFFER_LABELS[query.offer] });
  }
  for (const attr of query.attributes) {
    const definition = findAttributeDefinition(query.category, attr.key);
    const name = definition?.label ?? attr.key;
    const value = attributeValueLabel(query.category, attr.key, attr.value);
    chips.push({ id: `attr:${attr.key}:${attr.value}`, label: `${name}: ${value}` });
  }
  return chips;
}

export function removeChipFromQuery(query: CatalogQuery, chipId: string): CatalogQuery {
  const next: CatalogQuery = { ...query, page: 1 };
  if (chipId.startsWith('category:')) {
    return { ...next, category: '', attributes: [] };
  }
  if (chipId.startsWith('brand:')) {
    const brand = chipId.slice('brand:'.length);
    return { ...next, brands: query.brands.filter((item) => item !== brand) };
  }
  if (chipId === 'minPrice') {
    return { ...next, minPrice: null };
  }
  if (chipId === 'maxPrice') {
    return { ...next, maxPrice: null };
  }
  if (chipId.startsWith('availability:')) {
    return { ...next, availability: null };
  }
  if (chipId.startsWith('rating:')) {
    return { ...next, rating: null };
  }
  if (chipId.startsWith('offer:')) {
    return { ...next, offer: null };
  }
  if (chipId.startsWith('attr:')) {
    const rest = chipId.slice('attr:'.length);
    const sep = rest.indexOf(':');
    const key = rest.slice(0, sep);
    const value = rest.slice(sep + 1);
    return {
      ...next,
      attributes: query.attributes.filter((item) => !(item.key === key && item.value === value)),
    };
  }
  return next;
}

export function paginationItems(current: number, totalPages: number): readonly (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) {
    items.push('ellipsis');
  }
  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }
  if (end < totalPages - 1) {
    items.push('ellipsis');
  }
  items.push(totalPages);
  return items;
}

export function legacyShopLandingRedirect(
  params: ParamMap,
): { readonly path: string; readonly queryParams: Params } | null {
  const extras: Params = {};
  for (const key of params.keys) {
    if (key === 'offers' || key === 'brands') {
      continue;
    }
    const value = params.get(key);
    if (value !== null && value !== '') {
      extras[key] = value;
    }
  }

  if (params.get('offers') === '1') {
    return { path: '/offers', queryParams: { type: extras['type'] ?? 'today', ...extras } };
  }

  if (params.get('brands') === '1' && !params.get('brand')) {
    return { path: '/brands', queryParams: extras };
  }

  return null;
}
