import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BRANDS_PAGE_CONFIG } from '@core/config/brands-page.config';
import { MOCK_CATALOG_PRODUCTS } from '@features/catalog/data-access/catalog-mock.service';
import { BRAND_LABELS, CATEGORY_LABELS, VALID_BRAND_SLUGS } from '@features/catalog/models/catalog.model';
import { MOCK_BRANDS } from '@features/home/data-access/home.mock';
import { Brand } from '@shared/models/storefront.model';
import {
  BRAND_WALL_SLUGS,
  BrandListing,
  BrandsQuery,
  BrandsSearchResult,
} from '../models/brands.model';
import { BrandsRepository } from './brands.repository';
import {
  BRANDS_HOME_CATEGORY,
  brandDirectoryLabel,
  matchesHomeCategory,
} from './brands-directory.util';

function initialOf(name: string): string {
  const letter = name.trim().charAt(0).toUpperCase();
  return letter || '#';
}

function matchesBrand(productBrand: string, slug: string): boolean {
  return productBrand.toLowerCase() === slug || productBrand === BRAND_LABELS[slug];
}

function productCountFor(slug: string): number {
  return MOCK_CATALOG_PRODUCTS.filter((product) => matchesBrand(product.brand, slug)).length;
}

function primaryCategory(slug: string): { slug: string; label: string } {
  const counts = new Map<string, number>();
  for (const product of MOCK_CATALOG_PRODUCTS) {
    if (!matchesBrand(product.brand, slug)) {
      continue;
    }
    const category = product.categorySlug ?? '';
    if (!category) {
      continue;
    }
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  let selected = '';
  let max = 0;
  for (const [category, count] of counts) {
    if (count > max) {
      selected = category;
      max = count;
    }
  }

  return { slug: selected, label: CATEGORY_LABELS[selected] ?? 'الأجهزة المنزلية' };
}

function matchesCategoryFilter(brand: BrandListing, category: string): boolean {
  if (!category) {
    return true;
  }
  if (category === BRANDS_HOME_CATEGORY) {
    return matchesHomeCategory(brand.categoryLabel);
  }
  return MOCK_CATALOG_PRODUCTS.some(
    (product) => matchesBrand(product.brand, brand.slug) && product.categorySlug === category,
  );
}

function toListing(brand: Brand): BrandListing {
  const category = primaryCategory(brand.slug);
  return {
    ...brand,
    categorySlug: category.slug,
    categoryLabel: brandDirectoryLabel(brand.slug, category.label),
    initial: initialOf(brand.name),
    productCount: productCountFor(brand.slug),
  };
}

function allListings(): readonly BrandListing[] {
  const bySlug = new Map<string, Brand>(MOCK_BRANDS.map((brand) => [brand.slug, brand]));
  const listings: BrandListing[] = [];

  for (const slug of VALID_BRAND_SLUGS) {
    const known = bySlug.get(slug);
    listings.push(
      toListing(
        known ?? {
          id: slug,
          slug,
          name: BRAND_LABELS[slug] ?? slug,
          imageSrc: '',
        },
      ),
    );
  }

  return listings;
}

export function selectBrandWall(listings: readonly BrandListing[]): BrandListing[] {
  const withProducts = listings.filter((brand) => brand.productCount > 0);
  const bySlug = new Map(withProducts.map((brand) => [brand.slug, brand]));
  const selected: BrandListing[] = [];

  for (const slug of BRAND_WALL_SLUGS) {
    const brand = bySlug.get(slug);
    if (brand) {
      selected.push(brand);
    }
    if (selected.length === 6) {
      return selected;
    }
  }

  for (const brand of withProducts) {
    if (selected.some((item) => item.slug === brand.slug)) {
      continue;
    }
    selected.push(brand);
    if (selected.length === 6) {
      break;
    }
  }

  return selected;
}

@Injectable()
export class BrandsMockRepository extends BrandsRepository {
  search(query: BrandsQuery): Observable<BrandsSearchResult> {
    const listings = allListings();
    const catalog = listings.filter((brand) => brand.productCount > 0);
    const needle = query.q.trim().toLowerCase();

    let items = catalog.filter((brand) => {
      const haystack = `${brand.name} ${brand.slug} ${brand.categoryLabel}`.toLowerCase();
      const matchesQuery = !needle || haystack.includes(needle);
      const matchesInitial = !query.initial || brand.initial === query.initial;
      const inCategory = matchesCategoryFilter(brand, query.category);
      return matchesQuery && matchesInitial && inCategory;
    });

    items = [...items].sort((left, right) => {
      if (query.sort === 'products-desc') {
        return right.productCount - left.productCount || left.name.localeCompare(right.name, 'en');
      }
      if (query.sort === 'name-desc') {
        return right.name.localeCompare(left.name, 'en');
      }
      if (query.sort === 'relevance' && needle) {
        const score = (brand: BrandListing) => {
          const name = brand.name.toLowerCase();
          if (name === needle) {
            return 3;
          }
          if (name.startsWith(needle)) {
            return 2;
          }
          return name.includes(needle) ? 1 : 0;
        };
        return score(right) - score(left) || left.name.localeCompare(right.name, 'en');
      }
      return left.name.localeCompare(right.name, 'en');
    });

    const initials = [...new Set(catalog.map((brand) => brand.initial))].sort();
    const featuredSlug = BRANDS_PAGE_CONFIG.featuredBrandSlug.trim();
    const featured = featuredSlug ? (catalog.find((brand) => brand.slug === featuredSlug) ?? null) : null;
    const start = (query.page - 1) * query.pageSize;

    return of({
      items: items.slice(start, start + query.pageSize),
      total: items.length,
      catalogTotal: catalog.length,
      initials,
      featured,
      wall: selectBrandWall(catalog),
    });
  }
}
