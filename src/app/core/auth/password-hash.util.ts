import { PasswordSecret } from './auth.models';

const ALGO_NAME = 'PBKDF2';
const HASH = 'SHA-256';
const ITERATIONS = 100_000;
const KEY_BITS = 256;
const SALT_BYTES = 16;

export function canHashPassword(): boolean {
  return Boolean(globalThis.crypto?.subtle);
}

export async function hashPassword(password: string): Promise<PasswordSecret> {
  const subtle = requireSubtle();
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await deriveBits(subtle, password, salt, ITERATIONS);
  return {
    algo: ALGO_NAME,
    iterations: ITERATIONS,
    salt: bytesToBase64(salt),
    hash: bytesToBase64(new Uint8Array(hash)),
  };
}

export async function verifyPassword(password: string, secret: PasswordSecret): Promise<boolean> {
  if (secret.algo !== ALGO_NAME || secret.iterations < 1 || !secret.salt || !secret.hash) {
    return false;
  }

  const subtle = requireSubtle();
  const salt = base64ToBytes(secret.salt);
  const expected = base64ToBytes(secret.hash);
  const actual = new Uint8Array(await deriveBits(subtle, password, salt, secret.iterations));
  return timingSafeEqual(expected, actual);
}

function requireSubtle(): SubtleCrypto {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('crypto-unavailable');
  }
  return subtle;
}

async function deriveBits(
  subtle: SubtleCrypto,
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<ArrayBuffer> {
  const key = await subtle.importKey('raw', new TextEncoder().encode(password), ALGO_NAME, false, [
    'deriveBits',
  ]);
  return subtle.deriveBits(
    {
      name: ALGO_NAME,
      hash: HASH,
      salt: salt as BufferSource,
      iterations,
    },
    key,
    KEY_BITS,
  );
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }
  return diff === 0;
}
