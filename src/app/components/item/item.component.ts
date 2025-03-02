import { Location, NgFor, NgIf } from '@angular/common';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Box, Cat, Item } from '../../app';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UndoService } from '../../services/undo.service';
import { StorageService } from '../../services/storage.service';

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

  items: Signal<Item[]> = signal([])
  id: string | undefined = undefined;
  boxId: number | undefined = undefined;
  item: Signal<Item | undefined> = signal(undefined);
  box: Signal<Box | undefined> = signal(undefined);
  cat: Signal<Cat | undefined> = signal(undefined);

  route: ActivatedRoute = inject(ActivatedRoute);

  reset: any

  constructor(private data: StorageService,
    private router: Router,
    private location: Location,
    private undo: UndoService,
  ) {}
  ngOnInit(): void {
    this.items = this.data.Items
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.item = this.data.getItem(this.id)
      let item = this.item()
      if (item && item.boxID) {
        this.box = this.data.getBox(item.boxID)
      }
      if (item && item.catID) {
        this.cat = this.data.getCat(item.catID)
      }
    }
  }

  deleteItem(): void {
    this.reset = this.data.removeItem(this.item()?.id as string)
    this.undo.push(this.reset)
    this.location.back()
  }
}
