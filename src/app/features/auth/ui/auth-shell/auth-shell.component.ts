import { Component, input } from '@angular/core';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';

@Component({
  selector: 'app-auth-shell',
  imports: [SiteImageComponent],
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.scss',
})
export class AuthShellComponent {
  readonly title = input.required<string>();
  readonly image = SITE_IMAGE_ASSETS.about.cta;
}
