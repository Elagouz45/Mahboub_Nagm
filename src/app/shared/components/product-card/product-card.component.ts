import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { CART_PORT, WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from '@core/utils/whatsapp.util';
import { PriceDisplayComponent } from '@shared/components/price-display/price-display.component';
import { RatingDisplayComponent } from '@shared/components/rating-display/rating-display.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import { ProductSummary, StockStatus } from '@shared/models/storefront.model';
import { formatEgp } from '@shared/utils/format-price.util';

const STOCK_COPY: Record<StockStatus, string> = {
  'in-stock': 'متوفر',
  'out-of-stock': 'غير متوفر',
  'available-to-order': 'متاح للطلب',
  'coming-soon': 'متاح قريبًا',
};

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
    '[class.product-card--compact]': 'compact()',
    '[class.product-card--list]': 'layout() === "list" && !compact()',
  },
})
export class ProductCardComponent {
  private readonly cart = inject(CART_PORT);
  private readonly wishlist = inject(WISHLIST_PORT);
  private readonly whatsappNumber = inject(WHATSAPP_NUMBER);
  private readonly document = inject(DOCUMENT);
  private lastAddAt = 0;

  readonly product = input.required<ProductSummary>();
  readonly compact = input(false);
  readonly layout = input<'grid' | 'list'>('grid');

  readonly wishlisted = computed(() => this.wishlist.ids().has(this.product().id));
  readonly stockLabel = computed(() => {
    const status = this.product().stockStatus;
    return status ? STOCK_COPY[status] : null;
  });
  readonly canPurchase = computed(() => {
    const status = this.product().stockStatus;
    return status !== 'out-of-stock' && status !== 'coming-soon';
  });
  readonly whatsappHref = computed(() => {
    const item = this.product();
    const origin = this.document.location.origin || '';
    return buildWhatsAppUrl(
      this.whatsappNumber,
      buildProductWhatsAppMessage({
        title: item.title,
        sku: item.sku,
        priceLabel: formatEgp(item.price),
        productUrl: `${origin}/products/${item.slug}`,
      }),
    );
  });

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.canPurchase()) {
      return;
    }
    const now = Date.now();
    if (now - this.lastAddAt < 600) {
      return;
    }
    this.lastAddAt = now;
    this.cart.add(this.product());
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlist.toggle(this.product());
  }

  stopCardNavigation(event: Event): void {
    event.stopPropagation();
  }
}
