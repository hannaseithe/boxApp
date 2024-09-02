import { Injectable } from '@angular/core';
import { Box, Item } from './app';


@Injectable({
  providedIn: 'root'
})
export class DbService {
  private boxes: Box[]
  private items: Item []
    

  constructor() { 
    this.boxes = []
          
    this.items = []
  }
  init() {
    let boxes = localStorage.getItem('boxes')
    if (!boxes) {
      localStorage.setItem('boxes',JSON.stringify([
        {id: 1,
          description:"",
          items: []
        },
        {id: 2,
          description:"",
          items: []
        }]))
        boxes = localStorage.getItem('boxes') as string
    }
    let items = localStorage.getItem('items')
    if (!items) {
      localStorage.setItem('items',JSON.stringify([{ id:3,
      name:"Kissen",
      cat: "",
      description: "3 Kissen",
      tags: ["ausmisten"],
      boxId: 1
    },
    { id:4,
      name:"Decken",
      cat: "",
      description: "",
      tags: [],
      boxId: 1
    },
    { id:5,
      name:"Beetschaufel",
      cat: "Gartenzeug",
      description: "",
      tags: [],
      boxId: 2
    },
    { id:6,
      name:"Gummistiefel",
      cat: "",
      description: "",
      tags: [],
      boxId:2
    }]))
    items = localStorage.getItem('items') as string
    }
    let boxesArray = JSON.parse(boxes) as Box[]
    let itemsArray = JSON.parse(items) as Item[]
    itemsArray.forEach(item => boxesArray.find(box => item.boxId == box.id)?.items.push(item))
   
    this.boxes = boxesArray
    this.items = itemsArray
  }
  getBoxes() {
    return this.boxes
  }
  getBox(id:number) {
    return this.boxes.find(box => box.id == id)
  }
  getItem(id:number) {
    return this.items.find(item => item.id == id)
  }
  getItemsByTag(tag:string) {
    return this.items.filter(item => {
      return item.tags.includes(tag)
    })
  }
}
