import { Component } from '@angular/core';
import { AppIconName, IconComponent } from '@shared/components/icon/icon.component';

interface IntroChip {
  readonly label: string;
  readonly icon: AppIconName;
}

@Component({
  selector: 'app-brands-page-header',
  imports: [IconComponent],
  templateUrl: './brands-page-header.component.html',
  styleUrl: './brands-page-header.component.scss',
})
export class BrandsPageHeaderComponent {
  readonly chips: readonly IntroChip[] = [
    { label: 'أجهزة منزلية', icon: 'appliance' },
    { label: 'شاشات وتلفزيونات', icon: 'tv' },
    { label: 'تكييف وتبريد', icon: 'snowflake' },
  ];
}
