import { TestBed } from '@angular/core/testing';
import { AccountAddress } from '@core/auth/account.models';
import { MOCK_CATALOG_PRODUCTS } from '@features/catalog/data-access/catalog-mock.service';
import { ContactRequest } from '@features/contact/models/contact.model';
import { BrowserStorageService } from './browser-storage.service';
import { DEMO_COMMERCE_KEY, DemoCommerceService } from './demo-commerce.service';

const product = MOCK_CATALOG_PRODUCTS[0];
const address: AccountAddress = {
  id: 'address',
  userId: 'guest',
  label: 'home',
  recipientName: 'أحمد محمد',
  phone: '01012345678',
  governorateSlug: 'cairo',
  city: 'القاهرة',
  street: 'شارع النصر 10',
  details: 'الدور الأول',
  isDefault: false,
};
const request: ContactRequest = {
  type: 'maintenance',
  name: 'أحمد محمد',
  phone: '01012345678',
  email: 'test@example.com',
  message: 'رسالة تجريبية للصيانة',
  productSlug: '',
  orderNumber: '',
  deviceType: 'غسالة',
  issue: 'طلب تجريبي لفحص الجهاز',
  complaintSubject: '',
  attachments: [],
};

describe('Demo commerce transactions', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({});
  });
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('saves an immutable order and empties the basket in a single durable write', () => {
    const commerce = TestBed.inject(DemoCommerceService);
    commerce.add(product, 2);
    const order = commerce.placeOrder(address, 'checkout-1')!;
    expect(order.total).toBe(product.price * 2 + 100);
    expect(order.status).toBe('pending-review');
    expect(order.address).toEqual(address);
    expect(order.address).not.toBe(address);
    expect(commerce.cart()).toHaveLength(0);
    expect(commerce.placeOrder(address, 'checkout-1')?.id).toBe(order.id);
    expect(commerce.orders('guest')).toHaveLength(1);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const restored = TestBed.inject(DemoCommerceService);
    restored.switchUser(null);
    expect(restored.order(order.id)?.lines[0].unitPrice).toBe(product.price);
    expect(restored.cart()).toHaveLength(0);
  });

  it('does not lose the basket or announce success when order storage fails', () => {
    const commerce = TestBed.inject(DemoCommerceService);
    commerce.add(product);
    vi.spyOn(TestBed.inject(BrowserStorageService), 'writeLocalChecked').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(commerce.placeOrder(address, 'failed')).toBeNull();
    expect(commerce.cart()).toHaveLength(1);
    expect(commerce.orders('guest')).toHaveLength(0);
    expect(commerce.error()).toContain('تعذر حفظ');
  });

  it('rejects empty orders, invalid governorates, unavailable products and quantities over ten', () => {
    const commerce = TestBed.inject(DemoCommerceService);
    expect(commerce.placeOrder(address, 'empty')).toBeNull();
    expect(commerce.add(MOCK_CATALOG_PRODUCTS.find((p) => p.stockStatus === 'out-of-stock')!)).toBe(
      false,
    );
    expect(commerce.add(product, 11)).toBe(false);
    commerce.add(product, 10);
    expect(commerce.add(product)).toBe(false);
    expect(commerce.setQuantity(product.id, 0)).toBe(false);
    expect(commerce.setQuantity(product.id, 1.5)).toBe(false);
    expect(
      commerce.placeOrder({ ...address, governorateSlug: 'unknown' }, 'bad-address'),
    ).toBeNull();
  });

  it('merges guest items once by SKU and isolates carts and wishlists between accounts', () => {
    const commerce = TestBed.inject(DemoCommerceService);
    commerce.switchUser('alice');
    commerce.add(product, 7);
    commerce.switchUser(null);
    commerce.add(product, 5);
    commerce.toggleWishlist(product);
    commerce.switchUser('alice');
    expect(commerce.cart()[0].quantity).toBe(10);
    expect(commerce.wishlist()).toHaveLength(1);
    commerce.switchUser('bob');
    expect(commerce.cart()).toHaveLength(0);
    expect(commerce.wishlist()).toHaveLength(0);
    commerce.switchUser(null);
    expect(commerce.cart()).toHaveLength(0);
    commerce.switchUser('alice');
    expect(commerce.cart()[0].quantity).toBe(10);
  });

  it('keeps guest data recoverable if merging fails and does not expose another account', () => {
    const commerce = TestBed.inject(DemoCommerceService);
    commerce.add(product);
    vi.spyOn(TestBed.inject(BrowserStorageService), 'writeLocalChecked').mockImplementation(() => {
      throw new Error('quota');
    });
    commerce.switchUser('alice');
    expect(commerce.cart()).toHaveLength(0);
    commerce.switchUser(null);
    expect(commerce.cart()).toHaveLength(1);
  });

  it('migrates valid legacy data and ignores malformed records', () => {
    sessionStorage.setItem(
      'mahbub-najm.cart',
      JSON.stringify([null, { product, quantity: 2 }, { product, quantity: -1 }]),
    );
    sessionStorage.setItem('mahbub-najm.wishlist', JSON.stringify([null, product]));
    const commerce = TestBed.inject(DemoCommerceService);
    commerce.switchUser(null);
    expect(commerce.cart()).toHaveLength(1);
    expect(commerce.wishlist()).toHaveLength(1);
    commerce.remove(product.id);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const restored = TestBed.inject(DemoCommerceService);
    restored.switchUser(null);
    expect(restored.cart()).toHaveLength(0);
  });

  it('recovers from malformed stored JSON and invalid versioned entries', () => {
    localStorage.setItem(
      DEMO_COMMERCE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        carts: { guest: [null, {}, { product, quantity: '2' }] },
        wishlists: { guest: [null] },
        orders: [null, {}],
        messages: [null, {}],
      }),
    );
    const commerce = TestBed.inject(DemoCommerceService);
    commerce.switchUser(null);
    expect(commerce.cart()).toHaveLength(0);
    expect(commerce.orders('guest')).toHaveLength(0);
    expect(commerce.serviceRequests('guest')).toHaveLength(0);
    expect(commerce.add(product)).toBe(true);
  });

  it('requires a second confirmation after a price change', () => {
    sessionStorage.setItem(
      'mahbub-najm.cart',
      JSON.stringify([{ product: { ...product, price: 1 }, quantity: 1 }]),
    );
    const commerce = TestBed.inject(DemoCommerceService);
    expect(commerce.placeOrder(address, 'repriced')).toBeNull();
    expect(commerce.error()).toContain('تغير سعر');
    expect(commerce.cart()[0].product.price).toBe(product.price);
    expect(commerce.placeOrder(address, 'repriced')?.total).toBe(product.price + 100);
  });

  it('prevents checkout of a previously stored product that is unavailable now', () => {
    const unavailable = MOCK_CATALOG_PRODUCTS.find((p) => p.stockStatus === 'out-of-stock')!;
    sessionStorage.setItem(
      'mahbub-najm.cart',
      JSON.stringify([{ product: { ...unavailable, stockStatus: 'in-stock' }, quantity: 1 }]),
    );
    const commerce = TestBed.inject(DemoCommerceService);
    expect(commerce.placeOrder(address, 'unavailable')).toBeNull();
    expect(commerce.cart()).toHaveLength(1);
  });

  it('saves maintenance references per owner and protects order lookup from other accounts', () => {
    const commerce = TestBed.inject(DemoCommerceService);
    commerce.switchUser('alice');
    commerce.add(product);
    const order = commerce.placeOrder(address, 'alice-order')!;
    const reference = commerce.submitMessage(request);
    expect(commerce.serviceRequests('alice')[0].id).toBe(reference);
    commerce.switchUser('bob');
    expect(commerce.order(order.id)).toBeNull();
    expect(commerce.serviceRequests('bob')).toHaveLength(0);
  });

  it('reports message storage failures without creating a reference', () => {
    const commerce = TestBed.inject(DemoCommerceService);
    vi.spyOn(TestBed.inject(BrowserStorageService), 'writeLocalChecked').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(commerce.submitMessage(request)).toBeNull();
    expect(commerce.serviceRequests('guest')).toHaveLength(0);
  });
});
