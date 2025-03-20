import {
  Component,
  computed,
  effect,
  ElementRef,
  Signal,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
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
  form: FormGroup<{
    name: FormControl<string>;
    description: FormControl<string>;
    boxID: FormControl<string>;
    tags: FormControl<Array<string>>;
    catID: FormControl<string>;
    picture: FormControl<string>;
  }>;
  pictureFile: File | null = null;
  boxes: Box[] = [];
  cats: Signal<Cat[]>;
  picture: WritableSignal<string | undefined> = signal(undefined);
  private item: Signal<Item | undefined> = signal(undefined);

  constructor(
    private route: ActivatedRoute,
    private data: StorageService,
    private router: Router,
    private location: Location,
    private undo: UndoService,
    private dialog: MatDialog,
    public nas: NasService,
    private fb: NonNullableFormBuilder
  ) {
    this.form = this.fb.group({
      name: '',
      description: '',
      boxID: '',
      tags: new FormControl<string[]>([], { nonNullable: true }),
      catID: '',
      picture: '',
    });
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    effect(() => {
      const item = this.item();
      if (this.nas.loggedIn() && item?.picture) {
        this.fetchThumbnail(item.picture);
      }
    });

    if (!this.isAddMode && this.id) {
      this.item = this.data.getItem(this.id);
      let x = this.item();
    }

    this.cats = computed(() => this.data.Cats().sort(this.sortFn));

    this.boxes = this.data.Boxes().sort(this.sortFn);
  }

  ngOnInit(): void {
    if (this.item) {
      let item = this.item();
      if (item) {
        this.form.patchValue(item);
        if (item.picture && this.nas.loggedIn()) {
          this.fetchThumbnail(item.picture);
        }
      }
    }

    let boxID = this.route.snapshot.queryParams['boxId'];
    if (boxID) {
      this.form.patchValue({ boxID: boxID });
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
    if (tags) {
      const index = tags.indexOf(tag);
      if (index < 0) {
        return tags;
      }

      tags.splice(index, 1);
      this.form.markAsDirty();
      return [...tags];
    }
    return undefined;
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
    if (this.pictureFile && this.nas.loggedIn()) {
      this.nas.uploadFile(this.pictureFile, true).subscribe({
        next: (response: any) => {
          if (response.status === 1) {
            console.log('upload successful');
            this.saveForm(formItem, response.name);
          } else {
            console.error('Upload Failed');
            this.saveForm(formItem);
          }
        },
        error: (error) => {
          console.error(error);
          this.saveForm(formItem);
        },
      });
    } else {
      this.saveForm(formItem);
    }
  }

  private saveForm(formItem: any, pictureName?: string) {
    let saveItem =
      pictureName != undefined
        ? { ...formItem, picture: pictureName }
        : formItem;
    saveItem.id = this.id ? this.id : undefined;
    let { item, resetFn } = this.data.addUpdateItem(saveItem);
    if (resetFn) {
      this.undo.push(resetFn);
    }
    if (this.id) {
      this.router.navigateByUrl('/item/' + item()?.id);
    } else {
      this.router.navigateByUrl('/box/' + item()?.boxID);
    }
  }

  cancel() {
    this.location.back();
  }

  onFileSelect(event: any): void {
    this.pictureFile = event.target.files[0];
    this.form.markAsDirty();
  }
}
