import { inject, Injectable } from '@angular/core';
import { BrowserStorageService } from '@core/services/browser-storage.service';
import { AccountAddress, AccountOrder, AccountServiceRequest } from './account.models';
import { AccountRepository } from './account.repository';
import { AUTH_STORAGE_KEYS } from './auth.constants';
import { AuthRepository } from './auth.repository';
import { writeVersionedList } from './auth-storage.util';
import { readDemoAddresses, readDemoOrders, readDemoServiceRequests } from './local-demo-auth.repository';

@Injectable()
export class LocalDemoAccountRepository extends AccountRepository {
  private readonly storage = inject(BrowserStorageService);
  private readonly auth = inject(AuthRepository);

  async listOrders(userId: string): Promise<readonly AccountOrder[]> {
    await this.auth.ensureReady();
    return readDemoOrders(this.storage)
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.placedAt - a.placedAt);
  }

  async getOrder(userId: string, orderId: string): Promise<AccountOrder | null> {
    const orders = await this.listOrders(userId);
    return orders.find((item) => item.id === orderId) ?? null;
  }

  async listAddresses(userId: string): Promise<readonly AccountAddress[]> {
    await this.auth.ensureReady();
    return readDemoAddresses(this.storage).filter((item) => item.userId === userId);
  }

  async saveAddress(
    userId: string,
    address: Omit<AccountAddress, 'id' | 'userId'> & { readonly id?: string },
  ): Promise<AccountAddress> {
    await this.auth.ensureReady();
    const all = readDemoAddresses(this.storage);
    const id = address.id ?? `address-${globalThis.crypto.randomUUID()}`;
    const next: AccountAddress = { ...address, id, userId };
    const withoutCurrent = all.filter((item) => item.id !== id);
    const othersForUser = withoutCurrent.filter((item) => item.userId === userId);
    const shouldBeDefault = next.isDefault || othersForUser.length === 0;
    const saved: AccountAddress = { ...next, isDefault: shouldBeDefault };
    const merged = [
      ...withoutCurrent.map((item) =>
        item.userId === userId && saved.isDefault ? { ...item, isDefault: false } : item,
      ),
      saved,
    ];
    writeVersionedList(this.storage, AUTH_STORAGE_KEYS.addresses, merged);
    return saved;
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    await this.auth.ensureReady();
    const all = readDemoAddresses(this.storage);
    const target = all.find((item) => item.id === addressId && item.userId === userId);
    if (!target) {
      return;
    }
    const remaining = all.filter((item) => item.id !== addressId);
    const userRemaining = remaining.filter((item) => item.userId === userId);
    if (target.isDefault && userRemaining.length > 0 && !userRemaining.some((item) => item.isDefault)) {
      const first = userRemaining[0];
      const promoted: AccountAddress[] = remaining.map((item) =>
        item.id === first.id ? { ...item, isDefault: true } : item,
      );
      writeVersionedList(this.storage, AUTH_STORAGE_KEYS.addresses, promoted);
      return;
    }
    writeVersionedList(this.storage, AUTH_STORAGE_KEYS.addresses, remaining);
  }

  async listServiceRequests(userId: string): Promise<readonly AccountServiceRequest[]> {
    await this.auth.ensureReady();
    return readDemoServiceRequests(this.storage)
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
}
