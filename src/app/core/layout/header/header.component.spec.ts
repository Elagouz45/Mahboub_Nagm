import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@core/auth/auth.constants';
import { AuthStore } from '@core/auth/auth.store';
import { provideAuth } from '@core/auth/provide-auth';
import { clearAuthStorage } from '@core/auth/auth-testing';
import { CART_PORT, WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-header-spec-host',
  template: '',
})
class HeaderSpecHostComponent {}

describe('HeaderComponent', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  async function setup(
    url = '/',
    badges: { cart?: number; wishlist?: number } = {},
  ) {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideZonelessChangeDetection(),
        ...provideAuth(),
        provideRouter([
          { path: '', component: HeaderSpecHostComponent },
          { path: 'products', component: HeaderSpecHostComponent },
          { path: 'products/:slug', component: HeaderSpecHostComponent },
          { path: 'contact', component: HeaderSpecHostComponent },
          { path: 'brands', component: HeaderSpecHostComponent },
          { path: 'offers', component: HeaderSpecHostComponent },
          { path: 'about', component: HeaderSpecHostComponent },
          { path: 'after-sales', component: HeaderSpecHostComponent },
          { path: 'service-centers', component: HeaderSpecHostComponent },
          { path: 'account', component: HeaderSpecHostComponent },
          { path: 'auth/login', component: HeaderSpecHostComponent },
          { path: 'auth/register', component: HeaderSpecHostComponent },
          { path: 'cart', component: HeaderSpecHostComponent },
          { path: 'wishlist', component: HeaderSpecHostComponent },
        ]),
        {
          provide: CART_PORT,
          useValue: {
            count: signal(badges.cart ?? 0),
            items: signal([]),
            add: () => undefined,
            remove: () => undefined,
          },
        },
        {
          provide: WISHLIST_PORT,
          useValue: {
            count: signal(badges.wishlist ?? 0),
            items: signal([]),
            ids: signal(new Set()),
            toggle: () => undefined,
            remove: () => undefined,
          },
        },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    await router.navigateByUrl(url);
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture, router };
  }

  function desktopNavLabels(root: HTMLElement): string[] {
    return [...root.querySelectorAll<HTMLAnchorElement>('.app-header__nav .nav-link')].map(
      (link) => link.textContent?.trim() ?? '',
    );
  }

  it('renders the shared main links without an الأقسام dropdown', async () => {
    const { fixture } = await setup();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(desktopNavLabels(compiled)).toEqual([
      'الرئيسية',
      'المتجر',
      'العروض',
      'العلامات التجارية',
      'خدمات ما بعد البيع',
      'مركز الصيانة',
      'من نحن',
      'تواصل معنا',
    ]);
    expect(compiled.querySelector('[aria-controls="categories-menu"]')).toBeNull();
    expect(compiled.querySelector('#categories-menu')).toBeNull();
    expect(compiled.querySelector('.app-header__nav')?.textContent).not.toContain('الأقسام');
    expect(compiled.textContent).toContain('بيتك يستاهل الأفضل');

    const storeLink = [...compiled.querySelectorAll<HTMLAnchorElement>('.app-header__nav .nav-link')].find(
      (link) => link.textContent?.trim() === 'المتجر',
    );
    expect(storeLink?.getAttribute('href')).toBe('/products');
    expect(compiled.querySelector('.brand')?.getAttribute('href')).toBe('/');
    const brandLogo = compiled.querySelector('.brand img') as HTMLImageElement | null;
    expect(brandLogo?.getAttribute('ng-src') ?? brandLogo?.getAttribute('src')).toContain(
      'brand/store-logo.jpg',
    );

    const offersLink = [...compiled.querySelectorAll<HTMLAnchorElement>('.app-header__nav .nav-link')].find(
      (link) => link.textContent?.trim() === 'العروض',
    );
    const brandsLink = [...compiled.querySelectorAll<HTMLAnchorElement>('.app-header__nav .nav-link')].find(
      (link) => link.textContent?.trim() === 'العلامات التجارية',
    );
    const aboutLink = [...compiled.querySelectorAll<HTMLAnchorElement>('.app-header__nav .nav-link')].find(
      (link) => link.textContent?.trim() === 'من نحن',
    );
    expect(offersLink?.getAttribute('href')).toBe('/offers');
    expect(brandsLink?.getAttribute('href')).toBe('/brands');
    expect(aboutLink?.getAttribute('href')).toBe('/about');

    const afterSalesLink = [...compiled.querySelectorAll<HTMLAnchorElement>('.app-header__nav .nav-link')].find(
      (link) => link.textContent?.trim() === 'خدمات ما بعد البيع',
    );
    const centersLink = [...compiled.querySelectorAll<HTMLAnchorElement>('.app-header__nav .nav-link')].find(
      (link) => link.textContent?.trim() === 'مركز الصيانة',
    );
    expect(afterSalesLink?.getAttribute('href')).toBe('/after-sales');
    expect(centersLink?.getAttribute('href')).toBe('/service-centers');
  });

  it('marks المتجر active on the listing and product pages', async () => {
    const { fixture, router } = await setup('/');
    const storeLink = () =>
      [...fixture.nativeElement.querySelectorAll('.app-header__nav .nav-link')].find(
        (link: HTMLAnchorElement) => link.textContent?.trim() === 'المتجر',
      ) as HTMLAnchorElement;

    expect(storeLink().classList.contains('is-active')).toBe(false);
    expect(storeLink().getAttribute('aria-current')).toBeNull();

    await router.navigateByUrl('/products?category=fridges');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(storeLink().classList.contains('is-active')).toBe(true);
    expect(storeLink().getAttribute('aria-current')).toBe('page');

    await router.navigateByUrl('/products/lg-fridge-635');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(storeLink().classList.contains('is-active')).toBe(true);
  });

  it('marks العروض والعلامات التجارية ومن نحن as current on their pages', async () => {
    const { fixture, router } = await setup('/');
    const navLink = (label: string) =>
      [...fixture.nativeElement.querySelectorAll('.app-header__nav .nav-link')].find(
        (link: HTMLAnchorElement) => link.textContent?.trim() === label,
      ) as HTMLAnchorElement;

    await router.navigateByUrl('/offers');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(navLink('العروض').getAttribute('aria-current')).toBe('page');
    expect(navLink('المتجر').getAttribute('aria-current')).toBeNull();

    await router.navigateByUrl('/brands');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(navLink('العلامات التجارية').getAttribute('aria-current')).toBe('page');

    await router.navigateByUrl('/about');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(navLink('من نحن').getAttribute('aria-current')).toBe('page');
    expect(navLink('تواصل معنا').getAttribute('aria-current')).toBeNull();

    await router.navigateByUrl('/after-sales');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(navLink('خدمات ما بعد البيع').getAttribute('aria-current')).toBe('page');
    expect(navLink('مركز الصيانة').getAttribute('aria-current')).toBeNull();

    await router.navigateByUrl('/service-centers');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(navLink('مركز الصيانة').getAttribute('aria-current')).toBe('page');
    expect(navLink('خدمات ما بعد البيع').getAttribute('aria-current')).toBeNull();
    expect(navLink('تواصل معنا').getAttribute('aria-current')).toBeNull();
  });

  it('hides cart and wishlist badges when counts are zero', async () => {
    const { fixture } = await setup('/');
    expect(fixture.nativeElement.querySelector('.icon-action__badge')).toBeNull();
  });

  it('shows cart and wishlist badges when counts are greater than zero', async () => {
    const { fixture } = await setup('/', { cart: 3, wishlist: 12 });
    const badges = [...fixture.nativeElement.querySelectorAll('.icon-action__badge')].map((node) =>
      node.textContent?.trim(),
    );
    expect(badges).toEqual(['12', '3']);
  });

  it('opens and closes the mobile menu with the toggle and Escape', async () => {
    const { fixture } = await setup();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('.menu-toggle');
    const drawer = compiled.querySelector('.app-header__drawer');

    expect(drawer?.classList.contains('is-open')).toBe(false);
    toggle?.click();
    fixture.detectChanges();
    expect(drawer?.classList.contains('is-open')).toBe(true);
    expect(toggle?.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(drawer?.classList.contains('is-open')).toBe(false);
  });

  it('opens a compact guest account menu and closes it with Escape', async () => {
    const { fixture } = await setup();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('.account-control .icon-action');
    expect(toggle?.textContent).toContain('حسابي');
    toggle?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('#account-menu')?.textContent).toContain('تسجيل الدخول');
    expect(compiled.querySelector('#account-menu')?.textContent).toContain('إنشاء حساب');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(compiled.querySelector('#account-menu')).toBeNull();
  });

  it('shows the signed-in name, updates after profile save, and logs out', async () => {
    const { fixture } = await setup();
    const auth = TestBed.inject(AuthStore);
    await auth.login({ identifier: DEMO_EMAIL, password: DEMO_PASSWORD, rememberMe: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('مرحبًا، أحمد');

    await auth.updateProfile({
      firstName: 'حامد',
      lastName: 'محمد',
      phone: '01012345678',
      email: DEMO_EMAIL,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('مرحبًا، حامد');

    const toggle = fixture.nativeElement.querySelector('.account-control .icon-action') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    const logout = [...fixture.nativeElement.querySelectorAll('button')].find((node) =>
      node.textContent?.includes('تسجيل الخروج'),
    ) as HTMLButtonElement;
    logout.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(auth.user()).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('حسابي');
  });
});
