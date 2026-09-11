import { ProductSummary } from '@shared/models/storefront.model';

export function productDiscountPercent(product: ProductSummary): number | null {
  try {
    if (product.discountPercent && product.discountPercent > 0) {
      return Math.round(product.discountPercent);
    }
    if (product.oldPrice && product.oldPrice > product.price && product.price >= 0) {
      return Math.round((1 - product.price / product.oldPrice) * 100);
    }
    return null;
  } catch {
    return null;
  }
}

export function maxOfferDiscountPercent(products: readonly ProductSummary[]): number {
  try {
    let max = 0;
    for (const product of products) {
      const discount = productDiscountPercent(product);
      if (discount && discount > max) {
        max = discount;
      }
    }
    return max;
  } catch {
    return 0;
  }
}

export function resolveOffersMaxDiscount(
  apiMax: number | null | undefined,
  products: readonly ProductSummary[],
): number {
  try {
    if (typeof apiMax === 'number' && Number.isFinite(apiMax) && apiMax > 0) {
      return Math.round(apiMax);
    }
    return maxOfferDiscountPercent(products);
  } catch {
    return 0;
  }
}
