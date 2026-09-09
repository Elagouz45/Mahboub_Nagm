import { Component } from '@angular/core';
import { SITE_IMAGE_ASSETS, SiteImageAsset } from '@core/config/site-image-assets.config';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';

interface TrustFeature {
  readonly title: string;
  readonly text: string;
  readonly image: SiteImageAsset;
}

@Component({
  selector: 'app-trust-features',
  imports: [SiteImageComponent],
  templateUrl: './trust-features.component.html',
  styleUrl: './trust-features.component.scss',
})
export class TrustFeaturesComponent {
  readonly items: readonly TrustFeature[] = [
    {
      title: 'منتجات أصلية',
      text: 'جميع الأجهزة أصلية 100٪ من الماركات المعتمدة.',
      image: SITE_IMAGE_ASSETS.services.originalProducts,
    },
    {
      title: 'ضمان معتمد',
      text: 'ضمان رسمي على كل منتج مع خدمة ما بعد البيع.',
      image: SITE_IMAGE_ASSETS.services.authorizedWarranty,
    },
    {
      title: 'توصيل سريع',
      text: 'شحن منظم إلى جميع المحافظات بمتابعة واضحة.',
      image: SITE_IMAGE_ASSETS.services.fastDelivery,
    },
    {
      title: 'دعم عبر واتساب',
      text: 'فريقنا يساعدك في اختيار الجهاز الأنسب لميزانيتك.',
      image: SITE_IMAGE_ASSETS.services.whatsappSupport,
    },
  ];
}
