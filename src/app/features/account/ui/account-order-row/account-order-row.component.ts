import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountOrder } from '@core/auth/account.models';
import { formatEgp } from '@shared/utils/format-price.util';
import { AccountStatusBadgeComponent } from '../account-status-badge/account-status-badge.component';

const DATE_FORMAT = new Intl.DateTimeFormat('ar-EG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

@Component({
  selector: 'app-account-order-row',
  imports: [RouterLink, AccountStatusBadgeComponent],
  templateUrl: './account-order-row.component.html',
  styleUrl: './account-order-row.component.scss',
})
export class AccountOrderRowComponent {
  readonly order = input.required<AccountOrder>();

  readonly thumbs = computed(() => this.order().lines.slice(0, 2));
  readonly itemCount = computed(() =>
    this.order().lines.reduce((sum, line) => sum + line.quantity, 0),
  );
  readonly itemCountLabel = computed(() => (this.itemCount() === 1 ? 'منتج' : 'منتجات'));
  readonly totalLabel = computed(() => formatEgp(this.order().total));
  readonly placedOn = computed(() => DATE_FORMAT.format(this.order().placedAt));
  readonly placedAtIso = computed(() => new Date(this.order().placedAt).toISOString());
}
