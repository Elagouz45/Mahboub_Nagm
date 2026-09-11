import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CART_PORT, WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { PriceDisplayComponent } from '@shared/components/price-display/price-display.component';
import { RatingDisplayComponent } from '@shared/components/rating-display/rating-display.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import { ProductSummary, StockStatus } from '@shared/models/storefront.model';

export interface ProductCardBadge {
  readonly kind: 'discount' | 'offer' | 'bestseller';
  readonly label: string;
}

const STOCK_COPY: Record<StockStatus, string> = {
  'in-stock': 'متوفر',
  'out-of-stock': 'غير متوفر',
  'available-to-order': 'متاح للطلب',
  'coming-soon': 'متاح قريبًا',
};

const LOW_STOCK_MAX = 5;
const ADD_BUSY_MS = 450;
const ADDED_MS = 1600;
const WISH_BUSY_MS = 280;

@Component({
  selector: 'app-product-card',
  imports: [
    RouterLink,
    IconComponent,
    SiteImageComponent,
    PriceDisplayComponent,
    RatingDisplayComponent,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  host: {
    '[class.product-card--list]': 'layout() === "list" && !skeleton()',
    '[class.product-card--skeleton]': 'skeleton()',
  },
})
export class ProductCardComponent {
  private readonly cart = inject(CART_PORT, { optional: true });
  private readonly wishlist = inject(WISHLIST_PORT, { optional: true });
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private lastAddAt = 0;
  private addingTimer: ReturnType<typeof setTimeout> | undefined;
  private addedTimer: ReturnType<typeof setTimeout> | undefined;
  private wishingTimer: ReturnType<typeof setTimeout> | undefined;

  readonly product = input<ProductSummary | undefined>(undefined);
  readonly layout = input<'grid' | 'list'>('grid');
  readonly skeleton = input(false);
  readonly priority = input(false);
  readonly adding = signal(false);
  readonly added = signal(false);
  readonly wishing = signal(false);
  readonly addFailed = signal(false);

  readonly item = computed(() => this.product());
  readonly wishlisted = computed(() => {
    const id = this.item()?.id;
    return Boolean(id && this.wishlist?.ids().has(id));
  });
  readonly inCart = computed(() => {
    const id = this.item()?.id;
    return Boolean(id && this.cart?.items().some((line) => line.product.id === id));
  });
  readonly discountPercent = computed(() => {
    const product = this.item();
    if (!product) {
      return null;
    }
    if (product.discountPercent && product.discountPercent > 0) {
      return Math.round(product.discountPercent);
    }
    if (product.oldPrice && product.oldPrice > product.price) {
      return Math.round((1 - product.price / product.oldPrice) * 100);
    }
    return null;
  });
  readonly badges = computed((): readonly ProductCardBadge[] => {
    const product = this.item();
    if (!product) {
      return [];
    }
    const next: ProductCardBadge[] = [];
    const discount = this.discountPercent();
    if (discount) {
      next.push({ kind: 'discount', label: `خصم ${discount}٪` });
    }
    if (product.isTodaysOffer && next.length < 2) {
      next.push({ kind: 'offer', label: 'عرض اليوم' });
    }
    if (product.isBestseller && next.length < 2) {
      next.push({ kind: 'bestseller', label: 'الأكثر طلبًا' });
    }
    return next;
  });
  readonly canPurchase = computed(() => {
    const status = this.item()?.stockStatus;
    return status !== 'out-of-stock' && status !== 'coming-soon';
  });
  readonly stockTone = computed<'ok' | 'low' | 'unavailable'>(() => {
    if (!this.canPurchase()) {
      return 'unavailable';
    }
    const qty = this.item()?.stockQuantity;
    if (typeof qty === 'number' && qty > 0 && qty <= LOW_STOCK_MAX) {
      return 'low';
    }
    return 'ok';
  });
  readonly stockLabel = computed(() => {
    const product = this.item();
    if (!product) {
      return null;
    }
    if (this.stockTone() === 'low' && typeof product.stockQuantity === 'number') {
      return lowStockLabel(product.stockQuantity);
    }
    return product.stockStatus ? STOCK_COPY[product.stockStatus] : null;
  });
  readonly hasRating = computed(() => (this.item()?.rating ?? 0) > 0);
  readonly cartBusy = computed(() => this.adding());
  readonly cartAdded = computed(() => this.added() || this.inCart());
  readonly cartLabel = computed(() => {
    const title = this.item()?.title ?? 'المنتج';
    if (!this.canPurchase()) {
      return `${title} غير متوفر`;
    }
    if (this.cartBusy()) {
      return `جاري إضافة ${title} إلى السلة`;
    }
    if (this.cartAdded()) {
      return `تمت إضافة ${title} إلى السلة`;
    }
    return `أضف ${title} إلى السلة`;
  });
  readonly cartText = computed(() => {
    if (!this.canPurchase()) {
      return 'غير متوفر';
    }
    if (this.cartBusy()) {
      return 'جاري الإضافة';
    }
    if (this.cartAdded()) {
      return 'تمت الإضافة';
    }
    return 'أضف للسلة';
  });
  readonly wishLabel = computed(() =>
    this.wishlisted() ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة',
  );
  readonly imageSizes = computed(() => {
    if (this.layout() === 'list') {
      return '(max-width: 768px) 40vw, 18vw';
    }
    return '(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 32vw';
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.clearTimers();
    });
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const product = this.item();
    if (!product || !this.canPurchase() || this.adding() || !this.cart) {
      return;
    }
    const now = Date.now();
    if (now - this.lastAddAt < 600) {
      return;
    }
    this.lastAddAt = now;
    this.addFailed.set(false);
    this.cart.add(product);

    const added = this.cart.items().some((line) => line.product.id === product.id);
    if (!added) {
      this.addFailed.set(true);
      return;
    }

    if (!this.isBrowser) {
      return;
    }

    this.adding.set(true);
    this.added.set(false);
    this.addingTimer = globalThis.setTimeout(() => {
      this.adding.set(false);
      this.added.set(true);
      this.addedTimer = globalThis.setTimeout(() => this.added.set(false), ADDED_MS);
    }, ADD_BUSY_MS);
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const product = this.item();
    if (!product || this.wishing() || !this.wishlist) {
      return;
    }

    if (this.isBrowser) {
      this.wishing.set(true);
      this.wishingTimer = globalThis.setTimeout(() => this.wishing.set(false), WISH_BUSY_MS);
    }

    this.wishlist.toggle(product);
  }

  private clearTimers(): void {
    if (this.addingTimer) {
      globalThis.clearTimeout(this.addingTimer);
    }
    if (this.addedTimer) {
      globalThis.clearTimeout(this.addedTimer);
    }
    if (this.wishingTimer) {
      globalThis.clearTimeout(this.wishingTimer);
    }
  }
}

function lowStockLabel(quantity: number): string {
  if (quantity === 1) {
    return 'متبقي قطعة واحدة';
  }
  if (quantity === 2) {
    return 'متبقي قطعتان';
  }
  if (quantity >= 3 && quantity <= 10) {
    return `متبقي ${quantity} قطع`;
  }
  return `متبقي ${quantity} قطعة`;
}
