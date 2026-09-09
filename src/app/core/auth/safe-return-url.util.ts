const AUTH_PREFIX = '/auth';

export function sanitizeReturnUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return null;
  }

  if (trimmed.includes('\\') || trimmed.includes('://')) {
    return null;
  }

  const path = trimmed.split(/[?#]/, 1)[0] ?? trimmed;
  const lowered = path.toLowerCase();
  if (lowered.startsWith('http:') || lowered.startsWith('https:') || lowered.includes(':')) {
    return null;
  }

  if (path === AUTH_PREFIX || path.startsWith(`${AUTH_PREFIX}/`)) {
    return null;
  }

  return trimmed;
}

export function resolvePostAuthUrl(returnUrl: string | null | undefined, fallback = '/account'): string {
  return sanitizeReturnUrl(returnUrl) ?? fallback;
}
