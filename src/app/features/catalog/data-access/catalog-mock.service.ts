import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductSummary, StockStatus } from '@shared/models/storefront.model';
import {
  AvailableCatalogFilters,
  BRAND_LABELS,
  CatalogQuery,
  CatalogSearchResult,
  CATEGORY_LABELS,
  FilterOption,
  OFFER_LABELS,
  STOCK_LABELS,
  VALID_BRAND_SLUGS,
  VALID_CATEGORY_SLUGS,
} from '../models/catalog.model';
import { CATEGORY_ATTRIBUTE_FILTERS } from './catalog-attributes';
import { catalogProductImage } from './catalog-image.map';
import { CatalogRepository } from './catalog.repository';

export interface CatalogProductRecord extends ProductSummary {
  readonly createdAt: number;
}

type MatchOmit =
  | 'category'
  | 'brands'
  | 'price'
  | 'availability'
  | 'rating'
  | 'offer'
  | 'attributes';

function imageFor(slug: string, categorySlug: string): Pick<ProductSummary, 'imageSrc' | 'imageAlt'> {
  const image = catalogProductImage(slug, categorySlug);
  return { imageSrc: image.src, imageAlt: image.alt };
}

function record(
  data: Omit<CatalogProductRecord, 'imageSrc' | 'imageAlt'> & { readonly imageAlt?: string },
): CatalogProductRecord {
  const image = imageFor(data.slug, data.categorySlug ?? '');
  return {
    stockStatus: 'in-stock',
    ...data,
    imageSrc: image.imageSrc,
    imageAlt: data.imageAlt ?? image.imageAlt,
  };
}

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-09-01T00:00:00.000Z');

export const MOCK_CATALOG_PRODUCTS: readonly CatalogProductRecord[] = [
  record({
    id: 'lg-fridge-635',
    sku: 'LG-635',
    slug: 'lg-fridge-635',
    brand: 'LG',
    title: 'ثلاجة إل جي إنفرتر 635 لتر',
    spec: 'بابين · تبريد مركزي · ستيل',
    description: 'ثلاجة فرنسية إنفرتر بسعة كبيرة ونوفروست.',
    categorySlug: 'fridges',
    rating: 4.8,
    reviewCount: 214,
    price: 28999,
    oldPrice: 35499,
    discountPercent: 18,
    isBestseller: true,
    isTodaysOffer: true,
    createdAt: NOW - 2 * DAY,
    attributes: { capacity: 635, doors: 2, noFrost: true, inverter: true, color: 'silver', energy: 'A++' },
  }),
  record({
    id: 'samsung-fridge-sbs',
    sku: 'SM-SBS',
    slug: 'samsung-fridge-sbs',
    brand: 'Samsung',
    title: 'ثلاجة سامسونج بابين متقابلين',
    spec: 'سايد باي سايد · نوفروست',
    categorySlug: 'fridges',
    rating: 4.6,
    reviewCount: 156,
    price: 32999,
    oldPrice: 37999,
    discountPercent: 13,
    isTodaysOffer: true,
    createdAt: NOW - 8 * DAY,
    attributes: { capacity: 700, doors: 2, noFrost: true, inverter: true, color: 'black', energy: 'A+' },
  }),
  record({
    id: 'fresh-fridge-white',
    sku: 'FR-TFW',
    slug: 'fresh-fridge-white',
    brand: 'Fresh',
    title: 'ثلاجة فريش فريزر علوي 400 لتر',
    spec: 'بابان · أبيض',
    categorySlug: 'fridges',
    rating: 4.2,
    reviewCount: 73,
    price: 12499,
    createdAt: NOW - 20 * DAY,
    attributes: { capacity: 400, doors: 2, noFrost: false, inverter: false, color: 'white', energy: 'A+' },
  }),
  record({
    id: 'toshiba-fridge-french',
    sku: 'TB-FR',
    slug: 'toshiba-fridge-french',
    brand: 'Toshiba',
    title: 'ثلاجة توشيبا فرنسية 500 لتر',
    spec: '4 أبواب · إنفرتر',
    categorySlug: 'fridges',
    rating: 4.5,
    reviewCount: 41,
    price: 25999,
    stockStatus: 'available-to-order',
    createdAt: NOW - 5 * DAY,
    attributes: { capacity: 500, doors: 4, noFrost: true, inverter: true, color: 'silver', energy: 'A++' },
  }),
  record({
    id: 'samsung-washer-8',
    sku: 'SM-800',
    slug: 'samsung-washer-8kg',
    brand: 'Samsung',
    title: 'غسالة سامسونج 8 كيلو',
    spec: 'تعبئة أمامية · إنفرتر',
    categorySlug: 'washers',
    rating: 4.7,
    reviewCount: 168,
    price: 13599,
    oldPrice: 16999,
    discountPercent: 20,
    isBestseller: true,
    isTodaysOffer: true,
    createdAt: NOW - 3 * DAY,
    attributes: { capacity: 8, loadType: 'front', automatic: true, inverter: true, dryer: false, color: 'silver' },
  }),
  record({
    id: 'lg-washer-top',
    sku: 'LG-TOP',
    slug: 'lg-washer-top',
    brand: 'LG',
    title: 'غسالة إل جي تعبئة علوية 7 كجم',
    spec: 'أوتوماتيك · أبيض',
    categorySlug: 'washers',
    rating: 4.4,
    reviewCount: 92,
    price: 8999,
    createdAt: NOW - 14 * DAY,
    attributes: { capacity: 7, loadType: 'top', automatic: true, inverter: false, dryer: false, color: 'white' },
  }),
  record({
    id: 'toshiba-washer-dryer',
    sku: 'TB-WD',
    slug: 'toshiba-washer-dryer',
    brand: 'Toshiba',
    title: 'غسالة مجفف توشيبا 10 كجم',
    spec: 'أمامية · جرافيت',
    categorySlug: 'washers',
    rating: 4.6,
    reviewCount: 58,
    price: 18999,
    oldPrice: 21999,
    discountPercent: 14,
    stockStatus: 'out-of-stock',
    createdAt: NOW - 11 * DAY,
    attributes: { capacity: 10, loadType: 'front', automatic: true, inverter: true, dryer: true, color: 'graphite' },
  }),
  record({
    id: 'fresh-washer-7',
    sku: 'FR-W7',
    slug: 'fresh-washer-7',
    brand: 'Fresh',
    title: 'غسالة فريش 7 كجم تعبئة علوية',
    spec: 'حوضين · اقتصادي',
    categorySlug: 'washers',
    rating: 3.9,
    reviewCount: 44,
    price: 5499,
    createdAt: NOW - 30 * DAY,
    attributes: { capacity: 7, loadType: 'top', automatic: false, inverter: false, dryer: false, color: 'white' },
  }),
  record({
    id: 'tcl-tv-55',
    sku: 'TCL-55U',
    slug: 'tcl-tv-55',
    brand: 'TCL',
    title: 'تليفزيون تي سي إل 55 بوصة 4K',
    spec: 'Google TV · HDR',
    categorySlug: 'tvs',
    rating: 4.6,
    reviewCount: 142,
    price: 12499,
    oldPrice: 15999,
    discountPercent: 22,
    isTodaysOffer: true,
    createdAt: NOW - 4 * DAY,
    attributes: { screenSize: 55, resolution: '4k', smart: true, displayTech: 'led', connectivity: 'wifi' },
  }),
  record({
    id: 'samsung-tv-65',
    sku: 'SM-65Q',
    slug: 'samsung-tv-65',
    brand: 'Samsung',
    title: 'تليفزيون سامسونج 65 بوصة QLED',
    spec: '4K · سمارت',
    categorySlug: 'tvs',
    rating: 4.8,
    reviewCount: 201,
    price: 24999,
    oldPrice: 28999,
    discountPercent: 14,
    isBestseller: true,
    createdAt: NOW - 6 * DAY,
    attributes: { screenSize: 65, resolution: '4k', smart: true, displayTech: 'qled', connectivity: 'wifi' },
  }),
  record({
    id: 'lg-tv-43',
    sku: 'LG-43',
    slug: 'lg-tv-43',
    brand: 'LG',
    title: 'تليفزيون إل جي 43 بوصة',
    spec: 'Full HD · سمارت',
    categorySlug: 'tvs',
    rating: 4.3,
    reviewCount: 88,
    price: 7999,
    createdAt: NOW - 18 * DAY,
    attributes: { screenSize: 43, resolution: 'fhd', smart: true, displayTech: 'led', connectivity: 'hdmi' },
  }),
  record({
    id: 'tornado-tv-55',
    sku: 'TR-55',
    slug: 'tornado-tv-55',
    brand: 'Tornado',
    title: 'تليفزيون تورنيدو 55 بوصة 4K',
    spec: 'LED · HDMI',
    categorySlug: 'tvs',
    rating: 4.1,
    reviewCount: 62,
    price: 9999,
    createdAt: NOW - 9 * DAY,
    attributes: { screenSize: 55, resolution: '4k', smart: false, displayTech: 'led', connectivity: 'hdmi' },
  }),
  record({
    id: 'carrier-ac-1-5',
    sku: 'CR-18K',
    slug: 'carrier-ac-1-5',
    brand: 'Carrier',
    title: 'تكييف كاريير 1.5 حصان إنفرتر',
    spec: 'تبريد سريع · موفر للطاقة',
    categorySlug: 'acs',
    rating: 4.5,
    reviewCount: 97,
    price: 18999,
    oldPrice: 22999,
    discountPercent: 17,
    isTodaysOffer: true,
    isBestseller: true,
    createdAt: NOW - 1 * DAY,
    attributes: { horsepower: 1.5, coolingType: 'split', inverter: true, coverage: 'medium', energy: 'A+' },
  }),
  record({
    id: 'fresh-ac-split',
    sku: 'FR-AC',
    slug: 'fresh-ac-split',
    brand: 'Fresh',
    title: 'تكييف فريش سبليت 1.5 حصان',
    spec: 'تبريد فقط · أبيض',
    categorySlug: 'acs',
    rating: 4.0,
    reviewCount: 54,
    price: 12999,
    createdAt: NOW - 16 * DAY,
    attributes: { horsepower: 1.5, coolingType: 'split', inverter: false, coverage: 'medium', energy: 'A' },
  }),
  record({
    id: 'carrier-ac-premium',
    sku: 'CR-PR',
    slug: 'carrier-ac-premium',
    brand: 'Carrier',
    title: 'تكييف كاريير بريميوم 2.25 حصان',
    spec: 'إنفرتر · تغطية واسعة',
    categorySlug: 'acs',
    rating: 4.7,
    reviewCount: 39,
    price: 27499,
    createdAt: NOW - 7 * DAY,
    attributes: { horsepower: 2.25, coolingType: 'split', inverter: true, coverage: 'large', energy: 'A+' },
  }),
  record({
    id: 'sharp-ac-1',
    sku: 'SH-AC1',
    slug: 'sharp-ac-1',
    brand: 'Sharp',
    title: 'تكييف شارب 1 حصان',
    spec: 'سبليت · غرف صغيرة',
    categorySlug: 'acs',
    rating: 4.2,
    reviewCount: 47,
    price: 10999,
    stockStatus: 'coming-soon',
    createdAt: NOW - DAY / 2,
    attributes: { horsepower: 1, coolingType: 'split', inverter: false, coverage: 'small', energy: 'A' },
  }),
  record({
    id: 'fresh-cooker',
    sku: 'FR-C90',
    slug: 'fresh-cooker',
    brand: 'Fresh',
    title: 'بوتاجاز فريش 5 شعلة',
    spec: 'أمان كامل · استانلس',
    categorySlug: 'kitchen',
    rating: 4.6,
    reviewCount: 119,
    price: 8999,
    isBestseller: true,
    createdAt: NOW - 12 * DAY,
    attributes: { burners: 5, installType: 'freestanding', fuel: 'gas', safety: true },
  }),
  record({
    id: 'fresh-cooker-glass',
    sku: 'FR-CG',
    slug: 'fresh-cooker-glass',
    brand: 'Fresh',
    title: 'بوتاجاز فريش سطح زجاج أسود',
    spec: '4 شعلات · أمان',
    categorySlug: 'kitchen',
    rating: 4.4,
    reviewCount: 67,
    price: 7499,
    oldPrice: 8499,
    discountPercent: 12,
    createdAt: NOW - 10 * DAY,
    attributes: { burners: 4, installType: 'freestanding', fuel: 'gas', safety: true },
  }),
  record({
    id: 'sharp-hob',
    sku: 'SH-HOB',
    slug: 'sharp-hob',
    brand: 'Sharp',
    title: 'مسطح غاز شارب مدمج',
    spec: '5 شعلات · أمان',
    categorySlug: 'kitchen',
    rating: 4.5,
    reviewCount: 33,
    price: 6499,
    createdAt: NOW - 15 * DAY,
    attributes: { burners: 5, installType: 'built-in', fuel: 'gas', safety: true },
  }),
  record({
    id: 'sharp-oven-builtin',
    sku: 'SH-OV',
    slug: 'sharp-oven-builtin',
    brand: 'Sharp',
    title: 'فرن كهربائي شارب مدمج',
    spec: 'شواية · برامج متعددة',
    categorySlug: 'ovens',
    rating: 4.6,
    reviewCount: 51,
    price: 8999,
    createdAt: NOW - 13 * DAY,
    attributes: { capacity: 65, fuel: 'electric', installType: 'built-in' },
  }),
  record({
    id: 'sharp-microwave',
    sku: 'SH-M25',
    slug: 'sharp-microwave',
    brand: 'Sharp',
    title: 'ميكروويف شارب 25 لتر',
    spec: 'شواية · عدة برامج',
    categorySlug: 'ovens',
    rating: 4.4,
    reviewCount: 88,
    price: 3699,
    isBestseller: true,
    createdAt: NOW - 21 * DAY,
    attributes: { capacity: 25, fuel: 'electric', installType: 'countertop' },
  }),
  record({
    id: 'fresh-microwave',
    sku: 'FR-MW',
    slug: 'fresh-microwave',
    brand: 'Fresh',
    title: 'ميكروويف فريش 20 لتر',
    spec: 'رقمي · سهل التنظيف',
    categorySlug: 'ovens',
    rating: 4.0,
    reviewCount: 40,
    price: 2499,
    createdAt: NOW - 25 * DAY,
    attributes: { capacity: 20, fuel: 'electric', installType: 'countertop' },
  }),
  record({
    id: 'fresh-heater',
    sku: 'FR-H50',
    slug: 'fresh-water-heater',
    brand: 'Fresh',
    title: 'سخان مياه فريش 50 لتر',
    spec: 'كهرباء · حماية ضد الحرارة',
    categorySlug: 'water-heaters',
    rating: 4.4,
    reviewCount: 81,
    price: 4299,
    isBestseller: true,
    createdAt: NOW - 17 * DAY,
    attributes: { capacity: 50, fuel: 'electric', installType: 'wall', digital: false },
  }),
  record({
    id: 'fresh-heater-80',
    sku: 'FR-H80',
    slug: 'fresh-heater-80',
    brand: 'Fresh',
    title: 'سخان مياه فريش 80 لتر',
    spec: 'كهرباء · سعة كبيرة',
    categorySlug: 'water-heaters',
    rating: 4.3,
    reviewCount: 29,
    price: 5499,
    createdAt: NOW - 22 * DAY,
    attributes: { capacity: 80, fuel: 'electric', installType: 'wall', digital: true },
  }),
  record({
    id: 'tornado-fan',
    sku: 'TR-FAN',
    slug: 'tornado-fan',
    brand: 'Tornado',
    title: 'مروحة تورنيدو عمودية',
    spec: '3 سرعات · توقيت',
    categorySlug: 'fans',
    rating: 4.1,
    reviewCount: 76,
    price: 1299,
    oldPrice: 1599,
    discountPercent: 19,
    isTodaysOffer: true,
    createdAt: NOW - 4 * DAY,
  }),
  record({
    id: 'fresh-fan',
    sku: 'FR-FAN',
    slug: 'fresh-fan',
    brand: 'Fresh',
    title: 'مروحة فريش عمودية',
    spec: 'هادئة · 3 سرعات',
    categorySlug: 'fans',
    rating: 3.8,
    reviewCount: 22,
    price: 999,
    createdAt: NOW - 28 * DAY,
  }),
  record({
    id: 'philips-airfryer',
    sku: 'PH-AF4',
    slug: 'philips-air-fryer',
    brand: 'Philips',
    title: 'قلاية هوائية فيليبس 4.1 لتر',
    spec: 'Rapid Air · سلة مانعة للالتصاق',
    categorySlug: 'small',
    rating: 4.8,
    reviewCount: 201,
    price: 5499,
    isBestseller: true,
    createdAt: NOW - 6 * DAY,
  }),
  record({
    id: 'toshiba-blender',
    sku: 'TB-600',
    slug: 'toshiba-blender',
    brand: 'Toshiba',
    title: 'خلاط توشيبا 600 واط',
    spec: 'زجاج · سرعتان',
    categorySlug: 'small',
    rating: 4.3,
    reviewCount: 64,
    price: 1899,
    createdAt: NOW - 19 * DAY,
  }),
  record({
    id: 'philips-coffee',
    sku: 'PH-CM',
    slug: 'philips-coffee',
    brand: 'Philips',
    title: 'صانعة قهوة فيليبس',
    spec: 'فلتر · إبريق زجاج',
    categorySlug: 'small',
    rating: 4.5,
    reviewCount: 48,
    price: 2199,
    createdAt: NOW - 8 * DAY,
  }),
  record({
    id: 'philips-processor',
    sku: 'PH-FP',
    slug: 'philips-processor',
    brand: 'Philips',
    title: 'محضرة طعام فيليبس',
    spec: 'شفرات متعددة · وعاء كبير',
    categorySlug: 'small',
    rating: 4.4,
    reviewCount: 37,
    price: 3299,
    createdAt: NOW - 14 * DAY,
  }),
  record({
    id: 'tornado-vacuum',
    sku: 'TR-V20',
    slug: 'tornado-vacuum',
    brand: 'Tornado',
    title: 'مكنسة تورنيدو 2000 واط',
    spec: 'كيس قماش · فلاتر متعددة',
    categorySlug: 'vacuum-cleaners',
    rating: 4.2,
    reviewCount: 53,
    price: 2599,
    createdAt: NOW - 23 * DAY,
  }),
  record({
    id: 'philips-vacuum',
    sku: 'PH-VC',
    slug: 'philips-vacuum',
    brand: 'Philips',
    title: 'مكنسة فيليبس لاسلكية',
    spec: 'شحن سريع · خفيفة',
    categorySlug: 'vacuum-cleaners',
    rating: 4.6,
    reviewCount: 71,
    price: 4999,
    oldPrice: 5799,
    discountPercent: 14,
    isTodaysOffer: true,
    createdAt: NOW - 3 * DAY,
  }),
  record({
    id: 'lg-ac-inverter',
    sku: 'LG-AC',
    slug: 'lg-ac-inverter',
    brand: 'LG',
    title: 'تكييف إل جي 1.5 حصان إنفرتر',
    spec: 'سبليت · موفر',
    categorySlug: 'acs',
    rating: 4.4,
    reviewCount: 61,
    price: 17499,
    createdAt: NOW - 9 * DAY,
    imageAlt: 'تكييف إل جي إنفرتر',
    attributes: { horsepower: 1.5, coolingType: 'split', inverter: true, coverage: 'medium', energy: 'A+' },
  }),
  record({
    id: 'samsung-washer-10',
    sku: 'SM-10F',
    slug: 'samsung-washer-10',
    brand: 'Samsung',
    title: 'غسالة سامسونج 10 كجم إنفرتر',
    spec: 'أمامية · فضي',
    categorySlug: 'washers',
    rating: 4.7,
    reviewCount: 84,
    price: 16499,
    createdAt: NOW - DAY,
    imageAlt: 'غسالة سامسونج 10 كجم',
    attributes: { capacity: 10, loadType: 'front', automatic: true, inverter: true, dryer: false, color: 'silver' },
  }),
];

function brandSlug(brand: string): string {
  return brand.toLowerCase();
}

function matchesQuery(product: CatalogProductRecord, q: string): boolean {
  if (!q) {
    return true;
  }
  const haystack = `${product.title} ${product.brand} ${product.spec} ${product.sku} ${product.description ?? ''}`.toLowerCase();
  return haystack.includes(q.toLowerCase());
}

function attributeMatches(
  product: CatalogProductRecord,
  key: string,
  value: string,
): boolean {
  const raw = product.attributes?.[key];
  if (raw === undefined) {
    return false;
  }
  return String(raw) === value;
}

export function productMatchesQuery(
  product: CatalogProductRecord,
  query: CatalogQuery,
  omit: readonly MatchOmit[] = [],
): boolean {
  const skip = new Set(omit);
  if (!matchesQuery(product, query.q)) {
    return false;
  }
  if (!skip.has('category') && query.category && product.categorySlug !== query.category) {
    return false;
  }
  if (!skip.has('brands') && query.brands.length > 0) {
    if (!query.brands.includes(brandSlug(product.brand))) {
      return false;
    }
  }
  if (!skip.has('price')) {
    if (
      query.minPrice !== null &&
      Number.isFinite(query.minPrice) &&
      product.price < query.minPrice
    ) {
      return false;
    }
    if (
      query.maxPrice !== null &&
      Number.isFinite(query.maxPrice) &&
      product.price > query.maxPrice
    ) {
      return false;
    }
  }
  if (!skip.has('availability') && query.availability && product.stockStatus !== query.availability) {
    return false;
  }
  if (!skip.has('rating') && query.rating && product.rating < query.rating) {
    return false;
  }
  if (
    query.minDiscount !== null &&
    Number.isFinite(query.minDiscount) &&
    query.minDiscount > 0 &&
    (product.discountPercent ?? 0) < query.minDiscount
  ) {
    return false;
  }
  if (!skip.has('offer') && query.offer) {
    if (query.offer === 'discounted' && !product.discountPercent) {
      return false;
    }
    if (query.offer === 'todays' && !product.isTodaysOffer) {
      return false;
    }
    if (query.offer === 'bestselling' && !product.isBestseller) {
      return false;
    }
  }
  if (!skip.has('attributes')) {
    for (const attr of query.attributes) {
      if (!attributeMatches(product, attr.key, attr.value)) {
        return false;
      }
    }
  }
  return true;
}

function relevanceScore(product: CatalogProductRecord, q: string): number {
  if (!q) {
    return (product.isBestseller ? 100 : 0) + product.rating * 10 + product.reviewCount / 100;
  }
  const needle = q.toLowerCase();
  let score = 0;
  if (product.title.toLowerCase().includes(needle)) {
    score += 50;
  }
  if (product.brand.toLowerCase().includes(needle)) {
    score += 20;
  }
  if (product.spec.toLowerCase().includes(needle)) {
    score += 10;
  }
  if (product.sku.toLowerCase().includes(needle)) {
    score += 8;
  }
  return score + product.rating;
}

export function sortCatalogProducts(
  products: readonly CatalogProductRecord[],
  query: CatalogQuery,
): CatalogProductRecord[] {
  const sorted = [...products];
  sorted.sort((left, right) => {
    switch (query.sort) {
      case 'newest':
        return right.createdAt - left.createdAt;
      case 'bestselling':
        return (
          Number(right.isBestseller) - Number(left.isBestseller) || right.reviewCount - left.reviewCount
        );
      case 'rating':
        return right.rating - left.rating || right.reviewCount - left.reviewCount;
      case 'price-asc':
        return left.price - right.price;
      case 'price-desc':
        return right.price - left.price;
      case 'discount':
        return (right.discountPercent ?? 0) - (left.discountPercent ?? 0);
      case 'relevance':
      default:
        return relevanceScore(right, query.q) - relevanceScore(left, query.q);
    }
  });
  return sorted;
}

function countWhere(
  products: readonly CatalogProductRecord[],
  query: CatalogQuery,
  omit: readonly MatchOmit[],
  extra?: (product: CatalogProductRecord) => boolean,
): number {
  return products.filter((product) => productMatchesQuery(product, query, omit) && (!extra || extra(product)))
    .length;
}

function optionsWithCounts(
  options: readonly { value: string; label: string }[],
  countFor: (value: string) => number,
): FilterOption[] {
  return options.map((option) => ({ ...option, count: countFor(option.value) }));
}

export function buildAvailableFilters(
  products: readonly CatalogProductRecord[],
  query: CatalogQuery,
): AvailableCatalogFilters {
  const prices = products.map((item) => item.price);
  const categories = VALID_CATEGORY_SLUGS.map((slug) => ({
    value: slug,
    label: CATEGORY_LABELS[slug] ?? slug,
    count: countWhere(products, query, ['category'], (item) => item.categorySlug === slug),
  }));
  const brands = VALID_BRAND_SLUGS.map((slug) => ({
    value: slug,
    label: BRAND_LABELS[slug] ?? slug,
    count: countWhere(products, query, ['brands'], (item) => brandSlug(item.brand) === slug),
  })).filter((item) => item.count > 0 || query.brands.includes(item.value));

  const availability = (Object.keys(STOCK_LABELS) as StockStatus[]).map((status) => ({
    value: status,
    label: STOCK_LABELS[status],
    count: countWhere(products, query, ['availability'], (item) => item.stockStatus === status),
  }));

  const offers = (Object.keys(OFFER_LABELS) as (keyof typeof OFFER_LABELS)[]).map((offer) => ({
    value: offer,
    label: OFFER_LABELS[offer],
    count: countWhere(products, query, ['offer'], (item) => {
      if (offer === 'discounted') {
        return !!item.discountPercent;
      }
      if (offer === 'todays') {
        return !!item.isTodaysOffer;
      }
      return !!item.isBestseller;
    }),
  }));

  const ratings = [
    {
      value: '4',
      label: '4 نجوم فأكثر',
      count: countWhere(products, query, ['rating'], (item) => item.rating >= 4),
    },
    {
      value: '3',
      label: '3 نجوم فأكثر',
      count: countWhere(products, query, ['rating'], (item) => item.rating >= 3),
    },
  ];

  const definitions = query.category ? (CATEGORY_ATTRIBUTE_FILTERS[query.category] ?? []) : [];
  const attributes = definitions.map((definition) => ({
    ...definition,
    options: optionsWithCounts(definition.options, (value) =>
      countWhere(products, query, ['attributes'], (item) => attributeMatches(item, definition.key, value)),
    ),
  }));

  return {
    categories,
    brands,
    priceMin: prices.length ? Math.min(...prices) : 0,
    priceMax: prices.length ? Math.max(...prices) : 0,
    availability,
    offers,
    ratings,
    attributes,
  };
}

export function searchCatalog(
  products: readonly CatalogProductRecord[],
  query: CatalogQuery,
): CatalogSearchResult {
  const matched = sortCatalogProducts(
    products.filter((product) => productMatchesQuery(product, query)),
    query,
  );
  const total = matched.length;
  const pageSize = query.pageSize;
  const maxPage = Math.max(1, Math.ceil(total / pageSize) || 1);
  const page = Math.min(query.page, maxPage);
  const start = (page - 1) * pageSize;
  return {
    items: matched.slice(start, start + pageSize),
    total,
    filters: buildAvailableFilters(products, query),
  };
}

@Injectable()
export class CatalogMockService extends CatalogRepository {
  override search(query: CatalogQuery): Observable<CatalogSearchResult> {
    return of(searchCatalog(MOCK_CATALOG_PRODUCTS, query));
  }
}
