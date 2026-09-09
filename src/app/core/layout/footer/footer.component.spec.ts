import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SITE_CONTACT, SITE_CONTACT_CONFIG, SiteContactConfig } from '@core/config/site-contact.config';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-footer-spec-host',
  template: '',
})
class FooterSpecHostComponent {}

describe('FooterComponent', () => {
  async function setup(
    options: {
      whatsapp?: string;
      contact?: SiteContactConfig;
    } = {},
  ) {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: '', component: FooterSpecHostComponent },
          { path: 'products', component: FooterSpecHostComponent },
          { path: 'contact', component: FooterSpecHostComponent },
          { path: 'brands', component: FooterSpecHostComponent },
          { path: 'offers', component: FooterSpecHostComponent },
          { path: 'about', component: FooterSpecHostComponent },
          { path: 'account', component: FooterSpecHostComponent },
          { path: 'after-sales', component: FooterSpecHostComponent },
          { path: 'return-policy', component: FooterSpecHostComponent },
          { path: 'privacy-policy', component: FooterSpecHostComponent },
          { path: 'service-centers', component: FooterSpecHostComponent },
        ]),
        { provide: WHATSAPP_NUMBER, useValue: options.whatsapp ?? '' },
        { provide: SITE_CONTACT_CONFIG, useValue: options.contact ?? SITE_CONTACT },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture };
  }

  function footerEl(fixture: { nativeElement: HTMLElement }): HTMLElement {
    return fixture.nativeElement.querySelector('footer') as HTMLElement;
  }

  function navHrefs(root: HTMLElement, label: string): string[] {
    const nav = root.querySelector(`nav[aria-label="${label}"]`);
    return [...(nav?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].map(
      (link) => link.getAttribute('href') ?? '',
    );
  }

  it('links the brand mark to the home page', async () => {
    const { fixture } = await setup();
    const brand = footerEl(fixture).querySelector<HTMLAnchorElement>('.app-footer__brand');
    expect(brand?.getAttribute('href')).toBe('/');
    expect(brand?.querySelector('img')?.getAttribute('ng-src') ?? brand?.querySelector('img')?.getAttribute('src')).toContain(
      'brand/store-logo.jpg',
    );
    expect(brand?.textContent).toContain('محبوب نجم');
    expect(brand?.textContent).toContain('بيتك يستاهل الأفضل');
  });

  it('does not render a newsletter subscription section', async () => {
    const { fixture } = await setup();
    const footer = footerEl(fixture);
    expect(footer.querySelector('.app-footer__newsletter')).toBeNull();
    expect(footer.textContent).not.toContain('اشترك في نشرتنا البريدية');
  });

  it('renders the intended quick and service routes only', async () => {
    const { fixture } = await setup();
    const footer = footerEl(fixture);

    expect(navHrefs(footer, 'روابط سريعة')).toEqual([
      '/',
      '/products',
      '/offers',
      '/brands',
      '/about',
      '/after-sales',
      '/contact',
    ]);
    expect(footer.querySelector('nav[aria-label="تسوق"]')).toBeNull();
    expect(navHrefs(footer, 'خدمة العملاء')).toEqual([
      '/account',
      '/contact?topic=faq',
      '/contact?topic=shipping',
      '/return-policy',
      '/privacy-policy',
      '/contact?topic=warranty',
      '/service-centers',
    ]);
    expect(navHrefs(footer, 'روابط قانونية')).toEqual(['/return-policy', '/privacy-policy']);
    expect(footer.querySelector('.app-footer__contact-cta')?.getAttribute('href')).toBe('/contact');
    expect(footer.textContent).toContain('صنع في مصر لخدمة كل بيت');
    expect(footer.textContent).toContain('سياسة الخصوصية');
    expect(footer.textContent).toContain('خدمات ما بعد البيع');
    expect(footer.textContent).not.toContain('متابعة الطلب');
    expect(footer.textContent).not.toContain('الشروط والأحكام');
    expect(footer.textContent).not.toContain('16642');
  });

  it('does not render placeholder hash links', async () => {
    const { fixture } = await setup();
    const hrefs = [...footerEl(fixture).querySelectorAll<HTMLAnchorElement>('a')].map(
      (link) => link.getAttribute('href') ?? '',
    );
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.every((href) => href && href !== '#' && !href.startsWith('javascript:'))).toBe(true);
    expect(footerEl(fixture).querySelector('.app-footer__social')).toBeNull();
  });

  it('hides phone, email, hours, WhatsApp, and social when contact data is empty', async () => {
    const { fixture } = await setup();
    const footer = footerEl(fixture);
    expect(footer.querySelector('a[href^="tel:"]')).toBeNull();
    expect(footer.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(footer.querySelector('.app-footer__whatsapp')).toBeNull();
    expect(footer.querySelector('.app-footer__social')).toBeNull();
    expect(footer.textContent).toContain('تُضاف بيانات الهاتف والعنوان عند توفرها من إدارة المتجر.');
  });

  it('shows WhatsApp when a number is provided', async () => {
    const { fixture } = await setup({ whatsapp: '+20 100 123 4567' });
    const link = footerEl(fixture).querySelector<HTMLAnchorElement>('.app-footer__whatsapp');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toContain('https://wa.me/201001234567');
    expect(footerEl(fixture).textContent).not.toContain(
      'تُضاف بيانات الهاتف والعنوان عند توفرها من إدارة المتجر.',
    );
  });

  it('shows phone, email, hours, and social only when configured', async () => {
    const { fixture } = await setup({
      contact: {
        phone: '01001234567',
        email: 'hello@example.test',
        workingHours: 'يومياً من 10 صباحاً',
        social: [
          {
            platform: 'facebook',
            label: 'فيسبوك',
            url: 'https://facebook.com/mahbub-najm',
            icon: 'facebook',
          },
        ],
      },
    });
    const footer = footerEl(fixture);
    expect(footer.querySelector('a[href="tel:01001234567"]')?.textContent).toContain('01001234567');
    expect(footer.querySelector('a[href="mailto:hello@example.test"]')?.textContent).toContain(
      'hello@example.test',
    );
    expect(footer.textContent).toContain('يومياً من 10 صباحاً');
    expect(footer.querySelector('.app-footer__social a')?.getAttribute('href')).toBe(
      'https://facebook.com/mahbub-najm',
    );
  });

  it('shows the current year in the copyright line', async () => {
    const { fixture } = await setup();
    const year = new Date().getFullYear();
    expect(footerEl(fixture).querySelector('.app-footer__legal')?.textContent).toContain(
      `© ${year} محبوب نجم. جميع الحقوق محفوظة.`,
    );
  });

  it('uses an accessible accordion for quick and service links on compact screens', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) =>
      ({
        matches: query.includes('767'),
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
        onchange: null,
      }) as MediaQueryList) as typeof window.matchMedia;

    try {
      const { fixture } = await setup();
      const footer = footerEl(fixture);
      const toggle = footer.querySelector<HTMLButtonElement>(
        'button[aria-controls="footer-quick-links"]',
      );
      const list = footer.querySelector<HTMLUListElement>('#footer-quick-links');

      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute('aria-expanded')).toBe('false');
      expect(list?.hidden).toBe(true);

      toggle?.click();
      fixture.detectChanges();
      expect(toggle?.getAttribute('aria-expanded')).toBe('true');
      expect(list?.hidden).toBe(false);
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });
});
