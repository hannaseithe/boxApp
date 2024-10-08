import { Component } from '@angular/core';
import { DbService } from '../db.service';
import { MatButtonModule } from '@angular/material/button';


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
  constructor(private data: DbService){}

  exportExcel() {
    this.data.exportToExcel()
  }

}
