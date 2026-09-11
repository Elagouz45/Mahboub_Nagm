import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-brand-alphabet-filter',
  templateUrl: './brand-alphabet-filter.component.html',
  styleUrl: './brand-alphabet-filter.component.scss',
})
export class BrandAlphabetFilterComponent {
  readonly letters = input<readonly string[]>([]);
  readonly selected = input('');
  readonly letterChange = output<string>();
}
