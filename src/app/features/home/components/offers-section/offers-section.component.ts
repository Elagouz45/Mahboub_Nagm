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
import { HomeOffersPayload } from '@features/home/data-access/home-data.service';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';
import { SectionState } from '@shared/models/storefront.model';

@Component({
  selector: 'app-offers-section',
  imports: [
    IconComponent,
    ProductCardComponent,
    SectionHeaderComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './offers-section.component.html',
  styleUrl: './offers-section.component.scss',
})
export class OffersSectionComponent {
  readonly state = input.required<SectionState<HomeOffersPayload>>();
  readonly retry = output<void>();
  private readonly now = signal(Date.now());

  readonly remaining = computed(() => {
    const end = this.state().data.endsAt.getTime();
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
}
