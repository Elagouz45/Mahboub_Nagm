import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { IconComponent } from '@shared/components/icon/icon.component';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import {
  ABOUT_CTA,
  ABOUT_JOURNEY,
  ABOUT_STATS,
  ABOUT_STORY,
  ABOUT_TIMELINE,
  ABOUT_VALUES,
  ABOUT_WHY,
} from '../../about.content';

@Component({
  selector: 'app-about-page',
  imports: [RouterLink, IconComponent, SiteImageComponent, PageBreadcrumbComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
})
export class AboutPageComponent {
  readonly hero = SITE_IMAGE_ASSETS.about.hero;
  readonly story = ABOUT_STORY;
  readonly stats = ABOUT_STATS;
  readonly timeline = ABOUT_TIMELINE;
  readonly values = ABOUT_VALUES;
  readonly why = ABOUT_WHY;
  readonly journey = ABOUT_JOURNEY;
  readonly cta = ABOUT_CTA;
  readonly breadcrumb = [
    { label: 'الرئيسية', path: '/' },
    { label: 'من نحن' },
  ];
}
