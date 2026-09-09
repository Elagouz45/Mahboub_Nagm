import { TestBed } from '@angular/core/testing';
import { AUTH_STORAGE_KEYS, DEMO_EMAIL, DEMO_PASSWORD } from './auth.constants';
import { AuthStore } from './auth.store';
import { authTestProviders, clearAuthStorage } from './auth-testing';
import { BrowserStorageService } from '@core/services/browser-storage.service';

describe('AuthStore', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  it('restores a remembered session and keeps a tab session when remember me is off', async () => {
    TestBed.configureTestingModule({ providers: authTestProviders() });
    const store = TestBed.inject(AuthStore);
    const storage = TestBed.inject(BrowserStorageService);

    await store.login({ identifier: DEMO_EMAIL, password: DEMO_PASSWORD, rememberMe: false });
    expect(storage.readJson(AUTH_STORAGE_KEYS.session)).toEqual(
      expect.objectContaining({ userId: store.user()?.id }),
    );
    expect(storage.readLocalJson(AUTH_STORAGE_KEYS.session)).toBeNull();

    await store.logout();
    await store.login({ identifier: DEMO_EMAIL, password: DEMO_PASSWORD, rememberMe: true });
    expect(storage.readLocalJson(AUTH_STORAGE_KEYS.session)).toEqual(
      expect.objectContaining({ userId: store.user()?.id }),
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: authTestProviders() });
    const restored = TestBed.inject(AuthStore);
    await restored.restoreSession();
    expect(restored.user()?.email).toBe(DEMO_EMAIL);
  });
});
