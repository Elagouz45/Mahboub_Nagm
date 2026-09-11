import { provideZonelessChangeDetection } from '@angular/core';
import { provideAuth } from './provide-auth';
import { MOCK_AUTH_LATENCY_MS } from './auth.tokens';

export function clearAuthStorage(): void {
  localStorage.clear();
  sessionStorage.clear();
}

export function authTestProviders() {
  return [
    provideZonelessChangeDetection(),
    ...provideAuth(),
    { provide: MOCK_AUTH_LATENCY_MS, useValue: 0 },
  ];
}
