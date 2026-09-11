import { Provider } from '@angular/core';
import { environment } from '@environments/environment';
import { AccountRepository } from './account.repository';
import { ApiAccountRepository } from './api-account.repository';
import { ApiAuthRepository } from './api-auth.repository';
import { AuthRepository } from './auth.repository';
import { LocalDemoAccountRepository } from './local-demo-account.repository';
import { LocalDemoAuthRepository } from './local-demo-auth.repository';

/**
 * Local mock vs future API: flip `environment.useMockAuth`.
 * Pages keep using AuthStore; only this adapter mapping changes.
 */
export function provideAuth(): Provider[] {
  if (environment.useMockAuth) {
    return [
      { provide: AuthRepository, useClass: LocalDemoAuthRepository },
      { provide: AccountRepository, useClass: LocalDemoAccountRepository },
    ];
  }

  return [
    { provide: AuthRepository, useClass: ApiAuthRepository },
    { provide: AccountRepository, useClass: ApiAccountRepository },
  ];
}
