import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AccountRepository } from '@core/auth/account.repository';
import { AccountAddress, AccountOrder, ORDER_STATUS_LABELS } from '@core/auth/account.models';
import { AuthStore } from '@core/auth/auth.store';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { formatEgp } from '@shared/utils/format-price.util';

@Component({
  selector: 'app-account-overview-page',
  imports: [RouterLink, EmptyStateComponent, DatePipe],
  templateUrl: './account-overview-page.component.html',
  styleUrl: './account-overview-page.component.scss',
})
export class AccountOverviewPageComponent {
  private readonly auth = inject(AuthStore);
  private readonly account = inject(AccountRepository);
  private readonly router = inject(Router);

  readonly firstName = this.auth.firstName;
  readonly orders = signal<readonly AccountOrder[]>([]);
  readonly addresses = signal<readonly AccountAddress[]>([]);
  readonly statusLabels = ORDER_STATUS_LABELS;
  readonly lastOrder = computed(() => this.orders()[0] ?? null);
  readonly defaultAddress = computed(() => this.addresses().find((item) => item.isDefault) ?? null);
  readonly emptyShopper = computed(() => this.orders().length === 0 && this.addresses().length === 0);

  constructor() {
    void this.load();
  }

  formatPrice(value: number): string {
    return formatEgp(value);
  }

  goShop(): void {
    void this.router.navigate(['/products']);
  }

  async load(): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      return;
    }
    const [orders, addresses] = await Promise.all([
      this.account.listOrders(user.id),
      this.account.listAddresses(user.id),
    ]);
    this.orders.set(orders);
    this.addresses.set(addresses);
  }
}
