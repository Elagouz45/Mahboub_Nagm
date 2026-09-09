import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { CatalogRepository } from '../data-access/catalog.repository';
import { CatalogSearchResult, DEFAULT_CATALOG_QUERY, EMPTY_AVAILABLE_FILTERS } from '../models/catalog.model';
import { CatalogStore } from './catalog.store';

function page(ids: string[]): CatalogSearchResult {
  return {
    items: ids.map((id) => ({
      id,
      sku: id,
      slug: id,
      brand: 'LG',
      title: id,
      spec: '',
      imageSrc: '/assets/images/mahboub-nagm/products/refrigerator-top-freezer-white.webp',
      imageAlt: id,
      rating: 4,
      reviewCount: 1,
      price: 1000,
    })),
    total: ids.length,
    filters: EMPTY_AVAILABLE_FILTERS,
  };
}

@Component({
  template: '',
  providers: [CatalogStore],
})
class HostComponent {}

describe('CatalogStore', () => {
  it('cancels in-flight loads with switchMap and exposes active chips', async () => {
    const first$ = new Subject<CatalogSearchResult>();
    const repo: Pick<CatalogRepository, 'search'> = {
      search: (query) => {
        if (query.q === 'one') {
          return first$.asObservable();
        }
        return of(page(['two']));
      },
    };

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: CatalogRepository, useValue: repo }],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    const store = fixture.componentRef.injector.get(CatalogStore);

    store.load({ ...DEFAULT_CATALOG_QUERY, q: 'one', category: 'fridges' });
    store.load({ ...DEFAULT_CATALOG_QUERY, q: 'two' });
    first$.next(page(['stale']));
    first$.complete();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(store.products()[0]?.id).toBe('two');
    expect(store.query().q).toBe('two');
    expect(store.hasActiveFilters()).toBe(false);

    store.load({ ...DEFAULT_CATALOG_QUERY, category: 'fridges', page: 3 });
    await fixture.whenStable();
    expect(store.activeChips().some((chip) => chip.id === 'category:fridges')).toBe(true);
    expect(store.query().page).toBe(3);
  });
});
