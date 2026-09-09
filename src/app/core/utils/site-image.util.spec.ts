import { SITE_IMAGE_ASSETS, SITE_IMAGE_FALLBACK } from '@core/config/site-image-assets.config';
import { isUsableImageSrc, resolveSiteImage } from './site-image.util';

describe('resolveSiteImage', () => {
  const local = SITE_IMAGE_ASSETS.products.smartTv55Inch;

  it('prefers a valid backend URL over the local registry image', () => {
    const resolved = resolveSiteImage({
      remoteSrc: 'https://cdn.example.com/products/tv.webp',
      localAsset: local,
      alt: 'تليفزيون من الخادم',
    });

    expect(resolved.src).toBe('https://cdn.example.com/products/tv.webp');
    expect(resolved.width).toBe(local.width);
    expect(resolved.height).toBe(local.height);
    expect(resolved.alt).toBe('تليفزيون من الخادم');
  });

  it('falls back to the matching local registry image when the API value is empty', () => {
    const resolved = resolveSiteImage({
      remoteSrc: '   ',
      localAsset: local,
    });

    expect(resolved).toEqual(local);
  });

  it('uses the generic fallback when no local match exists', () => {
    const resolved = resolveSiteImage({
      remoteSrc: null,
      localAsset: null,
    });

    expect(resolved.src).toBe(SITE_IMAGE_FALLBACK.src);
  });

  it('does not mutate the input objects', () => {
    const options = {
      remoteSrc: '',
      localAsset: local,
      alt: 'نص بديل',
    };
    const snapshot = structuredClone(options);

    resolveSiteImage(options);

    expect(options).toEqual(snapshot);
  });

  it('accepts Laravel storage paths and rejects unusable values', () => {
    expect(isUsableImageSrc('/storage/products/tv.webp')).toBe(true);
    expect(isUsableImageSrc('/assets/images/mahboub-nagm/products/smart-tv-55-inch.webp')).toBe(
      true,
    );
    expect(isUsableImageSrc('null')).toBe(false);
    expect(isUsableImageSrc('javascript:alert(1)')).toBe(false);
  });
});
