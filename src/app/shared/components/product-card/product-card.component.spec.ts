import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { CART_PORT, CartPort, WISHLIST_PORT, WishlistPort } from '@core/tokens/commerce.tokens';
import { MOCK_OFFERS } from '@features/home/data-access/home.mock';
import { CartItem, ProductSummary } from '@shared/models/storefront.model';
import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  it('renders product details, discount, and add-to-cart', async () => {
    const items = signal<readonly CartItem[]>([]);
    const ids = signal<ReadonlySet<string>>(new Set());
    const added: ProductSummary[] = [];

    const cart: CartPort = {
      count: signal(0),
      items,
      add: (product) => added.push(product),
      remove: () => undefined,
    };
    const wishlist: WishlistPort = {
      count: signal(0),
      items: signal([]),
      ids,
      toggle: () => ids.update((current) => new Set(current).add(MOCK_OFFERS[1].id)),
      remove: () => undefined,
    };

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        provideRouter([]),
        { provide: WHATSAPP_NUMBER, useValue: '201000000000' },
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
    expect(compiled.querySelector('a.btn--whatsapp')?.getAttribute('href')).toContain(
      'wa.me/201000000000',
    );

    compiled.querySelector<HTMLButtonElement>('.btn--cart')?.click();
    expect(added).toEqual([MOCK_OFFERS[1]]);

    compiled.querySelector<HTMLButtonElement>('.product-card__wish')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.product-card__wish')?.getAttribute('aria-pressed')).toBe('true');
  });

  it('disables add-to-cart for out-of-stock products and supports list layout', async () => {
    const added: ProductSummary[] = [];
    const cart: CartPort = {
      count: signal(0),
      items: signal([]),
      add: (product) => added.push(product),
      remove: () => undefined,
    };
    const wishlist: WishlistPort = {
      count: signal(0),
      items: signal([]),
      ids: signal(new Set()),
      toggle: () => undefined,
      remove: () => undefined,
    };

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        provideRouter([]),
        { provide: WHATSAPP_NUMBER, useValue: '' },
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
    expect(fixture.componentRef.location.nativeElement.classList.contains('product-card--list')).toBe(
      true,
    );
    expect(compiled.textContent).toContain('غير متوفر');
    expect(compiled.querySelector<HTMLButtonElement>('.btn--cart')?.disabled).toBe(true);
    compiled.querySelector<HTMLButtonElement>('.btn--cart')?.click();
    expect(added).toEqual([]);
    expect(compiled.querySelector('.btn--whatsapp')?.getAttribute('aria-label')).toBe(
      'استفسر عن هذا المنتج عبر واتساب',
    );
  });
});
