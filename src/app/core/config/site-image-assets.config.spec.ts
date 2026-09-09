import {
  SITE_IMAGE_ASSETS,
  SITE_IMAGE_FALLBACK,
  countSiteImageAssets,
} from './site-image-assets.config';

const ASSET_PATH =
  /^\/assets\/images\/mahboub-nagm\/(banners|categories|products|lifestyle|services|brand)\/[a-z0-9-]+\.(webp|png|jpg)$/;
const WEBP_PATH =
  /^\/assets\/images\/mahboub-nagm\/(banners|categories|products|lifestyle|services)\/[a-z0-9-]+\.webp$/;

function flattenAssets() {
  return Object.values(SITE_IMAGE_ASSETS).flatMap((group) => Object.values(group));
}

describe('SITE_IMAGE_ASSETS', () => {
  it('registers the website image set including page heroes', () => {
    expect(countSiteImageAssets()).toBe(62);
    expect(flattenAssets()).toHaveLength(62);
    expect(SITE_IMAGE_ASSETS.brand.logo.src).toContain('brand/store-logo.jpg');
    expect(SITE_IMAGE_ASSETS.brand.logo.width).toBe(SITE_IMAGE_ASSETS.brand.logo.height);
    expect(SITE_IMAGE_ASSETS.brands.hero.src).toContain('home-bundle-showcase.webp');
    expect(SITE_IMAGE_ASSETS.offers.hero.src).toContain('hero-appliance-collection.webp');
    expect(SITE_IMAGE_ASSETS.about.hero.src).toContain('appliance-shopping-family.webp');
    expect(SITE_IMAGE_ASSETS.contact.hero.src).toContain('whatsapp-support.webp');
    expect(SITE_IMAGE_ASSETS.afterSales.hero.src).toContain('organized-laundry-room.webp');
    expect(SITE_IMAGE_ASSETS.serviceCenters.cta.src).toContain('authorized-warranty.webp');
    expect(SITE_IMAGE_ASSETS.returnPolicy.hero.src).toContain('fast-delivery.webp');
  });

  it('keeps kebab-case asset URLs with explicit dimensions and Arabic alt text', () => {
    for (const asset of flattenAssets()) {
      expect(asset.src).toMatch(ASSET_PATH);
      if (asset.src.endsWith('/banners/shop-banner.png')) {
        expect(asset).toEqual(SITE_IMAGE_ASSETS.banners.shop);
      } else if (asset.src.endsWith('/brand/store-logo.jpg')) {
        expect(asset).toEqual(SITE_IMAGE_ASSETS.brand.logo);
      } else {
        expect(asset.src).toMatch(WEBP_PATH);
      }
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
      expect(asset.alt.trim().length).toBeGreaterThan(0);
      expect(asset.alt).not.toMatch(/image|filename|\.webp|\.png/i);
    }
  });

  it('configures the main hero from the appliance collection banner', () => {
    expect(SITE_IMAGE_ASSETS.banners.mainHero).toEqual({
      src: '/assets/images/mahboub-nagm/banners/hero-appliance-collection.webp',
      width: 1600,
      height: 900,
      alt: 'مجموعة متكاملة من الأجهزة الكهربائية الحديثة',
    });
  });

  it('registers the shop banner asset', () => {
    expect(SITE_IMAGE_ASSETS.banners.shop).toEqual({
      src: '/assets/images/mahboub-nagm/banners/shop-banner.png',
      width: 1024,
      height: 384,
      alt: 'أجهزة كهربائية منزلية من ثلاجات وغسالات وتليفزيونات',
    });
  });

  it('uses a local product image as the generic fallback', () => {
    expect(SITE_IMAGE_FALLBACK.src).toBe(
      SITE_IMAGE_ASSETS.products.refrigeratorTopFreezerWhite.src,
    );
  });
});
