import { computed, inject, Injectable } from '@angular/core';
import { DemoCommerceService } from '@core/services/demo-commerce.service';
import { ToastService } from '@core/services/toast.service';
import { ProductSummary } from '@shared/models/storefront.model';
@Injectable({ providedIn: 'root' })
export class WishlistStore {
  private readonly commerce = inject(DemoCommerceService);
  private readonly toast = inject(ToastService);
  readonly items = this.commerce.wishlist;
  readonly count = computed(() => this.items().length);
  readonly ids = computed(() => new Set(this.items().map((item) => item.id)));
  toggle(product: ProductSummary): void {
    if (!this.commerce.toggleWishlist(product)) this.toast.show(this.commerce.error());
  }
  remove(id: string): void {
    this.commerce.removeWish(id);
    if (this.commerce.error()) this.toast.show(this.commerce.error());
  }
}
