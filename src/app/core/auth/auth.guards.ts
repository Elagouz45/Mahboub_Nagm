import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_LOGIN_PATH } from './auth.constants';
import { AuthStore } from './auth.store';

export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  await auth.restoreSession();
  if (auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree([AUTH_LOGIN_PATH], {
    queryParams: { returnUrl: state.url },
  });
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  await auth.restoreSession();
  if (!auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/account']);
};
