export const AUTH_STORAGE_KEYS = {
  users: 'mahboub-nagm-mock-users-v1',
  session: 'mahboub-nagm-mock-session-v1',
  orders: 'mahboub-nagm:demo-orders:v1',
  addresses: 'mahboub-nagm:demo-addresses:v1',
  serviceRequests: 'mahboub-nagm:demo-service-requests:v1',
  wishlistSeeded: 'mahboub-nagm:demo-wishlist-seeded:v1',
} as const;

export const AUTH_LOGIN_PATH = '/login';
export const AUTH_REGISTER_PATH = '/register';

export const DEMO_USER_ID = 'demo-user-1';
export const DEMO_EMAIL = 'demo@mahboubnag.com';
export const DEMO_PHONE = '01003585485';
export const DEMO_PASSWORD = 'Demo@12345';
export const DEMO_FIRST_NAME = 'محبوب';
export const DEMO_LAST_NAME = 'فتحى محبوب';

export const AUTH_COPY = {
  invalidCredentials: 'البريد الإلكتروني أو رقم الهاتف أو كلمة المرور غير صحيحة.',
  duplicateAccount: 'يوجد حساب مسجل بهذه البيانات بالفعل.',
  duplicateEmail: 'يوجد حساب مسجل بهذه البيانات بالفعل.',
  duplicatePhone: 'يوجد حساب مسجل بهذه البيانات بالفعل.',
  logoutSuccess: 'تم تسجيل الخروج بنجاح',
  loginSuccess: 'تم تسجيل الدخول بنجاح',
  registerSuccess: 'تم إنشاء حسابك بنجاح.',
  profileSaved: 'تم تحديث بياناتك بنجاح.',
  passwordChanged: 'تم تحديث كلمة المرور بنجاح.',
  cryptoUnavailable: 'تعذر إكمال العملية في هذا المتصفح. جرّب متصفحًا أحدث.',
  forgotPasswordUnavailable: 'ستتوفر استعادة كلمة المرور بعد ربط الخادم.',
} as const;
