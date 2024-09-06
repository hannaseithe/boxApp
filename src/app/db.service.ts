import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Box, Cat, Item, uniqueId } from './app';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  public Boxes: WritableSignal<Box[]>
  public Cats: WritableSignal<Cat[]>
  public Items: WritableSignal<Item[]>


  constructor() {
    this.Boxes = signal([])
    this.Items = signal([])
    this.Cats = signal([])
  }
  init() {
    let boxes = localStorage.getItem('boxes')
    if (!boxes) {
      localStorage.setItem('boxes', JSON.stringify([
        {
          id: crypto.randomUUID(),
          name: "1",
          description: "",
          items: []
        },
        {
          id: crypto.randomUUID(),
          name: "2",
          description: "",
          items: []
        }]))
      boxes = localStorage.getItem('boxes') as string
    }
    let boxesArray = JSON.parse(boxes) as Box[]

    let cats = localStorage.getItem('cats')
    if (!cats) {
      localStorage.setItem('cats',
        JSON.stringify([
          {
            id: 1,
            name: "Gartenzeug"
          },
          {
            id: 2,
            name: "Bücher"
          }]))
      cats = localStorage.getItem('cats') as string
    }

    let catsArray = JSON.parse(cats) as any[]

    let items = localStorage.getItem('items')
    if (!items) {
      localStorage.setItem('items', JSON.stringify([{
        id: crypto.randomUUID(),
        name: "Kissen",
        catID: catsArray[0].id,
        description: "3 Kissen",
        tags: ["ausmisten"],
        boxID: boxesArray[0].id
      },
      {
        id: crypto.randomUUID(),
        name: "Decken",
        catID: catsArray[0].id,
        description: "",
        tags: [],
        boxID: boxesArray[0].id
      },
      {
        id: crypto.randomUUID(),
        name: "Beetschaufel",
        catID: catsArray[1].id,
        description: "",
        tags: [],
        boxID: boxesArray[1].id
      },
      {
        id: crypto.randomUUID(),
        name: "Gummistiefel",
        catID: catsArray[0].id,
        description: "",
        tags: [],
        boxID: boxesArray[1].id
      }]))
      items = localStorage.getItem('items') as string
    }

    let itemsArray = JSON.parse(items) as Item[]

    itemsArray.forEach(item => {
      let box = boxesArray.find(box => item.boxID == box.id)
      box?.items?.push(item)
      item.boxName = box?.name
    })

    //this.boxes = boxesArray
    this.Boxes.set(boxesArray)
    this.Items.set(itemsArray)
    this.Cats.set(catsArray)
  }

  updateFK() {
    let itemsArray = JSON.parse(localStorage.getItem('items') as string) as Item[]
    let boxesArray = JSON.parse(localStorage.getItem('boxes') as string) as Box[]
    let catsArray = JSON.parse(localStorage.getItem('cats') as string) as Cat[]

    itemsArray.forEach(item => {
      let box = boxesArray.find(box => item.boxID == box.id)
      box?.items?.push(item)
      item.boxName = box?.name
    })
    this.Boxes.set(boxesArray)
    this.Cats.set(catsArray)
    this.Items.set(itemsArray)

  }

  clearStorage() {
    localStorage.clear()
  }

  getBoxes() {
    return this.Boxes()
  }
  getBox(id: uniqueId) {
    return this.Boxes().find(box => box.id == id)
  }

  getCategories() {
    return this.Cats()
  }

  getCategoryName(id: uniqueId) {
    return this.Cats().find(cat => cat.id == id)?.name
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
    localStorage.setItem('items', JSON.stringify(this.Items()))
    this.updateFK()
    return this.getItem(edItem.id)
  }

  deleteItem(id: uniqueId) {
    let i = this.Items().findIndex((item) => item.id == id)
    if (i > -1) {
      this.Items().splice(i, 1);
    } else {
      return
    }
    localStorage.setItem('items', JSON.stringify(this.Items()))
    this.updateFK()
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
}
