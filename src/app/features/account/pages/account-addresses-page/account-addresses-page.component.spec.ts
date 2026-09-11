import { TestBed } from '@angular/core/testing';
import { AccountRepository } from '@core/auth/account.repository';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@core/auth/auth.constants';
import { AuthStore } from '@core/auth/auth.store';
import { authTestProviders, clearAuthStorage } from '@core/auth/auth-testing';
import { ToastService } from '@core/services/toast.service';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { AccountAddressesPageComponent } from './account-addresses-page.component';

describe('AccountAddressesPageComponent', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  async function setup() {
    await TestBed.configureTestingModule({
      imports: [AccountAddressesPageComponent],
      providers: [...authTestProviders()],
    }).compileComponents();
    const auth = TestBed.inject(AuthStore);
    await auth.login({ identifier: DEMO_EMAIL, password: DEMO_PASSWORD, rememberMe: true });
    const fixture = TestBed.createComponent(AccountAddressesPageComponent);
    await fixture.componentInstance.reload();
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance, toast: TestBed.inject(ToastService) };
  }

  it('lists saved addresses in cards with the default highlighted', async () => {
    const { fixture, component } = await setup();
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('العناوين');
    expect(text).toContain('احفظ عناوينك لتوصيل أسرع في الطلبات القادمة.');
    expect(text).toContain('إضافة عنوان جديد');
    expect(text).toContain('المنزل');
    expect(text).toContain('العمل');
    expect(text).toContain('مدينة نصر');
    expect(text).toContain('الدقي');
    expect(text).toContain('العنوان الافتراضي');
    expect(text).toContain('عنوان إضافي');
    expect(text).toContain('تعيين كافتراضي');
    expect(text).toContain('سيتم استخدام العنوان الافتراضي تلقائيًا عند إتمام الطلب.');
    expect(text).not.toContain('خريطة');
    expect(component.addresses().length).toBe(2);
    expect(fixture.nativeElement.querySelector('.address-card.is-default')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.address-card').length).toBe(2);
  });

  it('creates an address from the editor dialog', async () => {
    const { fixture, component, toast } = await setup();
    component.openCreate();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('إضافة عنوان جديد');
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();

    component.form.setValue({
      label: 'other',
      recipientName: 'أحمد محمد',
      phone: '01012345678',
      governorateSlug: 'alexandria',
      city: 'سموحة',
      street: 'شارع فوزي معاذ',
      building: '5',
      floor: 'الدور الثاني',
      landmark: 'بجانب النادي',
      isDefault: false,
    });
    await component.save();
    fixture.detectChanges();

    expect(component.addresses().length).toBe(3);
    expect(component.addresses().some((item) => item.city === 'سموحة')).toBe(true);
    expect(component.addresses().find((item) => item.city === 'سموحة')?.details).toBe(
      '5، الدور الثاني، بجانب النادي',
    );
    expect(toast.messages().some((item) => item.text === 'تم حفظ العنوان')).toBe(true);
    expect(component.editorOpen()).toBe(false);
  });

  it('sets another address as default without opening the editor', async () => {
    const { fixture, component, toast } = await setup();
    const extra = component.addresses().find((item) => item.label === 'work');
    expect(extra).toBeTruthy();
    await component.makeDefault(extra!);
    fixture.detectChanges();

    expect(component.addresses().find((item) => item.id === extra!.id)?.isDefault).toBe(true);
    expect(component.editorOpen()).toBe(false);
    expect(toast.messages().some((item) => item.text === 'تم تعيين العنوان الافتراضي')).toBe(true);
  });

  it('confirms deletion by address name and refreshes the list', async () => {
    const confirmSpy = vi.spyOn(globalThis, 'confirm');
    const { fixture, component, toast } = await setup();
    const extra = component.addresses().find((item) => item.city === 'الدقي');
    expect(extra).toBeTruthy();

    component.requestDelete(extra!);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('حذف العنوان');
    expect(fixture.nativeElement.textContent).toContain('العمل');

    await component.confirmDelete();
    fixture.detectChanges();

    expect(component.addresses().length).toBe(1);
    expect(component.addresses().some((item) => item.city === 'الدقي')).toBe(false);
    expect(toast.messages().some((item) => item.text === 'تم حذف العنوان')).toBe(true);
    expect(component.deleteTarget()).toBeNull();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('shows an empty state after the last address is removed', async () => {
    const { fixture, component } = await setup();
    for (const address of [...component.addresses()]) {
      component.requestDelete(address);
      await component.confirmDelete();
    }
    fixture.detectChanges();

    expect(component.addresses().length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('لا توجد عناوين بعد');
    expect(fixture.nativeElement.querySelector('.address-card')).toBeNull();
  });

  it('shows an error state when addresses fail to load', async () => {
    await TestBed.configureTestingModule({
      imports: [AccountAddressesPageComponent],
      providers: [
        ...authTestProviders(),
        {
          provide: AccountRepository,
          useValue: {
            listOrders: () => Promise.resolve([]),
            getOrder: () => Promise.resolve(null),
            listAddresses: () => Promise.reject(new Error('fail')),
            saveAddress: () => Promise.reject(new Error('unused')),
            deleteAddress: () => Promise.resolve(),
            listServiceRequests: () => Promise.resolve([]),
          },
        },
      ],
    }).compileComponents();
    const auth = TestBed.inject(AuthStore);
    await auth.login({ identifier: DEMO_EMAIL, password: DEMO_PASSWORD, rememberMe: true });
    const fixture = TestBed.createComponent(AccountAddressesPageComponent);
    await fixture.componentInstance.reload();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(USER_ERROR_MESSAGES.unknown);
  });
});
