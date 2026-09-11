import { ParamMap, Params } from '@angular/router';
import { CatalogPageSize, PAGE_SIZES } from '@features/catalog/models/catalog.model';
import { BRAND_PAGE_SORTS, BrandPageSort, BrandsQuery, DEFAULT_BRANDS_QUERY } from '../models/brands.model';
import { isBrandsCategoryFilter } from './brands-directory.util';

function isPageSize(value: number): value is CatalogPageSize {
  return (PAGE_SIZES as readonly number[]).includes(value);
}

function isSort(value: string | null): value is BrandPageSort {
  return !!value && (BRAND_PAGE_SORTS as readonly string[]).includes(value);
}

export function parseBrandsQuery(params: ParamMap): BrandsQuery {
  const category = params.get('category') ?? '';
  const page = Number(params.get('page') ?? DEFAULT_BRANDS_QUERY.page);
  const pageSize = Number(params.get('pageSize') ?? DEFAULT_BRANDS_QUERY.pageSize);
  const sortParam = params.get('sort');
  return {
    q: (params.get('q') ?? '').trim(),
    category: isBrandsCategoryFilter(category) ? category : '',
    initial: (params.get('initial') ?? '').trim().toUpperCase(),
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
    pageSize: isPageSize(pageSize) ? pageSize : DEFAULT_BRANDS_QUERY.pageSize,
    sort: isSort(sortParam) ? sortParam : DEFAULT_BRANDS_QUERY.sort,
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
