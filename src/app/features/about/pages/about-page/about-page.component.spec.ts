import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ABOUT_STATS, ABOUT_TIMELINE } from '../../about.content';
import { AboutPageComponent } from './about-page.component';

describe('AboutPageComponent', () => {
  it('renders the about story, stats, timeline, values, journey and CTA', async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPageComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(AboutPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h1');
    const heroImage =
      compiled.querySelector('.about-hero__media img') ?? compiled.querySelector('.about-hero img');
    const imageSrc = heroImage?.getAttribute('ng-src') ?? heroImage?.getAttribute('src') ?? '';
    const hrefs = [...compiled.querySelectorAll('a')].map((anchor) => anchor.getAttribute('href'));

    expect(compiled.querySelectorAll('h1').length).toBe(1);
    expect(heading?.textContent).toContain('نساعدك تختار الصح لبيتك');
    expect(compiled.querySelector('app-page-breadcrumb')).toBeTruthy();
    expect(compiled.querySelector('app-brand-logo')).toBeNull();
    expect(compiled.querySelector('app-page-trust-strip')).toBeNull();
    expect(heroImage).toBeTruthy();
    expect(imageSrc).toContain('appliance-shopping-family');
    expect(compiled.textContent).toContain('حكايتنا بدأت من احتياج بسيط');
    expect(compiled.textContent).toContain('القيم اللي بنشتغل بيها');
    expect(compiled.textContent).toContain('من الاختيار لحد التشغيل');
    expect(compiled.textContent).toContain('تسوّق الآن');
    expect(compiled.textContent).toContain('ابدأ التسوق');
    expect(compiled.textContent).toContain('10+');
    expect(compiled.textContent).toContain('20+');
    expect(compiled.textContent).toContain('10,000+');
    expect(compiled.textContent).toContain('توصيل لكل');
    expect(compiled.querySelector('.about-stats')).toBeTruthy();
    expect(compiled.querySelector('.about-timeline')).toBeTruthy();
    expect(compiled.textContent).toContain('البداية');
    expect(compiled.textContent).toContain('التوسع');
    expect(compiled.textContent).toContain('اليوم');
    expect(hrefs).toContain('/products');
    expect(hrefs).toContain('/after-sales');
    expect(hrefs).toContain('/contact');
    expect(ABOUT_STATS.length).toBe(4);
    expect(ABOUT_TIMELINE.length).toBe(3);
  });
});
