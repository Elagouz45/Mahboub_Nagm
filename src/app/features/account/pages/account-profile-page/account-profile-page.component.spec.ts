import { TestBed } from '@angular/core/testing';
import { AUTH_COPY, AUTH_STORAGE_KEYS } from '@core/auth/auth.constants';
import { AuthStore } from '@core/auth/auth.store';
import { authTestProviders, clearAuthStorage } from '@core/auth/auth-testing';
import { BrowserStorageService } from '@core/services/browser-storage.service';
import { ToastService } from '@core/services/toast.service';
import { AccountProfilePageComponent } from './account-profile-page.component';

describe('AccountProfilePageComponent', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  async function setup() {
    await TestBed.configureTestingModule({
      imports: [AccountProfilePageComponent],
      providers: [...authTestProviders()],
    }).compileComponents();

    const auth = TestBed.inject(AuthStore);
    await auth.register({
      firstName: 'كريم',
      lastName: 'فؤاد',
      phone: '01098765432',
      email: 'karim@test.example',
      password: 'Secret123',
    });

    const fixture = TestBed.createComponent(AccountProfilePageComponent);
    fixture.detectChanges();
    return { fixture, auth, toast: TestBed.inject(ToastService) };
  }

  it('renders the account profile chrome without photo upload', async () => {
    const { fixture } = await setup();
    const text = fixture.nativeElement.textContent as string;
    const save = [...fixture.nativeElement.querySelectorAll('button')].find((node) =>
      node.textContent?.includes('حفظ التعديلات'),
    ) as HTMLButtonElement;

    expect(text).toContain('بيانات الحساب');
    expect(text).toContain('حدّث بياناتك الشخصية ومعلومات تسجيل الدخول.');
    expect(text).toContain('البيانات الشخصية');
    expect(text).toContain('تغيير كلمة المرور');
    expect(text).toContain('استخدم 8 أحرف على الأقل.');
    expect(text).not.toContain('تغيير الصورة');
    expect(text).not.toContain('حذف الحساب');
    expect(save.disabled).toBe(true);
  });

  it('saves profile changes and restores them from storage', async () => {
    const { fixture, auth, toast } = await setup();
    fixture.componentInstance.form.patchValue({ firstName: 'كرم' });
    fixture.componentInstance.form.markAsDirty();
    fixture.detectChanges();

    const save = [...fixture.nativeElement.querySelectorAll('button')].find((node) =>
      node.textContent?.includes('حفظ التعديلات'),
    ) as HTMLButtonElement;
    expect(save.disabled).toBe(false);

    await fixture.componentInstance.saveProfile();
    fixture.detectChanges();
    expect(auth.user()?.firstName).toBe('كرم');
    expect(toast.messages().some((item) => item.text === AUTH_COPY.profileSaved)).toBe(true);

    const storage = TestBed.inject(BrowserStorageService);
    const session = storage.readLocalJson<{ userId: string }>(AUTH_STORAGE_KEYS.session);
    expect(session?.userId).toBe(auth.user()?.id);

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AccountProfilePageComponent],
      providers: [...authTestProviders()],
    }).compileComponents();
    const restored = TestBed.inject(AuthStore);
    await restored.restoreSession();
    expect(restored.user()?.firstName).toBe('كرم');
    expect(restored.user()?.email).toBe('karim@test.example');
  });

  it('shows an egyptian phone error without saving', async () => {
    const { fixture, auth } = await setup();
    fixture.componentInstance.form.patchValue({ phone: '12345' });
    fixture.componentInstance.form.markAsDirty();
    await fixture.componentInstance.saveProfile();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('أدخل رقمًا مصريًا صحيحًا.');
    expect(auth.user()?.phone).toBe('01098765432');
  });

  it('requires the confirmation to match the new password', async () => {
    const { fixture } = await setup();
    fixture.componentInstance.passwordForm.setValue({
      currentPassword: 'Secret123',
      newPassword: 'Secret1234',
      confirmPassword: 'Mismatch1',
    });
    fixture.componentInstance.passwordForm.markAsDirty();
    await fixture.componentInstance.savePassword();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('كلمتا المرور غير متطابقتين.');
  });

  it('rejects the wrong current password and then accepts a valid change', async () => {
    const { fixture, auth, toast } = await setup();
    fixture.componentInstance.passwordForm.setValue({
      currentPassword: 'Wrong12345',
      newPassword: 'Secret1234',
      confirmPassword: 'Secret1234',
    });
    fixture.componentInstance.passwordForm.markAsDirty();
    await fixture.componentInstance.savePassword();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('كلمة المرور الحالية غير صحيحة.');

    fixture.componentInstance.passwordForm.setValue({
      currentPassword: 'Secret123',
      newPassword: 'Secret1234',
      confirmPassword: 'Secret1234',
    });
    await fixture.componentInstance.savePassword();
    expect(toast.messages().some((item) => item.text === AUTH_COPY.passwordChanged)).toBe(true);

    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.users) ?? '';
    expect(stored).not.toContain('Secret1234');
    expect(stored).not.toContain('Secret123');

    await auth.logout();
    await auth.login({
      identifier: 'karim@test.example',
      password: 'Secret1234',
      rememberMe: false,
    });
    expect(auth.user()?.email).toBe('karim@test.example');
  });
});
