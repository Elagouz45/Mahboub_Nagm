export type StockStatus = 'in-stock' | 'out-of-stock' | 'available-to-order' | 'coming-soon';

export interface ProductSummary {
  readonly id: string;
  readonly sku: string;
  readonly slug: string;
  readonly brand: string;
  readonly title: string;
  readonly spec: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly price: number;
  readonly oldPrice?: number;
  readonly discountPercent?: number;
  readonly categorySlug?: string;
  readonly stockStatus?: StockStatus;
  readonly stockQuantity?: number;
  readonly description?: string;
  readonly isBestseller?: boolean;
  readonly isTodaysOffer?: boolean;
  readonly attributes?: Readonly<Record<string, string | boolean | number>>;
}

export interface Category {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
}

export interface Brand {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly imageSrc: string;
}

export interface CartItem {
  readonly product: ProductSummary;
  readonly quantity: number;
}

export type SectionStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface SectionState<T> {
  readonly status: SectionStatus;
  readonly data: T;
  readonly error: string | null;
}
