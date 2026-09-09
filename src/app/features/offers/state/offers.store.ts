import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { EMPTY_AVAILABLE_FILTERS } from '@features/catalog/models/catalog.model';
import { Subject, catchError, of, switchMap } from 'rxjs';
import { OffersQuery, OffersSearchResult, DEFAULT_OFFERS_QUERY } from '../models/offers.model';
import { OffersRepository } from '../data-access/offers.repository';

const EMPTY_RESULT: OffersSearchResult = {
  items: [],
  total: 0,
  filters: EMPTY_AVAILABLE_FILTERS,
  maxDiscountPercent: 0,
  endsAt: null,
};

@Injectable()
export class OffersStore {
  private readonly repository = inject(OffersRepository);
  private readonly load$ = new Subject<OffersQuery>();
  private readonly queryState = signal<OffersQuery>(DEFAULT_OFFERS_QUERY);
  private readonly resultState = signal<OffersSearchResult>(EMPTY_RESULT);
  private readonly loadingState = signal(true);
  private readonly errorState = signal<string | null>(null);

  readonly query = this.queryState.asReadonly();
  readonly result = this.resultState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly empty = computed(() => !this.loading() && !this.error() && this.result().items.length === 0);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.result().total / this.query().pageSize) || 1));

  constructor() {
    this.load$
      .pipe(
        switchMap((query) => {
          this.queryState.set(query);
          this.loadingState.set(true);
          this.errorState.set(null);
          return this.repository.search(query).pipe(
            catchError(() => {
              this.errorState.set(USER_ERROR_MESSAGES.server);
              this.loadingState.set(false);
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        if (!result) {
          this.resultState.set(EMPTY_RESULT);
          return;
        }
        this.resultState.set(result);
        this.loadingState.set(false);
        this.errorState.set(null);
      });
  }

  load(query: OffersQuery): void {
    this.load$.next(query);
  }
}
