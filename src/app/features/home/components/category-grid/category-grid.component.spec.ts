import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Category, SectionState } from '@shared/models/storefront.model';
import { CategoryGridComponent } from './category-grid.component';

describe('CategoryGridComponent', () => {
  const categories: readonly Category[] = [
    {
      id: 'fridges',
      slug: 'fridges',
      name: 'ثلاجات',
      imageSrc: '/assets/images/categories/category-refrigerators.webp',
      imageAlt: 'ثلاجات',
    },
    {
      id: 'ovens',
      slug: 'ovens',
      name: 'أفران وميكروويف',
      imageSrc: '/assets/images/categories/category-ovens.webp',
      imageAlt: 'أفران وميكروويف',
    },
  ];

  async function setup(state: SectionState<readonly Category[]>) {
    await TestBed.configureTestingModule({
      imports: [CategoryGridComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(CategoryGridComponent);
    fixture.componentRef.setInput('state', state);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('shows a visible heading and compact category links', async () => {
    const fixture = await setup({ status: 'success', data: categories, error: null });
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('#categories-heading')?.textContent).toContain('الأقسام');
    expect(root.querySelector('#categories-heading')?.classList.contains('visually-hidden')).toBe(
      false,
    );
    expect(root.querySelector('.section-header a')?.getAttribute('href')).toBe('/products');

    const cards = [...root.querySelectorAll<HTMLAnchorElement>('.category-card')];
    expect(cards.map((card) => card.getAttribute('href'))).toEqual([
      '/products?category=fridges',
      '/products?category=ovens',
    ]);
    expect(cards[1]?.textContent).toContain('أفران وميكروويف');
    expect(root.querySelector('.category-card__media')).not.toBeNull();
  });

  it('keeps loading, empty, and retry states', async () => {
    const loading = await setup({ status: 'loading', data: [], error: null });
    expect(loading.nativeElement.querySelectorAll('.skeleton-card').length).toBe(10);

    TestBed.resetTestingModule();
    const empty = await setup({ status: 'empty', data: [], error: null });
    expect(empty.nativeElement.textContent).toContain('لا توجد أقسام حالياً');

    TestBed.resetTestingModule();
    const error = await setup({ status: 'error', data: [], error: 'تعذر التحميل' });
    expect(error.nativeElement.textContent).toContain('تعذر التحميل');
    expect(error.nativeElement.querySelector('button')).not.toBeNull();
  });
});
