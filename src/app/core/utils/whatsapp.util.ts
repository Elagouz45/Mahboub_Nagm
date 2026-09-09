export function buildWhatsAppUrl(phone: string, message: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 0) {
    return null;
  }

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppMessage(params: {
  readonly title: string;
  readonly sku: string;
  readonly priceLabel: string;
  readonly productUrl: string;
}): string {
  return `مرحبًا، أريد الاستفسار عن منتج: ${params.title}، كود المنتج: ${params.sku}، السعر: ${params.priceLabel}، رابط المنتج: ${params.productUrl}`;
}

export const WHATSAPP_HELP_MESSAGE = 'مرحبًا، أحتاج مساعدة في اختيار جهاز كهربائي مناسب.';
