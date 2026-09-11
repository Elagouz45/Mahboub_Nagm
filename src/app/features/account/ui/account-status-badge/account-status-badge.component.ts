import { Component, computed, input } from '@angular/core';
import { OrderStatus } from '@core/auth/account.models';
import { accountOrderStatusView, AccountOrderStatusTone } from './account-order-status';

@Component({
  selector: 'app-account-status-badge',
  template: `<span class="status-badge" [attr.data-tone]="tone()">{{ label() }}</span>`,
  styleUrl: './account-status-badge.component.scss',
})
export class AccountStatusBadgeComponent {
  readonly status = input.required<OrderStatus>();
  readonly view = computed(() => accountOrderStatusView(this.status()));
  readonly label = computed(() => this.view().label);
  readonly tone = computed((): AccountOrderStatusTone => this.view().tone);
}
