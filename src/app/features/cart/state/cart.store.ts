import { computed, inject, Injectable, signal } from '@angular/core';
import { BrowserStorageService } from '@core/services/browser-storage.service';
import { ToastService } from '@core/services/toast.service';
import { CartItem, ProductSummary } from '@shared/models/storefront.model';

const STORAGE_KEY = 'mahbub-najm.cart';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly storage = inject(BrowserStorageService);
  private readonly toast = inject(ToastService);
  private readonly state = signal<readonly CartItem[]>(this.storage.readJson<CartItem[]>(STORAGE_KEY) ?? []);

  readonly items = computed(() => this.state());
  readonly count = computed(() => this.state().reduce((total, item) => total + item.quantity, 0));

  add(product: ProductSummary): void {
    this.state.update((items) => {
    const index = items.findIndex((item) => item.product.sku === product.sku);
      if (index === -1) {
        return [...items, { product, quantity: 1 }];
      }

      return items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
    this.persist();
    this.toast.show('تمت إضافة المنتج إلى السلة', {
      actionLabel: 'عرض السلة',
      actionLink: '/cart',
    });
  }

  remove(productId: string): void {
    this.state.update((items) => items.filter((item) => item.product.id !== productId));
    this.persist();
  }

  private persist(): void {
    this.storage.writeJson(STORAGE_KEY, this.state());
  }
}
