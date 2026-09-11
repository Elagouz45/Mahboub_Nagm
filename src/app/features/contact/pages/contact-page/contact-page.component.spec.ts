import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { SITE_CONTACT } from '@core/config/site-contact.config';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { of } from 'rxjs';
import { ContactRepository } from '../../data-access/contact.repository';
import { ContactPageComponent } from './contact-page.component';

describe('ContactPageComponent', () => {
  async function setup(
    repo: Partial<ContactRepository> = { submit: () => of('unavailable') },
    query: Record<string, string> = {},
  ) {
    await TestBed.configureTestingModule({
      imports: [ContactPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: WHATSAPP_NUMBER, useValue: '' },
        { provide: ContactRepository, useValue: repo },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap(query)),
            snapshot: { queryParamMap: convertToParamMap(query) },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ContactPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('renders the quiet contact layout without extras', async () => {
    const fixture = await setup();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('h1').length).toBe(1);
    expect(compiled.querySelector('h1')?.textContent).toContain('يسعدنا نسمع منك');
    expect(compiled.querySelector('app-page-breadcrumb')).toBeTruthy();
    expect(compiled.querySelector('.contact-form')).toBeTruthy();
    expect(compiled.querySelector('.contact-details')).toBeTruthy();
    expect(compiled.querySelector('app-site-image')).toBeNull();
    expect(compiled.querySelector('app-page-trust-strip')).toBeNull();
    expect(compiled.querySelector('.purpose-grid')).toBeNull();
    expect(compiled.textContent).not.toContain('كم يستغرق التوصيل');
    expect(compiled.textContent).not.toContain('نوع الجهاز');
    expect(compiled.textContent).not.toContain('وصف العطل');
    expect(compiled.querySelector('input[formcontrolname="email"]')).toBeNull();
    expect(compiled.querySelector('input[formcontrolname="orderNumber"]')).toBeNull();
    expect(SITE_CONTACT.phone).toBe('');
    expect(compiled.querySelector('.contact-details a[href^="https://wa.me"]')).toBeNull();
  });

  it('requires an Egyptian phone and shows the failure copy when submit is unavailable', async () => {
    const fixture = await setup({ submit: () => of('unavailable') });
    const compiled = fixture.nativeElement as HTMLElement;
    const page = fixture.componentInstance;

    page.form.patchValue({
      type: 'product',
      name: 'أحمد محمد',
      phone: '12345',
      message: 'أريد الاستفسار عن ثلاجة مناسبة للبيت.',
    });
    page.submit();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('أدخل رقمًا مصريًا صحيحًا');

    page.form.controls.phone.setValue('01012345678');
    page.submit();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('تعذر إرسال الرسالة، حاول مرة أخرى.');
    expect(compiled.textContent).not.toContain('رقم مرجعي');
    expect(page.form.controls.name.value).toBe('أحمد محمد');
  });

  it('preselects maintenance without extra fields and shows success copy', async () => {
    const fixture = await setup({ submit: () => of({ reference: 'DEMO-1' }) }, { type: 'maintenance' });
    const compiled = fixture.nativeElement as HTMLElement;
    const page = fixture.componentInstance;

    expect(page.form.controls.type.value).toBe('maintenance');
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    const typeSelect = compiled.querySelector('select[formcontrolname="type"]') as HTMLSelectElement | null;
    expect(typeSelect?.selectedOptions[0]?.textContent).toContain('خدمة ما بعد البيع');
    expect(compiled.textContent).toContain('خدمة ما بعد البيع');
    expect(compiled.textContent).not.toContain('نوع الجهاز');
    expect(compiled.textContent).not.toContain('وصف العطل');

    page.form.patchValue({
      name: 'أحمد محمد',
      phone: '01012345678',
      message: 'أحتاج مساعدة في تركيب الغسالة الجديدة.',
    });
    page.submit();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('تم إرسال رسالتك بنجاح، سنتواصل معك قريبًا.');
    expect(compiled.querySelector('a[href^="/contact/requests"]')).toBeNull();
  });
});
