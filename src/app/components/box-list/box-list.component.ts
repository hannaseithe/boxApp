import { Component, Signal } from '@angular/core';
import { Box, Item } from '../../app';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarService } from '../../services/navbar.service';
import { StorageService } from '../../services/storage.service';

function isStringLikeNumber(value: string): boolean {
  return /^[+-]?\d+(\.\d+)?$/.test(value.trim());
}
@Component({
  selector: 'app-box-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterModule,
    MatToolbarModule,
  ],
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.css',
})
export class BoxListComponent {
  public boxes: Signal<Box[]>;
  public uaItems: Signal<Item[]>;
  public groupedItems: Map<string, Signal<Item[]>> = new Map();

  constructor(private data: StorageService, private navBar: NavbarService) {
    this.boxes = this.data.Boxes;
    this.uaItems = this.data.UnassignedItems;
  }

  ngOnInit(): void {
    this.navBar.update(['boxAdd']);
    this.groupItemsByBoxes();
  }

  private groupItemsByBoxes(): void {
    this.groupedItems.clear();
    for (const box of this.boxes()) {
      this.groupedItems.set(box.id, this.data.getItemsByBox(box.id));
    }
  }

  sortFn(a: Box | Item, b: Box | Item) {
    if (
      isStringLikeNumber(a.name) &&
      isStringLikeNumber(b.name)
    ) {
      return Number(a.name) < Number(b.name)
        ? -1
        : Number(a.name) == Number(b.name)
        ? 0
        : 1;
    }
    return a.name.toLowerCase() < b.name.toLowerCase()
      ? -1
      : a.name.toLowerCase() == b.name.toLowerCase()
      ? 0
      : 1;
  }
}
