import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { BRANDS_PAGE_CONFIG } from '@core/config/brands-page.config';
import { BrandsRepository } from '../../data-access/brands.repository';
import { BrandsPageComponent } from './brands-page.component';

describe('BrandsPageComponent', () => {
  it('renders brand cards and hides the featured card when none is configured', async () => {
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
                items: [
                  {
                    id: 'lg',
                    slug: 'lg',
                    name: 'LG',
                    imageSrc: '/assets/images/brand/lg.svg',
                    categorySlug: 'fridges',
                    categoryLabel: 'ثلاجات',
                    initial: 'L',
                  },
                  {
                    id: 'tcl',
                    slug: 'tcl',
                    name: 'TCL',
                    imageSrc: '',
                    categorySlug: 'tvs',
                    categoryLabel: 'تليفزيونات',
                    initial: 'T',
                  },
                ],
                total: 2,
                initials: ['L', 'T'],
                featured: null,
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
    expect(compiled.querySelector('h1')?.textContent).toContain('تسوق من علامات تجارية موثوقة');
    expect(compiled.querySelector('.brand-featured')).toBeNull();
    expect(compiled.textContent).toContain('LG');
    expect(compiled.textContent).toContain('TCL');
    expect(compiled.querySelector('a.brand-card')?.getAttribute('href')).toContain('brand=lg');
  });

  it('shows an empty message when no brands match', async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: BrandsRepository,
          useValue: {
            search: () => of({ items: [], total: 0, initials: ['L'], featured: null }),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({ q: 'xyz' })),
            snapshot: { queryParamMap: convertToParamMap({ q: 'xyz' }) },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(BrandsPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('لم نجد علامة تجارية مطابقة لاختياراتك');
    expect(BRANDS_PAGE_CONFIG.featuredBrandSlug).toBe('');
    expect(SITE_IMAGE_ASSETS.brands.hero.src).toContain('home-bundle-showcase.webp');
  });
});
