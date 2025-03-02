import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../components/bottom-sheet/bottom-sheet.component';
import { resetFn } from '../app';

@Injectable({
  providedIn: 'root'
})
export class UndoService {
  reset: any = undefined
  active:any = undefined
  

  private _bottomSheet = inject(MatBottomSheet);

  constructor() {
  }




  push(resetFn: resetFn) {
    if (this.reset) {
      this.reset.cancel()
      this.reset = null
    }

    this.reset = resetFn
    this.active = computed(()=> {
      if (this.reset){
        return this.reset.active()
      } else {
        return false
      }
    })

    let sheetRef
      if (this.active()) {
        sheetRef = this._bottomSheet.open(BottomSheetComponent, {
          data: { reset: this.reset },
          closeOnNavigation: false
        });
        sheetRef.afterDismissed().subscribe(() => {
          this.reset.cancel()
          this.reset = null
        })
    }
  }
}
