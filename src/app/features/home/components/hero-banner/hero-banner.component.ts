import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { WHATSAPP_HELP_MESSAGE, buildWhatsAppUrl } from '@core/utils/whatsapp.util';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';

@Component({
  selector: 'app-hero-banner',
  imports: [RouterLink, IconComponent, SiteImageComponent],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HeroBannerComponent {
  readonly whatsappUrl = buildWhatsAppUrl(inject(WHATSAPP_NUMBER), WHATSAPP_HELP_MESSAGE);
  readonly heroImage = SITE_IMAGE_ASSETS.banners.mainHero;
}
