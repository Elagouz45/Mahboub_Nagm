export const ACCOUNT_NAV_LINKS = [
  { path: '/account', label: 'نظرة عامة', exact: true },
  { path: '/account/orders', label: 'طلباتي', exact: false },
  { path: '/account/profile', label: 'الملف الشخصي', exact: true },
  { path: '/account/addresses', label: 'العناوين', exact: true },
  { path: '/account/wishlist', label: 'المفضلة', exact: true },
  { path: '/account/service-requests', label: 'طلبات الصيانة', exact: true },
] as const;
