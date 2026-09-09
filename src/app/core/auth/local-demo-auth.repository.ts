import { inject, Injectable } from '@angular/core';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { BrowserStorageService } from '@core/services/browser-storage.service';
import { normalizeEmail } from '@core/utils/email.util';
import { normalizeEgyptianMobile } from '@core/utils/egyptian-phone.util';
import { AccountAddress, AccountOrder, AccountServiceRequest } from './account.models';
import { AUTH_COPY, AUTH_STORAGE_KEYS, DEMO_EMAIL, DEMO_PHONE } from './auth.constants';
import {
  AuthError,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  StoredAuthUser,
  UpdateProfileRequest,
} from './auth.models';
import { AuthRepository } from './auth.repository';
import {
  clearSession,
  publicUser,
  readSession,
  readUsers,
  readVersionedList,
  writeSession,
  writeVersionedList,
} from './auth-storage.util';
import {
  createDemoAddresses,
  createDemoOrders,
  createDemoServiceRequests,
  createDemoUser,
} from './demo-seed';
import { canHashPassword, hashPassword, verifyPassword } from './password-hash.util';

@Injectable()
export class LocalDemoAuthRepository extends AuthRepository {
  private readonly storage = inject(BrowserStorageService);
  private seedPromise: Promise<void> | null = null;

  ensureReady(): Promise<void> {
    return this.ensureSeed();
  }

  async restoreSession(): Promise<AuthUser | null> {
    await this.ensureReady();
    const session = readSession(this.storage, AUTH_STORAGE_KEYS.session);
    if (!session) {
      return null;
    }
    const user = this.findUserById(session.userId);
    if (!user) {
      clearSession(this.storage, AUTH_STORAGE_KEYS.session);
      return null;
    }
    return publicUser(user);
  }

  async login(request: LoginRequest): Promise<AuthUser> {
    await this.ensureSeed();
    this.assertCrypto();
    const identifier = request.identifier.trim();
    const email = normalizeEmail(identifier);
    const phone = normalizeEgyptianMobile(identifier);
    const user = this.readAllUsers().find(
      (item) => item.email === email || (phone !== null && item.phone === phone),
    );
    if (!user || !(await verifyPassword(request.password, user.password))) {
      throw new AuthError('invalid-credentials', AUTH_COPY.invalidCredentials);
    }
    writeSession(this.storage, AUTH_STORAGE_KEYS.session, user.id, request.rememberMe);
    return publicUser(user);
  }

  async register(request: RegisterRequest): Promise<AuthUser> {
    await this.ensureSeed();
    this.assertCrypto();
    const email = normalizeEmail(request.email);
    const phone = normalizeEgyptianMobile(request.phone);
    if (!phone) {
      throw new AuthError('unknown', USER_ERROR_MESSAGES.unknown);
    }
    this.assertUnique(email, phone);
    const user: StoredAuthUser = {
      id: `user-${globalThis.crypto.randomUUID()}`,
      firstName: request.firstName.trim(),
      lastName: request.lastName.trim(),
      email,
      phone,
      createdAt: Date.now(),
      password: await hashPassword(request.password),
    };
    writeVersionedList(this.storage, AUTH_STORAGE_KEYS.users, [...this.readAllUsers(), user]);
    writeSession(this.storage, AUTH_STORAGE_KEYS.session, user.id, true);
    return publicUser(user);
  }

  async logout(): Promise<void> {
    clearSession(this.storage, AUTH_STORAGE_KEYS.session);
  }

  async updateProfile(userId: string, request: UpdateProfileRequest): Promise<AuthUser> {
    await this.ensureSeed();
    const users = this.readAllUsers();
    const index = users.findIndex((item) => item.id === userId);
    const current = users[index];
    if (!current) {
      throw new AuthError('unknown', USER_ERROR_MESSAGES.unknown);
    }
    const email = normalizeEmail(request.email);
    const phone = normalizeEgyptianMobile(request.phone);
    if (!phone) {
      throw new AuthError('unknown', USER_ERROR_MESSAGES.unknown);
    }
    this.assertUnique(email, phone, userId);
    const updated: StoredAuthUser = {
      ...current,
      firstName: request.firstName.trim(),
      lastName: request.lastName.trim(),
      email,
      phone,
    };
    users[index] = updated;
    writeVersionedList(this.storage, AUTH_STORAGE_KEYS.users, users);
    return publicUser(updated);
  }

  private assertUnique(email: string, phone: string, ignoreUserId?: string): void {
    const users = this.readAllUsers().filter((item) => item.id !== ignoreUserId);
    if (users.some((item) => item.email === email)) {
      throw new AuthError('duplicate-email', AUTH_COPY.duplicateEmail);
    }
    if (users.some((item) => item.phone === phone)) {
      throw new AuthError('duplicate-phone', AUTH_COPY.duplicatePhone);
    }
  }

  private assertCrypto(): void {
    if (!canHashPassword()) {
      throw new AuthError('unknown', AUTH_COPY.cryptoUnavailable);
    }
  }

  private findUserById(userId: string): StoredAuthUser | undefined {
    return this.readAllUsers().find((item) => item.id === userId);
  }

  private readAllUsers(): StoredAuthUser[] {
    return readUsers(this.storage, AUTH_STORAGE_KEYS.users);
  }

  private ensureSeed(): Promise<void> {
    this.seedPromise ??= this.seedIfEmpty();
    return this.seedPromise;
  }

  private async seedIfEmpty(): Promise<void> {
    if (this.readAllUsers().length > 0) {
      return;
    }
    if (!canHashPassword()) {
      return;
    }
    const demoUser = await createDemoUser();
    writeVersionedList(this.storage, AUTH_STORAGE_KEYS.users, [demoUser]);
    writeVersionedList(this.storage, AUTH_STORAGE_KEYS.addresses, createDemoAddresses());
    writeVersionedList(this.storage, AUTH_STORAGE_KEYS.orders, createDemoOrders());
    writeVersionedList(this.storage, AUTH_STORAGE_KEYS.serviceRequests, createDemoServiceRequests());
  }
}

export function readDemoOrders(storage: BrowserStorageService): AccountOrder[] {
  return readVersionedList<AccountOrder>(storage, AUTH_STORAGE_KEYS.orders, true);
}

export function readDemoAddresses(storage: BrowserStorageService): AccountAddress[] {
  return readVersionedList<AccountAddress>(storage, AUTH_STORAGE_KEYS.addresses, true);
}

export function readDemoServiceRequests(storage: BrowserStorageService): AccountServiceRequest[] {
  return readVersionedList<AccountServiceRequest>(storage, AUTH_STORAGE_KEYS.serviceRequests, true);
}

export { DEMO_EMAIL, DEMO_PHONE };
