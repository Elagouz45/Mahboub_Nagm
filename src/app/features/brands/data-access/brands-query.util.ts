import { ParamMap, Params } from '@angular/router';
import { CatalogPageSize, PAGE_SIZES, VALID_CATEGORY_SLUGS } from '@features/catalog/models/catalog.model';
import { BrandsQuery, DEFAULT_BRANDS_QUERY } from '../models/brands.model';

function isPageSize(value: number): value is CatalogPageSize {
  return (PAGE_SIZES as readonly number[]).includes(value);
}

export function parseBrandsQuery(params: ParamMap): BrandsQuery {
  const category = params.get('category') ?? '';
  const page = Number(params.get('page') ?? DEFAULT_BRANDS_QUERY.page);
  const pageSize = Number(params.get('pageSize') ?? DEFAULT_BRANDS_QUERY.pageSize);
  return {
    q: (params.get('q') ?? '').trim(),
    category: VALID_CATEGORY_SLUGS.includes(category) ? category : '',
    initial: (params.get('initial') ?? '').trim().toUpperCase(),
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
    pageSize: isPageSize(pageSize) ? pageSize : DEFAULT_BRANDS_QUERY.pageSize,
    sort: params.get('sort') === 'relevance' ? 'relevance' : 'name',
  };
}

export function brandsQueryToParams(query: BrandsQuery): Params {
  const params: Params = {};
  if (query.q) {
    params['q'] = query.q;
  }
  if (query.category) {
    params['category'] = query.category;
  }
  if (query.initial) {
    params['initial'] = query.initial;
  }
  if (query.page > 1) {
    params['page'] = String(query.page);
  }
  if (query.pageSize !== DEFAULT_BRANDS_QUERY.pageSize) {
    params['pageSize'] = String(query.pageSize);
  }
  if (query.sort !== DEFAULT_BRANDS_QUERY.sort) {
    params['sort'] = query.sort;
  }
  return params;
}
