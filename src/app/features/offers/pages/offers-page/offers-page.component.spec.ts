import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { CART_PORT, WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { EMPTY_AVAILABLE_FILTERS } from '@features/catalog/models/catalog.model';
import { MOCK_OFFERS } from '@features/home/data-access/home.mock';
import { of } from 'rxjs';
import { OffersRepository } from '../../data-access/offers.repository';
import { OffersPageComponent } from './offers-page.component';

describe('OffersPageComponent', () => {
  it('renders catalog-backed offers, real tabs, and the max discount badge', async () => {
    const added: unknown[] = [];
    await TestBed.configureTestingModule({
      imports: [OffersPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: WHATSAPP_NUMBER, useValue: '' },
        {
          provide: CART_PORT,
          useValue: {
            count: signal(0),
            items: signal([]),
            add: (product: unknown) => added.push(product),
            remove: () => undefined,
          },
        },
        {
          provide: WISHLIST_PORT,
          useValue: {
            count: signal(0),
            items: signal([]),
            ids: signal(new Set()),
            toggle: () => undefined,
            remove: () => undefined,
          },
        },
        {
          provide: OffersRepository,
          useValue: {
            search: () =>
              of({
                items: [MOCK_OFFERS[1]],
                total: 1,
                filters: EMPTY_AVAILABLE_FILTERS,
                maxDiscountPercent: 22,
                endsAt: null,
              }),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({ type: 'today' })),
            snapshot: { queryParamMap: convertToParamMap({ type: 'today' }) },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(OffersPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('عروض حقيقية لبيتك');
    expect(compiled.textContent).toContain('حتى 22٪');
    expect(compiled.textContent).toContain('غسالة سامسونج 8 كيلو');
    expect(compiled.textContent).not.toContain('باقات');
    expect(compiled.textContent).not.toContain('شحن مجاني');
    expect(compiled.querySelector('[role="tablist"]')?.textContent).toContain('عروض اليوم');

    compiled.querySelector<HTMLButtonElement>('.btn--cart')?.click();
    expect(added).toEqual([MOCK_OFFERS[1]]);
  });
});
