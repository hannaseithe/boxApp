import { Component, effect, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Box, Item} from '../app';
import { DbService } from '../db.service';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-unassigned-item-list',
  standalone: true,
  imports: [NgFor, 
    MatCardModule, 
    RouterModule, 
    MatChipsModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './unassigned-item-list.component.html',
  styleUrl: './unassigned-item-list.component.css'
})
export class UnassignedItemListComponent {

  items: Signal<Item[]>;
  boxes: Box[] = []

  constructor(
    private data: DbService,
    private router: Router
  ) {
    this.items = this.data.UnassignedItems
    this.boxes = this.data.Boxes()

    effect(() => {
      if (this.items().length == 0) {
        this.router.navigateByUrl('')
      }
    })

  }

  ngOnInit(): void {
  }


  assign(item: Item,event: any) {
    item.boxID = event.value
    this.data.updateItem(item);
  }
  delete(item:Item) {
    this.data.deleteItem(item.id)
  }

  sortFn(a: Item,b: Item) {
    return a.name < b.name ? -1: a.name == b.name ? 0:1
  }
}
