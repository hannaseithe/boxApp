import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Box, Cat, Item, uniqueId } from './app';
import { initializeApp } from './app.config';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  public Boxes: WritableSignal<Box[]>
  public Cats: WritableSignal<Cat[]>
  public Items: WritableSignal<Item[]>
  public UnassignedItems: WritableSignal<Item[]>


  constructor() {
    this.Boxes = signal([])
    this.Items = signal([])
    this.Cats = signal([])
    this.UnassignedItems = signal([])
  }

  private initBoxes = [
    {
      id: crypto.randomUUID(),
      name: "1",
      description: ""
    },
    {
      id: crypto.randomUUID(),
      name: "2",
      description: ""
    }]

  private initCats = [
    {
      id: crypto.randomUUID(),
      name: "Gartenzeug"
    },
    {
      id: crypto.randomUUID(),
      name: "Bücher"
    }]

  private initItems = [{
    id: crypto.randomUUID(),
    name: "Kissen",
    catID: this.initCats[0].id,
    description: "3 Kissen",
    tags: ["ausmisten"],
    boxID: this.initBoxes[0].id
  },
  {
    id: crypto.randomUUID(),
    name: "Decken",
    catID: this.initCats[0].id,
    description: "",
    tags: [],
    boxID: this.initBoxes[0].id
  },
  {
    id: crypto.randomUUID(),
    name: "Beetschaufel",
    catID: this.initCats[1].id,
    description: "",
    tags: [],
    boxID: this.initBoxes[1].id
  },
  {
    id: crypto.randomUUID(),
    name: "Gummistiefel",
    catID: this.initCats[0].id,
    description: "",
    tags: [],
    boxID: this.initBoxes[1].id
  }]


  init(newBoxes? : Box[], newCats?: Cat[], newItems?: Item[]) {
    let boxes = localStorage.getItem('boxes')
    if (!boxes) {
      let initBoxes = newBoxes ? newBoxes : this.initBoxes
      localStorage.setItem('boxes', JSON.stringify(this.purifyBoxes(initBoxes)))
      boxes = localStorage.getItem('boxes') as string
    }

    let cats = localStorage.getItem('cats')
    if (!cats) {
      let initCats = newCats ? newCats : this.initCats
      localStorage.setItem('cats',
        JSON.stringify(this.purifyCats(initCats)))
      cats = localStorage.getItem('cats') as string
    }

    let items = localStorage.getItem('items')
    if (!items) {
      let initItems = newItems ? newItems : this.initItems
      localStorage.setItem('items', JSON.stringify(this.purifyItems(initItems)))
      items = localStorage.getItem('items') as string
    }
    this.updateFK()

  }

  updateFK() {
    let itemRes = JSON.parse(localStorage.getItem('items') as string) as Item[]
    let boxRes = JSON.parse(localStorage.getItem('boxes') as string) as Box[]
    let catRes = JSON.parse(localStorage.getItem('cats') as string) as Cat[]
    let itemsArray = itemRes ? itemRes : []
    let boxesArray = boxRes ? boxRes : []
    let catsArray = catRes ? catRes : []
    let uaItemsArray: Item[] = []


    itemsArray.forEach(item => {
      let box = boxesArray.find(box => item.boxID == box.id)
      if (box) {
        if (!box?.items) {
          box.items = []
        }
        box?.items?.push(item)
        item.boxName = box?.name
      } else {
        uaItemsArray.push(item)
      }

    })
    this.Boxes.set(boxesArray)
    this.Cats.set(catsArray)
    this.Items.set(itemsArray)
    this.UnassignedItems.set(uaItemsArray)

  }

  generateNewId() {
    return crypto.randomUUID()
  }

  initializeNewDBfromExcel(boxes: Box[], cats: Cat[], items: Item[]) {
    this.clearStorage()

    this.init(boxes, cats, items)

  }

  purifyBoxes(boxes: Box[]): Box[] {
    return boxes.map(box => { return { id: box.id, name: box.name, description: box.description } })
  }

  purifyItems(items: Item[]): Item[] {
    return items.map(item => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        tags: item.tags,
        boxID: item.boxID,
        catID: item.catID
      }
    })
  }

  purifyCats(cats: Cat[]): Cat[] {
    return cats.map(cat => { return { id: cat.id, name: cat.name } })
  }

  clearStorage() {
    localStorage.clear()
    this.updateFK()
  }

  getBoxes() {
    return this.Boxes()
  }
  getBox(id: uniqueId) {
    return this.Boxes().find(box => box.id == id)
  }

  updateBox(edBox: Box) {
    if (!edBox.id) {
      edBox.id = crypto.randomUUID();
      this.Boxes().push(edBox)
    } else {
      let i = this.Boxes().findIndex(box => box.id == edBox.id)
      if (i > -1) {
        this.Boxes().splice(i, 1, edBox);
      }
    }
    localStorage.setItem('boxes', JSON.stringify(this.purifyBoxes(this.Boxes())))
    this.updateFK()
    return this.getBox(edBox.id)
  }

  deleteBox(id: uniqueId | undefined) {
    let i = this.Boxes().findIndex((box) => box.id == id)
    if (i > -1) {
      this.Boxes().splice(i, 1);
    } else {
      return
    }
    localStorage.setItem('boxes', JSON.stringify(this.purifyBoxes(this.Boxes())))
    this.updateFK()
  }

  getCategories() {
    return this.Cats()
  }

  getCategory(id: uniqueId) {
    let result = this.Cats().find(cat => cat.id == id)
    return result
  }

  getCategoryName(id: uniqueId) {
    return this.Cats().find(cat => cat.id == id)?.name
  }

  updateCat(edCat: Cat) {
    if (!edCat.id) {
      edCat.id = crypto.randomUUID();
      this.Cats().push(edCat)
    } else {
      let i = this.Cats().findIndex(cat => cat.id == edCat.id)
      if (i > -1) {
        this.Cats().splice(i, 1, edCat);
      }
    }
    localStorage.setItem('cats', JSON.stringify(this.purifyCats(this.Cats())))
    this.updateFK()
    return this.getCategory(edCat.id)

  }

  deleteCat(id: uniqueId) {
    let i = this.Cats().findIndex((cat) => cat.id == id)
    if (i > -1) {
      this.Cats().splice(i, 1);
    } else {
      return
    }
    localStorage.setItem('cats', JSON.stringify(this.purifyCats(this.Cats())))
    this.updateFK()
  }

  getItem(id: uniqueId) {
    let result = this.Items().find(item => item.id == id)
    if (result) {
      result.catName = this.getCategoryName(result.catID)
    }
    return result
  }

  updateItem(edItem: Item) {
    if (!edItem.id) {
      edItem.id = crypto.randomUUID();
    }
    let i = this.Items().findIndex((item) => item.id == edItem.id)
    if (i > -1) {
      this.Items().splice(i, 1, edItem);
    } else {
      this.Items().push(edItem)
    }
    localStorage.setItem('items', JSON.stringify(this.purifyItems(this.Items())))
    this.updateFK()
    return this.getItem(edItem.id)
  }

  resetOption(data: any, tablename: string) {
    let THIS = this
     function reset() {
      
      if (reset.active) {
        switch (tablename){
          case "items":
            localStorage.setItem('items', JSON.stringify(THIS.purifyItems(data)))
            THIS.updateFK() 
        }
      }
    }
    reset.cancel = () => {reset.active = false}
    reset.active = true
    
    setInterval(() => reset.active = false, 30000)
    return reset
  }

  deleteItem(id: uniqueId) {
    let oldItems = [...this.Items()]
    let i = this.Items().findIndex((item) => item.id == id)
    if (i > -1) {
      this.Items().splice(i, 1);
    } else {
      return
    }
    localStorage.setItem('items', JSON.stringify(this.purifyItems(this.Items())))
    this.updateFK()
    return this.resetOption(oldItems, "items")
  }

  getItemsByCat(id: uniqueId) {
    return this.Items().filter(item => {
      return item.catID == id
    })
  }
  getItemsByTag(tag: string) {
    return this.Items().filter(item => {
      return item.tags.includes(tag)
    })
  }

  prepExcelExport() {
   let result: any[] = []
   let cats = this.Cats()
   let boxes = this.Boxes()
   this.Items().forEach(item => {
    let itemCatName = cats.find(cat => cat.id == item.catID)?.name
    let itemBoxName = boxes.find(box => box.id == item.boxID)?.name
    let itemTags = item.tags?.reduce((acc, item) => acc + ", " + item)
    let prepItem = {
      name: item.name,
      description: item.description,
      category: itemCatName,
      box: itemBoxName,
      tags: itemTags
    }

    result.push(prepItem)
   })
   return result
  }

  exportToExcel(): void {  
    let json = this.prepExcelExport()
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);  
    const workbook: XLSX.WorkBook = { Sheets : {'data':worksheet}, SheetNames:['data'] };  
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type:'array'});
    this.saveAsExcelFile(excelBuffer, "BoxInventory");
  }  

  saveAsExcelFile(buffer:any, fileName:string): void{
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
