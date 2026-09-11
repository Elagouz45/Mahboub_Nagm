import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CART_PORT, CartPort, WISHLIST_PORT, WishlistPort } from '@core/tokens/commerce.tokens';
import { MOCK_OFFERS } from '@features/home/data-access/home.mock';
import { CartItem, ProductSummary } from '@shared/models/storefront.model';
import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  function ports(overrides?: { readonly cartItems?: CartItem[] }) {
    const items = signal<readonly CartItem[]>(overrides?.cartItems ?? []);
    const ids = signal<ReadonlySet<string>>(new Set());
    const added: ProductSummary[] = [];
    const cart: CartPort = {
      count: signal(0),
      items,
      add: (product) => {
        added.push(product);
        items.update((current) => [...current, { product, quantity: 1 }]);
      },
      remove: () => undefined,
    };
    const wishlist: WishlistPort = {
      count: signal(0),
      items: signal([]),
      ids,
      toggle: () => ids.update((current) => new Set(current).add(MOCK_OFFERS[1].id)),
      remove: () => undefined,
    };
    return { cart, wishlist, added, ids };
  }

  it('renders product details, discount, and add-to-cart', async () => {
    const { cart, wishlist, added } = ports();

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        provideRouter([]),
        { provide: CART_PORT, useValue: cart },
        { provide: WISHLIST_PORT, useValue: wishlist },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', MOCK_OFFERS[1]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('غسالة سامسونج 8 كيلو');
    expect(compiled.textContent).toContain('13,599');
    expect(compiled.textContent).toContain('خصم 20٪');
    expect(compiled.textContent).toContain('متبقي قطعتان');
    expect(compiled.querySelector('.product-card__photo app-site-image')).not.toBeNull();
    expect(compiled.querySelector('a.btn--whatsapp')).toBeNull();
    expect(compiled.querySelector('.product-card__badge--bestseller')).toBeNull();

    compiled.querySelector<HTMLButtonElement>('.btn--cart')?.click();
    fixture.detectChanges();
    expect(added).toEqual([MOCK_OFFERS[1]]);
    expect(compiled.textContent).toContain('تمت الإضافة');

    compiled.querySelector<HTMLButtonElement>('.product-card__wish')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.product-card__wish')?.getAttribute('aria-pressed')).toBe('true');
    expect(compiled.querySelector('.product-card__wish')?.getAttribute('aria-label')).toBe(
      'إزالة من المفضلة',
    );
  });

  it('disables add-to-cart for out-of-stock products and supports list layout', async () => {
    const { cart, wishlist, added } = ports();

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        provideRouter([]),
        { provide: CART_PORT, useValue: cart },
        { provide: WISHLIST_PORT, useValue: wishlist },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', {
      ...MOCK_OFFERS[0],
      stockStatus: 'out-of-stock',
      isBestseller: true,
    });
    fixture.componentRef.setInput('layout', 'list');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      fixture.componentRef.location.nativeElement.classList.contains('product-card--list'),
    ).toBe(true);
    expect(compiled.textContent).toContain('غير متوفر');
    expect(compiled.querySelector<HTMLButtonElement>('.btn--cart')?.disabled).toBe(true);
    compiled.querySelector<HTMLButtonElement>('.btn--cart')?.click();
    expect(added).toEqual([]);
    expect(compiled.querySelector('.btn--whatsapp')).toBeNull();
  });

  it('keeps the spec and limits badges to two without a navy bestseller chip', async () => {
    const { cart, wishlist } = ports();

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        provideRouter([]),
        { provide: CART_PORT, useValue: cart },
        { provide: WISHLIST_PORT, useValue: wishlist },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', MOCK_OFFERS[0]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn--whatsapp')).toBeNull();
    expect(compiled.textContent).toContain('بابين · تبريد مركزي · ستيل');
    expect(compiled.textContent).toContain('خصم 18٪');
    expect(compiled.textContent).toContain('عرض اليوم');
    expect(compiled.textContent).not.toContain('الأكثر طلبًا');
    expect(compiled.querySelectorAll('.product-card__badge').length).toBe(2);
    expect(compiled.querySelector('.btn--cart')?.getAttribute('aria-label')).toContain(
      'ثلاجة إل جي إنفرتر 635 لتر',
    );
  });

  it('shows a bestseller badge when there is room and hides rating when missing', async () => {
    const { cart, wishlist } = ports();

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        provideRouter([]),
        { provide: CART_PORT, useValue: cart },
        { provide: WISHLIST_PORT, useValue: wishlist },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', {
      ...MOCK_OFFERS[0],
      discountPercent: undefined,
      oldPrice: undefined,
      isTodaysOffer: false,
      isBestseller: true,
      rating: 0,
      reviewCount: 0,
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('الأكثر طلبًا');
    expect(compiled.textContent).not.toContain('خصم');
    expect(compiled.querySelector('app-rating-display')).toBeNull();
    expect(compiled.querySelector('.product-card__rank')).toBeNull();
  });

  it('renders a skeleton without requiring a product', async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('skeleton', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      fixture.componentRef.location.nativeElement.classList.contains('product-card--skeleton'),
    ).toBe(true);
    expect(compiled.querySelector('.btn--cart')).toBeNull();
    expect(compiled.querySelector('.product-card__pulse--btn')).not.toBeNull();
  });
});
