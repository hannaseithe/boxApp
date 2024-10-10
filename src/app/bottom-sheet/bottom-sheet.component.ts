import { Component, effect, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

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

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { reset: any },
private ref: MatBottomSheetRef<BottomSheetComponent>) {
    this.message = data.reset.message
    this.resetFn = data.reset
    effect(() => {

      if (!this.resetFn.active()) {
        this.resetFn = null
        this.ref.dismiss()
      }
    })
  }

  resetDB() {
    this.resetFn();
  }

}
