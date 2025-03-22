import { Component, Input } from '@angular/core';
import { Box, Room } from '../../app';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { MatChipsModule } from '@angular/material/chips';
import iconConfig from '../../icon.config';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-trail',
  standalone: true,
  imports: [AppIconComponent, MatChipsModule, RouterModule],
  templateUrl: './trail.component.html',
  styleUrl: './trail.component.css',
})
export class TrailComponent {
  @Input() trail: (Room | Box)[] = [];
  icon = iconConfig;
}
