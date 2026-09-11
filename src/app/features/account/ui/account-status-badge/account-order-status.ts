import { OrderStatus } from '@core/auth/account.models';

export type AccountOrderStatusTone = 'preparing' | 'shipping' | 'delivered' | 'cancelled';

export interface AccountOrderStatusView {
  readonly label: string;
  readonly tone: AccountOrderStatusTone;
}

const STATUS_VIEW: Record<OrderStatus, AccountOrderStatusView> = {
  'pending-review': { label: 'جاري التجهيز', tone: 'preparing' },
  shipped: { label: 'قيد التوصيل', tone: 'shipping' },
  delivered: { label: 'تم التسليم', tone: 'delivered' },
};

export function accountOrderStatusView(status: OrderStatus): AccountOrderStatusView {
  return STATUS_VIEW[status];
}
