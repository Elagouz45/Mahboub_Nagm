import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AUTH_STORAGE_KEYS } from '@core/auth/auth.constants';
import { AuthStore } from '@core/auth/auth.store';
import { authTestProviders, clearAuthStorage } from '@core/auth/auth-testing';
import { BrowserStorageService } from '@core/services/browser-storage.service';
import { AccountProfilePageComponent } from './account-profile-page.component';

describe('AccountProfilePageComponent', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  it('saves profile changes and restores them from storage', async () => {
    await TestBed.configureTestingModule({
      imports: [AccountProfilePageComponent],
      providers: [...authTestProviders(), provideRouter([])],
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
    fixture.componentInstance.form.patchValue({ firstName: 'كرم' });
    await fixture.componentInstance.save();
    expect(auth.user()?.firstName).toBe('كرم');

    const storage = TestBed.inject(BrowserStorageService);
    const session = storage.readLocalJson<{ userId: string }>(AUTH_STORAGE_KEYS.session);
    expect(session?.userId).toBe(auth.user()?.id);

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AccountProfilePageComponent],
      providers: [...authTestProviders(), provideRouter([])],
    }).compileComponents();
    const restored = TestBed.inject(AuthStore);
    await restored.restoreSession();
    expect(restored.user()?.firstName).toBe('كرم');
    expect(restored.user()?.email).toBe('karim@test.example');
  });
});
