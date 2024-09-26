import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Box, Cat, Item, uniqueId } from './app';


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
    this.updateFK()

  }

  updateFK() {
    let itemRes = JSON.parse(localStorage.getItem('items') as string) as Item[]
    let boxRes = JSON.parse(localStorage.getItem('boxes') as string) as Box[]
    let catRes = JSON.parse(localStorage.getItem('cats') as string) as Cat[]
    let itemsArray = itemRes ? itemRes : []
    let boxesArray = boxRes ? boxRes : []
    let catsArray = catRes ? catRes : []
    let uaItemsArray:Item[] = []


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

  purifyBoxes(boxes:Box[]):Box[] {
    return boxes.map(box => {return {id:box.id, name:box.name, description: box.description}})
  }

  purifyItems(items:Item[]):Item[] {
    return items.map(item => {
      return {
        id:item.id, 
        name:item.name,
        description: item.description,
        tags: item.tags,
        boxID: item.boxID,
        catID: item.catID
      }})
  }

  purifyCats(cats:Cat[]):Cat[] {
    return cats.map(cat => {return {id:cat.id, name:cat.name}})
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

  updateBox(edBox:Box) {
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

  getCategory(id:uniqueId) {
    let result = this.Cats().find(cat => cat.id == id)
    return result
  }

  getCategoryName(id: uniqueId) {
    return this.Cats().find(cat => cat.id == id)?.name
  }

  updateCat(edCat:Cat) {
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

  deleteItem(id: uniqueId) {
    let i = this.Items().findIndex((item) => item.id == id)
    if (i > -1) {
      this.Items().splice(i, 1);
    } else {
      return
    }
    localStorage.setItem('items', JSON.stringify(this.purifyItems(this.Items())))
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
