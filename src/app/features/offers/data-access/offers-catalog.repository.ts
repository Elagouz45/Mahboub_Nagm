import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { CatalogRepository } from '@features/catalog/data-access/catalog.repository';
import {
  CatalogQuery,
  DEFAULT_CATALOG_QUERY,
  ProductSort,
} from '@features/catalog/models/catalog.model';
import { OffersQuery, OffersSearchResult, OfferPageSort } from '../models/offers.model';
import { OffersRepository } from './offers.repository';

const BIG_DISCOUNT_THRESHOLD = 20;

function toCatalogSort(sort: OfferPageSort): ProductSort {
  if (sort === 'discount-desc') {
    return 'discount';
  }
  return sort;
}

export function toCatalogQuery(query: OffersQuery): CatalogQuery {
  const typeMinDiscount = query.type === 'big' ? (query.minDiscount ?? BIG_DISCOUNT_THRESHOLD) : query.minDiscount;
  return {
    ...DEFAULT_CATALOG_QUERY,
    category: query.category,
    brands: query.brands,
    offer: query.type === 'today' ? 'todays' : 'discounted',
    minDiscount: typeMinDiscount,
    sort: toCatalogSort(query.sort),
    page: query.page,
    pageSize: query.pageSize,
  };
}

@Injectable()
export class OffersCatalogRepository extends OffersRepository {
  private readonly catalog = inject(CatalogRepository);

  search(query: OffersQuery): Observable<OffersSearchResult> {
    return forkJoin({
      page: this.catalog.search(toCatalogQuery(query)),
      headline: this.catalog.search({
        ...DEFAULT_CATALOG_QUERY,
        offer: 'discounted',
        sort: 'discount',
        page: 1,
        pageSize: 36,
      }),
    }).pipe(
      map(({ page, headline }) => ({
        items: page.items,
        total: page.total,
        filters: page.filters,
        maxDiscountPercent: Math.max(0, ...headline.items.map((item) => item.discountPercent ?? 0)),
        endsAt: null,
      })),
    );
  }
}
