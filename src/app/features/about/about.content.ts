import { AppIconName } from '@shared/components/icon/icon.component';

export interface AboutStat {
  readonly label: string;
  readonly value: string;
}

export interface AboutMilestone {
  readonly year: string;
  readonly title: string;
  readonly description: string;
}

export interface AboutValue {
  readonly title: string;
  readonly description: string;
  readonly icon: AppIconName;
}

export interface AboutJourneyStep {
  readonly title: string;
  readonly description: string;
}

export const ABOUT_STORY = {
  kicker: 'من نحن',
  title: 'بيتك يستاهل اختيارًا أوضح',
  lead: 'محبوب نجم متجر متخصص في الأجهزة الكهربائية الأصلية، نساعدك تختار الجهاز المناسب لبيتك بوضوح قبل الشراء وبعده.',
  body: 'نعتمد على ماركات متوفرة في الكتالوج، وأسعار ظاهرة، وضمان معتمد، ودعم يمكن الوصول إليه من صفحة التواصل دون وعود غير مؤكدة.',
} as const;

export const ABOUT_VALUES: readonly AboutValue[] = [
  {
    title: 'منتجات أصلية',
    description: 'نعرض أجهزة من الماركات المتوفرة لدينا مع بيان المواصفات والسعر بوضوح.',
    icon: 'badge-check',
  },
  {
    title: 'ضمان معتمد',
    description: 'الضمان مرتبط بالمنتج المختار، وتظهر تفاصيله عند الطلب أو من خلال التواصل.',
    icon: 'shield',
  },
  {
    title: 'دعم بعد البيع',
    description: 'التركيب والصيانة والاسترجاع تُتابع من طلبات التواصل حسب نوع الخدمة المطلوبة.',
    icon: 'headset',
  },
];

export const ABOUT_JOURNEY: readonly AboutJourneyStep[] = [
  {
    title: 'اختيار الجهاز',
    description: 'تصفح المتجر أو العروض وقارن المواصفات والسعر قبل الإضافة إلى السلة.',
  },
  {
    title: 'التوصيل للبيت',
    description: 'بعد إتمام الطلب يصلك الجهاز حسب خيارات التوصيل المتاحة عند الشراء.',
  },
  {
    title: 'خدمة بعد الاستلام',
    description: 'اطلب التركيب أو الصيانة أو الاسترجاع من صفحة التواصل عند الحاجة.',
  },
];

export const ABOUT_STATS: readonly AboutStat[] = [];
export const ABOUT_TIMELINE: readonly AboutMilestone[] = [];

export const ABOUT_TRUST = {
  title: 'الثقة قبل البيع وبعده',
  description: 'نوضح المتوفر فعليًا، ونخفي أي رقم أو فرع أو وعد غير مؤكد حتى لا تشتري بناءً على معلومات ناقصة.',
} as const;

export const ABOUT_CTA = {
  title: 'جاهز تختار جهاز بيتك؟',
  description: 'تصفح الأجهزة المتوفرة أو راسلنا إذا احتجت مساعدة في الاختيار أو ما بعد البيع.',
  shopLabel: 'تسوق الآن',
  contactLabel: 'تواصل معنا',
} as const;
