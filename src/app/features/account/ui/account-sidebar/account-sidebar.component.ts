import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AccountRepository } from '@core/auth/account.repository';
import { AUTH_COPY } from '@core/auth/auth.constants';
import { AuthStore } from '@core/auth/auth.store';
import { ToastService } from '@core/services/toast.service';
import { WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ACCOUNT_NAV_LINKS } from '../../account-nav';

@Component({
  selector: 'app-account-sidebar',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './account-sidebar.component.html',
  styleUrl: './account-sidebar.component.scss',
})
export class AccountSidebarComponent {
  private readonly auth = inject(AuthStore);
  private readonly accounts = inject(AccountRepository);
  private readonly wishlist = inject(WISHLIST_PORT, { optional: true });
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly links = ACCOUNT_NAV_LINKS;
  readonly displayName = this.auth.displayName;
  readonly initial = this.auth.initial;
  readonly phone = computed(() => this.auth.user()?.phone.trim() ?? '');
  readonly openOrderCount = signal(0);
  readonly favoritesCount = computed(() => this.wishlist?.count() ?? 0);

  constructor() {
    void this.refreshOrderBadge();
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.toast.show(AUTH_COPY.logoutSuccess);
    await this.router.navigateByUrl('/', { replaceUrl: true });
  }

  private async refreshOrderBadge(): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      return;
    }
    try {
      const orders = await this.accounts.listOrders(user.id);
      this.openOrderCount.set(orders.filter((order) => order.status !== 'delivered').length);
    } catch {
      this.openOrderCount.set(0);
    }
    this.cdr.markForCheck();
  }
}
