import { Component } from '@angular/core';
import { TRUST_ANNOUNCEMENTS } from '@core/constants/app.constants';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-announcement-bar',
  imports: [IconComponent],
  templateUrl: './announcement-bar.component.html',
  styleUrl: './announcement-bar.component.scss',
})
export class AnnouncementBarComponent {
  readonly items = TRUST_ANNOUNCEMENTS;
}
