import { Component, inject, Signal } from '@angular/core';
import { Cat } from '../../app';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UndoService } from '../../services/undo.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-cat-list',
  standalone: true,
  imports: [
    RouterModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './cat-list.component.html',
  styleUrl: './cat-list.component.css'
})
export class CatListComponent {

  readonly dialogRef = inject(MatDialogRef<CatListComponent>);
  readonly dialogData = inject(MAT_DIALOG_DATA);

  catFC: FormControl
  latestCat: Cat | undefined = undefined

  public cats: Signal<Cat[]>

  catVisibility: { [id: string]: boolean } = {};
  route: ActivatedRoute = inject(ActivatedRoute);

  constructor(
    private data: StorageService,
  private undo: UndoService
  ) {
    this.cats = this.data.Cats
    this.catFC = new FormControl("")

  }

  ngOnInit() {

  }

  edit(cat: Cat) {
    for (let key in this.catVisibility) {
      this.catVisibility[key] = false
    }
    this.catVisibility[cat.id] = true;
    this.catFC.setValue(cat.name)
  }

  add() {
    this.dialogData.addNew = true
    this.catFC.setValue("")
  }

  isCatEdited(catId: string): boolean {
    // Check if the details for a specific cat are visible
    return !!this.catVisibility[catId];
  }

  updateCat(cat?: Cat) {
    let edCat: any
    if (cat) {
      edCat = {
        id: cat.id,
        name: this.catFC.value
      }
    } else {
      edCat = {
        name: this.catFC.value
      }
    }

    let updatedCat = this.data.addUpdateCat(edCat)()
    if (updatedCat) {
      this.catVisibility[updatedCat.id] = false;
      this.dialogData.addNew = false;
      this.latestCat = updatedCat

    }

  }

  delete(cat:Cat) {
    let resetFn = this.data.removeCat(cat.id)
    if (resetFn) {
        this.undo.push(resetFn)
    }

  }

  sortFn(a: Cat,b: Cat) {
    return a.name.toLowerCase() < b.name.toLowerCase() ? -1: a.name.toLowerCase() == b.name.toLowerCase() ? 0:1
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
