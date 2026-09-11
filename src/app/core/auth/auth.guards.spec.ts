import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { DEMO_EMAIL, DEMO_PASSWORD } from './auth.constants';
import { authGuard, guestGuard } from './auth.guards';
import { AuthStore } from './auth.store';
import { authTestProviders, clearAuthStorage } from './auth-testing';

@Component({ template: '' })
class GuardHostComponent {}

describe('auth guards', () => {
  beforeEach(() => {
    clearAuthStorage();
    TestBed.configureTestingModule({
      providers: [
        ...authTestProviders(),
        provideRouter([
          { path: '', component: GuardHostComponent },
          { path: 'account', canActivate: [authGuard], component: GuardHostComponent },
          { path: 'login', canActivate: [guestGuard], component: GuardHostComponent },
        ]),
      ],
    });
  });

  afterEach(() => {
    clearAuthStorage();
  });

  it('sends guests to login and signed-in users away from auth pages', async () => {
    const router = TestBed.inject(Router);
    const auth = TestBed.inject(AuthStore);

    await router.navigateByUrl('/account');
    expect(router.url.startsWith('/login')).toBe(true);
    expect(router.url).toContain('returnUrl');

    await auth.login({ identifier: DEMO_EMAIL, password: DEMO_PASSWORD, rememberMe: true });
    await router.navigateByUrl('/');
    await router.navigateByUrl('/login');
    expect(router.url.startsWith('/account')).toBe(true);
  });
});
