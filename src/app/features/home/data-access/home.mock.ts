import { Brand, Category, ProductSummary } from '@shared/models/storefront.model';
import { localCategoryImage } from './home-image.map';
import { MOCK_CATALOG_PRODUCTS } from '@features/catalog/data-access/catalog-mock.service';

function category(id: string, slug: string, name: string): Category {
  const image = localCategoryImage(slug);
  return {
    id,
    slug,
    name,
    imageSrc: image.src,
    imageAlt: image.alt,
  };
}

export const MOCK_CATEGORIES: readonly Category[] = [
  category('fridges', 'fridges', 'ثلاجات'),
  category('washers', 'washers', 'غسالات'),
  category('tvs', 'tvs', 'تليفزيونات'),
  category('acs', 'acs', 'تكييفات'),
  category('kitchen', 'kitchen', 'بوتاجازات'),
  category('ovens', 'ovens', 'أفران وميكروويف'),
  category('water-heaters', 'water-heaters', 'سخانات مياه'),
  category('fans', 'fans', 'مراوح'),
  category('small', 'small', 'أجهزة صغيرة'),
  category('vacuum-cleaners', 'vacuum-cleaners', 'مكانس كهربائية'),
];

export const MOCK_OFFERS: readonly ProductSummary[] = ['LG-635', 'SM-800', 'TCL-55U', 'CR-18K']
  .map((sku) => MOCK_CATALOG_PRODUCTS.find((p) => p.sku === sku))
  .filter((p): p is (typeof MOCK_CATALOG_PRODUCTS)[number] => p !== undefined);
export const MOCK_BEST_SELLERS: readonly ProductSummary[] = MOCK_CATALOG_PRODUCTS.filter(
  (p) => p.isBestseller,
).slice(0, 8);

export const MOCK_BRANDS: readonly Brand[] = [
  { id: 'lg', slug: 'lg', name: 'LG', imageSrc: '/assets/images/brand/lg.png' },
  { id: 'samsung', slug: 'samsung', name: 'Samsung', imageSrc: '/assets/images/brand/samsung.png' },
  { id: 'fresh', slug: 'fresh', name: 'Fresh', imageSrc: '/assets/images/brand/fresh.png' },
  { id: 'toshiba', slug: 'toshiba', name: 'Toshiba', imageSrc: '/assets/images/brand/toshiba.png' },
  { id: 'sharp', slug: 'sharp', name: 'Sharp', imageSrc: '/assets/images/brand/sharp.png' },
  { id: 'carrier', slug: 'carrier', name: 'Carrier', imageSrc: '/assets/images/brand/carrier.png' },
  { id: 'tornado', slug: 'tornado', name: 'Tornado', imageSrc: '/assets/images/brand/tornado.png' },
  { id: 'philips', slug: 'philips', name: 'Philips', imageSrc: '/assets/images/brand/philips.png' },
  { id: 'tcl', slug: 'tcl', name: 'TCL', imageSrc: '/assets/images/brand/tcl.png' },
];

export function createOfferEndDate(): Date {
  return new Date(Date.now() + ((12 * 60 + 34) * 60 + 58) * 1000);
}
