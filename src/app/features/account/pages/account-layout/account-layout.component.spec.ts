import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AccountOrder } from '@core/auth/account.models';
import { AccountRepository } from '@core/auth/account.repository';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@core/auth/auth.constants';
import { AuthStore } from '@core/auth/auth.store';
import { authTestProviders, clearAuthStorage } from '@core/auth/auth-testing';
import { WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { accountSectionBreadcrumb } from '../../account-nav';
import { AccountLayoutComponent } from './account-layout.component';

describe('AccountLayoutComponent', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  async function setup() {
    await TestBed.configureTestingModule({
      imports: [AccountLayoutComponent],
      providers: [
        ...authTestProviders(),
        provideRouter([]),
        {
          provide: WISHLIST_PORT,
          useValue: {
            count: signal(2),
            items: signal([]),
            ids: signal(new Set()),
            toggle: () => undefined,
            remove: () => undefined,
          },
        },
        {
          provide: AccountRepository,
          useValue: {
            listOrders: () =>
              Promise.resolve([{ status: 'pending-review' }] as AccountOrder[]),
            getOrder: () => Promise.resolve(null),
            listAddresses: () => Promise.resolve([]),
            saveAddress: () => Promise.reject(new Error('unused')),
            deleteAddress: () => Promise.resolve(),
            listServiceRequests: () => Promise.resolve([]),
          },
        },
      ],
    }).compileComponents();

    const auth = TestBed.inject(AuthStore);
    await auth.login({ identifier: DEMO_EMAIL, password: DEMO_PASSWORD, rememberMe: true });
    const fixture = TestBed.createComponent(AccountLayoutComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('renders the shared account chrome with live badges', async () => {
    const fixture = await setup();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-page-breadcrumb')?.textContent).toContain('حسابي');
    expect(compiled.querySelector('app-page-breadcrumb')?.textContent).not.toContain('طلباتي');
    expect(compiled.textContent).toContain('نظرة عامة');
    expect(compiled.textContent).toContain('طلباتي');
    expect(compiled.textContent).toContain('بيانات الحساب');
    expect(compiled.textContent).toContain('العناوين');
    expect(compiled.textContent).toContain('المفضلة');
    expect(compiled.textContent).toContain('تسجيل الخروج');
    expect(compiled.textContent).not.toContain('طلبات الصيانة');
    expect(compiled.textContent).not.toContain('حساب تجريبي محلي');
    expect(compiled.querySelector('a[href="/account/favorites"]')).toBeTruthy();
    expect(compiled.querySelector('a[href="/account/wishlist"]')).toBeNull();
    expect(compiled.querySelector('a[href="/account/orders"]')?.textContent).toContain('1');
    expect(compiled.querySelector('a[href="/account/favorites"]')?.textContent).toContain('2');
  });

  it('adds the current account section to the breadcrumb', () => {
    expect(accountSectionBreadcrumb('/account').map((item) => item.label)).toEqual([
      'الرئيسية',
      'حسابي',
    ]);
    expect(accountSectionBreadcrumb('/account/orders?status=delivered').map((item) => item.label)).toEqual([
      'الرئيسية',
      'حسابي',
      'طلباتي',
    ]);
    expect(accountSectionBreadcrumb('/account/orders/o6').at(-1)?.label).toBe('طلباتي');
    expect(accountSectionBreadcrumb('/account/profile').at(-1)?.label).toBe('بيانات الحساب');
  });
});
