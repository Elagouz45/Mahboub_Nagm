import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AccountAddress, AccountOrder, ADDRESS_LABELS } from '@core/auth/account.models';
import { AccountRepository } from '@core/auth/account.repository';
import { AUTH_COPY } from '@core/auth/auth.constants';
import { AuthStore } from '@core/auth/auth.store';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { ToastService } from '@core/services/toast.service';
import { WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { EGYPT_GOVERNORATES } from '@features/service-centers/data-access/egypt-governorates';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { AccountOrderRowComponent } from '../../ui/account-order-row/account-order-row.component';

@Component({
  selector: 'app-account-overview-page',
  imports: [
    RouterLink,
    EmptyStateComponent,
    ErrorStateComponent,
    IconComponent,
    AccountOrderRowComponent,
  ],
  templateUrl: './account-overview-page.component.html',
  styleUrl: './account-overview-page.component.scss',
})
export class AccountOverviewPageComponent {
  private readonly auth = inject(AuthStore);
  private readonly account = inject(AccountRepository);
  private readonly wishlist = inject(WISHLIST_PORT, { optional: true });
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly user = this.auth.user;
  readonly firstName = this.auth.firstName;
  readonly displayName = this.auth.displayName;
  readonly addressLabels = ADDRESS_LABELS;
  readonly loadErrorMessage = USER_ERROR_MESSAGES.unknown;

  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly orders = signal<readonly AccountOrder[]>([]);
  readonly addresses = signal<readonly AccountAddress[]>([]);

  readonly initials = computed(() => {
    const current = this.user();
    if (!current) {
      return 'م';
    }
    return `${current.firstName.charAt(0)}${current.lastName.charAt(0)}`.trim() || 'م';
  });
  readonly phone = computed(() => this.user()?.phone.trim() ?? '');
  readonly email = computed(() => this.user()?.email.trim() ?? '');
  readonly favoritesCount = computed(() => this.wishlist?.count() ?? 0);
  readonly openOrderCount = computed(
    () => this.orders().filter((order) => order.status !== 'delivered').length,
  );
  readonly completedOrderCount = computed(
    () => this.orders().filter((order) => order.status === 'delivered').length,
  );
  readonly recentOrders = computed(() =>
    [...this.orders()].sort((left, right) => right.placedAt - left.placedAt).slice(0, 2),
  );
  readonly defaultAddress = computed(
    () => this.addresses().find((item) => item.isDefault) ?? null,
  );

  constructor() {
    void this.load();
  }

  governorateLabel(slug: string): string {
    return EGYPT_GOVERNORATES.find((item) => item.slug === slug)?.label ?? slug;
  }

  goShop(): void {
    void this.router.navigate(['/products']);
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.toast.show(AUTH_COPY.logoutSuccess);
    await this.router.navigateByUrl('/', { replaceUrl: true });
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
      const [orders, addresses] = await Promise.all([
        this.account.listOrders(user.id),
        this.account.listAddresses(user.id),
      ]);
      this.orders.set(orders);
      this.addresses.set(addresses);
    } catch {
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
      this.cdr.markForCheck();
    }
  }
}
