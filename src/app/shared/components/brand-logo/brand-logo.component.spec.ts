import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { BrandLogoComponent } from './brand-logo.component';

describe('BrandLogoComponent', () => {
  it('renders the square store logo without stretching', async () => {
    await TestBed.configureTestingModule({
      imports: [BrandLogoComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(BrandLogoComponent);
    fixture.componentRef.setInput('variant', 'header');
    fixture.componentRef.setInput('priority', true);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const frame = root.querySelector('.brand-logo') as HTMLElement;
    const image = root.querySelector('img') as HTMLImageElement | null;

    expect(frame.classList.contains('brand-logo--header')).toBe(true);
    expect(image?.getAttribute('ng-src') ?? image?.getAttribute('src')).toBe(
      SITE_IMAGE_ASSETS.brand.logo.src,
    );
    expect(image?.getAttribute('alt')).toBe('');
    expect(image?.getAttribute('width')).toBeNull();
    expect(SITE_IMAGE_ASSETS.brand.logo.width).toBe(SITE_IMAGE_ASSETS.brand.logo.height);
  });
});
