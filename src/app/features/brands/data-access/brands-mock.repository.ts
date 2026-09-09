import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BRANDS_PAGE_CONFIG } from '@core/config/brands-page.config';
import { MOCK_CATALOG_PRODUCTS } from '@features/catalog/data-access/catalog-mock.service';
import { BRAND_LABELS, CATEGORY_LABELS, VALID_BRAND_SLUGS } from '@features/catalog/models/catalog.model';
import { MOCK_BRANDS } from '@features/home/data-access/home.mock';
import { Brand } from '@shared/models/storefront.model';
import {
  BrandListing,
  BrandsQuery,
  BrandsSearchResult,
} from '../models/brands.model';
import { BrandsRepository } from './brands.repository';

function initialOf(name: string): string {
  const letter = name.trim().charAt(0).toUpperCase();
  return letter || '#';
}

function primaryCategory(slug: string): { slug: string; label: string } {
  const counts = new Map<string, number>();
  for (const product of MOCK_CATALOG_PRODUCTS) {
    if (product.brand.toLowerCase() !== slug && product.brand !== BRAND_LABELS[slug]) {
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

function matchesBrand(productBrand: string, slug: string): boolean {
  return productBrand.toLowerCase() === slug || productBrand === BRAND_LABELS[slug];
}

function toListing(brand: Brand): BrandListing {
  const category = primaryCategory(brand.slug);
  return {
    ...brand,
    categorySlug: category.slug,
    categoryLabel: category.label,
    initial: initialOf(brand.name),
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

@Injectable()
export class BrandsMockRepository extends BrandsRepository {
  search(query: BrandsQuery): Observable<BrandsSearchResult> {
    const needle = query.q.trim().toLowerCase();
    let items = allListings().filter((brand) => {
      const haystack = `${brand.name} ${brand.slug} ${brand.categoryLabel}`.toLowerCase();
      const matchesQuery = !needle || haystack.includes(needle);
      const matchesInitial = !query.initial || brand.initial === query.initial;
      const hasProducts = MOCK_CATALOG_PRODUCTS.some((product) => matchesBrand(product.brand, brand.slug));
      const inCategory =
        !query.category ||
        MOCK_CATALOG_PRODUCTS.some(
          (product) => matchesBrand(product.brand, brand.slug) && product.categorySlug === query.category,
        );
      return matchesQuery && matchesInitial && hasProducts && inCategory;
    });

    items = [...items].sort((left, right) => {
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

    const initials = [...new Set(allListings().map((brand) => brand.initial))].sort();
    const featuredSlug = BRANDS_PAGE_CONFIG.featuredBrandSlug.trim();
    const featured = featuredSlug ? (allListings().find((brand) => brand.slug === featuredSlug) ?? null) : null;
    const start = (query.page - 1) * query.pageSize;

    return of({
      items: items.slice(start, start + query.pageSize),
      total: items.length,
      initials,
      featured,
    });
  }
}
