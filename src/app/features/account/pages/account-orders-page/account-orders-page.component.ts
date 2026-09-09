import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AccountRepository } from '@core/auth/account.repository';
import { AccountOrder, OrderStatus, ORDER_STATUS_LABELS } from '@core/auth/account.models';
import { AuthStore } from '@core/auth/auth.store';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { formatEgp } from '@shared/utils/format-price.util';

type SortDir = 'newest' | 'oldest';

@Component({
  selector: 'app-account-orders-page',
  imports: [RouterLink, EmptyStateComponent, DatePipe],
  templateUrl: './account-orders-page.component.html',
  styleUrl: './account-orders-page.component.scss',
})
export class AccountOrdersPageComponent {
  private readonly auth = inject(AuthStore);
  private readonly account = inject(AccountRepository);
  private readonly router = inject(Router);

  readonly statusLabels = ORDER_STATUS_LABELS;
  readonly statuses: readonly OrderStatus[] = ['pending-review', 'shipped', 'delivered'];
  readonly query = signal('');
  readonly status = signal<OrderStatus | 'all'>('all');
  readonly sort = signal<SortDir>('newest');
  readonly orders = signal<readonly AccountOrder[]>([]);
  readonly filtered = computed(() => {
    const term = this.query().trim();
    const status = this.status();
    const list = this.orders().filter((order) => {
      const matchesStatus = status === 'all' || order.status === status;
      const haystack = `${order.number} ${order.lines.map((line) => line.title).join(' ')}`;
      const matchesQuery = !term || haystack.includes(term);
      return matchesStatus && matchesQuery;
    });
    return [...list].sort((a, b) =>
      this.sort() === 'newest' ? b.placedAt - a.placedAt : a.placedAt - b.placedAt,
    );
  });

  constructor() {
    void this.load();
  }

  formatPrice(value: number): string {
    return formatEgp(value);
  }

  onSearch(event: Event): void {
    const target = event.target;
    this.query.set(target instanceof HTMLInputElement ? target.value : '');
  }

  onStatus(event: Event): void {
    const target = event.target;
    this.status.set(target instanceof HTMLSelectElement ? (target.value as OrderStatus | 'all') : 'all');
  }

  onSort(event: Event): void {
    const target = event.target;
    this.sort.set(target instanceof HTMLSelectElement ? (target.value as SortDir) : 'newest');
  }

  goShop(): void {
    void this.router.navigate(['/products']);
  }

  private async load(): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      return;
    }
    this.orders.set(await this.account.listOrders(user.id));
  }
}
