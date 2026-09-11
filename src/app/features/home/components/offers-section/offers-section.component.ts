import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeOffersPayload } from '@features/home/data-access/home-data.service';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { SectionState } from '@shared/models/storefront.model';

/** Temporary default: 12h 34m 58s from now when `endsAt` is missing. Replace when the API provides it. */
const DEFAULT_OFFER_DURATION_MS = ((12 * 60 + 34) * 60 + 58) * 1000;

@Component({
  selector: 'app-offers-section',
  imports: [RouterLink, IconComponent, ProductCardComponent, EmptyStateComponent, ErrorStateComponent],
  templateUrl: './offers-section.component.html',
  styleUrl: './offers-section.component.scss',
})
export class OffersSectionComponent {
  readonly state = input.required<SectionState<HomeOffersPayload>>();
  readonly retry = output<void>();
  private readonly now = signal(Date.now());
  private readonly fallbackEnd = Date.now() + DEFAULT_OFFER_DURATION_MS;

  readonly remaining = computed(() => {
    const end = this.offerEndMs();
    const diff = Math.max(0, end - this.now());
    const totalSeconds = Math.floor(diff / 1000);
    return {
      hours: String(Math.floor(totalSeconds / 3600)).padStart(2, '0'),
      minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
      seconds: String(totalSeconds % 60).padStart(2, '0'),
      expired: totalSeconds === 0,
    };
  });

  readonly showTimer = computed(() => this.state().status === 'success');

  readonly timerLabel = computed(() => {
    const time = this.remaining();
    if (time.expired) {
      return 'انتهى العرض';
    }

    return `ينتهي العرض خلال ${time.hours} ساعة و ${time.minutes} دقيقة و ${time.seconds} ثانية`;
  });

  constructor() {
    const platformId = inject(PLATFORM_ID);
    if (!isPlatformBrowser(platformId)) {
      return;
    }

    const id = globalThis.setInterval(() => this.now.set(Date.now()), 1000);
    inject(DestroyRef).onDestroy(() => globalThis.clearInterval(id));
  }

  private offerEndMs(): number {
    const raw = this.state().data.endsAt;
    if (raw instanceof Date && !Number.isNaN(raw.getTime()) && raw.getTime() > 0) {
      return raw.getTime();
    }

    return this.fallbackEnd;
  }
}
