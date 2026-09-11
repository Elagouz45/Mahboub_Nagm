import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@shared/components/icon/icon.component';
import { brandAccentColor } from '../../data-access/brands-accent.util';
import { formatBrandProductCount } from '../../data-access/brands-copy.util';
import { BrandListing } from '../../models/brands.model';

@Component({
  selector: 'app-brand-card',
  imports: [RouterLink, IconComponent],
  templateUrl: './brand-card.component.html',
  styleUrl: './brand-card.component.scss',
})
export class BrandCardComponent {
  readonly brand = input<BrandListing | null>(null);
  readonly skeleton = input(false);
  readonly imageFailed = signal(false);

  readonly accent = computed(() => {
    const brand = this.brand();
    return brand ? brandAccentColor(brand.slug) : '#c4bfb6';
  });
  readonly productLabel = computed(() => formatBrandProductCount(this.brand()?.productCount ?? 0));
  readonly monogram = computed(() => this.brand()?.name.trim().charAt(0).toUpperCase() || '#');
  readonly showLogo = computed(() => Boolean(this.brand()?.imageSrc) && !this.imageFailed());

  onImageError(): void {
    this.imageFailed.set(true);
  }
}
