import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { BrowserStorageService } from '@core/services/browser-storage.service';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import {
  catalogQueryToParams,
  clearCatalogFilters,
  legacyShopLandingRedirect,
  parseCatalogQuery,
  removeChipFromQuery,
} from '../../data-access/catalog-query.util';
import {
  CatalogFilterState,
  CatalogPageSize,
  CatalogQuery,
  DEFAULT_CATALOG_QUERY,
  ProductSort,
  ProductViewMode,
  VIEW_STORAGE_KEY,
} from '../../models/catalog.model';
import { CatalogStore } from '../../state/catalog.store';
import { ActiveFiltersComponent } from '../../components/active-filters/active-filters.component';
import { CatalogPaginationComponent } from '../../components/catalog-pagination/catalog-pagination.component';
import { MobileFiltersDrawerComponent } from '../../components/mobile-filters-drawer/mobile-filters-drawer.component';
import { ProductFiltersComponent } from '../../components/product-filters/product-filters.component';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { ProductsToolbarComponent } from '../../components/products-toolbar/products-toolbar.component';
import { ShopBannerComponent } from '../../components/shop-banner/shop-banner.component';
import { ShopCategoryNavComponent } from '../../components/shop-category-nav/shop-category-nav.component';

function toFilterState(query: CatalogQuery): CatalogFilterState {
  return {
    category: query.category,
    brands: query.brands,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    availability: query.availability,
    rating: query.rating,
    offer: query.offer,
    attributes: query.attributes,
  };
}

const EMPTY_FILTER_STATE: CatalogFilterState = toFilterState(DEFAULT_CATALOG_QUERY);

@Component({
  selector: 'app-shop-page',
  imports: [
    ShopBannerComponent,
    ShopCategoryNavComponent,
    ProductsToolbarComponent,
    ActiveFiltersComponent,
    ProductFiltersComponent,
    ProductGridComponent,
    CatalogPaginationComponent,
    MobileFiltersDrawerComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  providers: [CatalogStore],
  templateUrl: './shop-page.component.html',
  styleUrl: './shop-page.component.scss',
})
export class ShopPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly storage = inject(BrowserStorageService);
  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly searchInput$ = new Subject<string>();
  private readonly results = viewChild<ElementRef<HTMLElement>>('results');
  private filterTrigger: HTMLElement | null = null;

  readonly store = inject(CatalogStore);
  readonly errorMessage = USER_ERROR_MESSAGES.server;
  readonly filtersOpen = signal(false);
  readonly draftFilters = signal<CatalogFilterState>(EMPTY_FILTER_STATE);
  readonly viewMode = computed(() => this.store.query().view);
  readonly appliedSort = computed(() => this.store.query().sort);
  readonly searchText = computed(() => this.store.query().q);
  readonly appliedFilters = computed(() => toFilterState(this.store.query()));
  readonly desktopFilters = signal(true);

  constructor() {
    const platformId = inject(PLATFORM_ID);
    const view = this.document.defaultView;
    if (isPlatformBrowser(platformId) && view && typeof view.matchMedia === 'function') {
      const media = view.matchMedia('(min-width: 768px)');
      this.desktopFilters.set(media.matches);
      const onChange = () => this.desktopFilters.set(media.matches);
      media.addEventListener('change', onChange);
      inject(DestroyRef).onDestroy(() => media.removeEventListener('change', onChange));
    }

    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const redirect = legacyShopLandingRedirect(params);
      if (redirect) {
        void this.router.navigate([redirect.path], {
          queryParams: redirect.queryParams,
          replaceUrl: true,
        });
        return;
      }
      const storedView = this.storage.readJson<ProductViewMode>(VIEW_STORAGE_KEY);
      this.store.load(parseCatalogQuery(params, storedView));
      this.cdr.markForCheck();
    });

    this.searchInput$
      .pipe(
        debounceTime(350),
        map((value) => value.trim()),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((q) => {
        if (q === this.store.query().q) {
          return;
        }
        this.navigate({ q }, true);
      });
  }

  onCategorySelect(slug: string): void {
    const attributes = slug === this.store.query().category ? this.store.query().attributes : [];
    this.navigate({ category: slug, attributes }, true);
    this.scrollToResults();
  }

  onExplore(): void {
    this.scrollToTarget(this.document.getElementById('shop-categories'));
  }

  onSearch(value: string): void {
    this.searchInput$.next(value);
  }

  onSort(sort: ProductSort): void {
    this.navigate({ sort }, true);
  }

  onView(view: ProductViewMode): void {
    this.storage.writeJson(VIEW_STORAGE_KEY, view);
    this.navigate({ view });
  }

  onFiltersChange(state: CatalogFilterState): void {
    if (this.filtersOpen()) {
      this.draftFilters.set(state);
      return;
    }
    this.navigate(state, true);
  }

  onRemoveChip(id: string): void {
    this.navigate(removeChipFromQuery(this.store.query(), id));
  }

  onClearFilters(): void {
    this.navigate(clearCatalogFilters(this.store.query()), true);
  }

  onShowAll(): void {
    this.navigate({ ...DEFAULT_CATALOG_QUERY, view: this.store.query().view }, true);
  }

  onPage(page: number): void {
    this.navigate({ page });
    this.scrollToResults();
  }

  onPageSize(pageSize: CatalogPageSize): void {
    this.navigate({ pageSize }, true);
    this.scrollToResults();
  }

  retry(): void {
    this.store.load(this.store.query());
  }

  openFilters(): void {
    this.filterTrigger = this.document.activeElement as HTMLElement | null;
    this.draftFilters.set(toFilterState(this.store.query()));
    this.filtersOpen.set(true);
  }

  closeFilters(): void {
    this.filtersOpen.set(false);
    this.draftFilters.set(EMPTY_FILTER_STATE);
    queueMicrotask(() => this.filterTrigger?.focus());
  }

  applyDraft(): void {
    this.navigate(this.draftFilters(), true);
    this.closeFilters();
  }

  clearDraft(): void {
    this.draftFilters.set(EMPTY_FILTER_STATE);
  }

  private navigate(patch: Partial<CatalogQuery>, resetPage = false): void {
    const current = this.store.query();
    const next: CatalogQuery = {
      ...current,
      ...patch,
      page: resetPage ? 1 : (patch.page ?? current.page),
    };
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: catalogQueryToParams(next, this.route.snapshot.queryParamMap),
    });
  }

  private scrollToResults(): void {
    this.scrollToTarget(this.results()?.nativeElement ?? null);
  }

  private scrollToTarget(target: HTMLElement | null): void {
    if (!target) {
      return;
    }
    const view = this.document.defaultView;
    const reduce =
      !view ||
      typeof view.matchMedia !== 'function' ||
      view.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
  }
}
