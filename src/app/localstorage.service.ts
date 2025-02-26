import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { StorageService } from './storage.service';
import { Box, Cat, Item, Room, uniqueId, resetFn } from './app';

@Injectable({providedIn: 'root'})
export class StorageFactoryService {
  constructor(
    private localStorageService: LocalStorageService
  ) //private indexedDbService: IndexedDbService
  {}

  getStorageService(): StorageService {
    const useIndexedDb = true; // Toggle this based on environment/config
    //return useIndexedDb ? this.indexedDbService : this.localStorageService;
    return this.localStorageService;
  }
}

function getLocalStorage<T>(key: string, defaultValue: T): T {
  return JSON.parse(localStorage.getItem(key) || 'null') ?? defaultValue;
}

function findNestedBoxes(boxes: Box[], parentId: uniqueId): uniqueId[] {
  const nestedBoxes = boxes.filter((box) => box.boxID === parentId);
  const nestedIds = nestedBoxes.map((box) => box.id);

  nestedBoxes.forEach((box) => {
    nestedIds.push(...findNestedBoxes(boxes, box.id));
  });

  return nestedIds;
}

type Tablename = 'items' | 'boxes' | 'rooms' | 'cats'

@Injectable({providedIn:'root'})
export class LocalStorageService extends StorageService {
  public Boxes: WritableSignal<Box[]>;
  public Cats: WritableSignal<Cat[]>;
  public Items: WritableSignal<Item[]>;
  public Rooms: WritableSignal<Box[]>;
  public UnassignedItems: Signal<Item[]>;

  constructor() {
    super();
    this.Boxes = signal([]);
    this.Items = signal([]);
    this.Cats = signal([]);
    this.Rooms = signal([]);
    this.UnassignedItems = computed(() =>
      this.Items().filter((Item) => {
        let box = this.Boxes().find((Box) => Box.id == Item.boxID);
        return !box;
      })
    );

    let itemsArray: Item[] = getLocalStorage<Item[]>('items', []);
    let boxesArray: Box[] = getLocalStorage<Box[]>('boxes', []);
    let roomsArray: Room[] = getLocalStorage<Room[]>('rooms', []);
    let catsArray: Cat[] = getLocalStorage<Cat[]>('cats', []);

    this.Boxes.set(boxesArray);
    this.Cats.set(catsArray);
    this.Items.set(itemsArray);
    this.Rooms.set(roomsArray);
  }

  private save(name: Tablename, data: any): void {
    const purifiers = {
      items: this.purifyItems,
      rooms: this.purifyRooms,
      boxes: this.purifyBoxes,
      cats: this.purifyCats,
    };
  
    const storers = {
      items: () => this.Items.set(getLocalStorage(name, [])),
      rooms: () => this.Rooms.set(getLocalStorage(name, [])),
      boxes: () => this.Boxes.set(getLocalStorage(name, [])),
      cats: () => this.Cats.set(getLocalStorage(name, [])),
    };
  
    if (purifiers[name]) {
      localStorage.setItem(name, JSON.stringify(purifiers[name](data),this.jsonReplacer));
      storers[name]();
    }
  }

  private purifyBoxes(boxes: Box[]): Box[] {
    return boxes.map((box) => {
      return { id: box.id, name: box.name, description: box.description };
    });
  }

  private purifyItems(items: Item[]): Item[] {
    return items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        tags: item.tags,
        boxID: item.boxID,
        catID: item.catID,
        picture: item.picture,
      };
    });
  }

  private purifyCats(cats: Cat[]): Cat[] {
    return cats.map((cat) => {
      return { id: cat.id, name: cat.name };
    });
  }

  private purifyRooms(rooms: Room[]): Room[] {
    return rooms.map((room) => {
      return { id: room.id, name: room.name, description: room.description };
    });
  }

  private resetOption(data: any, tablename: Tablename, message: string) {
    let THIS = this;
    function reset() {
      if (reset.active()) {
        THIS.save(tablename, data)
      }
    }
    reset.cancel = () => {
      reset.active.set(false);
    };
    reset.active = signal(true);

    reset.message = message;

    setTimeout(() => reset.active.set(false), 10000);
    return reset;
  }

  public getItem(id: uniqueId): Signal<Item | undefined> {
    return computed(() => this.Items().find((item) => item.id == id));
  }

  public addUpdateItem(
    item: Item
  ):{ item: Signal<Item | undefined>; resetFn?: resetFn }
    {
    let oldItems, oldItemName;
    oldItems = this.Items();
    let items = oldItems;
    if (!item.id) {
      item.id = crypto.randomUUID();
    }
    let i = items.findIndex((it) => it.id == item.id);

    if (i > -1) {
      items.splice(i, 1, item);
      oldItemName = items[i].name;
    } else {
      items.push(item);
    }
    this.save('items', items)

    if (i > -1) {
      return {
        resetFn: this.resetOption(
          oldItems,
          'items',
          'The item >' + oldItemName + '< has been edited.'
        ),
        item: computed(() => this.Items().find((it) => item.id == it.id)),
      };
    } else {
      return {item: computed(() => this.Items().find((it) => item.id == it.id))};
    }
  }

  public removeItem(id: uniqueId): resetFn | void {
    let oldItems = [...this.Items()];

    let i = this.Items().findIndex((item) => item.id == id);
    let oldItemName = this.Items()[i].name;
    if (i > -1) {
      this.Items().splice(i, 1);
    } else {
      return;
    }
    this.save('items', this.Items())
    return this.resetOption(
      oldItems,
      'items',
      'The item >' + oldItemName + '< has been deleted.'
    );
  }

  public getBox(id: uniqueId): Signal<Box | undefined> {
    return computed(() => this.Boxes().find((box) => box.id == id));
  }

  public addUpdateBox(box: Box): Signal<Box | undefined> {
    let boxes = this.Boxes()
    if (!box.id) {
      box.id = crypto.randomUUID();
      boxes.push(box);
    } else {
      let i = boxes.findIndex((b) => b.id == box.id);
      if (i > -1) {
        boxes.splice(i, 1, box);
      }
    }
    this.save('boxes',boxes)
    return computed(() => this.Boxes().find((b) => b.id == box.id));
  }

  public removeBox(id: uniqueId): resetFn | void {
    let oldBoxes = this.Boxes();
    let newBoxes = oldBoxes;

    let i = oldBoxes.findIndex((box) => box.id == id);
    let oldBoxName = oldBoxes[i].name;
    if (i > -1) {
      newBoxes.splice(i, 1);
    } else {
      return;
    }
    this.save('boxes',newBoxes)
    return this.resetOption(
      oldBoxes,
      'boxes',
      'The box >' + oldBoxName + '< has been deleted.'
    );
  }

  public getRoom(id: uniqueId): Signal<Room | undefined> {
    return computed(() => this.Rooms().find((room) => room.id == id));
  }

  public addUpdateRoom(room: Room): Signal<Room | undefined> {
    let rooms = this.Rooms()
    if (!room.id) {
      room.id = crypto.randomUUID();
      rooms.push(room);
    } else {
      let i = rooms.findIndex((b) => b.id == room.id);
      if (i > -1) {
        rooms.splice(i, 1, room);
      }
    }
    this.save('rooms',rooms)
    return computed(() => this.Rooms().find((b) => b.id == room.id));
  }

  public removeRoom(id: uniqueId): resetFn | void {
    const oldRooms = this.Rooms();
    let newRooms = oldRooms;

    let i = oldRooms.findIndex((room) => room.id == id);
    let oldRoomName = oldRooms[i].name;
    if (i > -1) {
      newRooms.splice(i, 1);
    } else {
      return;
    }
    this.save('rooms', newRooms)
    return this.resetOption(
      oldRooms,
      'rooms',
      'The room >' + oldRoomName + '< has been deleted.'
    );
  }

  public getCat(id: uniqueId): Signal<Cat | undefined> {
    return computed(() => this.Cats().find((cat) => cat.id == id));
  }

  public addUpdateCat(cat: Cat): Signal<Cat | undefined> {
    let cats = this.Cats();
    if (!cat.id) {
      cat.id = crypto.randomUUID();
      cats.push(cat);
    } else {
      let i = cats.findIndex((c) => c.id == cat.id);
      if (i > -1) {
        cats.splice(i, 1, cat);
      }
    }
    this.save('cats', cats)
    return computed(() => this.Cats().find((c) => c.id == cat.id));
  }
  public removeCat(id: uniqueId): resetFn | void {
    const oldCats = this.Cats();
    let newCats = oldCats;
    let i = oldCats.findIndex((cat) => cat.id == id);
    let oldCatName = this.Cats()[i].name;
    if (i > -1) {
      newCats.splice(i, 1);
    } else {
      return;
    }
    this.save('cats', newCats);
    return this.resetOption(
      oldCats,
      'cats',
      'The category >' + oldCatName + '< has been deleted.'
    );
  }

  public getItemsByCat(id: uniqueId): Signal<Item[]> {
    return computed(() => this.Items().filter((item) => item.catID == id));
  }
  public getItemsByBox(id: uniqueId): Signal<Item[]> {
    return computed(() => this.Items().filter((item) => item.boxID == id));
  }
  public getItemsByTag(tag: string): Signal<Item[]> {
    return computed(() =>
      this.Items().filter((item) => {
        return item.tags?.includes(tag);
      })
    );
  }
  public getItemsByRoom(id: uniqueId): Signal<Item[]> {
    return computed(() => this.Items().filter((item) => item.roomID == id));
  }

  public getAllItemsByBox(id: uniqueId): Signal<Item[]> {
    let allBoxIDs: uniqueId[] = [...findNestedBoxes(this.Boxes(), id), id];
    return computed(() =>
      this.Items().filter((item) => allBoxIDs.some((id) => id == item.boxID))
    );
  }

  public getAllItemsByRoom(id: uniqueId): Signal<Item[]> {
    let allBoxIDs = this.Boxes()
      .filter((box) => box.roomID == id)
      .map((box) => box.id);
    allBoxIDs.forEach((bid) =>
      allBoxIDs.push(...findNestedBoxes(this.Boxes(), bid))
    );
    return computed(() => [
      ...this.Items().filter((item) => item.roomID == id),
      ...this.Items().filter((item) =>
        allBoxIDs.some((id) => id == item.boxID)
      ),
    ]);
  }

  public getBoxesByBox(id: uniqueId): Signal<Box[]> {
    return computed(() => this.Boxes().filter(box => box.boxID == id))
  }
  public getBoxesByRoom(id: uniqueId): Signal<Box[]> {
    return computed(() => this.Boxes().filter(box => box.roomID == id))
  }

  public getAllBoxesByBox(id: uniqueId): Signal<Box[]> {
    let allBoxIDs: uniqueId[] = [...findNestedBoxes(this.Boxes(), id), id];
    return computed(() =>
      this.Boxes().filter((box) => allBoxIDs.includes(box.id))
    );
  }

  public getAllBoxesByRoom(id: uniqueId): Signal<Box[]> {
    let allBoxIDs = this.Boxes()
    .filter((box) => box.roomID == id)
    .map((box) => box.id);
  allBoxIDs.forEach((bid) =>
    allBoxIDs.push(...findNestedBoxes(this.Boxes(), bid))
  );
  return computed(() => this.Boxes().filter((box) => allBoxIDs.includes(box.id)));
  }

  public assignItemToBox(
    boxId: uniqueId,
    itemId: uniqueId
  ): Signal<Item | undefined> | undefined{
    let item = this.getItem(itemId)();
    let result;
    if(this.getBox(boxId)() && item) {
      item.roomID = undefined;
      item.boxID = boxId
      result = this.addUpdateItem(item)
      if ("item" in result) { return result.item }
      else return result
    }
    return  
  }

  public assignBoxToBox(
    box1Id: uniqueId,
    box2Id: uniqueId
  ): Signal<Box | undefined> | undefined{
    let box = this.getBox(box2Id)();
    let result;
    if(this.getBox(box1Id)() && box) {
      box.roomID = undefined;
      box.boxID = box1Id
      result = this.addUpdateBox(box)
      return result
    }
    return  
  }

  public assignItemToRoom(
    itemId: uniqueId,
    roomId: uniqueId
  ): Signal<Item | undefined> | undefined{
    let item = this.getItem(itemId)();
    let result;
    if(this.getRoom(roomId)() && item) {
      item.boxID = undefined;
      item.roomID = roomId
      result = this.addUpdateItem(item)
      if ("item" in result) { return result.item }
      else return result
    }
    return 
  }

  public assignBoxToRoom(
    boxId: uniqueId,
    roomId: uniqueId
  ): Signal<Box | undefined> | undefined{
    let box = this.getBox(boxId)();
    let result;
    if(this.getRoom(roomId)() && box) {
      box.boxID = undefined;
      box.roomID = roomId
      result = this.addUpdateBox(box)
      return result
    }
    return 
  }

  public clearStorage() {
    localStorage.clear()
  }
  private jsonReplacer(k: any, v: any) {
    return v === undefined ? null : v;
  }
  private initStorage(newBoxes: Box[], newCats: Cat[], newItems: Item[], newRooms: Room[]) {

    this.save('boxes', newBoxes)
    this.save('cats', newCats)
    this.save('items', newItems)
    this.save('rooms', newRooms)
  }

  public initializeNewDB(boxes: Box[], cats: Cat[], items: Item[], rooms: Room[]) {
    this.clearStorage()

    this.initStorage(boxes, cats, items, rooms)

  }

  public generateNewId() {
    return crypto.randomUUID()
  }
}
