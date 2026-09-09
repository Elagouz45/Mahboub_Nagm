import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CART_PORT } from '@core/tokens/commerce.tokens';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { PriceDisplayComponent } from '@shared/components/price-display/price-display.component';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, EmptyStateComponent, PriceDisplayComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  readonly cart = inject(CART_PORT);
  private readonly router = inject(Router);

  goShop(): void {
    void this.router.navigate(['/products']);
  }
}
