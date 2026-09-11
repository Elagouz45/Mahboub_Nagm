import { CatalogPageSize } from '@features/catalog/models/catalog.model';
import { Brand } from '@shared/models/storefront.model';

export interface BrandListing extends Brand {
  readonly categorySlug: string;
  readonly categoryLabel: string;
  readonly initial: string;
  readonly productCount: number;
}

export const BRAND_PAGE_SORTS = ['name', 'name-desc', 'products-desc', 'relevance'] as const;
export type BrandPageSort = (typeof BRAND_PAGE_SORTS)[number];

export const BRAND_SORT_OPTIONS = [
  { value: 'name' as const, label: 'الاسم' },
  { value: 'name-desc' as const, label: 'الاسم من ي إلى أ' },
  { value: 'products-desc' as const, label: 'الأكثر منتجات' },
];

export interface BrandsQuery {
  readonly q: string;
  readonly category: string;
  readonly initial: string;
  readonly page: number;
  readonly pageSize: CatalogPageSize;
  readonly sort: BrandPageSort;
}

export interface BrandsSearchResult {
  readonly items: readonly BrandListing[];
  readonly total: number;
  readonly catalogTotal: number;
  readonly initials: readonly string[];
  readonly featured: BrandListing | null;
  readonly wall: readonly BrandListing[];
}

export const DEFAULT_BRANDS_QUERY: BrandsQuery = {
  q: '',
  category: '',
  initial: '',
  page: 1,
  pageSize: 12,
  sort: 'name',
};

export const BRAND_WALL_SLUGS = ['samsung', 'lg', 'toshiba', 'sharp', 'carrier', 'fresh'] as const;
