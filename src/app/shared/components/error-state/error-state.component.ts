import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss',
})
export class ErrorStateComponent {
  readonly title = input('تعذر إكمال الطلب');
  readonly message = input.required<string>();
  readonly retryLabel = input('إعادة المحاولة');
  readonly retryable = input(true);
  readonly retry = output<void>();
}
