import { Component, inject, signal, Signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Cat, Item, uniqueId } from '../app';
import { DbService } from '../db.service';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [NgFor, MatCardModule, RouterModule, MatChipsModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent {
  tag: string | undefined = undefined
  catID: uniqueId | undefined = undefined
  catName: string | undefined = undefined
  items: Signal<Item[]>

  route: ActivatedRoute = inject(ActivatedRoute);

  constructor(private data: DbService,
    private navBar: NavbarService
  ) {
    if (this.route.snapshot.params['tag']) {
      this.tag = this.route.snapshot.params['tag'];
      this.items = this.data.getItemsByTag(this.tag as string)
    } else if (this.route.snapshot.queryParams) {
      if(this.route.snapshot.queryParams['id']) {
        this.catID = this.route.snapshot.queryParams['id'];
        this.catName = this.route.snapshot.queryParams['name'];
        this.items = this.data.getItemsByCat(this.catID as uniqueId)
      } else if(this.route.snapshot.queryParams['search']) {
        this.items = this.navBar.searchResult
      } else {
        this.items = signal([])
      }
    } else {
      this.items = signal([])
    }

  }
  ngOnInit(): void {


  }
  sortFn(a: Item,b: Item) {
    return a.name.toLowerCase() < b.name.toLowerCase() ? -1: a.name.toLowerCase() == b.name.toLowerCase() ? 0:1
  }
}
