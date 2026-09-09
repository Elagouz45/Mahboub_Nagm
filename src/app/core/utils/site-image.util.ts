import {
  SITE_IMAGE_FALLBACK,
  SiteImageAsset,
} from '@core/config/site-image-assets.config';

export interface SiteImageResolveOptions {
  readonly remoteSrc?: string | null;
  readonly localAsset?: SiteImageAsset | null;
  readonly fallback?: SiteImageAsset;
  readonly alt?: string | null;
}

const INVALID_SRC = new Set(['', 'null', 'undefined', 'none', '#']);

export function isUsableImageSrc(src: string | null | undefined): src is string {
  if (typeof src !== 'string') {
    return false;
  }

  const value = src.trim();
  if (INVALID_SRC.has(value.toLowerCase())) {
    return false;
  }

  return (
    value.startsWith('/assets/') ||
    value.startsWith('/storage/') ||
    value.startsWith('/uploads/') ||
    value.startsWith('https://') ||
    value.startsWith('http://')
  );
}

export function resolveSiteImage(options: SiteImageResolveOptions): SiteImageAsset {
  const fallback = options.fallback ?? SITE_IMAGE_FALLBACK;
  const local = options.localAsset ?? fallback;
  const alt = options.alt?.trim() || local.alt;

  if (isUsableImageSrc(options.remoteSrc)) {
    const src = options.remoteSrc.trim();
    if (src === local.src) {
      return { ...local, alt };
    }

    return {
      src,
      width: local.width,
      height: local.height,
      alt,
    };
  }

  return { ...local, alt };
}
