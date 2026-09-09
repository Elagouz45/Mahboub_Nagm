export const APP_NAME = 'محبوب نجم للأجهزة الكهربائية';
export const APP_NAME_SHORT = 'محبوب نجم';
export const APP_NAME_SUBTITLE = 'للأجهزة الكهربائية';
export const APP_SLOGAN = 'بيتك يستاهل الأفضل';

export interface NavLink {
  readonly path: string;
  readonly label: string;
  readonly exact?: boolean;
  readonly queryParams?: Record<string, string>;
  readonly children?: readonly NavLink[];
}

export const SHOP_CATEGORY_STRIP: readonly { slug: string; label: string }[] = [
  { slug: 'fridges', label: 'ثلاجات' },
  { slug: 'washers', label: 'غسالات' },
  { slug: 'tvs', label: 'تليفزيونات' },
  { slug: 'acs', label: 'تكييفات' },
  { slug: 'kitchen', label: 'بوتاجازات' },
  { slug: 'ovens', label: 'أفران وميكروويف' },
  { slug: 'water-heaters', label: 'سخانات' },
  { slug: 'fans', label: 'مراوح' },
  { slug: 'vacuum-cleaners', label: 'مكانس كهربائية' },
  { slug: 'small', label: 'أجهزة صغيرة' },
];

export const CATEGORY_NAV: readonly NavLink[] = [
  { path: '/products', queryParams: { category: 'fridges' }, label: 'ثلاجات' },
  { path: '/products', queryParams: { category: 'washers' }, label: 'غسالات' },
  { path: '/products', queryParams: { category: 'tvs' }, label: 'تليفزيونات' },
  { path: '/products', queryParams: { category: 'acs' }, label: 'تكييفات' },
  { path: '/products', queryParams: { category: 'kitchen' }, label: 'بوتاجازات' },
  { path: '/products', queryParams: { category: 'ovens' }, label: 'أفران وميكروويف' },
  { path: '/products', queryParams: { category: 'water-heaters' }, label: 'سخانات مياه' },
  { path: '/products', queryParams: { category: 'fans' }, label: 'مراوح' },
  { path: '/products', queryParams: { category: 'small' }, label: 'أجهزة صغيرة' },
  { path: '/products', queryParams: { category: 'vacuum-cleaners' }, label: 'مكانس كهربائية' },
];

export const MAIN_NAV_LINKS: readonly NavLink[] = [
  { path: '/', label: 'الرئيسية', exact: true },
  { path: '/products', label: 'المتجر' },
  { path: '/offers', label: 'العروض' },
  { path: '/brands', label: 'العلامات التجارية' },
  { path: '/after-sales', label: 'خدمات ما بعد البيع' },
  { path: '/service-centers', label: 'مركز الصيانة' },
  { path: '/about', label: 'من نحن' },
  { path: '/contact', label: 'تواصل معنا', exact: true },
];

export const FOOTER_QUICK_LINKS: readonly NavLink[] = [
  { path: '/', label: 'الرئيسية', exact: true },
  { path: '/products', label: 'المتجر' },
  { path: '/offers', label: 'العروض' },
  { path: '/brands', label: 'العلامات التجارية' },
  { path: '/about', label: 'من نحن' },
  { path: '/after-sales', label: 'خدمات ما بعد البيع' },
  { path: '/contact', label: 'تواصل معنا', exact: true },
];

export const FOOTER_LEGAL_LINKS: readonly NavLink[] = [
  { path: '/return-policy', label: 'الاستبدال والاسترجاع' },
  { path: '/privacy-policy', label: 'سياسة الخصوصية' },
];

export const FOOTER_SERVICE_LINKS: readonly NavLink[] = [
  { path: '/account', label: 'حسابي' },
  { path: '/contact', queryParams: { topic: 'faq' }, label: 'الأسئلة الشائعة' },
  { path: '/contact', queryParams: { topic: 'shipping' }, label: 'الشحن والتوصيل' },
  { path: '/return-policy', label: 'الاستبدال والاسترجاع' },
  { path: '/privacy-policy', label: 'سياسة الخصوصية' },
  { path: '/contact', queryParams: { topic: 'warranty' }, label: 'الضمان' },
  { path: '/service-centers', label: 'مراكز الصيانة' },
];

export const FOOTER_TRUST_POINTS = [
  { id: 'original', label: 'منتجات أصلية', icon: 'badge-check' },
  { id: 'warranty', label: 'ضمان معتمد', icon: 'shield' },
  { id: 'delivery', label: 'توصيل آمن', icon: 'truck' },
] as const;

export const TRUST_ANNOUNCEMENTS = [
  { id: 'original', label: 'منتجات أصلية 100%', icon: 'badge-check' },
  { id: 'warranty', label: 'ضمان معتمد على جميع المنتجات', icon: 'shield' },
  { id: 'delivery', label: 'توصيل سريع لجميع المحافظات', icon: 'truck' },
] as const;
