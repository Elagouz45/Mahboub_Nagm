import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { authTestProviders, clearAuthStorage } from '@core/auth/auth-testing';
import { DemoCommerceService } from '@core/services/demo-commerce.service';
import { MOCK_CATALOG_PRODUCTS } from '@features/catalog/data-access/catalog-mock.service';
import { CheckoutPageComponent } from './checkout-page.component';

describe('CheckoutPageComponent', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  it('validates delivery details before proceeding and calculates the selected shipping fee', async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutPageComponent],
      providers: [...authTestProviders(), provideRouter([])],
    }).compileComponents();
    const commerce = TestBed.inject(DemoCommerceService);
    commerce.add(MOCK_CATALOG_PRODUCTS[0]);
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const page = fixture.componentInstance;
    await vi.waitFor(() => expect(page.ready()).toBe(true));
    page.next();
    expect(page.step()).toBe(1);
    expect(page.error()).not.toBe('');
    page.form.patchValue({
      recipientName: 'أحمد محمد',
      phone: '01012345678',
      governorateSlug: 'cairo',
      city: 'القاهرة',
      street: 'شارع النصر',
    });
    page.next();
    expect(page.step()).toBe(2);
    expect(page.shipping()).toBe(100);
    expect(page.total()).toBe(MOCK_CATALOG_PRODUCTS[0].price + 100);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('الدفع عند الاستلام');
    page.next();
    expect(page.step()).toBe(3);
  });
});
