import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AccountOrder } from '@core/auth/account.models';
import { AccountRepository } from '@core/auth/account.repository';
import { AuthStore } from '@core/auth/auth.store';
import { authTestProviders, clearAuthStorage } from '@core/auth/auth-testing';
import { AccountOverviewPageComponent } from './account-overview-page.component';

describe('AccountOverviewPageComponent', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  it('greets the signed-in user and shows an empty orders state', async () => {
    await TestBed.configureTestingModule({
      imports: [AccountOverviewPageComponent],
      providers: [
        ...authTestProviders(),
        provideRouter([{ path: 'products', component: AccountOverviewPageComponent }]),
      ],
    }).compileComponents();

    const auth = TestBed.inject(AuthStore);
    await auth.register({
      firstName: 'نادر',
      lastName: 'سالم',
      phone: '01055555555',
      email: 'nader@test.example',
      password: 'Secret123',
    });

    const fixture = TestBed.createComponent(AccountOverviewPageComponent);
    await fixture.componentInstance.load();
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('أهلاً، نادر');
    expect(text).toContain('نظرة عامة');
    expect(text).toContain('لا توجد طلبات بعد');
    expect(text).toContain('ابدأ التسوق');
    expect(text).toContain('لم تضف عنوانًا بعد');
    expect(text).not.toContain('طلبات الصيانة');
    expect(text).not.toContain('عروض');
  });

  it('shows at most two recent orders from the repository', async () => {
    const orders = [
      {
        id: 'o3',
        userId: 'u1',
        number: 'MN-3',
        status: 'pending-review',
        placedAt: 3,
        paymentLabel: '',
        shippingAddressId: '',
        shippingLabel: '',
        lines: [{ productId: 'p1', slug: 'p1', title: 'ثلاجة', imageSrc: 'a.jpg', imageAlt: '', quantity: 1, unitPrice: 1 }],
        subtotal: 1,
        shippingFee: 0,
        total: 1999,
      },
      {
        id: 'o2',
        userId: 'u1',
        number: 'MN-2',
        status: 'delivered',
        placedAt: 2,
        paymentLabel: '',
        shippingAddressId: '',
        shippingLabel: '',
        lines: [{ productId: 'p2', slug: 'p2', title: 'غسالة', imageSrc: 'b.jpg', imageAlt: '', quantity: 2, unitPrice: 1 }],
        subtotal: 1,
        shippingFee: 0,
        total: 2999,
      },
      {
        id: 'o1',
        userId: 'u1',
        number: 'MN-1',
        status: 'shipped',
        placedAt: 1,
        paymentLabel: '',
        shippingAddressId: '',
        shippingLabel: '',
        lines: [],
        subtotal: 1,
        shippingFee: 0,
        total: 1,
      },
    ] as AccountOrder[];

    await TestBed.configureTestingModule({
      imports: [AccountOverviewPageComponent],
      providers: [
        ...authTestProviders(),
        provideRouter([{ path: 'account/orders/:orderId', component: AccountOverviewPageComponent }]),
        {
          provide: AccountRepository,
          useValue: {
            listOrders: () => Promise.resolve(orders),
            listAddresses: () => Promise.resolve([]),
            getOrder: () => Promise.resolve(null),
            saveAddress: () => Promise.reject(new Error('unused')),
            deleteAddress: () => Promise.resolve(),
            listServiceRequests: () => Promise.resolve([]),
          },
        },
      ],
    }).compileComponents();

    const auth = TestBed.inject(AuthStore);
    await auth.register({
      firstName: 'نادر',
      lastName: 'سالم',
      phone: '01055555555',
      email: 'nader@test.example',
      password: 'Secret123',
    });

    const fixture = TestBed.createComponent(AccountOverviewPageComponent);
    await fixture.componentInstance.load();
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('طلب #MN-3');
    expect(text).toContain('طلب #MN-2');
    expect(text).not.toContain('طلب #MN-1');
    expect(text).toContain('جاري التجهيز');
    expect(text).toContain('تم التسليم');
    expect(fixture.nativeElement.querySelectorAll('app-account-order-row').length).toBe(2);
  });
});
