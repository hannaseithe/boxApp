import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Item } from './app';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  inputData = {
    buttons: signal({
      itemAdd: false,
      itemEdit: false,
      itemDelete: false,
      boxAdd: false,
      boxEdit: false,
      boxDelete: false,
    }),
    pageData:signal({})
  }

  outputData:{searchResult:WritableSignal<Item[]>} = {
    searchResult: signal([])
  }



  constructor() { }

  reset() {
    this.inputData.pageData.set({})
    this.inputData.buttons.update(x => {
      let result:any = {}
      for (const key in x) {
        result[key] = false
      }
      return result
    })
  }

  update(keys: string[], data?: any) {
    this.reset()
    keys.forEach(key => {
      this.inputData.buttons.update(x => ({...x, [key]: true}))
    })
    if (data) {
      this.inputData.pageData.set(data)
    }

  }

  updateSearchResult(result:Item[]) {
    this.outputData.searchResult.set(result)
  }


}
