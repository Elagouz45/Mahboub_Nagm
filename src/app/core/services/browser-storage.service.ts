import { PLATFORM_ID, inject, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class BrowserStorageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readJson<T>(key: string): T | null {
    return this.readFrom(this.sessionStore(), key);
  }

  writeJson(key: string, value: unknown): void {
    this.writeTo(this.sessionStore(), key, value);
  }

  removeJson(key: string): void {
    this.removeFrom(this.sessionStore(), key);
  }

  readLocalJson<T>(key: string): T | null {
    return this.readFrom(this.localStore(), key);
  }

  writeLocalJson(key: string, value: unknown): void {
    this.writeTo(this.localStore(), key, value);
  }

  removeLocal(key: string): void {
    this.removeFrom(this.localStore(), key);
  }

  private sessionStore(): Storage | null {
    return this.isBrowser ? sessionStorage : null;
  }

  private localStore(): Storage | null {
    return this.isBrowser ? localStorage : null;
  }

  private readFrom<T>(store: Storage | null, key: string): T | null {
    if (!store) {
      return null;
    }

    try {
      const raw = store.getItem(key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  }

  private writeTo(store: Storage | null, key: string, value: unknown): void {
    if (!store) {
      return;
    }

    try {
      store.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }

  private removeFrom(store: Storage | null, key: string): void {
    if (!store) {
      return;
    }

    try {
      store.removeItem(key);
    } catch {
      return;
    }
  }
}
