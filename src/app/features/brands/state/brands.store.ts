import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { Subject, catchError, of, switchMap } from 'rxjs';
import { BrandsQuery, BrandsSearchResult, DEFAULT_BRANDS_QUERY } from '../models/brands.model';
import { BrandsRepository } from '../data-access/brands.repository';

const EMPTY_RESULT: BrandsSearchResult = {
  items: [],
  total: 0,
  initials: [],
  featured: null,
};

@Injectable()
export class BrandsStore {
  private readonly repository = inject(BrandsRepository);
  private readonly load$ = new Subject<BrandsQuery>();
  private readonly queryState = signal<BrandsQuery>(DEFAULT_BRANDS_QUERY);
  private readonly resultState = signal<BrandsSearchResult>(EMPTY_RESULT);
  private readonly loadingState = signal(true);
  private readonly errorState = signal<string | null>(null);

  readonly query = this.queryState.asReadonly();
  readonly result = this.resultState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly empty = computed(() => !this.loading() && !this.error() && this.result().items.length === 0);
  readonly totalPages = computed(() => {
    const size = this.query().pageSize;
    return Math.max(1, Math.ceil(this.result().total / size) || 1);
  });

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

  load(query: BrandsQuery): void {
    this.load$.next(query);
  }
}
