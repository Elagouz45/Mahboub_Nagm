import { Component, input } from '@angular/core';

@Component({
  selector: 'app-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrl: './filter-group.component.scss',
})
export class FilterGroupComponent {
  readonly legend = input.required<string>();
}
