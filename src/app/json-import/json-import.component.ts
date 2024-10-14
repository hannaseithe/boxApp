import { Component } from '@angular/core';
import { DbService } from '../db.service';
import { Box, Cat, Item } from '../app';
import { MatButtonModule } from '@angular/material/button';

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

  constructor(private data:DbService) {

  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let json:[Box[],Cat[],Item[]] = JSON.parse(e.target.result)
      this.data.initializeNewDBfromExcel(...json);
      console.log('Imported Json:', json);
    };
    reader.readAsText(file);
  }

}
