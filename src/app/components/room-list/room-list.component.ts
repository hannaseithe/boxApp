import { Component, Signal } from '@angular/core';
import { Room } from '../../app';
import { StorageService } from '../../services/storage.service';
import { MatListModule } from '@angular/material/list';
import { NavbarService } from '../../services/navbar.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import iconConfig from '../../icon.config';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [
    MatListModule,
    ReactiveFormsModule,
    MatInputModule,
    AppIconComponent,
    RouterModule,
  ],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css',
})
export class RoomListComponent {
  public rooms: Signal<Room[]>;
  roomNameControl = new FormControl('');
  icon = iconConfig;

  constructor(private data: StorageService, private navBar: NavbarService) {
    this.rooms = this.data.Rooms;
  }

  ngOnInit(): void {
    this.navBar.update(['roomAdd']);
  }

  onEnter() {
    const value = this.roomNameControl.value;
    if (value) {
      this.data.addUpdateRoom({ name: value, id: '' });
      this.roomNameControl.reset();
    }
  }
}
