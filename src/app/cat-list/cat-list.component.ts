import { Component, Signal } from '@angular/core';
import { DbService } from '../db.service';
import { Cat, uniqueId } from '../app';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    ReactiveFormsModule,
  ],
  templateUrl: './cat-list.component.html',
  styleUrl: './cat-list.component.css'
})
export class CatListComponent {

  addNew = false
  itemId: uniqueId;

  catFC: FormControl

  public cats: Signal<Cat[]>

  catVisibility: { [id: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private data: DbService) {
    this.cats = this.data.Cats
    this.catFC = new FormControl("")
    this.addNew = this.route.snapshot.queryParams['addNew'];
    this.itemId = this.route.snapshot.queryParams['itemId'];
  }

  edit(cat: Cat) {
    for (let key in this.catVisibility) {
      this.catVisibility[key] = false
    }
    this.catVisibility[cat.id] = true;
    this.catFC.setValue(cat.name)
  }

  add() {
    this.addNew = true
    this.catFC.setValue("")
  }

  isCatEdited(catId: uniqueId): boolean {
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

    let updatedCat = this.data.updateCat(edCat)
    if (updatedCat) {
      this.catVisibility[updatedCat.id] = false;
      this.addNew = false;
    }

  }

  delete(cat:Cat) {
    this.data.deleteCat(cat.id)
  }

}
