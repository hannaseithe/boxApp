import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Item } from './app';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  set = signal({
    itemAdd: false,
    itemEdit: false,
    itemDelete: false,
    boxAdd: false,
    boxEdit: false,
    boxDelete: false,
  })

  pageData:WritableSignal<any> = signal({})

  public searchResult:WritableSignal<Item[]> = signal([])



  constructor() { }

  reset() {
    this.pageData.set({})
    this.set.update(x => {
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
      this.set.update(x => ({...x, [key]: true}))
    })
    if (data) {
      this.pageData.set(data)
    }

  }

  updateSearchResult(result:Item[]) {
    this.searchResult.set(result)
  }


}
