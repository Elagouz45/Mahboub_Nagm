import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  APP_NAME_SHORT,
  APP_SLOGAN,
  FOOTER_LEGAL_LINKS,
  FOOTER_QUICK_LINKS,
  FOOTER_SERVICE_LINKS,
  FOOTER_TRUST_POINTS,
  NavLink,
} from '@core/constants/app.constants';
import { SITE_CONTACT, SITE_CONTACT_CONFIG } from '@core/config/site-contact.config';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { WHATSAPP_HELP_MESSAGE, buildWhatsAppUrl } from '@core/utils/whatsapp.util';
import { BrandLogoComponent } from '@shared/components/brand-logo/brand-logo.component';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, BrandLogoComponent, IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly whatsappNumber = inject(WHATSAPP_NUMBER, { optional: true }) ?? '';
  private readonly contact = inject(SITE_CONTACT_CONFIG, { optional: true }) ?? SITE_CONTACT;

  readonly shortName = APP_NAME_SHORT;
  readonly slogan = APP_SLOGAN;
  readonly identityCopy =
    'متجر متخصص في الأجهزة الكهربائية الأصلية مع ضمان معتمد وتوصيل سريع لجميع المحافظات.';
  readonly year = new Date().getFullYear();
  readonly quickLinks = FOOTER_QUICK_LINKS;
  readonly serviceLinks = FOOTER_SERVICE_LINKS;
  readonly legalLinks = FOOTER_LEGAL_LINKS;
  readonly trustPoints = FOOTER_TRUST_POINTS;
  readonly navColumns: readonly { id: string; label: string; links: readonly NavLink[] }[] = [
    { id: 'footer-quick-links', label: 'روابط سريعة', links: this.quickLinks },
    { id: 'footer-service-links', label: 'خدمة العملاء', links: this.serviceLinks },
  ];
  readonly compactFooter = signal(false);
  readonly navOpen = signal<Record<string, boolean>>({
    'footer-quick-links': false,
    'footer-service-links': false,
  });
  readonly whatsappUrl = computed(() =>
    buildWhatsAppUrl(this.whatsappNumber, WHATSAPP_HELP_MESSAGE),
  );
  readonly socialLinks = computed(() =>
    this.contact.social.filter((item) => item.url.trim().length > 0),
  );

  constructor() {
    const platformId = inject(PLATFORM_ID);
    const view = inject(DOCUMENT).defaultView;
    if (!isPlatformBrowser(platformId) || !view || typeof view.matchMedia !== 'function') {
      return;
    }

    const media = view.matchMedia('(max-width: 767px)');
    this.compactFooter.set(media.matches);
    const onChange = () => {
      this.compactFooter.set(media.matches);
      if (!media.matches) {
        this.navOpen.set({
          'footer-quick-links': false,
          'footer-service-links': false,
        });
      }
    };
    media.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => media.removeEventListener('change', onChange));
  }

  isNavOpen(id: string): boolean {
    return !this.compactFooter() || Boolean(this.navOpen()[id]);
  }

  toggleNav(id: string): void {
    this.navOpen.update((open) => ({ ...open, [id]: !open[id] }));
  }
}
