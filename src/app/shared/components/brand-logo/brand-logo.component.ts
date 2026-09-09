import { Component, computed, input } from '@angular/core';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';

export type BrandLogoVariant = 'header' | 'footer' | 'page';

@Component({
  selector: 'app-brand-logo',
  imports: [SiteImageComponent],
  template: `
    <span class="brand-logo" [class]="'brand-logo--' + variant()" aria-hidden="true">
      <app-site-image
        [asset]="logo"
        [decorative]="true"
        [fill]="true"
        [priority]="priority()"
        objectFit="contain"
        [sizes]="sizes()"
      />
    </span>
  `,
  styleUrl: './brand-logo.component.scss',
})
export class BrandLogoComponent {
  readonly variant = input<BrandLogoVariant>('header');
  readonly priority = input(false);
  readonly logo = SITE_IMAGE_ASSETS.brand.logo;

  readonly sizes = computed(() => {
    switch (this.variant()) {
      case 'page':
        return '(max-width: 767px) 42vw, 12vw';
      case 'footer':
        return '(max-width: 767px) 20vw, 6vw';
      default:
        return '(max-width: 767px) 14vw, 5vw';
    }
  });
}
