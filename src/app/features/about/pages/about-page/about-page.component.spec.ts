import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ABOUT_STATS, ABOUT_TIMELINE } from '../../about.content';
import { AboutPageComponent } from './about-page.component';

describe('AboutPageComponent', () => {
  it('renders story, values, journey and CTA, and hides empty stats and timeline', async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPageComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(AboutPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('بيتك يستاهل اختيارًا أوضح');
    expect(
      compiled.querySelector('.page-hero img.site-image') ?? compiled.querySelector('.page-hero img'),
    ).toBeTruthy();
    expect(compiled.querySelector('.brand-logo--page img')?.getAttribute('ng-src') ??
      compiled.querySelector('.brand-logo--page img')?.getAttribute('src')).toContain('brand/store-logo.jpg');
    expect(compiled.textContent).toContain('قيم نلتزم بها');
    expect(compiled.textContent).toContain('رحلة العميل');
    expect(compiled.textContent).toContain('تسوق الآن');
    expect(compiled.querySelector('.about-stats')).toBeNull();
    expect(compiled.querySelector('.about-timeline')).toBeNull();
    expect(ABOUT_STATS).toEqual([]);
    expect(ABOUT_TIMELINE).toEqual([]);
    expect(compiled.textContent).not.toContain('+15');
    expect(compiled.textContent).not.toContain('10,000');
  });
});
