import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ExportImportService } from '../../services/exportimport.service';


@Component({
  selector: 'app-excel-download',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './excel-download.component.html',
  styleUrl: './excel-download.component.css'
})
export class ExcelDownloadComponent {
  constructor(private exim: ExportImportService){}

  exportExcel() {
    this.exim.exportToExcel()
  }

}
