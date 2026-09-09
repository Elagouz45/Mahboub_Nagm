import { CatalogPageSize } from '@features/catalog/models/catalog.model';
import { Brand } from '@shared/models/storefront.model';

export interface BrandListing extends Brand {
  readonly categorySlug: string;
  readonly categoryLabel: string;
  readonly initial: string;
}

export interface BrandsQuery {
  readonly q: string;
  readonly category: string;
  readonly initial: string;
  readonly page: number;
  readonly pageSize: CatalogPageSize;
  readonly sort: 'name' | 'relevance';
}

export interface BrandsSearchResult {
  readonly items: readonly BrandListing[];
  readonly total: number;
  readonly initials: readonly string[];
  readonly featured: BrandListing | null;
}

export const DEFAULT_BRANDS_QUERY: BrandsQuery = {
  q: '',
  category: '',
  initial: '',
  page: 1,
  pageSize: 12,
  sort: 'name',
};
