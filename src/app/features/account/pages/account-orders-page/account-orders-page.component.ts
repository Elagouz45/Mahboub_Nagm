import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountOrder } from '@core/auth/account.models';
import { AccountRepository } from '@core/auth/account.repository';
import { AuthStore } from '@core/auth/auth.store';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { CatalogPaginationComponent } from '@features/catalog/components/catalog-pagination/catalog-pagination.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { AccountOrderRowComponent } from '../../ui/account-order-row/account-order-row.component';
import {
  ACCOUNT_ORDERS_FILTERS,
  AccountOrdersFilter,
  AccountOrdersQuery,
  DEFAULT_ACCOUNT_ORDERS_QUERY,
  ORDERS_PAGE_SIZE,
  accountOrdersQueryToParams,
  countOrdersByFilter,
  orderMatchesSearch,
  orderMatchesStatus,
  parseAccountOrdersQuery,
} from './account-orders-query';

@Component({
  selector: 'app-account-orders-page',
  imports: [
    CatalogPaginationComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    IconComponent,
    AccountOrderRowComponent,
  ],
  templateUrl: './account-orders-page.component.html',
  styleUrl: './account-orders-page.component.scss',
})
export class AccountOrdersPageComponent {
  private readonly auth = inject(AuthStore);
  private readonly account = inject(AccountRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly user = this.auth.user;
  readonly filters = ACCOUNT_ORDERS_FILTERS;
  readonly pageSize = ORDERS_PAGE_SIZE;
  readonly loadErrorMessage = USER_ERROR_MESSAGES.unknown;
  readonly skeletonRows = [1, 2, 3];

  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly orders = signal<readonly AccountOrder[]>([]);
  readonly query = signal<AccountOrdersQuery>(DEFAULT_ACCOUNT_ORDERS_QUERY);
  readonly searchText = signal('');

  readonly initials = computed(() => {
    const current = this.user();
    if (!current) {
      return 'م';
    }
    return `${current.firstName.charAt(0)}${current.lastName.charAt(0)}`.trim() || 'م';
  });

  readonly filterCounts = computed(() => {
    const list = this.orders();
    return {
      all: countOrdersByFilter(list, 'all'),
      'in-progress': countOrdersByFilter(list, 'in-progress'),
      delivered: countOrdersByFilter(list, 'delivered'),
      cancelled: countOrdersByFilter(list, 'cancelled'),
    } as const;
  });

  readonly filtered = computed(() => {
    const { status, q } = this.query();
    return [...this.orders()]
      .filter((order) => orderMatchesStatus(order, status) && orderMatchesSearch(order, q))
      .sort((left, right) => right.placedAt - left.placedAt);
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / this.pageSize)),
  );

  readonly currentPage = computed(() => Math.min(this.query().page, this.totalPages()));

  readonly pagedOrders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  readonly emptyKind = computed(() => {
    if (this.filtered().length > 0) {
      return null;
    }
    if (this.query().q) {
      return 'search' as const;
    }
    return this.query().status;
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const next = parseAccountOrdersQuery(params);
      this.query.set(next);
      this.searchText.set(next.q);
      this.cdr.markForCheck();
    });
    void this.load();
  }

  onSearch(event: Event): void {
    const value = event.target instanceof HTMLInputElement ? event.target.value : '';
    this.searchText.set(value);
    this.navigate({ q: value.trim() }, true);
  }

  onStatus(status: AccountOrdersFilter): void {
    if (status === this.query().status) {
      return;
    }
    this.navigate({ status }, true);
  }

  onPage(page: number): void {
    if (page === this.query().page) {
      return;
    }
    this.navigate({ page });
  }

  goShop(): void {
    void this.router.navigate(['/products']);
  }

  async load(): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.loadError.set(false);
    try {
      this.orders.set(await this.account.listOrders(user.id));
    } catch {
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
      this.cdr.markForCheck();
    }
  }

  private navigate(patch: Partial<AccountOrdersQuery>, resetPage = false): void {
    const current = this.query();
    const next: AccountOrdersQuery = {
      ...current,
      ...patch,
      q: patch.q !== undefined ? patch.q : current.q,
      page: resetPage ? 1 : (patch.page ?? current.page),
    };
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: accountOrdersQueryToParams(next),
    });
  }
}
