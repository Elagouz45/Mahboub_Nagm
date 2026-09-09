import { computed, inject, Injectable, signal } from '@angular/core';
import { BrowserStorageService } from '@core/services/browser-storage.service';
import { ProductSummary } from '@shared/models/storefront.model';

const STORAGE_KEY = 'mahbub-najm.wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistStore {
  private readonly storage = inject(BrowserStorageService);
  private readonly state = signal<readonly ProductSummary[]>(
    this.storage.readJson<ProductSummary[]>(STORAGE_KEY) ?? [],
  );

  readonly items = computed(() => this.state());
  readonly count = computed(() => this.state().length);
  readonly ids = computed(() => new Set(this.state().map((item) => item.id)));

  toggle(product: ProductSummary): void {
    this.state.update((items) => {
      const exists = items.some((item) => item.id === product.id);
      return exists ? items.filter((item) => item.id !== product.id) : [...items, product];
    });
    this.persist();
  }

  remove(productId: string): void {
    this.state.update((items) => items.filter((item) => item.id !== productId));
    this.persist();
  }

  private persist(): void {
    this.storage.writeJson(STORAGE_KEY, this.state());
  }
}
