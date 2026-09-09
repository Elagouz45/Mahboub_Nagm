import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { BrandLogoComponent } from '@shared/components/brand-logo/brand-logo.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
import { PageTrustStripComponent } from '@shared/components/page-trust-strip/page-trust-strip.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import {
  ABOUT_CTA,
  ABOUT_JOURNEY,
  ABOUT_STATS,
  ABOUT_STORY,
  ABOUT_TIMELINE,
  ABOUT_TRUST,
  ABOUT_VALUES,
} from '../../about.content';

@Component({
  selector: 'app-about-page',
  imports: [
    RouterLink,
    BrandLogoComponent,
    IconComponent,
    SiteImageComponent,
    PageBreadcrumbComponent,
    PageTrustStripComponent,
  ],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
})
export class AboutPageComponent {
  readonly hero = SITE_IMAGE_ASSETS.about.hero;
  readonly serviceImage = SITE_IMAGE_ASSETS.about.service;
  readonly ctaImage = SITE_IMAGE_ASSETS.about.cta;
  readonly story = ABOUT_STORY;
  readonly values = ABOUT_VALUES;
  readonly journey = ABOUT_JOURNEY;
  readonly stats = ABOUT_STATS;
  readonly timeline = ABOUT_TIMELINE;
  readonly trust = ABOUT_TRUST;
  readonly cta = ABOUT_CTA;
  readonly breadcrumb = [
    { label: 'الرئيسية', path: '/' },
    { label: 'من نحن' },
  ];
  readonly trustItems = [
    { label: 'ضمان معتمد', icon: 'shield' as const },
    { label: 'منتجات أصلية', icon: 'badge-check' as const },
    { label: 'صيانة موثوقة', icon: 'headset' as const },
  ];
}
