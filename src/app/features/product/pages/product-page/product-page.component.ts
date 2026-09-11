import { CATEGORY_ATTRIBUTE_FILTERS } from '@features/catalog/data-access/catalog-attributes';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MOCK_CATALOG_PRODUCTS } from '@features/catalog/data-access/catalog-mock.service';
import { CartStore } from '@features/cart/state/cart.store';
import { WishlistStore } from '@features/wishlist/state/wishlist.store';
import { purchasable } from '@core/services/demo-commerce.service';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { PriceDisplayComponent } from '@shared/components/price-display/price-display.component';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
@Component({
  selector: 'app-product-page',
  imports: [
    RouterLink,
    SiteImageComponent,
    ProductCardComponent,
    PriceDisplayComponent,
    PageBreadcrumbComponent,
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent {
  readonly slug = input('');
  readonly product = computed(() => MOCK_CATALOG_PRODUCTS.find((p) => p.slug === this.slug()));
  readonly cart = inject(CartStore);
  readonly wishlist = inject(WishlistStore);
  readonly quantity = signal(1);
  readonly canBuy = computed(() => {
    const p = this.product();
    return !!p && purchasable(p);
  });
  readonly related = computed(() =>
    MOCK_CATALOG_PRODUCTS.filter(
      (p) => p.categorySlug === this.product()?.categorySlug && p.id !== this.product()?.id,
    ).slice(0, 4),
  );
  readonly attributes = computed(() => {
    const definitions = CATEGORY_ATTRIBUTE_FILTERS[this.product()?.categorySlug ?? ''] ?? [];
    return Object.entries(this.product()?.attributes ?? {}).map(([key, value]) => {
      const definition = definitions.find((item) => item.key === key);
      return {
        label: definition?.label ?? key,
        value:
          typeof value === 'boolean'
            ? value
              ? 'نعم'
              : 'لا'
            : (definition?.options.find((option) => option.value === String(value))?.label ??
              value),
      };
    });
  });
  readonly breadcrumb = computed(() => [
    { label: 'الرئيسية', path: '/' },
    { label: 'المتجر', path: '/products' },
    { label: this.product()?.title ?? 'المنتج غير موجود' },
  ]);
  add(): void {
    const product = this.product();
    if (product) this.cart.add(product, this.quantity());
  }
}
