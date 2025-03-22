import { Component, Input } from '@angular/core';
import { Box, Room } from '../../app';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-trail',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './trail.component.html',
  styleUrl: './trail.component.css',
})
export class TrailComponent {
  @Input() trail: (Room | Box)[] = [];
}
