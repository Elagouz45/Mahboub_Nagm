import { Component, input } from '@angular/core';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-page-loader',
  imports: [LoadingSpinnerComponent],
  templateUrl: './page-loader.component.html',
  styleUrl: './page-loader.component.scss',
})
export class PageLoaderComponent {
  readonly label = input('جاري تحميل الصفحة');
}
