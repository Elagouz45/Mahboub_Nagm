import { TestBed } from '@angular/core/testing';
import { SITE_IMAGE_ASSETS, SITE_IMAGE_FALLBACK } from '@core/config/site-image-assets.config';
import { SiteImageComponent } from './site-image.component';

describe('SiteImageComponent', () => {
  it('renders the provided asset with Arabic alt text', async () => {
    await TestBed.configureTestingModule({
      imports: [SiteImageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(SiteImageComponent);
    fixture.componentRef.setInput('asset', SITE_IMAGE_ASSETS.products.airFryerBlack);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(image.getAttribute('ng-src') ?? image.getAttribute('src')).toContain(
      'air-fryer-black.webp',
    );
    expect(image.alt).toBe('قلاية هوائية سوداء');
    expect(image.getAttribute('loading')).toBe('lazy');
  });

  it('marks the hero image as priority instead of lazy-loading it', async () => {
    await TestBed.configureTestingModule({
      imports: [SiteImageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(SiteImageComponent);
    fixture.componentRef.setInput('asset', SITE_IMAGE_ASSETS.banners.mainHero);
    fixture.componentRef.setInput('priority', true);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(image.getAttribute('loading')).not.toBe('lazy');
    expect(image.getAttribute('fetchpriority')).toBe('high');
  });

  it('switches to the generic fallback once and ignores later errors', async () => {
    await TestBed.configureTestingModule({
      imports: [SiteImageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(SiteImageComponent);
    fixture.componentRef.setInput('src', 'https://cdn.example.com/missing.webp');
    fixture.componentRef.setInput('asset', SITE_IMAGE_ASSETS.products.smartTv55Inch);
    fixture.detectChanges();

    const first = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(first.getAttribute('ng-src') ?? first.getAttribute('src')).toContain(
      'cdn.example.com/missing.webp',
    );

    first.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    const afterError = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(afterError.getAttribute('ng-src') ?? afterError.getAttribute('src')).toContain(
      SITE_IMAGE_FALLBACK.src,
    );

    afterError.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    const afterSecondError = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(afterSecondError.getAttribute('ng-src') ?? afterSecondError.getAttribute('src')).toContain(
      SITE_IMAGE_FALLBACK.src,
    );
  });
});
