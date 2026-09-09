import { Component, inject } from '@angular/core';
import { BestSellersSectionComponent } from '@features/home/components/best-sellers-section/best-sellers-section.component';
import { CategoryGridComponent } from '@features/home/components/category-grid/category-grid.component';
import { HeroBannerComponent } from '@features/home/components/hero-banner/hero-banner.component';
import { HomeBundleBannerComponent } from '@features/home/components/home-bundle-banner/home-bundle-banner.component';
import { OffersSectionComponent } from '@features/home/components/offers-section/offers-section.component';
import { TrustFeaturesComponent } from '@features/home/components/trust-features/trust-features.component';
import { WhatsappBannerComponent } from '@features/home/components/whatsapp-banner/whatsapp-banner.component';
import { HomeStore } from '@features/home/state/home.store';

@Component({
  selector: 'app-home-page',
  imports: [
    HeroBannerComponent,
    CategoryGridComponent,
    OffersSectionComponent,
    BestSellersSectionComponent,
    HomeBundleBannerComponent,
    TrustFeaturesComponent,
    WhatsappBannerComponent,
  ],
  providers: [HomeStore],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  readonly store = inject(HomeStore);
}
