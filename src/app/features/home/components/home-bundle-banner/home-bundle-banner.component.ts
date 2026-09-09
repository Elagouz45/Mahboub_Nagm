import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';

@Component({
  selector: 'app-home-bundle-banner',
  imports: [RouterLink, SiteImageComponent],
  templateUrl: './home-bundle-banner.component.html',
  styleUrl: './home-bundle-banner.component.scss',
})
export class HomeBundleBannerComponent {
  readonly bundleImage = SITE_IMAGE_ASSETS.banners.homeBundleShowcase;
}
