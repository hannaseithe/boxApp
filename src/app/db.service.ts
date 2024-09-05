import { Injectable } from '@angular/core';
import { Box, Cat, Item, uniqueId } from './app';


@Injectable({
  providedIn: 'root'
})
export class DbService {
  private boxes: Box[]
  private items: Item[]
  private cats: Cat[]


  constructor() {
    this.boxes = []
    this.items = []
    this.cats = []
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

    this.boxes = boxesArray
    this.items = itemsArray
    this.cats = catsArray
  }

  clearStorage() {
    localStorage.clear()
  }

  getBoxes() {
    return this.boxes
  }
  getBox(id: uniqueId) {
    return this.boxes.find(box => box.id == id)
  }

  getCategories() {
    return this.cats
  }

  getCategoryName(id: uniqueId) {
    return this.cats.find(cat => cat.id == id)?.name
  }

  getItem(id: uniqueId) {
    let result = this.items.find(item => item.id == id)
    if (result) {
      result.catName = this.getCategoryName(result.catID)
    }
    return result
  }

  updateItem(edItem: Item) {
    if (!edItem.id)  {
      edItem.id = crypto.randomUUID();
    }
    let i = this.items.findIndex((item) => item.id == edItem.id)
    if (i > -1) {
      this.items.splice(i,1,edItem);
    } else {
      this.items.push(edItem)
    }
    localStorage.setItem('items', JSON.stringify(this.items))
    return this.getItem(edItem.id)
  }

  deleteItem(id:uniqueId){
    let i = this.items.findIndex((item) => item.id == id)
    if (i > -1) {
      this.items.splice(i,1);
    } else {
      return
    }
    localStorage.setItem('items', JSON.stringify(this.items))
  }

  getItemsByCat(id: uniqueId) {
    return this.items.filter(item => {
      return item.catID == id
    })
  }
  getItemsByTag(tag: string) {
    return this.items.filter(item => {
      return item.tags.includes(tag)
    })
  }
}
