import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { ShopCategoryNavComponent } from './shop-category-nav.component';

describe('ShopCategoryNavComponent', () => {
  async function setup(selected = '') {
    await TestBed.configureTestingModule({
      imports: [ShopCategoryNavComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(ShopCategoryNavComponent);
    fixture.componentRef.setInput('selected', selected);
    fixture.detectChanges();
    return fixture;
  }

  it('renders a compact circular strip with the shop order and سخانات label', async () => {
    const fixture = await setup();
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = [...compiled.querySelectorAll<HTMLButtonElement>('.shop-category-nav__item')];
    const labels = buttons.map((button) =>
      button.querySelector('.shop-category-nav__label')?.textContent?.trim(),
    );

    expect(compiled.querySelector('h2')?.textContent).toContain('تسوق حسب القسم');
    expect(compiled.textContent).toContain('اختر القسم المناسب لعرض المنتجات');
    expect(labels).toEqual([
      'كل المنتجات',
      'ثلاجات',
      'غسالات',
      'تليفزيونات',
      'تكييفات',
      'بوتاجازات',
      'أفران وميكروويف',
      'سخانات',
      'مراوح',
      'مكانس كهربائية',
      'أجهزة صغيرة',
    ]);
    expect(compiled.textContent).not.toContain('سخانات مياه');
    expect(compiled.querySelector('.shop-category-nav__media')).not.toBeNull();
    expect(compiled.querySelector('.shop-category-nav__count')).toBeNull();

    const fridgeImg = compiled.querySelector('img') as HTMLImageElement | null;
    expect(fridgeImg?.getAttribute('ng-src') ?? fridgeImg?.getAttribute('src')).toContain(
      'category-refrigerators.webp',
    );
    expect(SITE_IMAGE_ASSETS.categories.refrigerators.src).toContain('category-refrigerators.webp');
    expect(fridgeImg?.getAttribute('loading')).not.toBe('lazy');
  });

  it('marks كل المنتجات vs a selected category and emits a cleared slug', async () => {
    const fixture = await setup('fridges');
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = [...compiled.querySelectorAll<HTMLButtonElement>('.shop-category-nav__item')];
    const fridge = buttons.find((button) => button.textContent?.includes('ثلاجات'));

    expect(buttons[0]?.getAttribute('aria-pressed')).toBe('false');
    expect(fridge?.getAttribute('aria-pressed')).toBe('true');

    let emitted: string | undefined;
    fixture.componentInstance.categoryChange.subscribe((slug) => {
      emitted = slug;
    });
    buttons[0]?.click();
    expect(emitted).toBe('');
  });
});
