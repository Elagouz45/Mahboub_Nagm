import { Component, input, output } from '@angular/core';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import { ShopBreadcrumbComponent } from '../shop-breadcrumb/shop-breadcrumb.component';

@Component({
  selector: 'app-shop-banner',
  imports: [SiteImageComponent, ShopBreadcrumbComponent],
  templateUrl: './shop-banner.component.html',
  styleUrl: './shop-banner.component.scss',
})
export class ShopBannerComponent {
  readonly categorySlug = input('');
  readonly explore = output<void>();
  readonly banner = SITE_IMAGE_ASSETS.banners.shop;
  readonly imageSizes = '100vw';
}
