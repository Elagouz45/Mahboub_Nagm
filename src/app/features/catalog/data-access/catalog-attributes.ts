import { AttributeFilterDefinition, FilterOption } from '../models/catalog.model';

const yes: FilterOption = { value: 'true', label: 'نعم' };

export const CATEGORY_ATTRIBUTE_FILTERS: Readonly<Record<string, readonly AttributeFilterDefinition[]>> =
  {
    fridges: [
      {
        key: 'capacity',
        label: 'السعة',
        options: [
          { value: '400', label: '400 لتر' },
          { value: '500', label: '500 لتر' },
          { value: '635', label: '635 لتر' },
          { value: '700', label: '700 لتر' },
        ],
      },
      {
        key: 'doors',
        label: 'عدد الأبواب',
        options: [
          { value: '2', label: 'بابان' },
          { value: '3', label: '3 أبواب' },
          { value: '4', label: '4 أبواب' },
        ],
      },
      { key: 'noFrost', label: 'نوفروست', options: [yes] },
      { key: 'inverter', label: 'إنفرتر', options: [yes] },
      {
        key: 'color',
        label: 'اللون',
        options: [
          { value: 'silver', label: 'فضي' },
          { value: 'white', label: 'أبيض' },
          { value: 'black', label: 'أسود' },
        ],
      },
      {
        key: 'energy',
        label: 'كفاءة الطاقة',
        options: [
          { value: 'A+', label: 'A+' },
          { value: 'A++', label: 'A++' },
        ],
      },
    ],
    washers: [
      {
        key: 'capacity',
        label: 'السعة',
        options: [
          { value: '7', label: '7 كجم' },
          { value: '8', label: '8 كجم' },
          { value: '10', label: '10 كجم' },
        ],
      },
      {
        key: 'loadType',
        label: 'نوع التعبئة',
        options: [
          { value: 'front', label: 'أمامية' },
          { value: 'top', label: 'علوية' },
        ],
      },
      { key: 'automatic', label: 'أوتوماتيك', options: [yes] },
      { key: 'inverter', label: 'إنفرتر', options: [yes] },
      { key: 'dryer', label: 'مجفف', options: [yes] },
      {
        key: 'color',
        label: 'اللون',
        options: [
          { value: 'silver', label: 'فضي' },
          { value: 'white', label: 'أبيض' },
          { value: 'graphite', label: 'جرافيت' },
        ],
      },
    ],
    tvs: [
      {
        key: 'screenSize',
        label: 'حجم الشاشة',
        options: [
          { value: '43', label: '43 بوصة' },
          { value: '55', label: '55 بوصة' },
          { value: '65', label: '65 بوصة' },
        ],
      },
      {
        key: 'resolution',
        label: 'الدقة',
        options: [
          { value: 'fhd', label: 'Full HD' },
          { value: '4k', label: '4K' },
        ],
      },
      { key: 'smart', label: 'ذكي', options: [yes] },
      {
        key: 'displayTech',
        label: 'تقنية العرض',
        options: [
          { value: 'led', label: 'LED' },
          { value: 'qled', label: 'QLED' },
          { value: 'oled', label: 'OLED' },
        ],
      },
      {
        key: 'connectivity',
        label: 'الاتصال',
        options: [
          { value: 'wifi', label: 'واي فاي' },
          { value: 'hdmi', label: 'HDMI' },
        ],
      },
    ],
    acs: [
      {
        key: 'horsepower',
        label: 'القدرة',
        options: [
          { value: '1', label: '1 حصان' },
          { value: '1.5', label: '1.5 حصان' },
          { value: '2.25', label: '2.25 حصان' },
        ],
      },
      {
        key: 'coolingType',
        label: 'نوع التبريد',
        options: [
          { value: 'split', label: 'سبليت' },
          { value: 'window', label: 'شباك' },
        ],
      },
      { key: 'inverter', label: 'إنفرتر', options: [yes] },
      {
        key: 'coverage',
        label: 'التغطية',
        options: [
          { value: 'small', label: 'غرفة صغيرة' },
          { value: 'medium', label: 'غرفة متوسطة' },
          { value: 'large', label: 'مساحة كبيرة' },
        ],
      },
      {
        key: 'energy',
        label: 'كفاءة الطاقة',
        options: [
          { value: 'A', label: 'A' },
          { value: 'A+', label: 'A+' },
        ],
      },
    ],
    kitchen: [
      {
        key: 'burners',
        label: 'عدد الشعلات',
        options: [
          { value: '4', label: '4 شعلات' },
          { value: '5', label: '5 شعلات' },
        ],
      },
      {
        key: 'installType',
        label: 'نوع التركيب',
        options: [
          { value: 'freestanding', label: 'منفصل' },
          { value: 'built-in', label: 'مدمج' },
        ],
      },
      {
        key: 'fuel',
        label: 'الوقود',
        options: [
          { value: 'gas', label: 'غاز' },
          { value: 'electric', label: 'كهرباء' },
        ],
      },
      { key: 'safety', label: 'أمان', options: [yes] },
    ],
    ovens: [
      {
        key: 'capacity',
        label: 'السعة',
        options: [
          { value: '20', label: '20 لتر' },
          { value: '25', label: '25 لتر' },
          { value: '65', label: '65 لتر' },
        ],
      },
      {
        key: 'fuel',
        label: 'الوقود',
        options: [
          { value: 'electric', label: 'كهرباء' },
          { value: 'gas', label: 'غاز' },
        ],
      },
      {
        key: 'installType',
        label: 'نوع التركيب',
        options: [
          { value: 'built-in', label: 'مدمج' },
          { value: 'countertop', label: 'سطحي' },
        ],
      },
    ],
    'water-heaters': [
      {
        key: 'capacity',
        label: 'السعة',
        options: [
          { value: '50', label: '50 لتر' },
          { value: '80', label: '80 لتر' },
        ],
      },
      {
        key: 'fuel',
        label: 'الوقود',
        options: [
          { value: 'electric', label: 'كهرباء' },
          { value: 'gas', label: 'غاز' },
        ],
      },
      {
        key: 'installType',
        label: 'نوع التركيب',
        options: [
          { value: 'wall', label: 'حائطي' },
          { value: 'floor', label: 'أرضي' },
        ],
      },
      { key: 'digital', label: 'رقمي', options: [yes] },
    ],
  };

export function findAttributeDefinition(
  category: string,
  key: string,
): AttributeFilterDefinition | undefined {
  return CATEGORY_ATTRIBUTE_FILTERS[category]?.find((item) => item.key === key);
}

export function attributeValueLabel(category: string, key: string, value: string): string {
  const option = findAttributeDefinition(category, key)?.options.find((item) => item.value === value);
  return option?.label ?? value;
}
