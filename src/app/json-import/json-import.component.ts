import { Component } from '@angular/core';
import { Box, Cat, Item, Room } from '../app';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-json-import',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './json-import.component.html',
  styleUrl: './json-import.component.css'
})
export class JsonImportComponent {

  constructor(private data:StorageService) {

  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let {rooms, boxes, cats, items} = JSON.parse(e.target.result)
      this.data.initializeNewDB(boxes, cats,items,rooms);
      console.log('Imported Json:', [items, boxes, rooms,cats]);
    };
    reader.readAsText(file);
  }

}
