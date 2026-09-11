import { inject, Injectable } from '@angular/core';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { isAddress } from '@core/models/demo-commerce.model';
import { BrowserStorageService } from '@core/services/browser-storage.service';
import { normalizeEmail } from '@core/utils/email.util';
import { normalizeEgyptianMobile } from '@core/utils/egyptian-phone.util';
import { AccountAddress, AccountOrder, AccountServiceRequest } from './account.models';
import { AUTH_COPY, AUTH_STORAGE_KEYS, DEMO_EMAIL, DEMO_PHONE, DEMO_USER_ID } from './auth.constants';
import {
  AuthError,
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  StoredAuthUser,
  UpdateProfileRequest,
} from './auth.models';
import { AuthRepository } from './auth.repository';
import { MOCK_AUTH_LATENCY_MS } from './auth.tokens';
import {
  clearSession,
  publicUser,
  readSession,
  readUsers,
  readVersionedList,
  writeSession,
  writeVersionedList,
} from './auth-storage.util';
import { createDemoAddresses, createDemoUser } from './demo-seed';
import { canHashPassword, hashPassword, verifyPassword } from './password-hash.util';

@Injectable()
export class LocalDemoAuthRepository extends AuthRepository {
  private readonly storage = inject(BrowserStorageService);
  private readonly latencyMs = inject(MOCK_AUTH_LATENCY_MS, { optional: true });
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
    await this.simulateNetwork();
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
    await this.simulateNetwork();
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

  async changePassword(userId: string, request: ChangePasswordRequest): Promise<void> {
    await this.ensureSeed();
    this.assertCrypto();
    const users = this.readAllUsers();
    const index = users.findIndex((item) => item.id === userId);
    const current = users[index];
    if (!current) {
      throw new AuthError('unknown', USER_ERROR_MESSAGES.unknown);
    }
    if (!(await verifyPassword(request.currentPassword, current.password))) {
      throw new AuthError('invalid-credentials', AUTH_COPY.invalidCredentials);
    }
    users[index] = { ...current, password: await hashPassword(request.newPassword) };
    writeVersionedList(this.storage, AUTH_STORAGE_KEYS.users, users);
  }

  private assertUnique(email: string, phone: string, ignoreUserId?: string): void {
    const users = this.readAllUsers().filter((item) => item.id !== ignoreUserId);
    if (users.some((item) => item.email === email)) {
      throw new AuthError('duplicate-email', AUTH_COPY.duplicateAccount);
    }
    if (users.some((item) => item.phone === phone)) {
      throw new AuthError('duplicate-phone', AUTH_COPY.duplicateAccount);
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
    this.seedPromise ??= this.seedDemoUser();
    return this.seedPromise;
  }

  private async seedDemoUser(): Promise<void> {
    if (!canHashPassword()) {
      return;
    }
    const users = this.readAllUsers();
    if (users.some((item) => item.id === DEMO_USER_ID || item.email === DEMO_EMAIL)) {
      return;
    }
    const demoUser = await createDemoUser();
    writeVersionedList(this.storage, AUTH_STORAGE_KEYS.users, [...users, demoUser]);
    const addresses = readDemoAddresses(this.storage);
    if (!addresses.some((item) => item.userId === DEMO_USER_ID)) {
      writeVersionedList(this.storage, AUTH_STORAGE_KEYS.addresses, [
        ...addresses,
        ...createDemoAddresses(),
      ]);
    }
  }

  private async simulateNetwork(): Promise<void> {
    const configured = this.latencyMs;
    const ms = configured === 0 ? 0 : (configured ?? 400 + Math.floor(Math.random() * 301));
    if (ms <= 0) {
      return;
    }
    await new Promise<void>((resolve) => {
      globalThis.setTimeout(resolve, ms);
    });
  }
}

export function readDemoOrders(storage: BrowserStorageService): AccountOrder[] {
  return readVersionedList<AccountOrder>(storage, AUTH_STORAGE_KEYS.orders, true);
}

export function readDemoAddresses(storage: BrowserStorageService): AccountAddress[] {
  return readVersionedList<AccountAddress>(storage, AUTH_STORAGE_KEYS.addresses, true).filter(
    isAddress,
  );
}

export function readDemoServiceRequests(storage: BrowserStorageService): AccountServiceRequest[] {
  return readVersionedList<AccountServiceRequest>(storage, AUTH_STORAGE_KEYS.serviceRequests, true);
}

export { DEMO_EMAIL, DEMO_PHONE };
