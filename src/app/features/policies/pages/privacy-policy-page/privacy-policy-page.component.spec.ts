import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PrivacyPolicyPageComponent } from './privacy-policy-page.component';

describe('PrivacyPolicyPageComponent', () => {
  async function setup(fragment: string | null = null) {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { fragment: of(fragment) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PrivacyPolicyPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('renders honest privacy copy without fake dates, badges, or cookie settings', async () => {
    const fixture = await setup();
    const compiled = fixture.nativeElement as HTMLElement;
    const hrefs = [...compiled.querySelectorAll<HTMLAnchorElement>('a')].map(
      (link) => link.getAttribute('href') ?? '',
    );

    expect(compiled.querySelector('h1')?.textContent).toContain('سياسة الخصوصية');
    expect(compiled.querySelectorAll('h1')).toHaveLength(1);
    expect(compiled.textContent).toContain('إدارة الطلبات');
    expect(compiled.textContent).toContain('التواصل معك');
    expect(compiled.textContent).toContain('تحسين التجربة');
    expect(hrefs).toContain('/contact?topic=privacy');
    expect(hrefs).toContain('#privacy-cookies');
    expect(compiled.querySelector('svg')).not.toBeNull();
    expect(compiled.textContent).not.toContain('آخر تحديث');
    expect(compiled.textContent).not.toContain('تفضيلات الكوكيز');
    expect(compiled.textContent).not.toContain('ISO');
    expect(compiled.textContent).not.toContain('16642');
  });

  it('opens the cookies accordion from the hash', async () => {
    const fixture = await setup('privacy-cookies');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="accordion-privacy-cookies"]',
    );
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.textContent).toContain('لا توجد لوحة تفضيلات كوكيز حاليًا');
  });
});
