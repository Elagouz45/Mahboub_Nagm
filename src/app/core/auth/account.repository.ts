import { Injectable } from '@angular/core';
import { AccountAddress, AccountOrder, AccountServiceRequest } from './account.models';

@Injectable()
export abstract class AccountRepository {
  abstract listOrders(userId: string): Promise<readonly AccountOrder[]>;
  abstract getOrder(userId: string, orderId: string): Promise<AccountOrder | null>;
  abstract listAddresses(userId: string): Promise<readonly AccountAddress[]>;
  abstract saveAddress(
    userId: string,
    address: Omit<AccountAddress, 'id' | 'userId'> & { readonly id?: string },
  ): Promise<AccountAddress>;
  abstract deleteAddress(userId: string, addressId: string): Promise<void>;
  abstract listServiceRequests(userId: string): Promise<readonly AccountServiceRequest[]>;
}
