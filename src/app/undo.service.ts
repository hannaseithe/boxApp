import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';

@Injectable({
  providedIn: 'root'
})
export class UndoService {
  reset: any = undefined
  active:any = undefined
  

  private _bottomSheet = inject(MatBottomSheet);

  constructor() {
    let sheetRef;
    effect(() => {
     if (this.active) {
      if (!this.active()) {
        this._bottomSheet.dismiss()
        this.reset.cancel()
        this.reset = null
      }
     }



    });


  }




  push(resetFn: Function) {

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
        });
        sheetRef.afterDismissed().subscribe(() => {
          this.reset.cancel()
          this.reset = null
        })
    }
  }
}
