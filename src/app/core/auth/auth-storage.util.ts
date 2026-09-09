import { BrowserStorageService } from '@core/services/browser-storage.service';
import { AUTH_SCHEMA_VERSION, AuthSession, AuthUser, StoredAuthUser, VersionedList } from './auth.models';

export function readVersionedList<T>(
  storage: BrowserStorageService,
  key: string,
  local: boolean,
): T[] {
  const payload = local
    ? storage.readLocalJson<VersionedList<T>>(key)
    : storage.readJson<VersionedList<T>>(key);
  if (!payload || payload.schemaVersion !== AUTH_SCHEMA_VERSION || !Array.isArray(payload.items)) {
    return [];
  }
  return [...payload.items];
}

export function writeVersionedList<T>(
  storage: BrowserStorageService,
  key: string,
  items: readonly T[],
  local = true,
): void {
  const payload: VersionedList<T> = { schemaVersion: AUTH_SCHEMA_VERSION, items };
  if (local) {
    storage.writeLocalJson(key, payload);
    return;
  }
  storage.writeJson(key, payload);
}

export function readUsers(storage: BrowserStorageService, key: string): StoredAuthUser[] {
  return readVersionedList<StoredAuthUser>(storage, key, true).filter(isStoredUser);
}

export function readSession(storage: BrowserStorageService, key: string): AuthSession | null {
  const local = asSession(storage.readLocalJson<AuthSession>(key));
  if (local) {
    return local;
  }
  return asSession(storage.readJson<AuthSession>(key));
}

export function writeSession(
  storage: BrowserStorageService,
  key: string,
  userId: string,
  rememberMe: boolean,
): void {
  const session: AuthSession = { schemaVersion: AUTH_SCHEMA_VERSION, userId };
  storage.removeLocal(key);
  storage.removeJson(key);
  if (rememberMe) {
    storage.writeLocalJson(key, session);
    return;
  }
  storage.writeJson(key, session);
}

export function clearSession(storage: BrowserStorageService, key: string): void {
  storage.removeLocal(key);
  storage.removeJson(key);
}

export function publicUser(user: StoredAuthUser): AuthUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
  };
}

function asSession(value: AuthSession | null): AuthSession | null {
  if (!value || value.schemaVersion !== AUTH_SCHEMA_VERSION || typeof value.userId !== 'string') {
    return null;
  }
  return value;
}

function isStoredUser(value: StoredAuthUser): boolean {
  return (
    typeof value.id === 'string' &&
    typeof value.email === 'string' &&
    typeof value.phone === 'string' &&
    typeof value.firstName === 'string' &&
    typeof value.lastName === 'string' &&
    Boolean(value.password?.hash) &&
    Boolean(value.password?.salt)
  );
}
