import { computed, inject, Injectable } from '@angular/core';
import { DemoCommerceService } from '@core/services/demo-commerce.service';
import { ToastService } from '@core/services/toast.service';
import { ProductSummary } from '@shared/models/storefront.model';
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly commerce = inject(DemoCommerceService);
  private readonly toast = inject(ToastService);
  readonly items = this.commerce.cart;
  readonly subtotal = this.commerce.subtotal;
  readonly error = this.commerce.error;
  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  add(product: ProductSummary, quantity = 1): void {
    if (this.commerce.add(product, quantity))
      this.toast.show('تمت إضافة المنتج إلى السلة', {
        actionLabel: 'عرض السلة',
        actionLink: '/cart',
      });
    else this.toast.show(this.error());
  }
  remove(id: string): void {
    this.commerce.remove(id);
  }
  setQuantity(id: string, quantity: number): void {
    this.commerce.setQuantity(id, quantity);
  }
}
