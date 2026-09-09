import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { Category, ProductSummary, SectionState } from '@shared/models/storefront.model';
import { HomeDataService, HomeOffersPayload } from '../data-access/home-data.service';

const emptyList = <T>(): SectionState<readonly T[]> => ({
  status: 'loading',
  data: [],
  error: null,
});

@Injectable()
export class HomeStore {
  private readonly data = inject(HomeDataService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly categoriesState = signal<SectionState<readonly Category[]>>(emptyList());
  private readonly offersState = signal<SectionState<HomeOffersPayload>>({
    status: 'loading',
    data: { products: [], endsAt: new Date(0) },
    error: null,
  });
  private readonly bestSellersState = signal<SectionState<readonly ProductSummary[]>>(emptyList());

  readonly categories = computed(() => this.categoriesState());
  readonly offers = computed(() => this.offersState());
  readonly bestSellers = computed(() => this.bestSellersState());

  constructor() {
    this.loadCategories();
    this.loadOffers();
    this.loadBestSellers();
  }

  retryCategories(): void {
    this.loadCategories();
  }

  retryOffers(): void {
    this.loadOffers();
  }

  retryBestSellers(): void {
    this.loadBestSellers();
  }

  private loadCategories(): void {
    this.categoriesState.set(emptyList());
    this.data
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) =>
          this.categoriesState.set({
            status: data.length > 0 ? 'success' : 'empty',
            data,
            error: null,
          }),
        error: () =>
          this.categoriesState.set({
            status: 'error',
            data: [],
            error: USER_ERROR_MESSAGES.server,
          }),
      });
  }

  private loadOffers(): void {
    this.offersState.set({
      status: 'loading',
      data: { products: [], endsAt: new Date(0) },
      error: null,
    });
    this.data
      .getOffers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) =>
          this.offersState.set({
            status: data.products.length > 0 ? 'success' : 'empty',
            data,
            error: null,
          }),
        error: () =>
          this.offersState.set({
            status: 'error',
            data: { products: [], endsAt: new Date(0) },
            error: USER_ERROR_MESSAGES.server,
          }),
      });
  }

  private loadBestSellers(): void {
    this.bestSellersState.set(emptyList());
    this.data
      .getBestSellers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) =>
          this.bestSellersState.set({
            status: data.length > 0 ? 'success' : 'empty',
            data,
            error: null,
          }),
        error: () =>
          this.bestSellersState.set({
            status: 'error',
            data: [],
            error: USER_ERROR_MESSAGES.server,
          }),
      });
  }
}
