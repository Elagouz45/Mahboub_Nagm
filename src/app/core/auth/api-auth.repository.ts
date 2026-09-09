import { Injectable } from '@angular/core';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { AuthError } from './auth.models';
import { AuthRepository } from './auth.repository';

@Injectable()
export class ApiAuthRepository extends AuthRepository {
  ensureReady(): Promise<void> {
    return Promise.resolve();
  }

  restoreSession(): Promise<null> {
    return Promise.resolve(null);
  }

  login(): Promise<never> {
    return Promise.reject(this.unavailable());
  }

  register(): Promise<never> {
    return Promise.reject(this.unavailable());
  }

  logout(): Promise<void> {
    return Promise.resolve();
  }

  updateProfile(): Promise<never> {
    return Promise.reject(this.unavailable());
  }

  private unavailable(): AuthError {
    return new AuthError('unavailable', USER_ERROR_MESSAGES.server);
  }
}
