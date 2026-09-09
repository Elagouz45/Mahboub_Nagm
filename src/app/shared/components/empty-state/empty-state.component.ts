import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly actionLabel = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly action = output<void>();
}
