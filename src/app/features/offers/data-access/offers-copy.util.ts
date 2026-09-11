export type OffersCountMode = 'short' | 'available';

export function formatOffersCount(count: number, mode: OffersCountMode = 'short'): string {
  const safe = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;

  if (safe === 0) {
    return mode === 'available' ? 'لا يوجد منتج متاح' : '0 منتجات';
  }
  if (safe === 1) {
    return mode === 'available' ? 'منتج واحد متاح' : 'منتج واحد';
  }
  if (safe === 2) {
    return mode === 'available' ? 'منتجان متاحان' : 'منتجان';
  }
  if (safe <= 10) {
    return mode === 'available' ? `${safe} منتجات متاحة` : `${safe} منتجات`;
  }
  return mode === 'available' ? `${safe} منتجًا متاحًا` : `${safe} منتجًا`;
}
