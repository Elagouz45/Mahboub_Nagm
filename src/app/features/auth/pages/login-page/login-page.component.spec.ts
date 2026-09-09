import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { CART_PORT, WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { CartStore } from '@features/cart/state/cart.store';
import { WishlistStore } from '@features/wishlist/state/wishlist.store';
import { LoginPageComponent } from './login-page.component';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@core/auth/auth.constants';
import { AuthStore } from '@core/auth/auth.store';
import { authTestProviders, clearAuthStorage } from '@core/auth/auth-testing';

describe('LoginPageComponent', () => {
  beforeEach(() => {
    clearAuthStorage();
  });

  afterEach(() => {
    clearAuthStorage();
  });

  async function setup() {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        ...authTestProviders(),
        provideRouter([
          { path: 'auth/login', component: LoginPageComponent },
          { path: 'account', component: LoginPageComponent },
          { path: 'products', component: LoginPageComponent },
        ]),
        { provide: WHATSAPP_NUMBER, useValue: '' },
        { provide: CART_PORT, useExisting: CartStore },
        { provide: WISHLIST_PORT, useExisting: WishlistStore },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, component: fixture.componentInstance };
  }

  it('fills demo credentials without submitting', async () => {
    const { fixture, component } = await setup();
    const button = [...fixture.nativeElement.querySelectorAll('button')].find((node) =>
      node.textContent?.includes('تعبئة البيانات'),
    ) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(component.form.controls.identifier.value).toBe(DEMO_EMAIL);
    expect(component.form.controls.password.value).toBe(DEMO_PASSWORD);
    expect(TestBed.inject(AuthStore).user()).toBeNull();
  });

  it('shows a generic error for bad credentials', async () => {
    const { fixture, component } = await setup();
    component.form.setValue({ identifier: DEMO_EMAIL, password: 'Wrong12345', rememberMe: false });
    await component.submit();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('بيانات تسجيل الدخول غير صحيحة');
  });
});
