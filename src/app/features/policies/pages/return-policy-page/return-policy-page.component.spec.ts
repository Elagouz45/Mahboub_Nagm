import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ReturnPolicyPageComponent } from './return-policy-page.component';

describe('ReturnPolicyPageComponent', () => {
  async function setup(fragment: string | null = null) {
    await TestBed.configureTestingModule({
      imports: [ReturnPolicyPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { fragment: of(fragment) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ReturnPolicyPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('keeps honest copy, hash targets, and a contact CTA that does not loop', async () => {
    const fixture = await setup();
    const compiled = fixture.nativeElement as HTMLElement;
    const hrefs = [...compiled.querySelectorAll<HTMLAnchorElement>('a')].map(
      (link) => link.getAttribute('href') ?? '',
    );

    expect(compiled.querySelector('h1')?.textContent).toContain('الاستبدال والاسترجاع');
    expect(hrefs).toContain('/contact?type=complaint&topic=returns');
    expect(hrefs).toContain('/contact');
    expect(hrefs).toContain('#return-prep');
    expect(compiled.querySelector('#return-conditions')).not.toBeNull();
    expect(compiled.textContent).not.toContain('14 يوم');
    expect(compiled.textContent).not.toContain('30 يوم');
    expect(compiled.textContent).not.toMatch(/\d+\s*(يوم|جنيه)/);
    expect(compiled.textContent).not.toContain('16642');
  });

  it('opens the matching accordion from the page hash', async () => {
    const fixture = await setup('return-refund');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector<HTMLButtonElement>(
      'button[aria-controls="accordion-return-refund"]',
    );
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.querySelector('#accordion-return-refund')?.textContent).toContain(
      'طريقة رد المبلغ',
    );
  });
});
