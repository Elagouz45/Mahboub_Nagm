const LOCAL_MOBILE = /^01[0125]\d{8}$/;
const INTL_MOBILE = /^\+20(1[0125]\d{8})$/;

export function compactPhone(value: string): string {
  return value.replace(/[\s-]/g, '');
}

export function normalizeEgyptianMobile(value: string): string | null {
  const compact = compactPhone(value);
  if (LOCAL_MOBILE.test(compact)) {
    return compact;
  }

  const intl = compact.match(INTL_MOBILE);
  return intl ? `0${intl[1]}` : null;
}

export function isEgyptianMobile(value: string): boolean {
  return normalizeEgyptianMobile(value) !== null;
}
