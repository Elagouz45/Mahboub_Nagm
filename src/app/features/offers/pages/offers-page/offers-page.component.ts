import { ChangeDetectorRef, Component, computed, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { CatalogPaginationComponent } from '@features/catalog/components/catalog-pagination/catalog-pagination.component';
import { ProductGridComponent } from '@features/catalog/components/product-grid/product-grid.component';
import { CATEGORY_LABELS, CatalogPageSize, VALID_CATEGORY_SLUGS } from '@features/catalog/models/catalog.model';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
import { PageTrustStripComponent } from '@shared/components/page-trust-strip/page-trust-strip.component';
import { OffersPageHeaderComponent } from '../../components/offers-page-header/offers-page-header.component';
import { formatOffersCount } from '../../data-access/offers-copy.util';
import { resolveOffersMaxDiscount } from '../../data-access/offers-discount.util';
import { offersQueryToParams, parseOffersQuery } from '../../data-access/offers-query.util';
import {
  DEFAULT_OFFERS_QUERY,
  OFFER_SORT_LABELS,
  OFFER_TYPE_LABELS,
  OFFER_TYPES,
  OfferPageSort,
  OffersQuery,
  OfferType,
} from '../../models/offers.model';
import { OffersStore } from '../../state/offers.store';

@Component({
  selector: 'app-offers-page',
  imports: [
    PageBreadcrumbComponent,
    PageTrustStripComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    ProductGridComponent,
    CatalogPaginationComponent,
    OffersPageHeaderComponent,
    IconComponent,
  ],
  providers: [OffersStore],
  templateUrl: './offers-page.component.html',
  styleUrl: './offers-page.component.scss',
})
export class OffersPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly store = inject(OffersStore);
  readonly errorMessage = USER_ERROR_MESSAGES.server;
  readonly types = OFFER_TYPES;
  readonly typeLabels = OFFER_TYPE_LABELS;
  readonly sortLabels = OFFER_SORT_LABELS;
  readonly sorts = Object.keys(OFFER_SORT_LABELS) as OfferPageSort[];
  readonly categories = VALID_CATEGORY_SLUGS.map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug] ?? slug,
  }));
  readonly breadcrumb = [
    { label: 'الرئيسية', path: '/' },
    { label: 'العروض' },
  ];
  readonly trustItems = [
    { label: 'ضمان معتمد', icon: 'shield' as const },
    { label: 'منتجات أصلية', icon: 'badge-check' as const },
    { label: 'صيانة موثوقة', icon: 'headset' as const },
  ];
  readonly filtersOpen = signal(false);

  readonly displayMaxDiscount = computed(() => {
    const result = this.store.result();
    return resolveOffersMaxDiscount(result.maxDiscountPercent, result.items);
  });

  readonly toolbarCountLabel = computed(() => formatOffersCount(this.store.result().total, 'short'));

  readonly activeFilterCount = computed(() => {
    const query = this.store.query();
    return (query.type !== 'all' ? 1 : 0) + (query.category ? 1 : 0) + query.brands.length;
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.store.load(parseOffersQuery(params));
      this.cdr.markForCheck();
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.filtersOpen()) {
      this.filtersOpen.set(false);
    }
  }

  selectedBrand(): string {
    return this.store.query().brands[0] || '';
  }

  toggleFilters(): void {
    this.filtersOpen.update((open) => !open);
  }

  onType(type: OfferType): void {
    this.navigate({ type }, true);
  }

  onCategory(event: Event): void {
    this.navigate({ category: (event.target as HTMLSelectElement).value }, true);
  }

  onBrand(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.navigate({ brands: value ? [value] : [] }, true);
  }

  onSort(event: Event): void {
    this.navigate({ sort: (event.target as HTMLSelectElement).value as OfferPageSort }, true);
  }

  onPage(page: number): void {
    this.navigate({ page });
  }

  onPageSize(pageSize: CatalogPageSize): void {
    this.navigate({ pageSize }, true);
  }

  retry(): void {
    this.store.load(this.store.query());
  }

  clearFilters(): void {
    this.filtersOpen.set(false);
    this.navigate({ ...DEFAULT_OFFERS_QUERY, pageSize: this.store.query().pageSize }, true);
  }

  private navigate(patch: Partial<OffersQuery>, resetPage = false): void {
    const current = this.store.query();
    const next: OffersQuery = {
      ...current,
      ...patch,
      page: resetPage ? 1 : (patch.page ?? current.page),
    };
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: offersQueryToParams(next),
    });
  }
}
