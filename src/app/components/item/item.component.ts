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
import { Box, Cat, Item } from '../../app';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UndoService } from '../../services/undo.service';
import { StorageService } from '../../services/storage.service';
import { NasService } from '../../services/nas.service';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})
export class ItemComponent {
  items: Signal<Item[]> = signal([]);
  id: string | undefined = undefined;
  boxId: number | undefined = undefined;
  item: Signal<Item | undefined> = signal(undefined);
  box: Signal<Box | undefined> = signal(undefined);
  cat: Signal<Cat | undefined> = signal(undefined);
  picture: WritableSignal<string | undefined> = signal(undefined);

  route: ActivatedRoute = inject(ActivatedRoute);

  reset: any;

  constructor(
    private data: StorageService,
    private router: Router,
    private location: Location,
    private undo: UndoService,
    public nas: NasService,
    private dialog: MatDialog
  ) {
    effect(() => {
      const item = this.item();
      if (this.nas.loggedIn() && item?.picture) {
        this.fetchThumbnail(item.picture);
      }
    });
  }
  ngOnInit(): void {
    this.items = this.data.Items;
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.item = this.data.getItem(this.id);
      let item = this.item();
      if (item && item.boxID) {
        this.box = this.data.getBox(item.boxID);
      }
      if (item && item.catID) {
        this.cat = this.data.getCat(item.catID);
      }
    }
  }

  private fetchThumbnail(fileName: string) {
    this.nas.fetchThumbnail(fileName,100).subscribe({
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
      data: { imageUrl: this.item()?.picture },
      width: '80vw', // Adjust size as needed
      maxWidth: '600px',
    });
  }

  deleteItem(): void {
    this.reset = this.data.removeItem(this.item()?.id as string);
    this.undo.push(this.reset);
    this.location.back();
  }
}
