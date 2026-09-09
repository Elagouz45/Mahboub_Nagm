import { PageAccordionItem } from '@shared/components/page-accordion/page-accordion.component';
import { PageTocItem } from '@shared/components/page-toc/page-toc.component';

export const RETURN_POLICY_STORY = {
  title: 'الاستبدال والاسترجاع',
  lead: 'أرسل طلب الاستبدال أو الاسترجاع من نموذج التواصل، وسنوضح الخطوات المتاحة حسب حالة المنتج.',
} as const;

export const RETURN_POLICY_PREP = {
  title: 'قبل تقديم طلبك',
  items: [
    'رقم الطلب أو الفاتورة إن وُجدت.',
    'بيانات الجهاز ومكان الاستلام.',
    'سبب الاستبدال أو الاسترجاع باختصار.',
  ],
} as const;

export const RETURN_POLICY_STEPS = [
  { title: 'جهّز بيانات الطلب', description: 'راجع الفاتورة ووصف الجهاز قبل الكتابة في النموذج.' },
  { title: 'أرسل الطلب', description: 'استخدم نموذج التواصل واذكر أن الطلب للاستبدال أو الاسترجاع.' },
  { title: 'نوضح الخطوة التالية', description: 'نتابع معك بما هو متاح حسب حالة المنتج عند دراسة الطلب.' },
] as const;

export const RETURN_POLICY_ACCORDION: readonly PageAccordionItem[] = [
  {
    id: 'return-conditions',
    title: 'شروط الاستبدال والاسترجاع',
    body: 'للاستبدال أو الاسترجاع أرسل الطلب من النموذج مع رقم الطلب إن وُجد. التفاصيل تُوضَّح عند تقديم الطلب حسب حالة المنتج، ولا نعرض هنا مدة أو رسومًا غير مؤكدة.',
  },
  {
    id: 'return-exceptions',
    title: 'الحالات المستثناة',
    body: 'لا نعرض قائمة استثناءات ثابتة غير مؤكدة في هذه الصفحة. يوضح الفريق ما ينطبق على جهازك بعد استلام الطلب.',
  },
  {
    id: 'return-refund',
    title: 'رد المبلغ',
    body: 'طريقة رد المبلغ ومدته تُحدَّد عند متابعة الطلب. لا نذكر هنا أيامًا أو رسومًا حتى لا نعد بما لا يظهر في المصدر الحالي.',
  },
];

export const RETURN_POLICY_TOC: readonly PageTocItem[] = [
  { id: 'return-prep', label: 'قبل تقديم طلبك' },
  { id: 'return-steps', label: 'خطوات الطلب' },
  { id: 'return-details', label: 'التفاصيل' },
];

export const RETURN_POLICY_CTA = {
  title: 'محتاج مساعدة في الطلب؟',
  description: 'راسلنا من صفحة التواصل وسنوضح الخطوة التالية.',
  submitLabel: 'قدّم الطلب',
  contactLabel: 'تواصل معنا',
} as const;

export const PRIVACY_POLICY_STORY = {
  title: 'سياسة الخصوصية',
  lead: 'نوضح كيف نستخدم البيانات المتوفرة فعليًا في المتجر، دون وعود أو شهادات غير مؤكدة.',
} as const;

export const PRIVACY_POLICY_USES = [
  {
    title: 'إدارة الطلبات',
    description: 'بيانات السلة والطلب تُستخدم لإتمام الشراء ومتابعة ما أدخلته في المتجر.',
  },
  {
    title: 'التواصل معك',
    description: 'بيانات نموذج التواصل تُستخدم للرد على الاستفسار أو الصيانة أو الشكوى.',
  },
  {
    title: 'تحسين التجربة',
    description: 'النشرة والصفحات التي تزورها تساعدنا نعرض محتوى أوضح دون تتبع غير معلن هنا.',
  },
] as const;

export const PRIVACY_POLICY_ACCORDION: readonly PageAccordionItem[] = [
  {
    id: 'privacy-sharing',
    title: 'مشاركة البيانات',
    body: 'لا نعرض جهات مشاركة غير مؤكدة. البيانات التي تدخلها في النموذج أو السلة تُستخدم لمتابعة طلبك داخل المتجر.',
  },
  {
    id: 'privacy-cookies',
    title: 'ملفات الارتباط',
    body: 'قد تُستخدم ملفات لازمة لعمل الصفحات والسلة. لا توجد لوحة تفضيلات كوكيز حاليًا، ولا نعد بإعدادات غير موجودة.',
  },
  {
    id: 'privacy-protection',
    title: 'حماية البيانات',
    body: 'نتعامل مع البيانات المدخلة في النماذج بحذر. لا نعرض شهادات أو شعارات اعتماد غير متوفرة في المصدر.',
  },
  {
    id: 'privacy-requests',
    title: 'طلبات الخصوصية',
    body: 'راسلنا من نموذج التواصل بخصوص بياناتك. لا نعد من هذه الصفحة بحذف غير مؤكد أو نتيجة تلقائية.',
  },
];

export const PRIVACY_POLICY_TOC: readonly PageTocItem[] = [
  { id: 'privacy-use', label: 'استخدام البيانات' },
  { id: 'privacy-sharing', label: 'المشاركة' },
  { id: 'privacy-cookies', label: 'ملفات الارتباط' },
  { id: 'privacy-protection', label: 'الحماية' },
  { id: 'privacy-requests', label: 'طلبات الخصوصية' },
];

export const PRIVACY_POLICY_CTA = {
  title: 'سؤال عن خصوصيتك؟',
  description: 'استخدم نموذج التواصل وحدد أن الرسالة تتعلق بالخصوصية.',
  label: 'تواصل بخصوص الخصوصية',
} as const;
