import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { ShopBannerComponent } from './shop-banner.component';

describe('ShopBannerComponent', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [ShopBannerComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(ShopBannerComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the shop heading, registry banner, and a scroll CTA button', async () => {
    const fixture = await setup();
    const compiled = fixture.nativeElement as HTMLElement;
    const image = compiled.querySelector('img');
    const cta = compiled.querySelector<HTMLButtonElement>('.shop-banner__cta');

    expect(compiled.querySelector('h1')?.textContent).toContain('كل احتياجات بيتك في مكان واحد');
    expect(compiled.textContent).toContain(
      'اكتشف أحدث الأجهزة الكهربائية من أفضل الماركات، وقارن بين المنتجات والأسعار بسهولة.',
    );
    expect(compiled.querySelector('app-shop-breadcrumb')).not.toBeNull();
    expect(SITE_IMAGE_ASSETS.banners.shop.src).toContain('shop-banner.png');
    expect(image?.getAttribute('ng-src') ?? image?.getAttribute('src')).toContain('shop-banner.png');
    expect(image?.getAttribute('loading')).not.toBe('lazy');
    expect(cta?.tagName).toBe('BUTTON');
    expect(cta?.textContent).toContain('تسوق الآن');

    let explored = false;
    fixture.componentInstance.explore.subscribe(() => {
      explored = true;
    });
    cta?.click();
    expect(explored).toBe(true);
  });
});
