import { ParamMap, Params } from '@angular/router';
import {
  CatalogPageSize,
  PAGE_SIZES,
  VALID_BRAND_SLUGS,
  VALID_CATEGORY_SLUGS,
} from '@features/catalog/models/catalog.model';
import {
  DEFAULT_OFFERS_QUERY,
  OFFER_PAGE_SORTS,
  OFFER_TYPES,
  OfferPageSort,
  OffersQuery,
  OfferType,
} from '../models/offers.model';

function isType(value: string | null): value is OfferType {
  return !!value && (OFFER_TYPES as readonly string[]).includes(value);
}

function isSort(value: string | null): value is OfferPageSort {
  return !!value && (OFFER_PAGE_SORTS as readonly string[]).includes(value);
}

function isPageSize(value: number): value is CatalogPageSize {
  return (PAGE_SIZES as readonly number[]).includes(value);
}

export function parseOffersQuery(params: ParamMap): OffersQuery {
  const page = Number(params.get('page') ?? DEFAULT_OFFERS_QUERY.page);
  const pageSize = Number(params.get('pageSize') ?? DEFAULT_OFFERS_QUERY.pageSize);
  const minDiscountRaw = params.get('minDiscount');
  const minDiscount = minDiscountRaw ? Number(minDiscountRaw) : null;
  const allowedBrands = new Set<string>(VALID_BRAND_SLUGS);
  const brands = (params.get('brands') ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => allowedBrands.has(item));
  const category = params.get('category') ?? '';
  const typeParam = params.get('type');

  return {
    type: isType(typeParam) ? typeParam : DEFAULT_OFFERS_QUERY.type,
    category: VALID_CATEGORY_SLUGS.includes(category) ? category : '',
    brands,
    minDiscount: minDiscount !== null && Number.isFinite(minDiscount) && minDiscount > 0 ? Math.floor(minDiscount) : null,
    sort: isSort(params.get('sort')) ? (params.get('sort') as OfferPageSort) : DEFAULT_OFFERS_QUERY.sort,
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
    pageSize: isPageSize(pageSize) ? pageSize : DEFAULT_OFFERS_QUERY.pageSize,
  };
}

export function offersQueryToParams(query: OffersQuery): Params {
  const params: Params = {};
  if (query.type !== DEFAULT_OFFERS_QUERY.type) {
    params['type'] = query.type;
  }
  if (query.category) {
    params['category'] = query.category;
  }
  if (query.brands.length > 0) {
    params['brands'] = query.brands.join(',');
  }
  if (query.minDiscount !== null) {
    params['minDiscount'] = String(query.minDiscount);
  }
  if (query.sort !== DEFAULT_OFFERS_QUERY.sort) {
    params['sort'] = query.sort;
  }
  if (query.page !== DEFAULT_OFFERS_QUERY.page) {
    params['page'] = String(query.page);
  }
  if (query.pageSize !== DEFAULT_OFFERS_QUERY.pageSize) {
    params['pageSize'] = String(query.pageSize);
  }
  return params;
}
