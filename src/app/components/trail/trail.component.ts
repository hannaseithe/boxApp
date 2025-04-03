import {
  Component,
  Input,
  Signal,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { Box, Room } from '../../app';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { MatChipsModule } from '@angular/material/chips';
import iconConfig from '../../icon.config';
import { Router, RouterModule } from '@angular/router';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { StorageService } from '../../services/storage.service';
import { DragStateService } from '../../services/dragState.service';

@Component({
  selector: 'app-trail',
  standalone: true,
  imports: [
    AppIconComponent,
    MatChipsModule,
    RouterModule,
    DragDropModule,
    MatListModule,
  ],
  templateUrl: './trail.component.html',
  styleUrl: './trail.component.css',
})
export class TrailComponent {
  @Input() trail: (Room | Box)[] = [];
  @Input() droplist: string = '';
  icon = iconConfig;
  things: WritableSignal<(Room | Box)[]> = signal([]);
  dragging = false;
  trailDropLists = ['homeList'];
  thingsDropLists: string[] = [];
  navigationTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    private data: StorageService,
    private drag: DragStateService
  ) {}

  ngOnInit() {
    this.trail.forEach((thing) =>
      this.trailDropLists.push(`trailList-${thing.id}`)
    );
    this.drag.registerDropLists(this.trailDropLists);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.trailDropLists = ['homeList'];
    this.trail.forEach((thing) =>
      this.trailDropLists.push(`trailList-${thing.id}`)
    );
    this.drag.registerDropLists(this.trailDropLists);
  }

  onDragEnter(type: string, id?: string) {
    this.navigationTimeout = setTimeout(() => {
      this.dragging = true;
      switch (type) {
        case 'home':
          this.things.set(
            this.data.Rooms().map((room) => ({ ...room, type: 'room' }))
          );
          break;
        case 'room':
          this.things.set(
            this.data
              .getBoxesByRoom(id!)()
              .map((box) => ({ ...box, type: 'box' }))
          );
          break;
        case 'box':
          this.things.set(
            this.data
              .getBoxesByBox(id!)()
              .map((box) => ({ ...box, type: 'box' }))
          );
          break;
      }
      this.thingsDropLists = [];
      this.things().forEach((thing) =>
        this.thingsDropLists.push(`thingList-${thing.id}`)
      );
      setTimeout(() => {
        this.drag.registerDropLists([
          ...this.trailDropLists,
          ...this.thingsDropLists,
        ]);
      }, 0);
    }, 500);
  }

  drop(event: CdkDragDrop<Room | Box>) {
    const droppedThing = event.item.dropContainer.data;
    const containerThing = event.container.data;
    if (droppedThing.id !== containerThing.id) {
      const actionsItem: Record<
        string,
        (containerId: string, droppedId: string) => void
      > = {
        box: this.data.assignItemToBox.bind(this.data),
        room: this.data.assignItemToRoom.bind(this.data),
      };
      const actionsBox: Record<
        string,
        (containerId: string, droppedId: string) => void
      > = {
        box: this.data.assignBoxToBox.bind(this.data),
        room: this.data.assignBoxToRoom.bind(this.data),
      };

      if (droppedThing.type === 'item' && actionsItem[containerThing.type!]) {
        actionsItem[containerThing.type!](containerThing.id, droppedThing.id);
      }
      if (droppedThing.type === 'box' && actionsBox[containerThing.type!]) {
        actionsBox[containerThing.type!](containerThing.id, droppedThing.id);
      }
    }

    this.dragging = false;
    this.drag.onDropped();
    this.drag.registerDropLists(this.trailDropLists);
  }
}
