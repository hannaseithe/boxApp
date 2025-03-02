import { Component, effect, inject, signal, Signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Box, Item, Room} from '../../app';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavbarService } from '../../services/navbar.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [NgFor, MatCardModule, RouterModule, MatChipsModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent {
  tag: string | undefined = undefined
  catID: string | undefined = undefined
  catName: string | undefined = undefined
  items: Signal<Item[]> = signal([])
  mappedBoxes: Map<string, Signal<Box | undefined>> = new Map();
  mappedRooms: Map<string, Signal<Room | undefined>> = new Map();
  route: ActivatedRoute = inject(ActivatedRoute);

  constructor(private data: StorageService,
    private navBar: NavbarService
  ) {
    effect(() => {
      this.mapFKItems()
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['tag']) {
      this.tag = this.route.snapshot.params['tag'];
      this.items = this.data.getItemsByTag(this.tag as string)
    } else if (this.route.snapshot.queryParams) {
      if(this.route.snapshot.queryParams['id']) {
        this.catID = this.route.snapshot.queryParams['id'];
        this.catName = this.route.snapshot.queryParams['name'];
        if(this.catID) {
          this.items = this.data.getItemsByCat(this.catID as string)
        }
      } else if(this.route.snapshot.queryParams['search']) {
        this.items = this.navBar.outputData.searchResult
      } 
    } 
  }

  private mapFKItems(): void {
    this.mappedBoxes.clear();
    this.mappedRooms.clear();
    for (const item of this.items()) {
      if (item.boxID) this.mappedBoxes.set(item.id, this.data.getBox(item.boxID));
      if (item.roomID) this.mappedRooms.set(item.id, this.data.getBox(item.roomID));
    }
  }
  sortFn(a: Item,b: Item) {
    return a.name.toLowerCase() < b.name.toLowerCase() ? -1: a.name.toLowerCase() == b.name.toLowerCase() ? 0:1
  }
}
