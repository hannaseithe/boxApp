import { Injectable } from '@angular/core';
import { Box, Cat, Item } from './app';


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
          id: 1,
          description: "",
          items: []
        },
        {
          id: 2,
          description: "",
          items: []
        }]))
      boxes = localStorage.getItem('boxes') as string
    }
    let items = localStorage.getItem('items')
    if (!items) {
      localStorage.setItem('items', JSON.stringify([{
        id: 3,
        name: "Kissen",
        catID: 0,
        description: "3 Kissen",
        tags: ["ausmisten"],
        boxID: 1
      },
      {
        id: 4,
        name: "Decken",
        catID: 0,
        description: "",
        tags: [],
        boxID: 1
      },
      {
        id: 5,
        name: "Beetschaufel",
        catID: 1,
        description: "",
        tags: [],
        boxID: 2
      },
      {
        id: 6,
        name: "Gummistiefel",
        catID: 0,
        description: "",
        tags: [],
        boxID: 2
      }]))
      items = localStorage.getItem('items') as string
    }
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
    let boxesArray = JSON.parse(boxes) as Box[]
    let itemsArray = JSON.parse(items) as Item[]
    let catsArray = JSON.parse(cats) as any[]
    itemsArray.forEach(item => {
      boxesArray.find(box => item.boxID == box.id)?.items.push(item)
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
  getBox(id: number) {
    return this.boxes.find(box => box.id == id)
  }

  getCategories() {
    return this.cats
  }

  getCategoryName(id: number) {
    return this.cats.find(cat => cat.id == id)?.name
  }

  getItem(id: number) {
    let result = this.items.find(item => item.id == id)
    if (result) {
      result.catName = this.getCategoryName(result.catID)
    }
    return result
  }
  getItemsByCat(id:number) {
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
