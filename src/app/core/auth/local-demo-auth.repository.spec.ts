import { TestBed } from '@angular/core/testing';
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_PHONE } from './auth.constants';
import { AuthError } from './auth.models';
import { AuthRepository } from './auth.repository';
import { authTestProviders, clearAuthStorage } from './auth-testing';

describe('LocalDemoAuthRepository', () => {
  beforeEach(() => {
    clearAuthStorage();
    TestBed.configureTestingModule({ providers: authTestProviders() });
  });

  afterEach(() => {
    clearAuthStorage();
  });

  it('logs in with email or phone and restores a remembered session', async () => {
    const repo = TestBed.inject(AuthRepository);
    const byEmail = await repo.login({
      identifier: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      rememberMe: true,
    });
    expect(byEmail.email).toBe(DEMO_EMAIL);
    await repo.logout();

    const byPhone = await repo.login({
      identifier: DEMO_PHONE,
      password: DEMO_PASSWORD,
      rememberMe: true,
    });
    expect(byPhone.phone).toBe(DEMO_PHONE);

    const restored = await repo.restoreSession();
    expect(restored?.id).toBe(byPhone.id);
  });

  it('rejects bad credentials without leaking which field failed', async () => {
    const repo = TestBed.inject(AuthRepository);
    await expect(
      repo.login({ identifier: DEMO_EMAIL, password: 'Wrong12345', rememberMe: false }),
    ).rejects.toMatchObject({
      code: 'invalid-credentials',
      message: 'البريد الإلكتروني أو رقم الهاتف أو كلمة المرور غير صحيحة.',
    });
  });

  it('registers a new user and rejects duplicate email or phone', async () => {
    const repo = TestBed.inject(AuthRepository);
    const created = await repo.register({
      firstName: 'منى',
      lastName: 'علي',
      phone: '01112345678',
      email: 'mona@test.example',
      password: 'Secret123',
    });
    expect(created.email).toBe('mona@test.example');

    await expect(
      repo.register({
        firstName: 'أخرى',
        lastName: 'علي',
        phone: '01212345678',
        email: 'mona@test.example',
        password: 'Secret123',
      }),
    ).rejects.toBeInstanceOf(AuthError);

    await expect(
      repo.register({
        firstName: 'أخرى',
        lastName: 'علي',
        phone: '01112345678',
        email: 'other@test.example',
        password: 'Secret123',
      }),
    ).rejects.toMatchObject({ code: 'duplicate-phone' });
  });

  it('changes the password hash without storing the plaintext secret', async () => {
    const repo = TestBed.inject(AuthRepository);
    const created = await repo.register({
      firstName: 'منى',
      lastName: 'علي',
      phone: '01112345678',
      email: 'mona@test.example',
      password: 'Secret123',
    });

    await expect(
      repo.changePassword(created.id, {
        currentPassword: 'Wrong12345',
        newPassword: 'Secret1234',
      }),
    ).rejects.toMatchObject({ code: 'invalid-credentials' });

    await repo.changePassword(created.id, {
      currentPassword: 'Secret123',
      newPassword: 'Secret1234',
    });

    const stored = localStorage.getItem('mahboub-nagm-mock-users-v1') ?? '';
    expect(stored).not.toContain('Secret1234');
    expect(created).not.toHaveProperty('password');

    await repo.logout();
    const signedIn = await repo.login({
      identifier: 'mona@test.example',
      password: 'Secret1234',
      rememberMe: false,
    });
    expect(signedIn.id).toBe(created.id);
  });
});
