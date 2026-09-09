import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { ProductSummary } from '@shared/models/storefront.model';
import { Subject, catchError, of, switchMap } from 'rxjs';
import { CatalogRepository } from '../data-access/catalog.repository';
import { buildActiveChips, formatResultRange } from '../data-access/catalog-query.util';
import {
  AvailableCatalogFilters,
  CatalogQuery,
  DEFAULT_CATALOG_QUERY,
  EMPTY_AVAILABLE_FILTERS,
} from '../models/catalog.model';

@Injectable()
export class CatalogStore {
  private readonly repository = inject(CatalogRepository);
  private readonly load$ = new Subject<CatalogQuery>();

  private readonly productsState = signal<readonly ProductSummary[]>([]);
  private readonly availableFiltersState = signal<AvailableCatalogFilters>(EMPTY_AVAILABLE_FILTERS);
  private readonly loadingState = signal(true);
  private readonly loadingFiltersState = signal(true);
  private readonly errorState = signal<string | null>(null);
  private readonly queryState = signal<CatalogQuery>(DEFAULT_CATALOG_QUERY);
  private readonly totalState = signal(0);
  private readonly hasLoadedState = signal(false);

  readonly products = this.productsState.asReadonly();
  readonly availableFilters = this.availableFiltersState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly loadingFilters = this.loadingFiltersState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly query = this.queryState.asReadonly();
  readonly total = this.totalState.asReadonly();
  readonly hasLoaded = this.hasLoadedState.asReadonly();

  readonly totalPages = computed(() => {
    const size = this.query().pageSize;
    return Math.max(1, Math.ceil(this.total() / size) || 1);
  });
  readonly resultRange = computed(() =>
    formatResultRange(this.total(), this.query().page, this.query().pageSize),
  );
  readonly activeChips = computed(() => buildActiveChips(this.query()));
  readonly activeFilterCount = computed(() => this.activeChips().length);
  readonly hasActiveFilters = computed(() => this.activeFilterCount() > 0);
  readonly canPrev = computed(() => this.query().page > 1);
  readonly canNext = computed(() => this.query().page < this.totalPages());

  constructor() {
    this.load$
      .pipe(
        switchMap((query) => {
          this.queryState.set(query);
          this.loadingState.set(true);
          if (!this.hasLoadedState()) {
            this.loadingFiltersState.set(true);
          }
          this.errorState.set(null);
          return this.repository.search(query).pipe(
            catchError(() => {
              this.errorState.set(USER_ERROR_MESSAGES.server);
              this.loadingState.set(false);
              this.loadingFiltersState.set(false);
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.productsState.set(result.items);
        this.totalState.set(result.total);
        this.availableFiltersState.set(result.filters);
        this.loadingState.set(false);
        this.loadingFiltersState.set(false);
        this.hasLoadedState.set(true);
        this.errorState.set(null);
      });
  }

  load(query: CatalogQuery): void {
    this.load$.next(query);
  }
}
