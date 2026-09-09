import { Brand, Category, ProductSummary } from '@shared/models/storefront.model';
import { localCategoryImage, localProductImage } from './home-image.map';

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

function product(
  data: Omit<ProductSummary, 'imageSrc' | 'imageAlt'> & { readonly imageAlt?: string },
): ProductSummary {
  const image = localProductImage(data.slug);
  return {
    ...data,
    imageSrc: image.src,
    imageAlt: data.imageAlt ?? image.alt,
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

export const MOCK_OFFERS: readonly ProductSummary[] = [
  product({
    id: 'lg-fridge-635',
    sku: 'LG-635',
    slug: 'lg-fridge-635',
    brand: 'LG',
    title: 'ثلاجة إل جي إنفرتر 635 لتر',
    spec: 'بابين · تبريد مركزي · ستيل',
    imageAlt: 'ثلاجة إل جي 635 لتر',
    rating: 4.8,
    reviewCount: 214,
    price: 28999,
    oldPrice: 35499,
    discountPercent: 18,
  }),
  product({
    id: 'samsung-washer-8',
    sku: 'SM-800',
    slug: 'samsung-washer-8kg',
    brand: 'Samsung',
    title: 'غسالة سامسونج 8 كيلو',
    spec: 'تعبئة أمامية · إنفرتر',
    imageAlt: 'غسالة سامسونج 8 كيلو',
    rating: 4.7,
    reviewCount: 168,
    price: 13599,
    oldPrice: 16999,
    discountPercent: 20,
  }),
  product({
    id: 'tcl-tv-55',
    sku: 'TCL-55U',
    slug: 'tcl-tv-55',
    brand: 'TCL',
    title: 'تليفزيون تي سي إل 55 بوصة 4K',
    spec: 'Google TV · HDR',
    imageAlt: 'تليفزيون تي سي إل 55 بوصة',
    rating: 4.6,
    reviewCount: 142,
    price: 12499,
    oldPrice: 15999,
    discountPercent: 22,
  }),
  product({
    id: 'carrier-ac-1-5',
    sku: 'CR-18K',
    slug: 'carrier-ac-1-5',
    brand: 'Carrier',
    title: 'تكييف كاريير 1.5 حصان إنفرتر',
    spec: 'تبريد سريع · موفر للطاقة',
    imageAlt: 'تكييف كاريير 1.5 حصان',
    rating: 4.5,
    reviewCount: 97,
    price: 18999,
    oldPrice: 22999,
    discountPercent: 17,
  }),
];

export const MOCK_BEST_SELLERS: readonly ProductSummary[] = [
  product({
    id: 'fresh-heater',
    sku: 'FR-H50',
    slug: 'fresh-water-heater',
    brand: 'Fresh',
    title: 'سخان مياه فريش 50 لتر',
    spec: 'كهرباء · حماية ضد الحرارة',
    imageAlt: 'سخان مياه فريش',
    rating: 4.4,
    reviewCount: 81,
    price: 4299,
  }),
  product({
    id: 'toshiba-blender',
    sku: 'TB-600',
    slug: 'toshiba-blender',
    brand: 'Toshiba',
    title: 'خلاط توشيبا 600 واط',
    spec: 'زجاج · سرعتان',
    imageAlt: 'خلاط توشيبا',
    rating: 4.3,
    reviewCount: 64,
    price: 1899,
  }),
  product({
    id: 'fresh-cooker',
    sku: 'FR-C90',
    slug: 'fresh-cooker',
    brand: 'Fresh',
    title: 'بوتاجاز فريش 5 شعلة',
    spec: 'أمان كامل · استانلس',
    imageAlt: 'بوتاجاز فريش',
    rating: 4.6,
    reviewCount: 119,
    price: 8999,
  }),
  product({
    id: 'tornado-vacuum',
    sku: 'TR-V20',
    slug: 'tornado-vacuum',
    brand: 'Tornado',
    title: 'مكنسة تورنيدو 2000 واط',
    spec: 'كيس قماش · فلاتر متعددة',
    imageAlt: 'مكنسة تورنيدو',
    rating: 4.2,
    reviewCount: 53,
    price: 2599,
  }),
  product({
    id: 'philips-airfryer',
    sku: 'PH-AF4',
    slug: 'philips-air-fryer',
    brand: 'Philips',
    title: 'قلاية هوائية فيليبس 4.1 لتر',
    spec: 'Rapid Air · سلة مانعة للالتصاق',
    imageAlt: 'قلاية هوائية فيليبس',
    rating: 4.8,
    reviewCount: 201,
    price: 5499,
  }),
  product({
    id: 'sharp-microwave',
    sku: 'SH-M25',
    slug: 'sharp-microwave',
    brand: 'Sharp',
    title: 'ميكروويف شارب 25 لتر',
    spec: 'شواية · عدة برامج',
    imageAlt: 'ميكروويف شارب',
    rating: 4.4,
    reviewCount: 88,
    price: 3699,
  }),
];

export const MOCK_BRANDS: readonly Brand[] = [
  { id: 'lg', slug: 'lg', name: 'LG', imageSrc: '/assets/images/brand/lg.svg' },
  { id: 'samsung', slug: 'samsung', name: 'Samsung', imageSrc: '/assets/images/brand/samsung.svg' },
  { id: 'fresh', slug: 'fresh', name: 'Fresh', imageSrc: '/assets/images/brand/fresh.svg' },
  { id: 'toshiba', slug: 'toshiba', name: 'Toshiba', imageSrc: '/assets/images/brand/toshiba.svg' },
  { id: 'sharp', slug: 'sharp', name: 'Sharp', imageSrc: '/assets/images/brand/sharp.svg' },
  { id: 'carrier', slug: 'carrier', name: 'Carrier', imageSrc: '/assets/images/brand/carrier.svg' },
  { id: 'tornado', slug: 'tornado', name: 'Tornado', imageSrc: '/assets/images/brand/tornado.svg' },
  { id: 'philips', slug: 'philips', name: 'Philips', imageSrc: '/assets/images/brand/philips.svg' },
];

export function createOfferEndDate(): Date {
  return new Date(Date.now() + ((12 * 60 + 34) * 60 + 58) * 1000);
}
