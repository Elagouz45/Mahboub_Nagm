import { provideZonelessChangeDetection } from '@angular/core';
import { provideAuth } from './provide-auth';

export function clearAuthStorage(): void {
  localStorage.clear();
  sessionStorage.clear();
}

export function authTestProviders() {
  return [provideZonelessChangeDetection(), ...provideAuth()];
}
