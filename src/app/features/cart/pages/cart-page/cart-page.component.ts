import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MAX_CART_QUANTITY } from '@core/config/demo-commerce.config';
import { FOOTER_TRUST_POINTS } from '@core/constants/app.constants';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import { formatEgp } from '@shared/utils/format-price.util';
import { CartStore } from '../../state/cart.store';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, SiteImageComponent, IconComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  readonly cart = inject(CartStore);
  readonly price = formatEgp;
  readonly maxQuantity = MAX_CART_QUANTITY;
  readonly trustPoints = FOOTER_TRUST_POINTS;
}
