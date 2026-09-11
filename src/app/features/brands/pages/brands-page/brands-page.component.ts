import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { CatalogPageSize } from '@features/catalog/models/catalog.model';
import { CatalogPaginationComponent } from '@features/catalog/components/catalog-pagination/catalog-pagination.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
import { Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { BrandCardComponent } from '../../components/brand-card/brand-card.component';
import { BrandsFiltersComponent } from '../../components/brands-filters/brands-filters.component';
import { BrandsPageHeaderComponent } from '../../components/brands-page-header/brands-page-header.component';
import { BrandsTrustStripComponent } from '../../components/brands-trust-strip/brands-trust-strip.component';
import { formatBrandsCount } from '../../data-access/brands-copy.util';
import { brandsQueryToParams, parseBrandsQuery } from '../../data-access/brands-query.util';
import { BrandsQuery, DEFAULT_BRANDS_QUERY } from '../../models/brands.model';
import { BrandsStore } from '../../state/brands.store';

@Component({
  selector: 'app-brands-page',
  imports: [
    PageBreadcrumbComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    CatalogPaginationComponent,
    BrandsPageHeaderComponent,
    BrandsFiltersComponent,
    BrandCardComponent,
    BrandsTrustStripComponent,
  ],
  providers: [BrandsStore],
  templateUrl: './brands-page.component.html',
  styleUrl: './brands-page.component.scss',
})
export class BrandsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly searchInput$ = new Subject<string>();

  readonly store = inject(BrandsStore);
  readonly errorMessage = USER_ERROR_MESSAGES.server;
  readonly skeletons = [1, 2, 3, 4, 5, 6];
  readonly searchText = signal('');
  readonly breadcrumb = [
    { label: 'الرئيسية', path: '/' },
    { label: 'العلامات التجارية' },
  ];
  readonly countLabel = computed(() => formatBrandsCount(this.store.result().total, 'badge'));

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const query = parseBrandsQuery(params);
      this.searchText.set(query.q);
      this.store.load(query);
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

  onSearch(value: string): void {
    this.searchText.set(value);
    this.searchInput$.next(value);
  }

  onCategory(value: string): void {
    this.navigate({ category: value }, true);
  }

  onInitial(value: string): void {
    this.navigate({ initial: value }, true);
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

  showAll(): void {
    this.searchText.set('');
    this.navigate({ ...DEFAULT_BRANDS_QUERY, pageSize: this.store.query().pageSize }, true);
  }

  private navigate(patch: Partial<BrandsQuery>, resetPage = false): void {
    const current = this.store.query();
    const next: BrandsQuery = {
      ...current,
      ...patch,
      page: resetPage ? 1 : (patch.page ?? current.page),
    };
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: brandsQueryToParams(next),
    });
  }
}
