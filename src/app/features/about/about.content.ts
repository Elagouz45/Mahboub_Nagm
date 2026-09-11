import { AppIconName } from '@shared/components/icon/icon.component';

export interface AboutStat {
  readonly label: string;
  readonly value: string;
}

export interface AboutMilestone {
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
  kicker: 'أجهزة أفضل لبيت أسهل',
  title: 'نساعدك تختار الصح لبيتك',
  lead: 'في محبوب نجم، نجمع لك أجهزة أصلية من علامات موثوقة، بأسعار واضحة وخدمة تكمّل معك بعد الشراء.',
  trustPoints: ['اختيار موثوق', 'دعم مستمر بعد البيع'] as const,
  shopLabel: 'تسوّق الآن',
  servicesLabel: 'تعرّف على خدماتنا',
  storyTitle: 'حكايتنا بدأت من احتياج بسيط',
  valuesTitle: 'القيم اللي بنشتغل بيها',
  journeyTitle: 'من الاختيار لحد التشغيل',
  paragraphs: [
    'بدأت رحلتنا من ملاحظة بسيطة: شراء الأجهزة المنزلية ممكن يكون مرهقًا ومليئًا بالأسئلة. لذلك قررنا في محبوب نجم أن نوفر مكانًا واحدًا يقدم أجهزة أصلية من علامات موثوقة، مع معلومات واضحة وأسعار عادلة.',
    'اليوم نواصل نفس الهدف: نجعل تجربة شراء الأجهزة أسهل وأكثر أمانًا، ونكون معك حتى بعد الشراء من خلال خدمات التركيب والصيانة ودعم حقيقي.',
  ] as const,
} as const;

export const ABOUT_STATS: readonly AboutStat[] = [
  { value: '10+', label: 'سنوات خبرة' },
  { value: '20+', label: 'علامة موثوقة' },
  { value: '10,000+', label: 'عميل' },
  { value: 'توصيل لكل', label: 'المحافظات' },
];

export const ABOUT_TIMELINE: readonly AboutMilestone[] = [
  { title: 'البداية', description: 'اختيار أجهزة موثوقة' },
  { title: 'التوسع', description: 'علامات أكثر وخدمة أسرع' },
  { title: 'اليوم', description: 'تجربة متكاملة قبل وبعد الشراء' },
];

export const ABOUT_VALUES: readonly AboutValue[] = [
  {
    title: 'الثقة أولًا',
    description: 'معلومات واضحة ومنتجات أصلية',
    icon: 'shield',
  },
  {
    title: 'اختيار يناسبك',
    description: 'نساعدك تختار على حسب احتياجك',
    icon: 'user',
  },
  {
    title: 'معك بعد الشراء',
    description: 'تركيب وصيانة وضمان موثوق',
    icon: 'wrench',
  },
];

export const ABOUT_WHY = {
  title: 'ليه محبوب نجم؟',
  reasons: [
    'منتجات من موردين معتمدين',
    'أسعار وعروض واضحة',
    'توصيل منظم وآمن',
    'خدمة عملاء ودعم بعد البيع',
  ] as const,
  promiseTitle: 'وعدنا ليك',
  promise:
    'مش هدفنا نبيع لك جهاز وبس؛ هدفنا نكون اختيارك الموثوق كل مرة.',
  signature: 'فريق محبوب نجم',
} as const;

export const ABOUT_JOURNEY: readonly AboutJourneyStep[] = [
  {
    title: 'اختار جهازك',
    description: 'تصفح المنتجات وقارن بسهولة',
  },
  {
    title: 'أكد طلبك',
    description: 'اختر طريقة الدفع المناسبة',
  },
  {
    title: 'استلم بأمان',
    description: 'توصيل منظم لكل المحافظات',
  },
  {
    title: 'خدمة مستمرة',
    description: 'تركيب وصيانة ودعم بعد البيع',
  },
];

export const ABOUT_CTA = {
  title: 'جاهز تختار جهازك الجديد؟',
  description: 'تصفّح منتجات أصلية وعروض تناسب بيتك.',
  shopLabel: 'ابدأ التسوق',
  contactLabel: 'تواصل معنا',
} as const;
