import { ComponentRef, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { CART_PORT, CartPort, WISHLIST_PORT, WishlistPort } from '@core/tokens/commerce.tokens';
import { MOCK_BEST_SELLERS } from '@features/home/data-access/home.mock';
import { ProductSummary, SectionState } from '@shared/models/storefront.model';
import { BestSellersSectionComponent } from './best-sellers-section.component';

describe('BestSellersSectionComponent', () => {
  async function setup(state: SectionState<readonly ProductSummary[]>) {
    const cart: CartPort = {
      count: signal(0),
      items: signal([]),
      add: () => undefined,
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
      imports: [BestSellersSectionComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: WHATSAPP_NUMBER, useValue: '' },
        { provide: CART_PORT, useValue: cart },
        { provide: WISHLIST_PORT, useValue: wishlist },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(BestSellersSectionComponent);
    const ref = fixture.componentRef as ComponentRef<BestSellersSectionComponent>;
    ref.setInput('state', state);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('renders the cream header, view-all link, and shared product cards', async () => {
    const fixture = await setup({
      status: 'success',
      data: MOCK_BEST_SELLERS.slice(0, 4),
      error: null,
    });
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('#best-sellers-heading')?.textContent).toContain('الأكثر مبيعًا');
    expect(root.textContent).toContain('اختيارات العملاء الأكثر طلبًا');
    expect(root.querySelector('a.best-sellers__all')?.getAttribute('href')).toBe(
      '/products?sort=bestselling',
    );
    expect(root.querySelector('app-product-card')).not.toBeNull();
    expect(root.querySelector('.product-card__rank')).toBeNull();
    expect(root.querySelector('.btn--whatsapp')).toBeNull();
    expect(root.querySelector('.best-sellers__nav')).toBeNull();
  });

  it('keeps loading, empty, and retry states', async () => {
    const loading = await setup({ status: 'loading', data: [], error: null });
    expect(loading.nativeElement.querySelectorAll('app-product-card').length).toBe(4);

    TestBed.resetTestingModule();
    const empty = await setup({ status: 'empty', data: [], error: null });
    expect(empty.nativeElement.textContent).toContain('لا توجد منتجات متاحة حاليًا');
    expect(empty.nativeElement.querySelector('.best-sellers__row')).toBeNull();

    TestBed.resetTestingModule();
    const error = await setup({ status: 'error', data: [], error: 'تعذر التحميل' });
    expect(error.nativeElement.textContent).toContain('تعذر التحميل');
    expect(error.nativeElement.querySelector('button')).not.toBeNull();
  });
});
