import { Component, Inject } from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.css'
})
export class BottomSheetComponent {
  message;
  resetFn;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {reset: any}) { 
    this.message = data.reset.message
    this.resetFn = data.reset
  }

  resetDB() {
    this.resetFn();
  }

}
