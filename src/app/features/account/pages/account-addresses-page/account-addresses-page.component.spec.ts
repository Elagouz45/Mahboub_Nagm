import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@core/auth/auth.constants';
import { AuthStore } from '@core/auth/auth.store';
import { authTestProviders, clearAuthStorage } from '@core/auth/auth-testing';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { AccountAddressesPageComponent } from './account-addresses-page.component';

describe('AccountAddressesPageComponent', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  async function setup() {
    await TestBed.configureTestingModule({
      imports: [AccountAddressesPageComponent],
      providers: [
        ...authTestProviders(),
        provideRouter([]),
        { provide: WHATSAPP_NUMBER, useValue: '' },
      ],
    }).compileComponents();
    const auth = TestBed.inject(AuthStore);
    await auth.login({ identifier: DEMO_EMAIL, password: DEMO_PASSWORD, rememberMe: true });
    const fixture = TestBed.createComponent(AccountAddressesPageComponent);
    await fixture.componentInstance.reload();
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance, auth };
  }

  it('lists demo addresses and supports create and delete', async () => {
    const { fixture, component } = await setup();
    expect(fixture.nativeElement.textContent).toContain('مدينة نصر');
    expect(component.addresses().length).toBe(2);

    component.openCreate();
    component.form.setValue({
      label: 'other',
      recipientName: 'أحمد محمد',
      phone: '01012345678',
      governorateSlug: 'alexandria',
      city: 'سموحة',
      street: 'شارع فوزي معاذ',
      details: '',
      isDefault: false,
    });
    await component.save();
    fixture.detectChanges();
    expect(component.addresses().length).toBe(3);

    const extra = component.addresses().find((item) => item.city === 'سموحة');
    expect(extra).toBeTruthy();
    vi.spyOn(globalThis, 'confirm').mockReturnValue(true);
    await component.remove(extra!);
    expect(component.addresses().length).toBe(2);
  });
});
