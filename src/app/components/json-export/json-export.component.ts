import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ExportImportService } from '../../services/exportimport.service';

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

  constructor(private exim: ExportImportService) {}

  exportJson() {
    this.exim.exportToJson()
  }

}
