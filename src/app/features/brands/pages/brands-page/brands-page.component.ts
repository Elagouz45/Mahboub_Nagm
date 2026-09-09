import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { CATEGORY_LABELS, CatalogPageSize, VALID_CATEGORY_SLUGS } from '@features/catalog/models/catalog.model';
import { CatalogPaginationComponent } from '@features/catalog/components/catalog-pagination/catalog-pagination.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
import { PageTrustStripComponent } from '@shared/components/page-trust-strip/page-trust-strip.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import { Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { brandsQueryToParams, parseBrandsQuery } from '../../data-access/brands-query.util';
import { BrandsQuery, DEFAULT_BRANDS_QUERY } from '../../models/brands.model';
import { BrandsStore } from '../../state/brands.store';

@Component({
  selector: 'app-brands-page',
  imports: [
    RouterLink,
    IconComponent,
    SiteImageComponent,
    PageBreadcrumbComponent,
    PageTrustStripComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    CatalogPaginationComponent,
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
  readonly hero = SITE_IMAGE_ASSETS.brands.hero;
  readonly errorMessage = USER_ERROR_MESSAGES.server;
  readonly breadcrumb = [
    { label: 'الرئيسية', path: '/' },
    { label: 'العلامات التجارية' },
  ];
  readonly trustItems = [
    { label: 'ضمان معتمد', icon: 'shield' as const },
    { label: 'منتجات أصلية', icon: 'badge-check' as const },
    { label: 'صيانة موثوقة', icon: 'headset' as const },
  ];
  readonly categories = VALID_CATEGORY_SLUGS.map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug] ?? slug,
  }));
  readonly searchText = signal('');

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

  onSearchInput(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.onSearch(target.value);
    }
  }

  onSearch(value: string): void {
    this.searchText.set(value);
    this.searchInput$.next(value);
  }

  onCategory(event: Event): void {
    this.navigate({ category: (event.target as HTMLSelectElement).value }, true);
  }

  onInitial(value: string): void {
    this.navigate({ initial: this.store.query().initial === value ? '' : value }, true);
  }

  onSort(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.navigate({ sort: value === 'relevance' ? 'relevance' : 'name' }, true);
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
