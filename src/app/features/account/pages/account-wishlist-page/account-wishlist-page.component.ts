import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-account-wishlist-page',
  imports: [EmptyStateComponent, ProductCardComponent],
  templateUrl: './account-wishlist-page.component.html',
  styleUrl: './account-wishlist-page.component.scss',
})
export class AccountWishlistPageComponent {
  readonly wishlist = inject(WISHLIST_PORT);
  private readonly router = inject(Router);

  goShop(): void {
    void this.router.navigate(['/products']);
  }
}
