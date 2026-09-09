import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { ServiceCentersRepository } from '../../data-access/service-centers.repository';
import { ServiceCentersPageComponent } from './service-centers-page.component';

describe('ServiceCentersPageComponent', () => {
  async function setup(
    repo: Partial<ServiceCentersRepository> = { search: () => of({ items: [], total: 0 }) },
  ) {
    await TestBed.configureTestingModule({
      imports: [ServiceCentersPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ServiceCentersRepository, useValue: repo },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({})),
            snapshot: { queryParamMap: convertToParamMap({}) },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ServiceCentersPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('shows an honest empty list and hides map, directions, and invented addresses', async () => {
    const fixture = await setup();
    const compiled = fixture.nativeElement as HTMLElement;
    const hrefs = [...compiled.querySelectorAll<HTMLAnchorElement>('a')].map(
      (link) => link.getAttribute('href') ?? '',
    );

    expect(compiled.querySelector('h1')?.textContent).toContain('مراكز الصيانة');
    expect(compiled.textContent).toContain('لا توجد مراكز صيانة معتمدة مطابقة');
    expect(hrefs).toContain('/contact?type=maintenance');
    expect(compiled.querySelector('iframe')).toBeNull();
    expect(compiled.querySelector('[aria-label="خريطة"]')).toBeNull();
    expect(compiled.textContent).not.toContain('الاتجاهات');
    expect(compiled.textContent).not.toContain('سموحة');
    expect(compiled.textContent).not.toContain('16642');
    expect(compiled.querySelector('select')?.textContent).toContain('القاهرة');
  });

  it('shows a retryable error without inventing centers', async () => {
    const fixture = await setup({ search: () => throwError(() => new Error('network')) });
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(USER_ERROR_MESSAGES.server);
    expect(compiled.querySelector('button')?.textContent).toContain('إعادة المحاولة');
    expect(compiled.textContent).not.toContain('فرع');
  });
});
