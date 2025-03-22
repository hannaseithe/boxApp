import { Component, effect, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Box, Item } from '../../app';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { StorageService } from '../../services/storage.service';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import iconConfig from '../../icon.config';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-unassigned-item-list',
  standalone: true,
  imports: [
    RouterModule,
    MatChipsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatCardModule,
    AppIconComponent,
  ],
  templateUrl: './unassigned-item-list.component.html',
  styleUrl: './unassigned-item-list.component.css',
})
export class UnassignedItemListComponent {
  items: Signal<Item[]>;
  boxes: Box[] = [];
  formGroup: FormGroup;
  icon = iconConfig;

  constructor(
    private data: StorageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.items = this.data.UnassignedItems;
    this.boxes = this.data.Boxes();
    this.formGroup = this.fb.group({});

    effect(() => {
      if (this.items().length == 0) {
        this.router.navigateByUrl('');
      }
    });
  }

  ngOnInit(): void {
    this.items().forEach((item) => {
      this.formGroup.addControl(item.id, new FormControl(false));
    });
  }

  assign(item: Item, event: any) {
    item.boxID = event.value;
    this.data.addUpdateItem(item);
  }
  delete(item: Item) {
    this.data.removeItem(item.id);
  }

  private getSelectedItems() {
    const formValues = this.formGroup.value;
    return Object.keys(formValues).filter((key) => formValues[key]);
  }

  assignSelected(event: any) {
    const boxID = event.value;
    this.getSelectedItems().forEach((id) => {
      const item = this.items().find((item) => item.id == id);
      if (item) {
        this.data.addUpdateItem({ ...item, boxID: boxID });
      }
    });
  }

  deleteSelected() {
    const selectedItems = this.getSelectedItems();
    selectedItems.forEach((id) => this.data.removeItem(id));
  }

  sortFn(a: Item, b: Item) {
    return a.name.toLowerCase() < b.name.toLowerCase()
      ? -1
      : a.name.toLowerCase() == b.name.toLowerCase()
      ? 0
      : 1;
  }
}
