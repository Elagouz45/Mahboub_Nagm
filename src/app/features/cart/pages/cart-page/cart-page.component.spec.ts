import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MOCK_CATALOG_PRODUCTS } from '@features/catalog/data-access/catalog-mock.service';
import { CartStore } from '../../state/cart.store';
import { CartPageComponent } from './cart-page.component';

describe('CartPageComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders the empty cart with a shop CTA', async () => {
    await TestBed.configureTestingModule({
      imports: [CartPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(CartPageComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('السلة في انتظار اختياراتك');
    expect(element.querySelector('a[href="/products"]')?.textContent).toContain('ابدأ التسوق');
    expect(element.querySelector('a[href="/checkout"]')).toBeNull();
  });

  it('renders a working checkout link and quantity controls after loading products', async () => {
    await TestBed.configureTestingModule({
      imports: [CartPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const cart = TestBed.inject(CartStore);
    cart.add(MOCK_CATALOG_PRODUCTS[0]);
    const fixture = TestBed.createComponent(CartPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('a[href="/checkout"]')).not.toBeNull();
    element.querySelector<HTMLButtonElement>('button[aria-label^="زيادة"]')!.click();
    fixture.detectChanges();
    expect(cart.count()).toBe(2);
    element.querySelector<HTMLButtonElement>('button[aria-label^="حذف"]')!.click();
    fixture.detectChanges();
    expect(element.querySelector('a[href="/checkout"]')).toBeNull();
    expect(element.textContent).toContain('السلة في انتظار اختياراتك');
  });
});
