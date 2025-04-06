import { Location, NgFor, NgIf } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Box, Cat, Item, Room } from '../../app';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UndoService } from '../../services/undo.service';
import { StorageService } from '../../services/storage.service';
import { NasService } from '../../services/nas.service';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import iconConfig from '../../icon.config';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { TrailComponent } from '../trail/trail.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { DragStateService } from '../../services/dragState.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    AppIconComponent,
    RouterModule,
    TrailComponent,
    DragDropModule,
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})
export class ItemComponent {
  id: string | undefined = undefined;
  boxId: number | undefined = undefined;
  item: Item | undefined;
  box: Box | undefined;
  cat: Cat | undefined;
  picture: WritableSignal<string | undefined> = signal(undefined);
  icon = iconConfig;
  trail: (Room | Box)[] = [];

  route: ActivatedRoute = inject(ActivatedRoute);

  reset: any;

  constructor(
    private data: StorageService,
    private router: Router,
    private location: Location,
    private undo: UndoService,
    public nas: NasService,
    private dialog: MatDialog,
    public drag: DragStateService
  ) {
    effect(() => {
      if (this.nas.loggedIn() && this.item?.picture) {
        this.fetchThumbnail(this.item.picture);
      }
    });
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getItem();
  }

  private getItem() {
    if (this.id) {
      this.item = this.data.getItem(this.id);
      if (this.item) {
        this.item.type = 'item';
      }
      if (this.item && this.item.boxID) {
        this.box = this.data.getBox(this.item.boxID);
      }
      if (this.item && this.item.catID) {
        this.cat = this.data.getCat(this.item.catID);
      }
      this.trail = this.data.getTrail(this.id);
    }
  }
  private fetchThumbnail(fileName: string) {
    this.nas.fetchThumbnail(fileName, 100).subscribe({
      next: (blob) => {
        this.convertBlobToBase64(blob).then((base64) => {
          this.picture.set(base64);
        });
      },
      error: (error) => console.error(error),
    });
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  openImageDialog(): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl: this.item?.picture },
      width: '80vw', // Adjust size as needed
      maxWidth: '600px',
    });
  }

  deleteItem(): void {
    this.reset = this.data.removeItem(this.item?.id as string);
    this.undo.push(this.reset);
    this.location.back();
  }
  onDragStarted() {
    this.drag.registerDragged(() => this.getItem());
    this.drag.startDragging();
  }
  onDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      this.drag.onDropped();
    }
  }
}
