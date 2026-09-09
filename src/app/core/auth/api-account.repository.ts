import { Injectable } from '@angular/core';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { AccountRepository } from './account.repository';
import { AuthError } from './auth.models';

@Injectable()
export class ApiAccountRepository extends AccountRepository {
  listOrders(): Promise<never> {
    return Promise.reject(this.unavailable());
  }

  getOrder(): Promise<never> {
    return Promise.reject(this.unavailable());
  }

  listAddresses(): Promise<never> {
    return Promise.reject(this.unavailable());
  }

  saveAddress(): Promise<never> {
    return Promise.reject(this.unavailable());
  }

  deleteAddress(): Promise<never> {
    return Promise.reject(this.unavailable());
  }

  listServiceRequests(): Promise<never> {
    return Promise.reject(this.unavailable());
  }

  private unavailable(): AuthError {
    return new AuthError('unavailable', USER_ERROR_MESSAGES.server);
  }
}
