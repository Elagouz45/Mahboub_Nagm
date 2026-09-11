import { EGYPT_GOVERNORATES } from '@core/data/egypt-governorates';

export const DEMO_COMMERCE_KEY = 'mahbub-najm.commerce.v1';
export const MAX_CART_QUANTITY = 10;
export const DEMO_SHIPPING = Object.fromEntries(EGYPT_GOVERNORATES.map((g) => [g.slug, 100]));
