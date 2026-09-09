import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import {
  SITE_IMAGE_FALLBACK,
  SiteImageAsset,
} from '@core/config/site-image-assets.config';
import { resolveSiteImage } from '@core/utils/site-image.util';

export type SiteImageObjectFit = 'contain' | 'cover';

@Component({
  selector: 'app-site-image',
  imports: [NgOptimizedImage],
  templateUrl: './site-image.component.html',
  styleUrl: './site-image.component.scss',
  host: {
    '[class.site-image--fill]': 'fill()',
  },
})
export class SiteImageComponent {
  readonly asset = input<SiteImageAsset | null>(null);
  readonly src = input<string | null>(null);
  readonly alt = input('');
  readonly fallback = input(SITE_IMAGE_FALLBACK);
  readonly fill = input(false);
  readonly priority = input(false);
  readonly objectFit = input<SiteImageObjectFit>('contain');
  readonly objectPosition = input('center');
  readonly sizes = input<string | undefined>(undefined);
  readonly decorative = input(false);

  private readonly hasFailed = signal(false);

  readonly displayAsset = computed(() => {
    if (this.hasFailed()) {
      return this.fallback();
    }

    return resolveSiteImage({
      remoteSrc: this.src(),
      localAsset: this.asset(),
      fallback: this.fallback(),
      alt: this.alt(),
    });
  });

  readonly displayAlt = computed(() => {
    if (this.decorative()) {
      return '';
    }

    return this.alt().trim() || this.displayAsset().alt;
  });

  onImageError(): void {
    if (this.hasFailed()) {
      return;
    }

    this.hasFailed.set(true);
  }
}
