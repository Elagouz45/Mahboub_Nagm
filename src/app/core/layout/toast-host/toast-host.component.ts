import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  imports: [RouterLink],
  templateUrl: './toast-host.component.html',
  styleUrl: './toast-host.component.scss',
})
export class ToastHostComponent {
  readonly toast = inject(ToastService);
}
