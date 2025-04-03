import { Component, ElementRef, Signal, ViewChild } from '@angular/core';
import { DraggedItem, Room } from '../../app';
import { StorageService } from '../../services/storage.service';
import { MatListModule } from '@angular/material/list';
import { NavbarService } from '../../services/navbar.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import iconConfig from '../../icon.config';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { DragStateService } from '../../services/dragState.service';
import { MatChipsModule } from '@angular/material/chips';
import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [
    MatListModule,
    ReactiveFormsModule,
    MatInputModule,
    AppIconComponent,
    RouterModule,
    MatChipsModule,
    DragDropModule,
  ],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css',
})
export class RoomListComponent {
  public rooms: Signal<Room[]>;
  roomNameControl = new FormControl('');
  icon = iconConfig;
  draggedItem: DraggedItem | null = null;

  constructor(
    private data: StorageService,
    private navBar: NavbarService,
    private drag: DragStateService
  ) {
    this.rooms = this.data.Rooms;
  }

  ngOnInit(): void {
    this.navBar.update(['roomAdd']);
  }

  ngAfterViewInit() {}

  onEnter() {
    const value = this.roomNameControl.value;
    if (value) {
      this.data.addUpdateRoom({ name: value, id: '' });
      this.roomNameControl.reset();
    }
  }
}
