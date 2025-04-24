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
import { UndoService } from '../../services/undo.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

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
    ReactiveFormsModule,
    MatInputModule,
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
  boxNameControl = new FormControl('');
  itemNameControl = new FormControl('');

  constructor(
    private data: StorageService,
    private navBar: NavbarService,
    private undo: UndoService,
    private router: Router
  ) {
    this.uaItems = this.data.UnassignedItems;
    this.uaBoxes = this.data.UnassignedBoxes;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.navBar.update(['boxAdd'], { roomId: this.id });

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
  deleteRoom(id: string | undefined) {
    if (id) {
      let resetFn = this.data.removeRoom(id);
      this.undo.push(resetFn as any);
      this.router.navigateByUrl('/');
    }
  }
  addBox() {
    const value = this.boxNameControl.value;
    if (value) {
      this.data.addUpdateBox({ name: value, id: '', roomID: this.room!.id });
      this.boxNameControl.reset();
    }
  }
  addItem() {
    const value = this.itemNameControl.value;
    if (value) {
      this.data.addUpdateItem({
        name: value,
        id: '',
        tags: [],
        roomID: this.room!.id,
      });
      this.itemNameControl.reset();
    }
  }
}
