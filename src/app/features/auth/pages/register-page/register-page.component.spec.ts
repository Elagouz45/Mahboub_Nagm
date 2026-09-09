import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AUTH_COPY } from '@core/auth/auth.constants';
import { AuthStore } from '@core/auth/auth.store';
import { authTestProviders, clearAuthStorage } from '@core/auth/auth-testing';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { CART_PORT, WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { CartStore } from '@features/cart/state/cart.store';
import { WishlistStore } from '@features/wishlist/state/wishlist.store';
import { RegisterPageComponent } from './register-page.component';

describe('RegisterPageComponent', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  async function setup() {
    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [
        ...authTestProviders(),
        provideRouter([
          { path: 'auth/register', component: RegisterPageComponent },
          { path: 'account', component: RegisterPageComponent },
        ]),
        { provide: WHATSAPP_NUMBER, useValue: '' },
        { provide: CART_PORT, useExisting: CartStore },
        { provide: WISHLIST_PORT, useExisting: WishlistStore },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(RegisterPageComponent);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  }

  it('validates required fields, password mismatch, and duplicate email', async () => {
    const { fixture, component } = await setup();
    await component.submit();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('الاسم الأول مطلوب');

    component.form.setValue({
      firstName: 'سارة',
      lastName: 'حسن',
      phone: '01112345678',
      email: 'sara@test.example',
      password: 'Secret123',
      confirmPassword: 'Secret124',
      terms: true,
    });
    await component.submit();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('كلمتا المرور غير متطابقتين');

    component.form.patchValue({ confirmPassword: 'Secret123' });
    await component.submit();
    const auth = TestBed.inject(AuthStore);
    expect(auth.user()?.email).toBe('sara@test.example');

    const second = TestBed.createComponent(RegisterPageComponent);
    second.detectChanges();
    second.componentInstance.form.setValue({
      firstName: 'أخرى',
      lastName: 'حسن',
      phone: '01212345678',
      email: 'sara@test.example',
      password: 'Secret123',
      confirmPassword: 'Secret123',
      terms: true,
    });
    await second.componentInstance.submit();
    second.detectChanges();
    expect(second.nativeElement.textContent).toContain(AUTH_COPY.duplicateEmail);
  });
});
