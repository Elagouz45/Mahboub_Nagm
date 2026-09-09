import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { Subject, catchError, of, switchMap } from 'rxjs';
import { ServiceCentersRepository } from '../data-access/service-centers.repository';
import {
  DEFAULT_SERVICE_CENTERS_QUERY,
  ServiceCentersQuery,
  ServiceCentersSearchResult,
} from '../models/service-center.model';

const EMPTY_RESULT: ServiceCentersSearchResult = { items: [], total: 0 };

@Injectable()
export class ServiceCentersStore {
  private readonly repository = inject(ServiceCentersRepository);
  private readonly load$ = new Subject<ServiceCentersQuery>();
  private readonly queryState = signal<ServiceCentersQuery>(DEFAULT_SERVICE_CENTERS_QUERY);
  private readonly resultState = signal<ServiceCentersSearchResult>(EMPTY_RESULT);
  private readonly loadingState = signal(true);
  private readonly errorState = signal<string | null>(null);

  readonly query = this.queryState.asReadonly();
  readonly result = this.resultState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly empty = computed(
    () => !this.loading() && !this.error() && this.result().items.length === 0,
  );

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

  load(query: ServiceCentersQuery): void {
    this.load$.next(query);
  }
}
