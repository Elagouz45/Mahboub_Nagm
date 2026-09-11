import { Component, computed, input } from '@angular/core';
import { formatOffersCount } from '../../data-access/offers-copy.util';

@Component({
  selector: 'app-offers-page-header',
  templateUrl: './offers-page-header.component.html',
  styleUrl: './offers-page-header.component.scss',
})
export class OffersPageHeaderComponent {
  readonly productCount = input(0);
  readonly maxDiscountPercent = input(0);
  readonly loading = input(false);
  readonly empty = input(false);

  readonly countLabel = computed(() => formatOffersCount(this.productCount(), 'available'));
  readonly hasDiscount = computed(() => this.maxDiscountPercent() > 0);
  readonly description = computed(() => {
    if (!this.loading() && this.empty()) {
      return 'لا توجد عروض مطابقة حاليًا. جرّبي تصفية أخرى أو عودي لاحقًا.';
    }
    return 'اكتشفي أفضل الأسعار على أجهزة أصلية بضمان معتمد.';
  });
}
