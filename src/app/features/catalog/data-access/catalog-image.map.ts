import { SITE_IMAGE_ASSETS, SITE_IMAGE_FALLBACK, SiteImageAsset } from '@core/config/site-image-assets.config';
import { resolveSiteImage } from '@core/utils/site-image.util';
import { ProductSummary } from '@shared/models/storefront.model';

export const CATALOG_PRODUCT_IMAGE_BY_SLUG: Readonly<Record<string, SiteImageAsset>> = {
  'lg-fridge-635': SITE_IMAGE_ASSETS.products.refrigeratorFrenchDoorSilver,
  'samsung-fridge-sbs': SITE_IMAGE_ASSETS.products.refrigeratorSideBySideBlack,
  'fresh-fridge-white': SITE_IMAGE_ASSETS.products.refrigeratorTopFreezerWhite,
  'toshiba-fridge-french': SITE_IMAGE_ASSETS.products.refrigeratorFrenchDoorSilver,
  'samsung-washer-8kg': SITE_IMAGE_ASSETS.products.washingMachineFrontLoadSilver,
  'samsung-washer-10': SITE_IMAGE_ASSETS.products.washingMachineFrontLoadSilver,
  'lg-washer-top': SITE_IMAGE_ASSETS.products.washingMachineTopLoadWhite,
  'toshiba-washer-dryer': SITE_IMAGE_ASSETS.products.washerDryerGraphite,
  'fresh-washer-7': SITE_IMAGE_ASSETS.products.washingMachineTopLoadWhite,
  'tcl-tv-55': SITE_IMAGE_ASSETS.products.smartTv55Inch,
  'samsung-tv-65': SITE_IMAGE_ASSETS.products.smartTv65Inch,
  'lg-tv-43': SITE_IMAGE_ASSETS.products.smartTv43Inch,
  'tornado-tv-55': SITE_IMAGE_ASSETS.products.smartTv55Inch,
  'carrier-ac-1-5': SITE_IMAGE_ASSETS.products.airConditionerInverterSilver,
  'lg-ac-inverter': SITE_IMAGE_ASSETS.products.airConditionerInverterSilver,
  'fresh-ac-split': SITE_IMAGE_ASSETS.products.airConditionerSplitWhite,
  'carrier-ac-premium': SITE_IMAGE_ASSETS.products.airConditionerPremiumBlack,
  'sharp-ac-1': SITE_IMAGE_ASSETS.products.airConditionerSplitWhite,
  'fresh-cooker': SITE_IMAGE_ASSETS.products.gasCookerStainlessSteel,
  'fresh-cooker-glass': SITE_IMAGE_ASSETS.products.gasCookerBlackGlass,
  'sharp-hob': SITE_IMAGE_ASSETS.products.builtInGasHob,
  'sharp-oven-builtin': SITE_IMAGE_ASSETS.products.builtInElectricOven,
  'sharp-microwave': SITE_IMAGE_ASSETS.products.microwaveBlack,
  'fresh-microwave': SITE_IMAGE_ASSETS.products.microwaveBlack,
  'fresh-water-heater': SITE_IMAGE_ASSETS.products.electricWaterHeater,
  'fresh-heater-80': SITE_IMAGE_ASSETS.products.electricWaterHeater,
  'tornado-fan': SITE_IMAGE_ASSETS.products.pedestalFan,
  'fresh-fan': SITE_IMAGE_ASSETS.products.pedestalFan,
  'philips-air-fryer': SITE_IMAGE_ASSETS.products.airFryerBlack,
  'toshiba-blender': SITE_IMAGE_ASSETS.products.countertopBlender,
  'philips-coffee': SITE_IMAGE_ASSETS.products.coffeeMaker,
  'philips-processor': SITE_IMAGE_ASSETS.products.foodProcessor,
  'tornado-vacuum': SITE_IMAGE_ASSETS.products.cordlessVacuumCleaner,
  'philips-vacuum': SITE_IMAGE_ASSETS.products.cordlessVacuumCleaner,
};

export const CATALOG_CATEGORY_IMAGE_BY_SLUG: Readonly<Record<string, SiteImageAsset>> = {
  fridges: SITE_IMAGE_ASSETS.categories.refrigerators,
  washers: SITE_IMAGE_ASSETS.categories.washingMachines,
  tvs: SITE_IMAGE_ASSETS.categories.televisions,
  acs: SITE_IMAGE_ASSETS.categories.airConditioners,
  kitchen: SITE_IMAGE_ASSETS.categories.cookers,
  ovens: SITE_IMAGE_ASSETS.categories.ovens,
  'water-heaters': SITE_IMAGE_ASSETS.categories.waterHeaters,
  fans: SITE_IMAGE_ASSETS.categories.fans,
  small: SITE_IMAGE_ASSETS.categories.smallAppliances,
  'vacuum-cleaners': SITE_IMAGE_ASSETS.categories.vacuumCleaners,
};

export function catalogProductImage(slug: string, categorySlug?: string): SiteImageAsset {
  const bySlug = CATALOG_PRODUCT_IMAGE_BY_SLUG[slug];
  if (bySlug) {
    return bySlug;
  }

  if (categorySlug) {
    return CATALOG_CATEGORY_IMAGE_BY_SLUG[categorySlug] ?? SITE_IMAGE_FALLBACK;
  }

  return SITE_IMAGE_FALLBACK;
}

export function resolveCatalogProductImage(
  product: Pick<ProductSummary, 'slug' | 'imageSrc' | 'imageAlt' | 'categorySlug'>,
): SiteImageAsset {
  return resolveSiteImage({
    remoteSrc: product.imageSrc,
    localAsset: catalogProductImage(product.slug, product.categorySlug),
    alt: product.imageAlt,
  });
}
