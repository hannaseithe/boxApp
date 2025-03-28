import { Component, ElementRef, ViewChild } from '@angular/core';
import { Box, Cat, Item, Room } from '../../app';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-json-import',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './json-import.component.html',
  styleUrl: './json-import.component.css',
})
export class JsonImportComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private data: StorageService) {}

  clearAndClick() {
    this.fileInput.nativeElement.value = '';

    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let {
        rooms = [],
        boxes = [],
        cats = [],
        items = [],
      } = JSON.parse(e.target.result);
      this.data.initializeNewDB(boxes, cats, items, rooms);
      console.log('Imported Json:', [items, boxes, rooms, cats]);
    };
    reader.readAsText(file);
  }
}
