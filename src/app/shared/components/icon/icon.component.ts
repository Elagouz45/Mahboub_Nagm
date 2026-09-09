import { Component, input } from '@angular/core';

export type AppIconName =
  | 'search'
  | 'cart'
  | 'heart'
  | 'user'
  | 'menu'
  | 'close'
  | 'star'
  | 'star-outline'
  | 'whatsapp'
  | 'bag'
  | 'shield'
  | 'truck'
  | 'badge-check'
  | 'headset'
  | 'bolt'
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
  | 'message';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  readonly name = input.required<AppIconName>();
  readonly label = input<string | undefined>(undefined);
}
