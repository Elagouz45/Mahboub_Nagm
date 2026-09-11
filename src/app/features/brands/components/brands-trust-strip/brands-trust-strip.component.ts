import { Component } from '@angular/core';
import { AppIconName, IconComponent } from '@shared/components/icon/icon.component';

interface TrustItem {
  readonly title: string;
  readonly detail: string;
  readonly icon: AppIconName;
}

@Component({
  selector: 'app-brands-trust-strip',
  imports: [IconComponent],
  templateUrl: './brands-trust-strip.component.html',
  styleUrl: './brands-trust-strip.component.scss',
})
export class BrandsTrustStripComponent {
  readonly items: readonly TrustItem[] = [
    { title: 'منتجات أصلية', detail: 'من الوكلاء المعتمدين', icon: 'badge-check' },
    { title: 'ضمان موثوق', detail: 'دعم حقيقي بعد البيع', icon: 'wrench' },
    { title: 'توصيل آمن', detail: 'لكل المحافظات', icon: 'truck-fast' },
  ];
}
