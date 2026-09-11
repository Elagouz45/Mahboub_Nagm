export interface BrandDirectoryMeta {
  readonly categoryLabel: string;
}

export const BRAND_DIRECTORY_META: Readonly<Record<string, BrandDirectoryMeta>> = {
  carrier: { categoryLabel: 'تكييفات' },
  fresh: { categoryLabel: 'بوتاجازات وأجهزة منزلية' },
  lg: { categoryLabel: 'ثلاجات وأجهزة منزلية' },
  philips: { categoryLabel: 'أجهزة صغيرة' },
  samsung: { categoryLabel: 'غسالات وأجهزة منزلية' },
  sharp: { categoryLabel: 'أفران وميكروويف' },
  tcl: { categoryLabel: 'تلفزيونات' },
  tornado: { categoryLabel: 'تلفزيونات وأجهزة منزلية' },
  toshiba: { categoryLabel: 'ثلاجات وأجهزة منزلية' },
};

export const BRANDS_HOME_CATEGORY = 'home';

export const BRANDS_CATEGORY_FILTERS = [
  { value: '', label: 'كل التصنيفات' },
  { value: BRANDS_HOME_CATEGORY, label: 'الأجهزة المنزلية' },
  { value: 'fridges', label: 'الثلاجات' },
  { value: 'washers', label: 'الغسالات' },
  { value: 'tvs', label: 'الشاشات والتلفزيونات' },
  { value: 'acs', label: 'التكييف والتبريد' },
  { value: 'small', label: 'الأجهزة الصغيرة' },
  { value: 'ovens', label: 'الأفران والميكروويف' },
] as const;

export function brandDirectoryLabel(slug: string, fallback: string): string {
  return BRAND_DIRECTORY_META[slug]?.categoryLabel ?? fallback;
}

export function isBrandsCategoryFilter(value: string): boolean {
  return BRANDS_CATEGORY_FILTERS.some((option) => option.value === value);
}

export function matchesHomeCategory(categoryLabel: string): boolean {
  return categoryLabel.includes('منزلية');
}
