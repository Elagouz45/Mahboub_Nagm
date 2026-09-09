import { Component, input, output } from '@angular/core';
import { ActiveFilterChip } from '../../models/catalog.model';

@Component({
  selector: 'app-active-filters',
  templateUrl: './active-filters.component.html',
  styleUrl: './active-filters.component.scss',
})
export class ActiveFiltersComponent {
  readonly chips = input<readonly ActiveFilterChip[]>([]);
  readonly remove = output<string>();
  readonly clear = output<void>();
}
