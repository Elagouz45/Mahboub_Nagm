import { ParamMap, Params } from '@angular/router';
import { AccountOrder } from '@core/auth/account.models';

export const ORDERS_PAGE_SIZE = 5;

export type AccountOrdersFilter = 'all' | 'in-progress' | 'delivered' | 'cancelled';

export interface AccountOrdersQuery {
  readonly status: AccountOrdersFilter;
  readonly page: number;
  readonly q: string;
}

export interface AccountOrdersFilterChip {
  readonly id: AccountOrdersFilter;
  readonly label: string;
}

export const ACCOUNT_ORDERS_FILTERS: readonly AccountOrdersFilterChip[] = [
  { id: 'all', label: 'الكل' },
  { id: 'in-progress', label: 'قيد التنفيذ' },
  { id: 'delivered', label: 'تم التسليم' },
  { id: 'cancelled', label: 'ملغي' },
];

export const DEFAULT_ACCOUNT_ORDERS_QUERY: AccountOrdersQuery = {
  status: 'all',
  page: 1,
  q: '',
};

const FILTER_IDS = new Set<string>(ACCOUNT_ORDERS_FILTERS.map((item) => item.id));

export function parseAccountOrdersQuery(params: ParamMap): AccountOrdersQuery {
  const statusRaw = params.get('status') ?? '';
  const status = FILTER_IDS.has(statusRaw) ? (statusRaw as AccountOrdersFilter) : 'all';
  const pageRaw = Number(params.get('page'));
  const page = Number.isInteger(pageRaw) && pageRaw > 1 ? pageRaw : 1;
  const q = params.get('q')?.trim() ?? '';
  return { status, page, q };
}

export function accountOrdersQueryToParams(query: AccountOrdersQuery): Params {
  return {
    status: query.status === 'all' ? null : query.status,
    page: query.page > 1 ? query.page : null,
    q: query.q ? query.q : null,
  };
}

export function orderMatchesStatus(order: AccountOrder, status: AccountOrdersFilter): boolean {
  if (status === 'all') {
    return true;
  }
  if (status === 'in-progress') {
    return order.status !== 'delivered';
  }
  if (status === 'delivered') {
    return order.status === 'delivered';
  }
  return false;
}

export function orderMatchesSearch(order: AccountOrder, term: string): boolean {
  const needle = normalizeOrderNumber(term);
  if (!needle) {
    return true;
  }
  return normalizeOrderNumber(order.number).includes(needle);
}

export function countOrdersByFilter(
  orders: readonly AccountOrder[],
  status: AccountOrdersFilter,
): number {
  if (status === 'cancelled') {
    return 0;
  }
  return orders.filter((order) => orderMatchesStatus(order, status)).length;
}

function normalizeOrderNumber(value: string): string {
  return value.trim().replace(/^#+/, '').toLowerCase();
}
