import { AccountAddress, AccountOrder } from '@core/auth/account.models';
import { ContactRequest } from '@features/contact/models/contact.model';
import { CartItem, ProductSummary } from '@shared/models/storefront.model';
import { MAX_CART_QUANTITY } from '@core/config/demo-commerce.config';

export interface DemoOrder extends AccountOrder {
  readonly checkoutKey: string;
  readonly address: AccountAddress;
}
export interface DemoMessage extends ContactRequest {
  readonly id: string;
  readonly userId: string;
  readonly createdAt: number;
}
export interface CommerceData {
  readonly schemaVersion: 1;
  readonly carts: Record<string, readonly CartItem[]>;
  readonly wishlists: Record<string, readonly ProductSummary[]>;
  readonly orders: readonly DemoOrder[];
  readonly messages: readonly DemoMessage[];
}
export const emptyData = (): CommerceData => ({
  schemaVersion: 1,
  carts: {},
  wishlists: {},
  orders: [],
  messages: [],
});
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
export const isProduct = (value: unknown): value is ProductSummary =>
  isRecord(value) &&
  ['id', 'sku', 'slug', 'title', 'brand', 'spec', 'imageSrc', 'imageAlt'].every(
    (key) => typeof value[key] === 'string',
  ) &&
  typeof value['price'] === 'number' &&
  Number.isFinite(value['price']) &&
  value['price'] >= 0;
export const isCartItem = (value: unknown): value is CartItem =>
  isRecord(value) &&
  isProduct(value['product']) &&
  typeof value['quantity'] === 'number' &&
  Number.isInteger(value['quantity']) &&
  value['quantity'] > 0 &&
  value['quantity'] <= MAX_CART_QUANTITY;
export const isAddress = (value: unknown): value is AccountAddress =>
  isRecord(value) &&
  ['id', 'userId', 'recipientName', 'phone', 'governorateSlug', 'city', 'street', 'details'].every(
    (key) => typeof value[key] === 'string',
  );
export const isOrder = (value: unknown): value is DemoOrder =>
  isRecord(value) &&
  ['id', 'userId', 'number', 'checkoutKey', 'shippingLabel', 'paymentLabel'].every(
    (key) => typeof value[key] === 'string',
  ) &&
  ['placedAt', 'subtotal', 'shippingFee', 'total'].every(
    (key) => typeof value[key] === 'number' && Number.isFinite(value[key]),
  ) &&
  ['pending-review', 'shipped', 'delivered'].includes(String(value['status'])) &&
  isAddress(value['address']) &&
  Array.isArray(value['lines']) &&
  value['lines'].every(
    (line: unknown) =>
      isRecord(line) &&
      ['productId', 'slug', 'title', 'imageSrc', 'imageAlt'].every(
        (key) => typeof line[key] === 'string',
      ) &&
      typeof line['quantity'] === 'number' &&
      Number.isInteger(line['quantity']) &&
      line['quantity'] > 0 &&
      typeof line['unitPrice'] === 'number' &&
      Number.isFinite(line['unitPrice']) &&
      line['unitPrice'] >= 0,
  );
export const isMessage = (value: unknown): value is DemoMessage =>
  isRecord(value) &&
  ['id', 'userId', 'name', 'phone', 'email', 'message', 'deviceType', 'issue'].every(
    (key) => typeof value[key] === 'string',
  ) &&
  ['product', 'order', 'maintenance', 'complaint', 'other'].includes(String(value['type'])) &&
  typeof value['createdAt'] === 'number';
