import { Component, inject } from '@angular/core';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { WHATSAPP_HELP_MESSAGE, buildWhatsAppUrl } from '@core/utils/whatsapp.util';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';

@Component({
  selector: 'app-whatsapp-banner',
  imports: [IconComponent, SiteImageComponent],
  templateUrl: './whatsapp-banner.component.html',
  styleUrl: './whatsapp-banner.component.scss',
})
export class WhatsappBannerComponent {
  readonly whatsappUrl = buildWhatsAppUrl(inject(WHATSAPP_NUMBER), WHATSAPP_HELP_MESSAGE);
  readonly supportImage = SITE_IMAGE_ASSETS.services.whatsappSupport;
}
