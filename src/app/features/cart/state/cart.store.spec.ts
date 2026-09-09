import { TestBed } from '@angular/core/testing';
import { MOCK_OFFERS } from '@features/home/data-access/home.mock';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('adds a product and increments quantity for duplicates', () => {
    TestBed.configureTestingModule({});
    const store = TestBed.inject(CartStore);
    const product = MOCK_OFFERS[1];

    store.add(product);
    store.add(product);

    expect(store.count()).toBe(2);
    expect(store.items()[0]?.quantity).toBe(2);
    expect(store.items()[0]?.product.sku).toBe('SM-800');
  });
});
