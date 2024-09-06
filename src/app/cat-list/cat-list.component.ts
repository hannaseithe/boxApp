import { Component, Signal } from '@angular/core';
import { DbService } from '../db.service';
import { Cat, uniqueId } from '../app';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cat-list',
  standalone: true,
  imports: [
    RouterModule,
    MatListModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cat-list.component.html',
  styleUrl: './cat-list.component.css'
})
export class CatListComponent {

  public cats: Signal<Cat[]>

  catVisibility: { [id: string]: boolean } = {};

  constructor(private data:DbService){
    this.cats = this.data.Cats
  }

  edit(cat: Cat){
    this.catVisibility[cat.id] = true;
    //name = new FormControl('');
  }

  isCatEdited(catId: uniqueId): boolean {
    // Check if the details for a specific cat are visible
    return !!this.catVisibility[catId];
  }

  updateCat() {

  }

}
