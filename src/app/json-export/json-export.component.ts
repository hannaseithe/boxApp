import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DbService } from '../db.service';

@Component({
  selector: 'app-json-export',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './json-export.component.html',
  styleUrl: './json-export.component.css'
})
export class JsonExportComponent {

  constructor(private data: DbService) {}

  exportJson() {
    this.data.exportToJson()
  }

}
