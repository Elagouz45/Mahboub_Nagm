import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { CART_PORT, WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { CartStore } from '@features/cart/state/cart.store';
import { WishlistStore } from '@features/wishlist/state/wishlist.store';
import { ActivatedRoute } from '@angular/router';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { CatalogRepository } from '../../data-access/catalog.repository';
import { EMPTY_AVAILABLE_FILTERS } from '../../models/catalog.model';
import { ShopPageComponent } from './shop-page.component';

const FILTERS_WITH_CATEGORIES = {
  ...EMPTY_AVAILABLE_FILTERS,
  categories: [{ value: 'fridges', label: 'ثلاجات', count: 4 }],
};

describe('ShopPageComponent', () => {
  async function setup(repo: Partial<CatalogRepository>, query: Record<string, string> = {}) {
    await TestBed.configureTestingModule({
      imports: [ShopPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: WHATSAPP_NUMBER, useValue: '' },
        { provide: CART_PORT, useExisting: CartStore },
        { provide: WISHLIST_PORT, useExisting: WishlistStore },
        { provide: CatalogRepository, useValue: repo },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap(query)),
            snapshot: { queryParamMap: convertToParamMap(query) },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ShopPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('renders the shop heading and category images from the registry', async () => {
    const fixture = await setup({
      search: () =>
        of({
          items: [],
          total: 0,
          filters: FILTERS_WITH_CATEGORIES,
        }),
    });

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'كل احتياجات بيتك في مكان واحد',
    );
    expect(fixture.nativeElement.textContent).toContain(
      'اكتشف أحدث الأجهزة الكهربائية من أفضل الماركات، وقارن بين المنتجات والأسعار بسهولة.',
    );
    expect(fixture.nativeElement.querySelector('.shop-banner')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.shop-banner__cta')?.tagName).toBe('BUTTON');
    expect(fixture.nativeElement.querySelector('app-shop-category-nav')).not.toBeNull();

    const fridgeImg = fixture.nativeElement.querySelector(
      '.shop-category-nav img',
    ) as HTMLImageElement | null;
    expect(fridgeImg?.getAttribute('ng-src') ?? fridgeImg?.getAttribute('src')).toContain(
      'category-refrigerators.webp',
    );
    expect(SITE_IMAGE_ASSETS.categories.refrigerators.src).toContain('category-refrigerators.webp');
    expect(fixture.nativeElement.querySelector('.toolbar input')?.getAttribute('placeholder')).toBe(
      'ابحث داخل المتجر عن منتج أو ماركة...',
    );
    expect(fixture.nativeElement.textContent).toContain('لا توجد منتجات متاحة حاليًا');
  });

  it('selects كل المنتجات by default', async () => {
    const fixture = await setup({
      search: () =>
        of({
          items: [],
          total: 0,
          filters: FILTERS_WITH_CATEGORIES,
        }),
    });
    const allButton = [...fixture.nativeElement.querySelectorAll('.shop-category-nav__item')].find(
      (button: HTMLButtonElement) => button.textContent?.includes('كل المنتجات'),
    ) as HTMLButtonElement;
    expect(allButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('selects the category from the URL', async () => {
    const fixture = await setup(
      {
        search: () =>
          of({
            items: [],
            total: 0,
            filters: FILTERS_WITH_CATEGORIES,
          }),
      },
      { category: 'fridges' },
    );
    const fridgeButton = [...fixture.nativeElement.querySelectorAll('.shop-category-nav__item')].find(
      (button: HTMLButtonElement) => button.textContent?.includes('ثلاجات'),
    ) as HTMLButtonElement;
    expect(fridgeButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('maps the refrigerators alias to fridges', async () => {
    const fixture = await setup(
      {
        search: () =>
          of({
            items: [],
            total: 0,
            filters: FILTERS_WITH_CATEGORIES,
          }),
      },
      { category: 'refrigerators' },
    );

    const fridgeButton = [
      ...fixture.nativeElement.querySelectorAll('.shop-category-nav__item'),
    ].find((button: HTMLButtonElement) => button.textContent?.includes('ثلاجات')) as HTMLButtonElement;
    expect(fridgeButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('shows a retryable error state', async () => {
    const fixture = await setup({
      search: () => throwError(() => new Error('fail')),
    });

    expect(fixture.nativeElement.textContent).toContain(USER_ERROR_MESSAGES.server);
    expect(fixture.nativeElement.querySelector('.error-state button')?.textContent).toContain(
      'إعادة المحاولة',
    );
  });
});
