import { Component, input } from '@angular/core';

export type AppIconName =
  | 'search'
  | 'cart'
  | 'heart'
  | 'user'
  | 'menu'
  | 'close'
  | 'check'
  | 'star'
  | 'star-outline'
  | 'whatsapp'
  | 'bag'
  | 'shield'
  | 'truck'
  | 'truck-fast'
  | 'badge-check'
  | 'headset'
  | 'headset-whatsapp'
  | 'certificate'
  | 'bolt'
  | 'flame'
  | 'crown'
  | 'clock'
  | 'chevron-down'
  | 'chevron-next'
  | 'chevron-prev'
  | 'grid'
  | 'list'
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'phone'
  | 'mail'
  | 'send'
  | 'wrench'
  | 'package'
  | 'lock'
  | 'message'
  | 'sliders'
  | 'appliance'
  | 'tv'
  | 'snowflake'
  | 'map-pin'
  | 'external-link'
  | 'layout'
  | 'log-out'
  | 'eye'
  | 'eye-off'
  | 'home'
  | 'plus';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  readonly name = input.required<AppIconName>();
  readonly label = input<string | undefined>(undefined);
  readonly filled = input(false);
}
