import {
  SITE_IMAGE_ASSETS,
  SITE_IMAGE_FALLBACK,
  SiteImageAsset,
} from '@core/config/site-image-assets.config';
import { resolveSiteImage } from '@core/utils/site-image.util';
import { Category, ProductSummary } from '@shared/models/storefront.model';

export const CATEGORY_IMAGE_BY_SLUG: Readonly<Record<string, SiteImageAsset>> = {
  fridges: SITE_IMAGE_ASSETS.categories.refrigerators,
  washers: SITE_IMAGE_ASSETS.categories.washingMachines,
  tvs: SITE_IMAGE_ASSETS.categories.televisions,
  acs: SITE_IMAGE_ASSETS.categories.airConditioners,
  kitchen: SITE_IMAGE_ASSETS.categories.cookers,
  cookers: SITE_IMAGE_ASSETS.categories.cookers,
  ovens: SITE_IMAGE_ASSETS.categories.ovens,
  'water-heaters': SITE_IMAGE_ASSETS.categories.waterHeaters,
  fans: SITE_IMAGE_ASSETS.categories.fans,
  small: SITE_IMAGE_ASSETS.categories.smallAppliances,
  'vacuum-cleaners': SITE_IMAGE_ASSETS.categories.vacuumCleaners,
};

export const PRODUCT_IMAGE_BY_SLUG: Readonly<Record<string, SiteImageAsset>> = {
  'lg-fridge-635': SITE_IMAGE_ASSETS.products.refrigeratorFrenchDoorSilver,
  'samsung-washer-8kg': SITE_IMAGE_ASSETS.products.washingMachineFrontLoadSilver,
  'tcl-tv-55': SITE_IMAGE_ASSETS.products.smartTv55Inch,
  'carrier-ac-1-5': SITE_IMAGE_ASSETS.products.airConditionerInverterSilver,
  'fresh-water-heater': SITE_IMAGE_ASSETS.products.electricWaterHeater,
  'toshiba-blender': SITE_IMAGE_ASSETS.products.countertopBlender,
  'fresh-cooker': SITE_IMAGE_ASSETS.products.gasCookerStainlessSteel,
  'tornado-vacuum': SITE_IMAGE_ASSETS.products.cordlessVacuumCleaner,
  'philips-air-fryer': SITE_IMAGE_ASSETS.products.airFryerBlack,
  'sharp-microwave': SITE_IMAGE_ASSETS.products.microwaveBlack,
};

export function localCategoryImage(slug: string): SiteImageAsset {
  return CATEGORY_IMAGE_BY_SLUG[slug] ?? SITE_IMAGE_ASSETS.categories.smallAppliances;
}

export function localProductImage(slug: string): SiteImageAsset {
  return PRODUCT_IMAGE_BY_SLUG[slug] ?? SITE_IMAGE_FALLBACK;
}

export function resolveCategoryDisplayImage(
  category: Pick<Category, 'slug' | 'imageSrc' | 'imageAlt'>,
): SiteImageAsset {
  return resolveSiteImage({
    remoteSrc: category.imageSrc,
    localAsset: localCategoryImage(category.slug),
    alt: category.imageAlt,
  });
}

export function resolveProductDisplayImage(
  product: Pick<ProductSummary, 'slug' | 'imageSrc' | 'imageAlt'>,
): SiteImageAsset {
  return resolveSiteImage({
    remoteSrc: product.imageSrc,
    localAsset: localProductImage(product.slug),
    alt: product.imageAlt,
  });
}
