import { Component, Signal } from '@angular/core';
import { DbService } from '../db.service';
import { Box, Item } from '../app';
import { NgFor, NgIf } from '@angular/common';
import { BoxComponent } from '../box/box.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ExcelUploadComponent } from "../excel-upload/excel-upload.component";
import { ExcelDownloadComponent } from '../excel-download/excel-download.component';
import { JsonExportComponent } from '../json-export/json-export.component';

@Component({
  selector: 'app-box-list',
  standalone: true,
  imports: [NgFor, NgIf, BoxComponent, MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterModule,
    ExcelUploadComponent,
    ExcelDownloadComponent,
    JsonExportComponent
  ],
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.css'
})
export class BoxListComponent {
  public boxes: Signal<Box[]>;
  public uaItems: Signal<Item[]>;
  constructor(private data: DbService) {
    this.boxes = this.data.Boxes
    this.uaItems = this.data.UnassignedItems
  }
  ngOnInit(): void {

  }

  public clearStorage(event: Event) {
    this.data.clearStorage()
  }

  public initStorage(event: Event) {
    this.data.init()
  }

  sortFn(a: Box | Item, b: Box | Item) {
    if (typeof Number(a.name) == "number" && typeof Number(b.name) == "number") {
      return Number(a.name) < Number(b.name) ? -1 : Number(a.name) == Number(b.name) ? 0 : 1
    }
    return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() == b.name.toLowerCase() ? 0 : 1
  }
}
