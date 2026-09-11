import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { AccountOrder } from '@core/auth/account.models';
import { AccountRepository } from '@core/auth/account.repository';
import { AuthStore } from '@core/auth/auth.store';
import { authTestProviders, clearAuthStorage } from '@core/auth/auth-testing';
import { AccountOrdersPageComponent } from './account-orders-page.component';

function order(
  partial: Partial<AccountOrder> & Pick<AccountOrder, 'id' | 'number' | 'status'>,
): AccountOrder {
  return {
    userId: 'u1',
    placedAt: 1,
    paymentLabel: '',
    shippingAddressId: '',
    shippingLabel: '',
    lines: [
      {
        productId: `p-${partial.id}`,
        slug: `p-${partial.id}`,
        title: 'منتج',
        imageSrc: 'a.jpg',
        imageAlt: '',
        quantity: 1,
        unitPrice: 1,
      },
    ],
    subtotal: 1,
    shippingFee: 0,
    total: 1999,
    ...partial,
  };
}

const SAMPLE_ORDERS: readonly AccountOrder[] = [
  order({ id: 'o6', number: '12584', status: 'shipped', placedAt: 6, total: 28450 }),
  order({ id: 'o5', number: '12521', status: 'pending-review', placedAt: 5, total: 24999 }),
  order({ id: 'o4', number: '12491', status: 'delivered', placedAt: 4, total: 18999 }),
  order({ id: 'o3', number: '12400', status: 'delivered', placedAt: 3 }),
  order({ id: 'o2', number: '12300', status: 'shipped', placedAt: 2 }),
  order({ id: 'o1', number: '12200', status: 'pending-review', placedAt: 1 }),
];

describe('AccountOrdersPageComponent', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  async function setup(
    orders: readonly AccountOrder[] | (() => Promise<readonly AccountOrder[]>) = [],
    query: Record<string, string> = {},
  ) {
    const listOrders =
      typeof orders === 'function' ? orders : () => Promise.resolve(orders);

    await TestBed.configureTestingModule({
      imports: [AccountOrdersPageComponent],
      providers: [
        ...authTestProviders(),
        provideRouter([
          { path: 'products', component: AccountOrdersPageComponent },
          { path: 'account/orders/:orderId', component: AccountOrdersPageComponent },
        ]),
        {
          provide: AccountRepository,
          useValue: {
            listOrders,
            getOrder: () => Promise.resolve(null),
            listAddresses: () => Promise.resolve([]),
            saveAddress: () => Promise.reject(new Error('unused')),
            deleteAddress: () => Promise.resolve(),
            listServiceRequests: () => Promise.resolve([]),
          },
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

    const auth = TestBed.inject(AuthStore);
    await auth.register({
      firstName: 'محمد',
      lastName: 'محمود',
      phone: '01055555555',
      email: 'orders@test.example',
      password: 'Secret123',
    });

    const fixture = TestBed.createComponent(AccountOrdersPageComponent);
    await fixture.componentInstance.load();
    fixture.detectChanges();
    return fixture;
  }

  it('renders the page header, filter counts, and a shop empty state', async () => {
    const fixture = await setup([]);
    const text = fixture.nativeElement.textContent as string;

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('طلباتي');
    expect(text).toContain('تابع حالة طلباتك وتفاصيل الشراء.');
    expect(text).toContain('الكل');
    expect(text).toContain('قيد التنفيذ');
    expect(text).toContain('تم التسليم');
    expect(text).toContain('ملغي');
    expect(text).toContain('لا توجد طلبات بعد');
    expect(text).toContain('تسوق الآن');
    expect(fixture.nativeElement.querySelector('input[type="search"]')?.getAttribute('placeholder')).toBe(
      'ابحث برقم الطلب',
    );
    expect(text).not.toContain('إعادة الطلب');
    expect(text).not.toContain('منتجات مقترحة');
  });

  it('shows real status counts and rows from the repository', async () => {
    const fixture = await setup(SAMPLE_ORDERS);
    const text = fixture.nativeElement.textContent as string;
    const chips = [...fixture.nativeElement.querySelectorAll('.orders-chips button')].map(
      (button: HTMLButtonElement) => button.textContent?.replace(/\s+/g, ' ').trim(),
    );

    expect(chips).toEqual(['الكل6', 'قيد التنفيذ4', 'تم التسليم2', 'ملغي0']);
    expect(fixture.nativeElement.querySelectorAll('app-account-order-row').length).toBe(5);
    expect(text).toContain('طلب #12584');
    expect(text).toContain('تفاصيل الطلب');
    expect(fixture.nativeElement.querySelector('a.order-row__details')?.getAttribute('href')).toBe(
      '/account/orders/o6',
    );
    expect(text).not.toContain('طلب #12200');
    expect(fixture.nativeElement.querySelector('app-catalog-pagination')).toBeTruthy();
  });

  it('filters in-progress orders from the query string', async () => {
    const fixture = await setup(SAMPLE_ORDERS, { status: 'in-progress' });
    const text = fixture.nativeElement.textContent as string;
    const active = fixture.nativeElement.querySelector('.orders-chips button.is-active') as HTMLButtonElement;

    expect(active.textContent).toContain('قيد التنفيذ');
    expect(fixture.nativeElement.querySelectorAll('app-account-order-row').length).toBe(4);
    expect(text).toContain('طلب #12584');
    expect(text).toContain('طلب #12521');
    expect(text).not.toContain('طلب #12491');
  });

  it('shows the cancelled empty state and keeps filter counts', async () => {
    const fixture = await setup(SAMPLE_ORDERS, { status: 'cancelled' });
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('لا توجد طلبات ملغاة');
    expect(text).toContain('ملغي0');
    expect(text).not.toContain('تسوق الآن');
    expect(fixture.nativeElement.querySelectorAll('app-account-order-row').length).toBe(0);
  });

  it('filters by order number and ignores product titles', async () => {
    const fixture = await setup(
      [
        order({
          id: 'hit',
          number: '12584',
          status: 'shipped',
          lines: [
            {
              productId: 'p1',
              slug: 'p1',
              title: 'غسالة',
              imageSrc: 'a.jpg',
              imageAlt: '',
              quantity: 1,
              unitPrice: 1,
            },
          ],
        }),
        order({
          id: 'miss',
          number: '99999',
          status: 'delivered',
          lines: [
            {
              productId: 'p2',
              slug: 'p2',
              title: 'طلب 12584',
              imageSrc: 'b.jpg',
              imageAlt: '',
              quantity: 1,
              unitPrice: 1,
            },
          ],
        }),
      ],
      { q: '12584' },
    );
    const text = fixture.nativeElement.textContent as string;

    expect(fixture.nativeElement.querySelectorAll('app-account-order-row').length).toBe(1);
    expect(text).toContain('طلب #12584');
    expect(text).not.toContain('طلب #99999');
  });

  it('shows a search empty state when no order number matches', async () => {
    const fixture = await setup(SAMPLE_ORDERS, { q: '00000' });
    expect(fixture.nativeElement.textContent).toContain('لا توجد نتائج مطابقة');
    expect(fixture.nativeElement.querySelector('input[type="search"]')).toBeTruthy();
  });

  it('paginates from the page query param', async () => {
    const fixture = await setup(SAMPLE_ORDERS, { page: '2' });
    const text = fixture.nativeElement.textContent as string;

    expect(fixture.nativeElement.querySelectorAll('app-account-order-row').length).toBe(1);
    expect(text).toContain('طلب #12200');
    expect(text).not.toContain('طلب #12584');
  });

  it('writes status and page into query params without a reload', async () => {
    const fixture = await setup(SAMPLE_ORDERS);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.onStatus('delivered');
    expect(navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: { status: 'delivered', page: null, q: null },
      }),
    );

    fixture.componentInstance.onPage(2);
    expect(navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: { status: null, page: 2, q: null },
      }),
    );
  });

  it('shows an error state and retries loading', async () => {
    let shouldFail = true;
    const fixture = await setup(() =>
      shouldFail ? Promise.reject(new Error('fail')) : Promise.resolve(SAMPLE_ORDERS),
    );

    expect(fixture.nativeElement.textContent).toContain('حدث خطأ غير متوقع');
    expect(fixture.nativeElement.textContent).toContain('إعادة المحاولة');

    shouldFail = false;
    await fixture.componentInstance.load();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('طلب #12584');
    expect(fixture.nativeElement.querySelectorAll('app-account-order-row').length).toBe(5);
  });
});
