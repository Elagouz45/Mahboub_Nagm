export type OrderStatus = 'pending-review' | 'shipped' | 'delivered';
export type AddressLabel = 'home' | 'work' | 'other';
export type ServiceRequestStatus = 'received' | 'in-progress' | 'completed';

export interface AccountOrderLine {
  readonly productId: string;
  readonly slug: string;
  readonly title: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly quantity: number;
  readonly unitPrice: number;
}

export interface AccountOrder {
  readonly id: string;
  readonly userId: string;
  readonly number: string;
  readonly status: OrderStatus;
  readonly placedAt: number;
  readonly paymentLabel: string;
  readonly shippingAddressId: string;
  readonly shippingLabel: string;
  readonly lines: readonly AccountOrderLine[];
  readonly subtotal: number;
  readonly shippingFee: number;
  readonly total: number;
}

export interface AccountAddress {
  readonly id: string;
  readonly userId: string;
  readonly label: AddressLabel;
  readonly recipientName: string;
  readonly phone: string;
  readonly governorateSlug: string;
  readonly city: string;
  readonly street: string;
  readonly details: string;
  readonly isDefault: boolean;
}

export interface AccountServiceRequest {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly productTitle: string;
  readonly status: ServiceRequestStatus;
  readonly createdAt: number;
  readonly note: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  'pending-review': 'قيد المراجعة',
  shipped: 'جاري الشحن',
  delivered: 'تم التسليم',
};

export const ADDRESS_LABELS: Record<AddressLabel, string> = {
  home: 'المنزل',
  work: 'العمل',
  other: 'عنوان آخر',
};

export const SERVICE_REQUEST_STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  received: 'تم الاستلام',
  'in-progress': 'قيد التنفيذ',
  completed: 'مكتمل',
};
