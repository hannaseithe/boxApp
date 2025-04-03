import { Component, inject, Input, signal, Signal } from '@angular/core';
import { Box, Item, Room } from '../../app';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarService } from '../../services/navbar.service';
import { StorageService } from '../../services/storage.service';
import { MatListModule } from '@angular/material/list';
import iconConfig from '../../icon.config';
import { AppIconComponent } from '../app-icon/app-icon.component';

function isStringLikeNumber(value: string): boolean {
  return /^[+-]?\d+(\.\d+)?$/.test(value.trim());
}
@Component({
  selector: 'app-box-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    AppIconComponent,
    RouterModule,
    MatToolbarModule,
    MatListModule,
  ],
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.css',
})
export class BoxListComponent {
  @Input() id: string | undefined = undefined;
  public room: Room | undefined;
  public boxes: Signal<Box[]> = signal([]);
  public items: Signal<Item[]> = signal([]);
  public uaItems: Signal<Item[]>;
  public uaBoxes: Signal<Box[]>;
  public groupedItems: Map<string, Signal<Item[]>> = new Map();
  route: ActivatedRoute = inject(ActivatedRoute);
  public icon = iconConfig;

  constructor(private data: StorageService, private navBar: NavbarService) {
    this.uaItems = this.data.UnassignedItems;
    this.uaBoxes = this.data.UnassignedBoxes;
  }

  ngOnInit(): void {
    this.navBar.update(['boxAdd']);

    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.room = this.data.getRoom(this.id);
      this.boxes = this.data.getBoxesByRoom(this.id);
      this.items = this.data.getItemsByRoom(this.id);
    }
    this.groupItemsByBoxes();
  }

  private groupItemsByBoxes(): void {
    this.groupedItems.clear();
    for (const box of this.boxes()) {
      this.groupedItems.set(box.id, this.data.getItemsByBox(box.id));
    }
  }

  sortFn(a: Box | Item, b: Box | Item) {
    if (isStringLikeNumber(a.name) && isStringLikeNumber(b.name)) {
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
