import {
  Component,
  effect,
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
  dragging: WritableSignal<boolean>;
  readyToDrop: boolean = false;
  dropLists = ['homeList'];

  fullTrail: Map<string, { show: boolean; data: Room[] | Box[] }> = new Map();

  navigationTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

  constructor(
    private router: Router,
    private data: StorageService,
    private drag: DragStateService
  ) {
    this.dragging = this.drag.dragging;
    effect(() => {
      if (!this.drag.dragging()) this.readyToDrop = false;
    });
  }

  ngOnInit() {
    this.initTrail();
  }
  ngOnChanges() {
    this.initTrail();
  }

  private initTrail() {
    this.dropLists = ['homeList'];
    this.fullTrail.clear();
    this.fullTrail.set('homeList', {
      show: false,
      data: this.data.Rooms().map((room) => ({ ...room, type: 'room' })),
    });
    this.dropLists.push(
      ...this.fullTrail
        .get('homeList')!
        .data.map((room) => `thingList-${room.id}`)
    );
    this.trail.forEach((thing) => {
      this.dropLists.push(`trailList-${thing.id}`);
      switch (thing.type) {
        case 'room':
          this.fullTrail.set(`trailList-${thing.id}`, {
            show: false,
            data: this.data
              .getBoxesByRoom(thing.id!)()
              .map((box) => ({ ...box, type: 'box' })),
          });
          break;
        case 'box':
          this.fullTrail.set(`trailList-${thing.id}`, {
            show: false,
            data: this.data
              .getBoxesByBox(thing.id!)()
              .map((box) => ({ ...box, type: 'box' })),
          });
          break;
      }
      this.dropLists.push(
        ...this.fullTrail
          .get(`trailList-${thing.id}`)!
          .data.map((box) => `thingList-${box.id}`)
      );
    });
    this.drag.registerDropLists(this.dropLists);
  }

  isShow(key: string) {
    return this.fullTrail.get(key)!.show;
  }

  onDragEnter(key: string) {
    this.fullTrail.forEach((Item) => (Item.show = false));
    let item = this.fullTrail.get(key);
    if (item) {
      this.fullTrail.set(key, { ...item, show: true });
    }
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

    this.readyToDrop = false;
    this.drag.onDropped();
  }
}
