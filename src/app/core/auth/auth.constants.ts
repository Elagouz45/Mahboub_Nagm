export const AUTH_STORAGE_KEYS = {
  users: 'mahboub-nagm:demo-users:v1',
  session: 'mahboub-nagm:demo-session:v1',
  orders: 'mahboub-nagm:demo-orders:v1',
  addresses: 'mahboub-nagm:demo-addresses:v1',
  serviceRequests: 'mahboub-nagm:demo-service-requests:v1',
  wishlistSeeded: 'mahboub-nagm:demo-wishlist-seeded:v1',
} as const;

export const DEMO_USER_ID = 'demo-user-1';
export const DEMO_EMAIL = 'demo@mahboubtnagm.test';
export const DEMO_PHONE = '01012345678';
export const DEMO_PASSWORD = 'Demo@12345';
export const DEMO_FIRST_NAME = 'أحمد';
export const DEMO_LAST_NAME = 'محمد';

export const AUTH_COPY = {
  invalidCredentials: 'بيانات تسجيل الدخول غير صحيحة',
  duplicateEmail: 'هذا البريد الإلكتروني مسجّل بالفعل.',
  duplicatePhone: 'رقم الهاتف مسجّل بالفعل.',
  logoutSuccess: 'تم تسجيل الخروج بنجاح',
  loginSuccess: 'تم تسجيل الدخول بنجاح',
  registerSuccess: 'تم إنشاء الحساب بنجاح',
  profileSaved: 'تم حفظ بيانات الملف الشخصي',
  cryptoUnavailable: 'تعذر إكمال العملية في هذا المتصفح. جرّب متصفحًا أحدث.',
} as const;
