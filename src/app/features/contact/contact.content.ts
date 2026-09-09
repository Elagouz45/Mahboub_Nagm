export interface ContactFaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export const CONTACT_FAQ: readonly ContactFaqItem[] = [
  {
    id: 'shipping',
    question: 'كم يستغرق التوصيل؟',
    answer:
      'مدة التوصيل تعتمد على المحافظة وتوفر المنتج عند إتمام الطلب. لا نعرض مواعيدًا ثابتة هنا حتى لا نعد بما لا يظهر في الطلب.',
  },
  {
    id: 'installation',
    question: 'هل يتوفر تركيب للأجهزة؟',
    answer: 'يمكن طلب التركيب أو الاستفسار عنه من نموذج التواصل باختيار استفسار عن منتج أو طلب صيانة.',
  },
  {
    id: 'maintenance',
    question: 'كيف أطلب صيانة؟',
    answer: 'اختر «طلب صيانة» في هذه الصفحة، واكتب نوع الجهاز ووصف العطل، وسنتابع الطلب عند توفر الخدمة.',
  },
  {
    id: 'returns',
    question: 'ما سياسة الاستبدال والاسترجاع؟',
    answer:
      'للاستبدال أو الاسترجاع أرسل الطلب من النموذج مع رقم الطلب إن وُجد، وسنوضح الخطوات المتاحة حسب حالة المنتج.',
  },
];
