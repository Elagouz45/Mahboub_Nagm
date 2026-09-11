import { convertToParamMap } from '@angular/router';
import { AccountOrder } from '@core/auth/account.models';
import {
  accountOrdersQueryToParams,
  countOrdersByFilter,
  orderMatchesSearch,
  orderMatchesStatus,
  parseAccountOrdersQuery,
} from './account-orders-query';

function order(partial: Partial<AccountOrder> & Pick<AccountOrder, 'id' | 'number' | 'status'>): AccountOrder {
  return {
    userId: 'u1',
    placedAt: 1,
    paymentLabel: '',
    shippingAddressId: '',
    shippingLabel: '',
    lines: [],
    subtotal: 1,
    shippingFee: 0,
    total: 1,
    ...partial,
  };
}

describe('account-orders-query', () => {
  it('parses status, page, and search from query params', () => {
    expect(parseAccountOrdersQuery(convertToParamMap({}))).toEqual({
      status: 'all',
      page: 1,
      q: '',
    });
    expect(
      parseAccountOrdersQuery(convertToParamMap({ status: 'delivered', page: '2', q: ' 12584 ' })),
    ).toEqual({
      status: 'delivered',
      page: 2,
      q: '12584',
    });
    expect(parseAccountOrdersQuery(convertToParamMap({ status: 'unknown', page: '0' }))).toEqual({
      status: 'all',
      page: 1,
      q: '',
    });
  });

  it('omits default query params from the URL', () => {
    expect(accountOrdersQueryToParams({ status: 'all', page: 1, q: '' })).toEqual({
      status: null,
      page: null,
      q: null,
    });
    expect(accountOrdersQueryToParams({ status: 'in-progress', page: 2, q: '12584' })).toEqual({
      status: 'in-progress',
      page: 2,
      q: '12584',
    });
  });

  it('maps in-progress to open orders and cancelled to none', () => {
    const pending = order({ id: '1', number: 'A', status: 'pending-review' });
    const shipped = order({ id: '2', number: 'B', status: 'shipped' });
    const delivered = order({ id: '3', number: 'C', status: 'delivered' });

    expect(orderMatchesStatus(pending, 'in-progress')).toBe(true);
    expect(orderMatchesStatus(shipped, 'in-progress')).toBe(true);
    expect(orderMatchesStatus(delivered, 'in-progress')).toBe(false);
    expect(orderMatchesStatus(pending, 'cancelled')).toBe(false);
    expect(countOrdersByFilter([pending, shipped, delivered], 'all')).toBe(3);
    expect(countOrdersByFilter([pending, shipped, delivered], 'in-progress')).toBe(2);
    expect(countOrdersByFilter([pending, shipped, delivered], 'delivered')).toBe(1);
    expect(countOrdersByFilter([pending, shipped, delivered], 'cancelled')).toBe(0);
  });

  it('matches search against the order number only', () => {
    const match = order({
      id: '1',
      number: '#12584',
      status: 'shipped',
      lines: [
        {
          productId: 'p1',
          slug: 'p1',
          title: 'ثلاجة',
          imageSrc: 'a.jpg',
          imageAlt: '',
          quantity: 1,
          unitPrice: 1,
        },
      ],
    });
    const other = order({
      id: '2',
      number: 'MN-9',
      status: 'delivered',
      lines: [
        {
          productId: 'p2',
          slug: 'p2',
          title: 'طلب 12584',
          imageSrc: 'b.jpg',
          imageAlt: '',
          quantity: 1,
          unitPrice: 1,
        },
      ],
    });

    expect(orderMatchesSearch(match, '12584')).toBe(true);
    expect(orderMatchesSearch(match, '#12584')).toBe(true);
    expect(orderMatchesSearch(other, '12584')).toBe(false);
  });
});
