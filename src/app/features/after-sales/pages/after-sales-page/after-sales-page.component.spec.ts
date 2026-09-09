import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SITE_CONTACT_CONFIG } from '@core/config/site-contact.config';
import { AfterSalesPageComponent } from './after-sales-page.component';

describe('AfterSalesPageComponent', () => {
  async function setup(phone = '') {
    await TestBed.configureTestingModule({
      imports: [AfterSalesPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: SITE_CONTACT_CONFIG,
          useValue: { phone, email: '', workingHours: '', social: [] },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfterSalesPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('links services to contact types without a fake warranty result or phone', async () => {
    const fixture = await setup();
    const compiled = fixture.nativeElement as HTMLElement;
    const hrefs = [...compiled.querySelectorAll<HTMLAnchorElement>('a')].map(
      (link) => link.getAttribute('href') ?? '',
    );

    expect(compiled.querySelector('h1')?.textContent).toContain('راحتك مستمرة بعد الشراء');
    expect(compiled.querySelectorAll('h1')).toHaveLength(1);
    expect(hrefs).toContain('#after-sales-services');
    expect(hrefs).toContain('/contact?type=order');
    expect(hrefs.filter((href) => href === '/contact?type=maintenance').length).toBeGreaterThanOrEqual(2);
    expect(hrefs).toContain('/contact?topic=warranty');
    expect(compiled.textContent).toContain('استفسر عن الضمان');
    expect(compiled.textContent).not.toContain('تحقق من الضمان');
    expect(compiled.textContent).not.toContain('رقم مرجعي');
    expect(compiled.textContent).not.toContain('16642');
    expect(compiled.querySelector('a[href^="tel:"]')).toBeNull();
    expect(compiled.querySelector('form')).toBeNull();
  });

  it('shows the phone only when SITE_CONTACT has a number', async () => {
    const fixture = await setup('01001234567');
    const compiled = fixture.nativeElement as HTMLElement;
    const phone = compiled.querySelector<HTMLAnchorElement>('a[href="tel:01001234567"]');
    expect(phone?.textContent).toContain('01001234567');
    expect(compiled.textContent).not.toContain('16642');
  });
});
