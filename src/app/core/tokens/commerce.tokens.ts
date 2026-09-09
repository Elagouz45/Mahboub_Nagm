import { InjectionToken, Signal } from '@angular/core';
import { CartItem, ProductSummary } from '@shared/models/storefront.model';

export interface CartPort {
  readonly count: Signal<number>;
  readonly items: Signal<readonly CartItem[]>;
  add(product: ProductSummary): void;
  remove(productId: string): void;
}

export interface WishlistPort {
  readonly count: Signal<number>;
  readonly items: Signal<readonly ProductSummary[]>;
  readonly ids: Signal<ReadonlySet<string>>;
  toggle(product: ProductSummary): void;
  remove(productId: string): void;
}

export const CART_PORT = new InjectionToken<CartPort>('CART_PORT');
export const WISHLIST_PORT = new InjectionToken<WishlistPort>('WISHLIST_PORT');
