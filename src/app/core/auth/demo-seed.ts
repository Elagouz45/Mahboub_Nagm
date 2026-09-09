import { MOCK_CATALOG_PRODUCTS } from '@features/catalog/data-access/catalog-mock.service';
import { AccountAddress, AccountOrder, AccountOrderLine, AccountServiceRequest } from './account.models';
import {
  DEMO_EMAIL,
  DEMO_FIRST_NAME,
  DEMO_LAST_NAME,
  DEMO_PHONE,
  DEMO_USER_ID,
} from './auth.constants';
import { StoredAuthUser } from './auth.models';
import { hashPassword } from './password-hash.util';

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-09-07T00:00:00.000Z');

function productLine(productId: string, quantity: number): AccountOrderLine {
  const product = MOCK_CATALOG_PRODUCTS.find((item) => item.id === productId);
  if (!product) {
    throw new Error(`Missing catalog product ${productId}`);
  }
  return {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    imageSrc: product.imageSrc,
    imageAlt: product.imageAlt,
    quantity,
    unitPrice: product.price,
  };
}

function withTotals(
  order: Omit<AccountOrder, 'subtotal' | 'total'> & { readonly shippingFee: number },
): AccountOrder {
  const subtotal = order.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  return { ...order, subtotal, total: subtotal + order.shippingFee };
}

export async function createDemoUser(): Promise<StoredAuthUser> {
  return {
    id: DEMO_USER_ID,
    firstName: DEMO_FIRST_NAME,
    lastName: DEMO_LAST_NAME,
    email: DEMO_EMAIL,
    phone: DEMO_PHONE,
    createdAt: NOW - 40 * DAY,
    password: await hashPassword('Demo@12345'),
  };
}

export function createDemoAddresses(): AccountAddress[] {
  return [
    {
      id: 'demo-address-home',
      userId: DEMO_USER_ID,
      label: 'home',
      recipientName: `${DEMO_FIRST_NAME} ${DEMO_LAST_NAME}`,
      phone: DEMO_PHONE,
      governorateSlug: 'cairo',
      city: 'مدينة نصر',
      street: 'شارع عباس العقاد، عمارة 12',
      details: 'الدور الثالث، شقة 8',
      isDefault: true,
    },
    {
      id: 'demo-address-work',
      userId: DEMO_USER_ID,
      label: 'work',
      recipientName: `${DEMO_FIRST_NAME} ${DEMO_LAST_NAME}`,
      phone: DEMO_PHONE,
      governorateSlug: 'giza',
      city: 'الدقي',
      street: 'شارع التحرير، برج النيل',
      details: 'مكتب 14',
      isDefault: false,
    },
  ];
}

export function createDemoOrders(): AccountOrder[] {
  const home = 'demo-address-home';
  return [
    withTotals({
      id: 'demo-order-delivered',
      userId: DEMO_USER_ID,
      number: 'MN-24018',
      status: 'delivered',
      placedAt: NOW - 18 * DAY,
      paymentLabel: 'الدفع عند الاستلام',
      shippingAddressId: home,
      shippingLabel: 'المنزل — مدينة نصر، القاهرة',
      lines: [productLine('lg-fridge-635', 1)],
      shippingFee: 0,
    }),
    withTotals({
      id: 'demo-order-shipped',
      userId: DEMO_USER_ID,
      number: 'MN-24052',
      status: 'shipped',
      placedAt: NOW - 5 * DAY,
      paymentLabel: 'الدفع عند الاستلام',
      shippingAddressId: home,
      shippingLabel: 'المنزل — مدينة نصر، القاهرة',
      lines: [productLine('samsung-washer-8', 1)],
      shippingFee: 0,
    }),
    withTotals({
      id: 'demo-order-pending',
      userId: DEMO_USER_ID,
      number: 'MN-24061',
      status: 'pending-review',
      placedAt: NOW - 1 * DAY,
      paymentLabel: 'الدفع عند الاستلام',
      shippingAddressId: home,
      shippingLabel: 'المنزل — مدينة نصر، القاهرة',
      lines: [productLine('carrier-ac-1-5', 1)],
      shippingFee: 0,
    }),
  ];
}

export function createDemoServiceRequests(): AccountServiceRequest[] {
  return [
    {
      id: 'demo-service-1',
      userId: DEMO_USER_ID,
      title: 'صيانة غسالة',
      productTitle: 'غسالة سامسونج 8 كيلو',
      status: 'received',
      createdAt: NOW - 3 * DAY,
      note: 'اهتزاز ملحوظ أثناء الدورة',
    },
  ];
}

export const DEMO_WISHLIST_PRODUCT_IDS = ['lg-fridge-635', 'samsung-washer-8'] as const;
