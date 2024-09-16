import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Cat, Item, uniqueId } from '../app';
import { DbService } from '../db.service';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [NgFor, MatCardModule, RouterModule, MatChipsModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent {
  tag: string | undefined = undefined
  cat: Cat | undefined = undefined
  items: Item[] = []

  route: ActivatedRoute = inject(ActivatedRoute);

  constructor(private data: DbService) {
    if (this.route.snapshot.params['tag']) {
      this.tag = this.route.snapshot.params['tag'];
    } else {
      this.cat = this.route.snapshot.queryParams as Cat;
    }

  }
  ngOnInit(): void {
    if (this.tag) { this.items = this.data.getItemsByTag(this.tag) }
    else if (this.cat) { this.items = this.data.getItemsByCat(this.cat.id) }

  }
}
