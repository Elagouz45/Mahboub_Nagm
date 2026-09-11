import { TestBed } from '@angular/core/testing';
import { MOCK_OFFERS } from '@features/home/data-access/home.mock';
import { WishlistStore } from './wishlist.store';

describe('WishlistStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('toggles wishlist membership', () => {
    TestBed.configureTestingModule({});
    const store = TestBed.inject(WishlistStore);
    const product = MOCK_OFFERS[0];

    store.toggle(product);
    expect(store.ids().has(product.id)).toBe(true);
    expect(store.count()).toBe(1);

    store.toggle(product);
    expect(store.ids().has(product.id)).toBe(false);
    expect(store.count()).toBe(0);
  });
});
