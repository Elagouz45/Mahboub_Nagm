export interface EgyptGovernorate {
  readonly slug: string;
  readonly label: string;
}

export const EGYPT_GOVERNORATES: readonly EgyptGovernorate[] = [
  { slug: 'cairo', label: 'القاهرة' },
  { slug: 'giza', label: 'الجيزة' },
  { slug: 'alexandria', label: 'الإسكندرية' },
  { slug: 'qalyubia', label: 'القليوبية' },
  { slug: 'port-said', label: 'بورسعيد' },
  { slug: 'suez', label: 'السويس' },
  { slug: 'ismailia', label: 'الإسماعيلية' },
  { slug: 'damietta', label: 'دمياط' },
  { slug: 'dakahlia', label: 'الدقهلية' },
  { slug: 'sharqia', label: 'الشرقية' },
  { slug: 'gharbia', label: 'الغربية' },
  { slug: 'monufia', label: 'المنوفية' },
  { slug: 'beheira', label: 'البحيرة' },
  { slug: 'kafr-el-sheikh', label: 'كفر الشيخ' },
  { slug: 'fayoum', label: 'الفيوم' },
  { slug: 'beni-suef', label: 'بني سويف' },
  { slug: 'minya', label: 'المنيا' },
  { slug: 'asyut', label: 'أسيوط' },
  { slug: 'sohag', label: 'سوهاج' },
  { slug: 'qena', label: 'قنا' },
  { slug: 'luxor', label: 'الأقصر' },
  { slug: 'aswan', label: 'أسوان' },
  { slug: 'red-sea', label: 'البحر الأحمر' },
  { slug: 'new-valley', label: 'الوادي الجديد' },
  { slug: 'matrouh', label: 'مطروح' },
  { slug: 'north-sinai', label: 'شمال سيناء' },
  { slug: 'south-sinai', label: 'جنوب سيناء' },
];

export const EGYPT_GOVERNORATE_SLUGS: readonly string[] = EGYPT_GOVERNORATES.map((item) => item.slug);
