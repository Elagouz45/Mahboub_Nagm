import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountRepository } from '@core/auth/account.repository';
import { AccountOrder, ORDER_STATUS_LABELS, OrderStatus } from '@core/auth/account.models';
import { AuthStore } from '@core/auth/auth.store';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import { formatEgp } from '@shared/utils/format-price.util';

const TIMELINE: readonly { status: OrderStatus; label: string }[] = [
  { status: 'pending-review', label: 'قيد المراجعة' },
  { status: 'shipped', label: 'جاري الشحن' },
  { status: 'delivered', label: 'تم التسليم' },
];

@Component({
  selector: 'app-account-order-detail-page',
  imports: [DatePipe, RouterLink, ErrorStateComponent, SiteImageComponent],
  templateUrl: './account-order-detail-page.component.html',
  styleUrl: './account-order-detail-page.component.scss',
})
export class AccountOrderDetailPageComponent {
  private readonly auth = inject(AuthStore);
  private readonly account = inject(AccountRepository);

  readonly orderId = input.required<string>();
  readonly order = signal<AccountOrder | null | undefined>(undefined);
  readonly statusLabels = ORDER_STATUS_LABELS;
  readonly timeline = TIMELINE;

  constructor() {
    effect(() => {
      const orderId = this.orderId();
      void this.load(orderId);
    });
  }

  formatPrice(value: number): string {
    return formatEgp(value);
  }

  isStepDone(status: OrderStatus): boolean {
    const current = this.order()?.status;
    if (!current) {
      return false;
    }
    return (
      this.timeline.findIndex((step) => step.status === status) <=
      this.timeline.findIndex((step) => step.status === current)
    );
  }

  async load(orderId = this.orderId()): Promise<void> {
    const user = this.auth.user();
    if (!user || !orderId) {
      this.order.set(null);
      return;
    }
    this.order.set(await this.account.getOrder(user.id, orderId));
  }
}
