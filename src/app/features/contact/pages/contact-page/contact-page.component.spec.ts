import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { SITE_CONTACT } from '@core/config/site-contact.config';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { EMPTY_AVAILABLE_FILTERS } from '@features/catalog/models/catalog.model';
import { CatalogRepository } from '@features/catalog/data-access/catalog.repository';
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
          provide: CatalogRepository,
          useValue: { search: () => of({ items: [], total: 0, filters: EMPTY_AVAILABLE_FILTERS }) },
        },
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

  it('hides empty direct contact, branches, and map, and keeps the form', async () => {
    const fixture = await setup();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('نحن قريبون منك دائمًا');
    expect(compiled.querySelector('.contact-aside')).toBeNull();
    expect(compiled.textContent).not.toContain('16642');
    expect(compiled.textContent).not.toContain('سموحة');
    expect(compiled.querySelector('.contact-form')).not.toBeNull();
    expect(SITE_CONTACT.phone).toBe('');
  });

  it('requires an Egyptian phone and keeps data when the stub fails', async () => {
    const fixture = await setup({ submit: () => of('unavailable') });
    const compiled = fixture.nativeElement as HTMLElement;
    const page = fixture.componentInstance;

    page.form.patchValue({
      name: 'أحمد محمد',
      phone: '12345',
      email: 'user@example.com',
      message: 'أريد الاستفسار عن ثلاجة مناسبة للبيت.',
    });
    page.submit();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('أدخل رقمًا مصريًا صحيحًا');

    page.form.controls.phone.setValue('01012345678');
    page.submit();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('تعذر إرسال الرسالة حاليًا، حاول مرة أخرى');
    expect(compiled.textContent).not.toContain('رقم مرجعي');
    expect(page.form.controls.name.value).toBe('أحمد محمد');
  });

  it('shows maintenance fields when type=maintenance', async () => {
    const fixture = await setup({ submit: () => of('failed') }, { type: 'maintenance' });
    expect(fixture.nativeElement.textContent).toContain('نوع الجهاز');
    expect(fixture.nativeElement.textContent).toContain('وصف العطل');
  });
});
