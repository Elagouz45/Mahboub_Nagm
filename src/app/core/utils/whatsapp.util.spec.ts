import { buildProductWhatsAppMessage, buildWhatsAppUrl } from './whatsapp.util';

describe('WhatsApp URL builder', () => {
  it('returns null when the phone number is missing', () => {
    expect(buildWhatsAppUrl('', 'hello')).toBeNull();
    expect(buildWhatsAppUrl('abc', 'hello')).toBeNull();
  });

  it('encodes the message and keeps digits only', () => {
    const url = buildWhatsAppUrl('+20 100 123 4567', 'مرحبًا، أريد جهاز');
    expect(url).toBe(
      `https://wa.me/201001234567?text=${encodeURIComponent('مرحبًا، أريد جهاز')}`,
    );
  });

  it('builds a product inquiry message', () => {
    const message = buildProductWhatsAppMessage({
      title: 'غسالة سامسونج 8 كيلو',
      sku: 'SM-800',
      priceLabel: '13,599 جنيه',
      productUrl: 'https://example.test/products/samsung-washer-8kg',
    });

    expect(message).toContain('غسالة سامسونج 8 كيلو');
    expect(message).toContain('SM-800');
    expect(message).toContain('13,599 جنيه');
    expect(message).toContain('https://example.test/products/samsung-washer-8kg');
  });
});
