import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideAuth } from '@core/auth/provide-auth';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { CART_PORT, WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { CartStore } from '@features/cart/state/cart.store';
import { WishlistStore } from '@features/wishlist/state/wishlist.store';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('app routes', () => {
  it('lazy-loads feature route groups instead of eagerly importing pages', () => {
    const layoutRoute = routes[0];
    const children = layoutRoute.children ?? [];
    const featureRoutes = children.filter((route) => route.path !== '**');

    expect(layoutRoute.component).toBeTruthy();

    for (const route of featureRoutes) {
      if (route.redirectTo) {
        expect(route.path).toBe('shop');
        expect(typeof route.redirectTo).toBe('function');
        continue;
      }

      if (route.path === 'products') {
        const productChildren = route.children ?? [];
        expect(productChildren[0]?.path).toBe('');
        expect(productChildren[1]?.path).toBe(':slug');
        expect(productChildren.every((child) => typeof child.loadChildren === 'function')).toBe(
          true,
        );
        expect(productChildren.every((child) => child.component === undefined)).toBe(true);
        continue;
      }

      expect(typeof route.loadChildren).toBe('function');
      expect(route.component).toBeUndefined();
      expect(route.loadComponent).toBeUndefined();
    }

    const notFound = children.at(-1);
    expect(notFound?.path).toBe('**');
    expect(typeof notFound?.loadComponent).toBe('function');
  });

  it(
    'loads the home feature and the not-found page',
    async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        ...provideAuth(),
        { provide: WHATSAPP_NUMBER, useValue: '' },
        { provide: CART_PORT, useExisting: CartStore },
        { provide: WISHLIST_PORT, useExisting: WishlistStore },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    fixture.detectChanges();

    await router.navigateByUrl('/');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('كل أجهزة بيتك في مكان واحد');

    await router.navigateByUrl('/this-route-does-not-exist');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('الصفحة غير موجودة');
  },
  15000,
);

  it('redirects /shop to /products and keeps query params', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        ...provideAuth(),
        { provide: WHATSAPP_NUMBER, useValue: '' },
        { provide: CART_PORT, useExisting: CartStore },
        { provide: WISHLIST_PORT, useExisting: WishlistStore },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    fixture.detectChanges();

    await router.navigateByUrl('/shop?q=lg');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url.startsWith('/products')).toBe(true);
    expect(router.url).toContain('q=lg');
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'كل احتياجات بيتك في مكان واحد',
    );
  });

  it('redirects legacy offers and brands shop aliases', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        ...provideAuth(),
        { provide: WHATSAPP_NUMBER, useValue: '' },
        { provide: CART_PORT, useExisting: CartStore },
        { provide: WISHLIST_PORT, useExisting: WishlistStore },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    fixture.detectChanges();

    await router.navigateByUrl('/products?offers=1');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url.startsWith('/offers')).toBe(true);

    await router.navigateByUrl('/products?brands=1');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url.startsWith('/brands')).toBe(true);

    await router.navigateByUrl('/contact?topic=about');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url.startsWith('/about')).toBe(true);
  });

  it('redirects legacy contact topics and keeps the maintenance form', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        ...provideAuth(),
        { provide: WHATSAPP_NUMBER, useValue: '' },
        { provide: CART_PORT, useExisting: CartStore },
        { provide: WISHLIST_PORT, useExisting: WishlistStore },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    fixture.detectChanges();

    await router.navigateByUrl('/contact?topic=after-sales');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url.startsWith('/after-sales')).toBe(true);
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('راحتك مستمرة بعد الشراء');

    await router.navigateByUrl('/contact?topic=maintenance');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url.startsWith('/service-centers')).toBe(true);

    await router.navigateByUrl('/contact?topic=returns');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url.startsWith('/return-policy')).toBe(true);

    await router.navigateByUrl('/contact?type=maintenance');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url.startsWith('/contact')).toBe(true);
    expect(router.url).toContain('type=maintenance');
    expect(fixture.nativeElement.textContent).toContain('نوع الجهاز');

    await router.navigateByUrl('/contact?topic=privacy');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url.startsWith('/contact')).toBe(true);
    expect(router.url).toContain('topic=privacy');
  }, 20000);
});
