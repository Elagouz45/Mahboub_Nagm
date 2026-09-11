import { afterNextRender, computed, inject, Injectable, signal } from '@angular/core';
import { AccountAddress, AccountServiceRequest } from '@core/auth/account.models';
import { MOCK_CATALOG_PRODUCTS } from '@features/catalog/data-access/catalog-mock.service';
import { ContactRequest } from '@features/contact/models/contact.model';
import { EGYPT_GOVERNORATES } from '@core/data/egypt-governorates';
import { CartItem, ProductSummary } from '@shared/models/storefront.model';
import { BrowserStorageService } from './browser-storage.service';

import {
  DEMO_COMMERCE_KEY,
  DEMO_SHIPPING,
  MAX_CART_QUANTITY,
} from '@core/config/demo-commerce.config';
import {
  CommerceData,
  DemoMessage,
  DemoOrder,
  emptyData,
  isAddress,
  isCartItem,
  isMessage,
  isOrder,
  isProduct,
  isRecord,
} from '@core/models/demo-commerce.model';
export {
  DEMO_COMMERCE_KEY,
  DEMO_SHIPPING,
  MAX_CART_QUANTITY,
} from '@core/config/demo-commerce.config';

export function purchasable(product: ProductSummary): boolean {
  return product.stockStatus !== 'out-of-stock' && product.stockStatus !== 'coming-soon';
}

@Injectable({ providedIn: 'root' })
export class DemoCommerceService {
  private readonly storage = inject(BrowserStorageService);
  private readonly data = signal<CommerceData>(emptyData());
  private loaded = false;
  constructor() {
    afterNextRender(() => this.ensureLoaded());
  }
  private ensureLoaded(): void {
    if (this.loaded) return;
    this.loaded = true;
    this.data.set(this.read());
  }
  private readonly ownerState = signal('guest');
  readonly owner = this.ownerState.asReadonly();
  readonly error = signal('');
  readonly cart = computed(() => this.data().carts[this.owner()] ?? []);
  readonly wishlist = computed(() => this.data().wishlists[this.owner()] ?? []);
  readonly subtotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );

  switchUser(userId: string | null): void {
    this.ensureLoaded();
    const owner = userId ?? 'guest';
    const previous = this.owner();
    this.ownerState.set(owner);
    if (owner === previous || previous !== 'guest' || owner === 'guest') return;
    const current = this.data();
    const merged = [...(current.carts[owner] ?? [])];
    for (const item of current.carts['guest'] ?? []) {
      const index = merged.findIndex((line) => line.product.sku === item.product.sku);
      if (index < 0) merged.push(item);
      else
        merged[index] = {
          ...merged[index],
          quantity: Math.min(MAX_CART_QUANTITY, merged[index].quantity + item.quantity),
        };
    }
    const wishes = [...(current.wishlists[owner] ?? [])];
    for (const product of current.wishlists['guest'] ?? []) {
      if (!wishes.some((item) => item.sku === product.sku)) wishes.push(product);
    }
    if (!(current.carts['guest']?.length || current.wishlists['guest']?.length)) return;
    this.commit({
      ...current,
      carts: { ...current.carts, [owner]: merged, guest: [] },
      wishlists: { ...current.wishlists, [owner]: wishes, guest: [] },
    });
  }

  add(product: ProductSummary, quantity = 1): boolean {
    this.ensureLoaded();
    const canonical = MOCK_CATALOG_PRODUCTS.find((item) => item.sku === product.sku);
    if (!canonical || !purchasable(canonical))
      return this.fail('هذا المنتج غير متاح للشراء حاليًا.');
    const items = [...this.cart()];
    const index = items.findIndex((item) => item.product.sku === canonical.sku);
    const nextQuantity = (index < 0 ? 0 : items[index].quantity) + quantity;
    if (!Number.isInteger(quantity) || quantity < 1 || nextQuantity > MAX_CART_QUANTITY)
      return this.fail('الحد الأقصى التجريبي 10 وحدات لكل منتج.');
    const next = { product: canonical, quantity: nextQuantity };
    if (index < 0) items.push(next);
    else items[index] = next;
    return this.saveCart(items);
  }

  setQuantity(id: string, quantity: number): boolean {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CART_QUANTITY)
      return this.fail('اختر كمية من 1 إلى 10.');
    return this.saveCart(
      this.cart().map((item) => (item.product.id === id ? { ...item, quantity } : item)),
    );
  }
  remove(id: string): boolean {
    return this.saveCart(this.cart().filter((item) => item.product.id !== id));
  }
  toggleWishlist(product: ProductSummary): boolean {
    this.ensureLoaded();
    const canonical = MOCK_CATALOG_PRODUCTS.find((item) => item.sku === product.sku);
    if (!canonical) return false;
    const items = this.wishlist().some((item) => item.id === canonical.id)
      ? this.wishlist().filter((item) => item.id !== canonical.id)
      : [...this.wishlist(), canonical];
    return this.commit({
      ...this.data(),
      wishlists: { ...this.data().wishlists, [this.owner()]: items },
    });
  }
  removeWish(id: string): void {
    this.commit({
      ...this.data(),
      wishlists: {
        ...this.data().wishlists,
        [this.owner()]: this.wishlist().filter((item) => item.id !== id),
      },
    });
  }

  placeOrder(address: AccountAddress, checkoutKey: string): DemoOrder | null {
    this.ensureLoaded();
    const previous = this.data().orders.find(
      (order) => order.checkoutKey === checkoutKey && order.userId === this.owner(),
    );
    if (previous) return previous;
    if (!this.cart().length) {
      this.fail('السلة فارغة. أضف منتجات قبل إتمام الطلب.');
      return null;
    }
    if (!isAddress(address) || !DEMO_SHIPPING[address.governorateSlug]) {
      this.fail('راجع عنوان التوصيل والمحافظة.');
      return null;
    }
    const refreshed: CartItem[] = [];
    let changed = false;
    for (const item of this.cart()) {
      const product = MOCK_CATALOG_PRODUCTS.find((p) => p.sku === item.product.sku);
      if (!product || !purchasable(product)) {
        this.fail(`المنتج ${item.product.title} لم يعد متاحًا. احذفه من السلة للمتابعة.`);
        return null;
      }
      changed ||= product.price !== item.product.price;
      refreshed.push({ product, quantity: item.quantity });
    }
    if (changed) {
      if (this.saveCart(refreshed))
        this.fail('تغير سعر أحد المنتجات. تم تحديث الملخص؛ راجعه ثم أكد الطلب مرة أخرى.');
      return null;
    }
    const id = globalThis.crypto.randomUUID();
    const governorate = EGYPT_GOVERNORATES.find((g) => g.slug === address.governorateSlug)!;
    const shippingFee = DEMO_SHIPPING[address.governorateSlug];
    const order: DemoOrder = {
      id,
      checkoutKey,
      userId: this.owner(),
      number: `DEMO-${id.slice(0, 8).toUpperCase()}`,
      status: 'pending-review',
      placedAt: Date.now(),
      paymentLabel: 'الدفع عند الاستلام — تجريبي',
      address: { ...address },
      shippingAddressId: address.id,
      shippingLabel: `${address.recipientName} — ${address.phone} — ${governorate.label}، ${address.city}، ${address.street} ${address.details}`,
      lines: refreshed.map(({ product, quantity }) => ({
        productId: product.id,
        slug: product.slug,
        title: product.title,
        imageSrc: product.imageSrc,
        imageAlt: product.imageAlt,
        quantity,
        unitPrice: product.price,
      })),
      subtotal: this.subtotal(),
      shippingFee,
      total: this.subtotal() + shippingFee,
    };
    // Order and cart are persisted together: a failed write cannot lose the basket.
    return this.commit({
      ...this.data(),
      orders: [...this.data().orders, order],
      carts: { ...this.data().carts, [this.owner()]: [] },
    })
      ? order
      : null;
  }
  orders(userId: string): readonly DemoOrder[] {
    this.ensureLoaded();
    return this.data()
      .orders.filter((o) => o.userId === userId)
      .sort((a, b) => b.placedAt - a.placedAt);
  }
  order(id: string): DemoOrder | null {
    return this.data().orders.find((o) => o.id === id && o.userId === this.owner()) ?? null;
  }
  message(id: string): DemoMessage | null {
    return (
      this.data().messages.find(
        (message) => message.id === id && message.userId === this.owner(),
      ) ?? null
    );
  }

  submitMessage(request: ContactRequest): string | null {
    this.ensureLoaded();
    const message: DemoMessage = {
      ...request,
      attachments: [],
      id: `DEMO-${globalThis.crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      userId: this.owner(),
      createdAt: Date.now(),
    };
    return this.commit({ ...this.data(), messages: [...this.data().messages, message] })
      ? message.id
      : null;
  }
  serviceRequests(userId: string): readonly AccountServiceRequest[] {
    this.ensureLoaded();
    return this.data()
      .messages.filter((m) => m.userId === userId && m.type === 'maintenance')
      .map((m) => ({
        id: m.id,
        userId,
        title: `طلب صيانة تجريبي ${m.id}`,
        productTitle: m.deviceType,
        status: 'received' as const,
        createdAt: m.createdAt,
        note: m.issue + ' — ' + m.message,
      }))
      .reverse();
  }
  private saveCart(items: readonly CartItem[]): boolean {
    return this.commit({ ...this.data(), carts: { ...this.data().carts, [this.owner()]: items } });
  }
  private fail(message: string): false {
    this.error.set(message);
    return false;
  }
  private commit(data: CommerceData): boolean {
    try {
      this.storage.writeLocalChecked(DEMO_COMMERCE_KEY, data);
      this.data.set(data);
      this.error.set('');
      return true;
    } catch {
      return this.fail(
        'تعذر حفظ البيانات على هذا المتصفح. أتح التخزين أو وفر مساحة ثم حاول مجددًا؛ لم يتم تأكيد العملية.',
      );
    }
  }
  private read(): CommerceData {
    const raw: unknown = this.storage.readLocalJson(DEMO_COMMERCE_KEY);
    if (isRecord(raw) && raw['schemaVersion'] === 1) {
      const carts: CommerceData['carts'] = {};
      const wishlists: CommerceData['wishlists'] = {};
      if (isRecord(raw['carts']))
        for (const [owner, value] of Object.entries(raw['carts']))
          if (Array.isArray(value)) carts[owner] = value.filter(isCartItem);
      if (isRecord(raw['wishlists']))
        for (const [owner, value] of Object.entries(raw['wishlists']))
          if (Array.isArray(value)) wishlists[owner] = value.filter(isProduct);
      return {
        schemaVersion: 1,
        carts,
        wishlists,
        orders: Array.isArray(raw['orders']) ? raw['orders'].filter(isOrder) : [],
        messages: Array.isArray(raw['messages']) ? raw['messages'].filter(isMessage) : [],
      };
    }
    const legacyCart: unknown = this.storage.readJson('mahbub-najm.cart');
    const legacyWishes: unknown = this.storage.readJson('mahbub-najm.wishlist');
    return {
      ...emptyData(),
      carts: { guest: Array.isArray(legacyCart) ? legacyCart.filter(isCartItem) : [] },
      wishlists: { guest: Array.isArray(legacyWishes) ? legacyWishes.filter(isProduct) : [] },
    };
  }
}
