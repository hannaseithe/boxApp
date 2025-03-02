import { Component, computed, ElementRef, Signal, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { Box, Cat, Item } from '../../app';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';
import { UndoService } from '../../services/undo.service';
import { CatListComponent } from '../cat-list/cat-list.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StorageService } from '../../services/storage.service';
import { NasService } from '../../services/nas.service';

@Component({
  selector: 'app-add-edit-item',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './add-edit-item.component.html',
  styleUrl: './add-edit-item.component.css',
})
export class AddEditItemComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  id: string | undefined = undefined;
  isAddMode: boolean = true;
  form: FormGroup;
  boxes: Box[] = [];
  cats: Signal<Cat[]>;
  picture = signal<string | undefined>(undefined);
  private item: Signal<Item | undefined> | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private data: StorageService,
    private router: Router,
    private location: Location,
    private undo: UndoService,
    private dialog: MatDialog,
    public nas: NasService,
  ) {
    this.form = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      boxID: new FormControl(''),
      tags: new FormControl([]),
      catID: new FormControl(''),
      picture: new FormControl(''),
    });
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    if (!this.isAddMode && this.id) {
      this.item = this.data.getItem(this.id);
      let x = this.item();
      computed(() => {
        const picturePath = this.item?.()?.picture;
        if (picturePath) {
          //this.loadImage(picturePath);
        }
      });
    }

    this.cats = computed(() => this.data.Cats().sort(this.sortFn));

    this.boxes = this.data.Boxes().sort(this.sortFn);
  }

  ngOnInit(): void {
    if (this.item) {
      let item = this.item()
      if (item) {
        this.form.patchValue(item);
      }
    }
    
    let boxID = this.route.snapshot.queryParams['boxId'];
    if (boxID) {
      this.form.patchValue({ boxID: boxID });
    }
  }

  /*private async loadImage(picturePath: string) {
    try {
      const imageUrl = await this.fs.loadImageFromFolder(picturePath);
      this.picture.set(imageUrl); // Das Bild-URL im Signal setzen
    } catch (error) {
      console.error('Error loading image:', error);
    }
  }*/

  openDialog(data: any) {
    let dialogRef = this.dialog.open(CatListComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.form.patchValue({ catID: result.id });
        this.form.markAsDirty();
      }
    });
  }

  sortFn(a: Box | Cat, b: Box | Cat) {
    return a.name.toLowerCase() < b.name.toLowerCase()
      ? -1
      : a.name.toLowerCase() == b.name.toLowerCase()
      ? 0
      : 1;
  }

  remove(tag: string) {
    let tags = this.form.get('tags')?.value;
    const index = tags.indexOf(tag);
    if (index < 0) {
      return tags;
    }

    tags.splice(index, 1);
    return [...tags];
  }

  add(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    let tags = this.form.get('tags')?.value;
    // Add our keyword
    if (value && !!value) {
      if (tags) {
        this.form.patchValue({ tags: [...tags, value] });
      } else {
        this.form.patchValue({ tags: [value] });
      }
      this.form.markAsDirty();
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  onSubmit() {
    let formItem = this.form.value;
    formItem.id = this.id ? this.id : undefined;
    let { item, resetFn } = this.data.addUpdateItem(formItem);
    if (resetFn) {
      this.undo.push(resetFn);
    }
    if (this.id) {
      this.router.navigateByUrl('/item/' + item()?.id);
    } else {
      this.router.navigateByUrl('/box/' + formItem.boxID);
    }
  }

  cancel() {
    this.location.back();
  }

  loginToNAS() {
    this.router.navigate(['/nas-login']);
  }

  async onFileSelect(event: any): Promise<void> {
    const file = event.target.files[0];
    console.log('File selected');

    if (file) {
      const fileName = this.nas.uploadFile(file,true).subscribe({next: (response: any) => {
        if (response.authPassed === '1') {
          console.log('upload successful')
          this.form.patchValue({ picture: fileName });
        } else {
          console.error('Upload Failed')
        }
      },
      error: (error) => {
        console.error(error);
      },});
      
    }
  }
}
