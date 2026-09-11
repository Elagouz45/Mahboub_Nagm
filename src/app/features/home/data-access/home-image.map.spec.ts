import { MOCK_CATALOG_PRODUCTS } from '@features/catalog/data-access/catalog-mock.service';
import { SITE_IMAGE_ASSETS, SITE_IMAGE_FALLBACK } from '@core/config/site-image-assets.config';
import { MOCK_CATEGORIES, MOCK_BEST_SELLERS, MOCK_OFFERS } from './home.mock';
import {
  localCategoryImage,
  localProductImage,
  resolveCategoryDisplayImage,
  resolveProductDisplayImage,
} from './home-image.map';

describe('home image mapping', () => {
  it('maps each homepage category slug to the matching pack image', () => {
    expect(localCategoryImage('fridges')).toBe(SITE_IMAGE_ASSETS.categories.refrigerators);
    expect(localCategoryImage('washers')).toBe(SITE_IMAGE_ASSETS.categories.washingMachines);
    expect(localCategoryImage('tvs')).toBe(SITE_IMAGE_ASSETS.categories.televisions);
    expect(localCategoryImage('acs')).toBe(SITE_IMAGE_ASSETS.categories.airConditioners);
    expect(localCategoryImage('kitchen')).toBe(SITE_IMAGE_ASSETS.categories.cookers);
    expect(localCategoryImage('ovens')).toBe(SITE_IMAGE_ASSETS.categories.ovens);
    expect(localCategoryImage('water-heaters')).toBe(SITE_IMAGE_ASSETS.categories.waterHeaters);
    expect(localCategoryImage('fans')).toBe(SITE_IMAGE_ASSETS.categories.fans);
    expect(localCategoryImage('small')).toBe(SITE_IMAGE_ASSETS.categories.smallAppliances);
    expect(localCategoryImage('vacuum-cleaners')).toBe(SITE_IMAGE_ASSETS.categories.vacuumCleaners);
  });

  it('maps demo product slugs instead of array indexes', () => {
    expect(localProductImage('lg-fridge-635')).toBe(
      SITE_IMAGE_ASSETS.products.refrigeratorFrenchDoorSilver,
    );
    expect(localProductImage('samsung-washer-8kg')).toBe(
      SITE_IMAGE_ASSETS.products.washingMachineFrontLoadSilver,
    );
    expect(localProductImage('unknown-product')).toBe(SITE_IMAGE_FALLBACK);
  });

  it('lets a backend image override the local product fallback', () => {
    const product = MOCK_OFFERS.find((item) => item.slug === 'tcl-tv-55');
    expect(product).toBeDefined();

    const resolved = resolveProductDisplayImage({
      slug: product!.slug,
      imageSrc: 'https://api.example.com/media/tv.webp',
      imageAlt: product!.imageAlt,
    });

    expect(resolved.src).toBe('https://api.example.com/media/tv.webp');
    expect(resolved.width).toBe(SITE_IMAGE_ASSETS.products.smartTv55Inch.width);
  });

  it('wires mock categories and products to registry paths', () => {
    expect(MOCK_CATEGORIES).toHaveLength(10);
    for (const category of MOCK_CATEGORIES) {
      expect(category.imageSrc).toBe(localCategoryImage(category.slug).src);
      expect(resolveCategoryDisplayImage(category).src).toBe(category.imageSrc);
    }

    for (const item of [...MOCK_OFFERS, ...MOCK_BEST_SELLERS]) {
      expect(item).toEqual(MOCK_CATALOG_PRODUCTS.find((product) => product.sku === item.sku));
    }
  });
});
