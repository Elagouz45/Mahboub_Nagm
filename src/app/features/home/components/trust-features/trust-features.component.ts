import { Component } from '@angular/core';
import { AppIconName, IconComponent } from '@shared/components/icon/icon.component';

interface TrustFeature {
  readonly title: string;
  readonly text: string;
  readonly icon: AppIconName;
}

@Component({
  selector: 'app-trust-features',
  imports: [IconComponent],
  templateUrl: './trust-features.component.html',
  styleUrl: './trust-features.component.scss',
})
export class TrustFeaturesComponent {
  readonly items: readonly TrustFeature[] = [
    {
      title: 'منتجات أصلية',
      text: 'أجهزة أصلية من الماركات المعتمدة',
      icon: 'shield',
    },
    {
      title: 'ضمان معتمد',
      text: 'ضمان رسمي وخدمة ما بعد البيع',
      icon: 'certificate',
    },
    {
      title: 'توصيل سريع',
      text: 'شحن منظم لكل المحافظات',
      icon: 'truck-fast',
    },
    {
      title: 'دعم واتساب',
      text: 'نساعدك تختاري الجهاز الأنسب',
      icon: 'headset-whatsapp',
    },
  ];
}
