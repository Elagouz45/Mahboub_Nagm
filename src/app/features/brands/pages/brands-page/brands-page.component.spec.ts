import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BrandsRepository } from '../../data-access/brands.repository';
import { BrandsPageComponent } from './brands-page.component';

const lg = {
  id: 'lg',
  slug: 'lg',
  name: 'LG',
  imageSrc: '/assets/images/brand/lg.png',
  categorySlug: 'fridges',
  categoryLabel: 'ثلاجات وأجهزة منزلية',
  initial: 'L',
  productCount: 4,
};

const tcl = {
  id: 'tcl',
  slug: 'tcl',
  name: 'TCL',
  imageSrc: '/assets/images/brand/tcl.png',
  categorySlug: 'tvs',
  categoryLabel: 'تلفزيونات',
  initial: 'T',
  productCount: 1,
};

describe('BrandsPageComponent', () => {
  it('renders the intro, filters, and brand cards', async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: BrandsRepository,
          useValue: {
            search: () =>
              of({
                items: [lg, tcl],
                total: 9,
                catalogTotal: 9,
                initials: ['C', 'F', 'L', 'P', 'S', 'T'],
                featured: null,
                wall: [lg],
              }),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({})),
            snapshot: { queryParamMap: convertToParamMap({}) },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(BrandsPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('اختاري ماركتك المفضلة');
    expect(compiled.textContent).toContain('علامات أصلية لبيتك');
    expect(compiled.textContent).toContain('كل العلامات التجارية');
    expect(compiled.textContent).toContain('9 علامات');
    expect(compiled.querySelector('.page-hero')).toBeNull();
    expect(compiled.querySelector('.brand-tile')).toBeNull();
    expect(compiled.textContent).toContain('LG');
    expect(compiled.textContent).toContain('TCL');
    expect(compiled.querySelector('img')?.getAttribute('src')).toContain('/assets/images/brand/lg.png');
    expect(compiled.querySelector('img')?.getAttribute('alt')).toBe('شعار LG');
    expect(compiled.querySelectorAll('.brand-card__name').length).toBe(2);
    expect(compiled.querySelector('a.brand-card')?.getAttribute('href')).toContain('brand=lg');
    expect(compiled.querySelector('[aria-pressed="true"]')?.textContent?.trim()).toBe('الكل');
    expect(compiled.querySelector('input[type="search"]')?.getAttribute('placeholder')).toBe(
      'ابحث باسم الماركة...',
    );
  });

  it('shows an empty message when no brands match the current filters', async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: BrandsRepository,
          useValue: {
            search: () =>
              of({
                items: [],
                total: 0,
                catalogTotal: 9,
                initials: ['L'],
                featured: null,
                wall: [lg],
              }),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({ initial: 'Z' })),
            snapshot: { queryParamMap: convertToParamMap({ initial: 'Z' }) },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(BrandsPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('لم نجد علامة تجارية مطابقة');
    expect(fixture.nativeElement.textContent).toContain('عرض الكل');
  });
});
