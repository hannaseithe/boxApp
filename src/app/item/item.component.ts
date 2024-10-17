import { Location, NgFor, NgIf } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Box, Item, uniqueId } from '../app';
import { DbService } from '../db.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UndoService } from '../undo.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgFor, NgIf,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {

  items: Signal<Item[]>
  id: uniqueId | undefined = undefined;
  boxId: number | undefined = undefined;
  item: Signal<Item | undefined>;
  box: Signal<Box | undefined>;
  catName: Signal<string | undefined>;

  route: ActivatedRoute = inject(ActivatedRoute);

  reset: any

  constructor(private data: DbService,
    private router: Router,
    private location: Location,
    private undo: UndoService,
  ) {
    this.items = this.data.Items
    this.id = this.route.snapshot.params['id'];
    this.item = computed(() => {
      return this.items().find(item => item.id == this.id) 
      })
    this.box = computed(() => {
      let item = this.item()
      if (item) { 
        return this.data.getBox(item.boxID)
      } else {
        return
      }
    })
    this.catName = computed(() => {
      let item = this.item()
      if (item && item.catID) {
        return this.data.getCategory(item.catID)?.name
      } else {
        return
      }
    })
  }
  ngOnInit(): void {

  }

  deleteItem(): void {
    this.reset = this.data.deleteItem(this.item()?.id as uniqueId)
    this.undo.push(this.reset)
    this.location.back()

  }

}
