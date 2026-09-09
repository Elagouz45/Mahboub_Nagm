import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { CATEGORY_LABELS, VALID_CATEGORY_SLUGS } from '@features/catalog/models/catalog.model';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import { Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { EGYPT_GOVERNORATES } from '../../data-access/egypt-governorates';
import {
  mergeServiceCentersQuery,
  parseServiceCentersQuery,
  serviceCentersQueryToParams,
} from '../../data-access/service-centers-query.util';
import { ServiceCentersQuery } from '../../models/service-center.model';
import { ServiceCentersStore } from '../../state/service-centers.store';

@Component({
  selector: 'app-service-centers-page',
  imports: [
    RouterLink,
    IconComponent,
    SiteImageComponent,
    PageBreadcrumbComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingSpinnerComponent,
  ],
  providers: [ServiceCentersStore],
  templateUrl: './service-centers-page.component.html',
  styleUrl: './service-centers-page.component.scss',
})
export class ServiceCentersPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly searchInput$ = new Subject<string>();

  readonly store = inject(ServiceCentersStore);
  readonly ctaImage = SITE_IMAGE_ASSETS.serviceCenters.cta;
  readonly errorMessage = USER_ERROR_MESSAGES.server;
  readonly governorates = EGYPT_GOVERNORATES;
  readonly categories = VALID_CATEGORY_SLUGS.map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug] ?? slug,
  }));
  readonly searchText = signal('');
  readonly breadcrumb = [
    { label: 'الرئيسية', path: '/' },
    { label: 'مراكز الصيانة' },
  ];

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const query = parseServiceCentersQuery(params);
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
        this.navigate({ q });
      });
  }

  onSearchInput(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.searchText.set(target.value);
      this.searchInput$.next(target.value);
    }
  }

  onGovernorate(event: Event): void {
    this.navigate({ governorate: (event.target as HTMLSelectElement).value });
  }

  onCategory(event: Event): void {
    this.navigate({ category: (event.target as HTMLSelectElement).value });
  }

  retry(): void {
    this.store.load(this.store.query());
  }

  private navigate(patch: Partial<ServiceCentersQuery>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: serviceCentersQueryToParams(mergeServiceCentersQuery(this.store.query(), patch)),
      replaceUrl: true,
    });
  }
}
