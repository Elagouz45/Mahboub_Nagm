export type BrandsCountMode = 'trusted' | 'catalog' | 'badge';

export function formatBrandsCount(count: number, mode: BrandsCountMode = 'catalog'): string {
  const safe = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;

  if (mode === 'badge') {
    if (safe === 0) {
      return 'لا علامات';
    }
    if (safe === 1) {
      return 'علامة واحدة';
    }
    if (safe === 2) {
      return 'علامتان';
    }
    return `${safe} علامات`;
  }

  if (safe === 0) {
    return mode === 'trusted' ? 'لا توجد علامات موثوقة' : 'لا توجد علامات تجارية';
  }
  if (safe === 1) {
    return mode === 'trusted' ? 'علامة موثوقة واحدة' : 'علامة تجارية واحدة';
  }
  if (safe === 2) {
    return mode === 'trusted' ? 'علامتان موثوقتان' : 'علامتان تجاريتان';
  }
  if (safe <= 10) {
    return mode === 'trusted' ? `${safe} علامات موثوقة` : `${safe} علامات تجارية`;
  }
  return mode === 'trusted' ? `${safe} علامة موثوقة` : `${safe} علامة تجارية`;
}

export function formatBrandProductCount(count: number): string {
  const safe = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  if (safe === 0) {
    return 'لا منتجات';
  }
  if (safe === 1) {
    return 'منتج واحد';
  }
  if (safe === 2) {
    return 'منتجان';
  }
  if (safe <= 10) {
    return `${safe} منتجات`;
  }
  return `${safe} منتج`;
}
