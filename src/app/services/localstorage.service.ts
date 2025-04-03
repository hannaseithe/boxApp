import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { StorageService } from './storage.service';
import { Box, Cat, Item, Room, resetFn } from '../app';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class StorageFactoryService {
  constructor(
    private localStorageService: LocalStorageService //private indexedDbService: IndexedDbService
  ) {}

  getStorageService(): StorageService {
    const useIndexedDb = true; // Toggle this based on environment/config
    //return useIndexedDb ? this.indexedDbService : this.localStorageService;
    return this.localStorageService;
  }
}

function getLocalStorage<T>(key: string, defaultValue: T): T {
  return JSON.parse(localStorage.getItem(key) || 'null') ?? defaultValue;
}

function findNestedBoxes(boxes: Box[], parentId: string): string[] {
  const nestedBoxes = boxes.filter((box) => box.boxID === parentId);
  const nestedIds = nestedBoxes.map((box) => box.id);

  nestedBoxes.forEach((box) => {
    nestedIds.push(...findNestedBoxes(boxes, box.id));
  });

  return nestedIds;
}

type Tablename = 'items' | 'boxes' | 'rooms' | 'cats';

@Injectable({ providedIn: 'root' })
export class LocalStorageService extends StorageService {
  public Boxes: WritableSignal<Box[]>;
  public Cats: WritableSignal<Cat[]>;
  public Items: WritableSignal<Item[]>;
  public Rooms: WritableSignal<Room[]>;
  public UnassignedItems: Signal<Item[]>;
  public UnassignedBoxes: Signal<Box[]>;
  private itemLookup: Record<string, Item> = {};
  private roomLookup: Record<string, Room> = {};
  private boxLookup: Record<string, Box> = {};
  private catLookup: Record<string, Cat> = {};

  constructor() {
    super();
    this.Boxes = signal([]);
    this.Items = signal([]);
    this.Cats = signal([]);
    this.Rooms = signal([]);
    this.UnassignedItems = computed(() =>
      this.Items().filter((Item) => {
        const box = Item.boxID ? this.boxLookup[Item.boxID] : undefined;
        const room = Item.roomID ? this.roomLookup[Item.roomID] : undefined;
        return !box && !room;
      })
    );
    this.UnassignedBoxes = computed(() =>
      this.Boxes().filter((Box) => {
        const box = Box.boxID ? this.boxLookup[Box.boxID] : undefined;
        const room = Box.roomID ? this.roomLookup[Box.roomID] : undefined;
        return !box && !room;
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

    this.initializeLookup(this.Boxes(), this.boxLookup);
    this.initializeLookup(this.Items(), this.itemLookup);
    this.initializeLookup(this.Rooms(), this.roomLookup);
    this.initializeLookup(this.Cats(), this.catLookup);
  }

  private save(name: Tablename, data: any): void {
    const purifiers = {
      items: this.purifyItems,
      rooms: this.purifyRooms,
      boxes: this.purifyBoxes,
      cats: this.purifyCats,
    };

    const signals = {
      items: this.Items,
      rooms: this.Rooms,
      boxes: this.Boxes,
      cats: this.Cats,
    };

    const lookups = {
      items: this.itemLookup,
      rooms: this.roomLookup,
      boxes: this.boxLookup,
      cats: this.catLookup,
    };

    if (purifiers[name]) {
      localStorage.setItem(
        name,
        JSON.stringify(purifiers[name](data), this.jsonReplacer)
      );
      signals[name].set(getLocalStorage(name, []));
      if (lookups[name]) {
        this.initializeLookup(signals[name](), lookups[name]);
      }
    }
  }

  private initializeLookup(
    values: Item[] | Room[] | Box[],
    lookup: Record<string, Item> | Record<string, Room> | Record<string, Box>
  ) {
    for (const key in lookup) {
      delete lookup[key];
    }

    values.forEach((value) => {
      lookup[value.id] = value;
    });
  }

  private purifyBoxes(boxes: Box[]): Box[] {
    return boxes.map((box) => {
      return {
        id: box.id,
        name: box.name,
        description: box.description,
        roomID: box.roomID,
        boxID: box.boxID,
      };
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
        roomID: item.roomID,
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
        THIS.save(tablename, data);
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

  public getItem(id: string): Item | undefined {
    return this.itemLookup[id];
  }

  public addUpdateItem(item: Item): {
    item: Item | undefined;
    resetFn?: resetFn;
  } {
    let oldItems, oldItemName;
    oldItems = this.Items();
    let items = oldItems;
    if (!item.id) {
      item.id = uuidv4();
    }
    let i = items.findIndex((it) => it.id == item.id);

    if (i > -1) {
      items.splice(i, 1, item);
      oldItemName = items[i].name;
    } else {
      items.push(item);
    }
    this.save('items', items);

    if (i > -1) {
      return {
        resetFn: this.resetOption(
          oldItems,
          'items',
          'The item >' + oldItemName + '< has been edited.'
        ),
        item: this.itemLookup[item.id],
      };
    } else {
      return {
        item: this.itemLookup[item.id],
      };
    }
  }

  public removeItem(id: string): resetFn | void {
    let oldItems = [...this.Items()];

    let i = this.Items().findIndex((item) => item.id == id);
    let oldItemName = this.Items()[i].name;
    if (i > -1) {
      this.Items().splice(i, 1);
    } else {
      return;
    }
    this.save('items', this.Items());
    return this.resetOption(
      oldItems,
      'items',
      'The item >' + oldItemName + '< has been deleted.'
    );
  }

  public getBox(id: string): Box | undefined {
    return this.boxLookup[id];
  }

  public addUpdateBox(box: Box): Box | undefined {
    let boxes = this.Boxes();
    if (!box.id) {
      box.id = uuidv4();
      boxes.push(box);
    } else {
      let i = boxes.findIndex((b) => b.id == box.id);
      if (i > -1) {
        boxes.splice(i, 1, box);
      }
    }
    this.save('boxes', boxes);
    return this.boxLookup[box.id];
  }

  public removeBox(id: string): resetFn | void {
    let oldBoxes = this.Boxes();
    let newBoxes = oldBoxes;

    let i = oldBoxes.findIndex((box) => box.id == id);
    let oldBoxName = oldBoxes[i].name;
    if (i > -1) {
      newBoxes.splice(i, 1);
    } else {
      return;
    }
    this.save('boxes', newBoxes);
    return this.resetOption(
      oldBoxes,
      'boxes',
      'The box >' + oldBoxName + '< has been deleted.'
    );
  }

  public getRoom(id: string): Room | undefined {
    return this.roomLookup[id];
  }

  public addUpdateRoom(room: Room): Room | undefined {
    let rooms = this.Rooms();
    if (!room.id) {
      room.id = uuidv4();
      rooms.push(room);
    } else {
      let i = rooms.findIndex((b) => b.id == room.id);
      if (i > -1) {
        rooms.splice(i, 1, room);
      }
    }
    this.save('rooms', rooms);
    return this.roomLookup[room.id];
  }

  public removeRoom(id: string): resetFn | void {
    const oldRooms = this.Rooms();
    let newRooms = oldRooms;

    let i = oldRooms.findIndex((room) => room.id == id);
    let oldRoomName = oldRooms[i].name;
    if (i > -1) {
      newRooms.splice(i, 1);
    } else {
      return;
    }
    this.save('rooms', newRooms);
    return this.resetOption(
      oldRooms,
      'rooms',
      'The room >' + oldRoomName + '< has been deleted.'
    );
  }

  public getCat(id: string): Cat | undefined {
    return this.catLookup[id];
  }

  public addUpdateCat(cat: Cat): Cat | undefined {
    let cats = this.Cats();
    if (!cat.id) {
      cat.id = uuidv4();
      cats.push(cat);
    } else {
      let i = cats.findIndex((c) => c.id == cat.id);
      if (i > -1) {
        cats.splice(i, 1, cat);
      }
    }
    this.save('cats', cats);
    return this.catLookup[cat.id];
  }
  public removeCat(id: string): resetFn | void {
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

  public getItemsByCat(id: string): Signal<Item[]> {
    return computed(() => this.Items().filter((item) => item.catID == id));
  }
  public getItemsByBox(id: string): Signal<Item[]> {
    return computed(() => this.Items().filter((item) => item.boxID == id));
  }
  public getItemsByTag(tag: string): Signal<Item[]> {
    return computed(() =>
      this.Items().filter((item) => {
        return item.tags?.includes(tag);
      })
    );
  }
  public getItemsByRoom(id: string): Signal<Item[]> {
    return computed(() => this.Items().filter((item) => item.roomID == id));
  }

  public getAllItemsByBox(id: string): Signal<Item[]> {
    let allBoxIDs: string[] = [...findNestedBoxes(this.Boxes(), id), id];
    return computed(() =>
      this.Items().filter((item) => allBoxIDs.some((id) => id == item.boxID))
    );
  }

  public getAllItemsByRoom(id: string): Signal<Item[]> {
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

  public getBoxesByBox(id: string): Signal<Box[]> {
    return computed(() => this.Boxes().filter((box) => box.boxID == id));
  }
  public getBoxesByRoom(id: string): Signal<Box[]> {
    return computed(() => this.Boxes().filter((box) => box.roomID == id));
  }

  public getAllBoxesByBox(id: string): Signal<Box[]> {
    let allBoxIDs: string[] = [...findNestedBoxes(this.Boxes(), id), id];
    return computed(() =>
      this.Boxes().filter((box) => allBoxIDs.includes(box.id))
    );
  }

  public getAllBoxesByRoom(id: string): Signal<Box[]> {
    let allBoxIDs = this.Boxes()
      .filter((box) => box.roomID == id)
      .map((box) => box.id);
    allBoxIDs.forEach((bid) =>
      allBoxIDs.push(...findNestedBoxes(this.Boxes(), bid))
    );
    return computed(() =>
      this.Boxes().filter((box) => allBoxIDs.includes(box.id))
    );
  }

  public assignItemToBox(boxId: string, itemId: string): Item | undefined {
    let item = this.itemLookup[itemId];
    let result;
    if (this.boxLookup[boxId] && item) {
      item.roomID = undefined;
      item.boxID = boxId;
      result = this.addUpdateItem(item);
      if ('item' in result) {
        return result.item;
      } else return result;
    }
    return;
  }

  public assignBoxToBox(box1Id: string, box2Id: string): Box | undefined {
    let box = this.boxLookup[box2Id];
    let result;
    if (this.boxLookup[box1Id] && box) {
      box.roomID = undefined;
      box.boxID = box1Id;
      result = this.addUpdateBox(box);
      return result;
    }
    return;
  }

  public assignItemToRoom(roomId: string, itemId: string): Item | undefined {
    let item = this.itemLookup[itemId];
    let result;
    if (this.roomLookup[roomId] && item) {
      item.boxID = undefined;
      item.roomID = roomId;
      result = this.addUpdateItem(item);
      if ('item' in result) {
        return result.item;
      } else return result;
    }
    return;
  }

  public assignBoxToRoom(boxId: string, roomId: string): Box | undefined {
    let box = this.boxLookup[boxId];
    let result;
    if (this.roomLookup[roomId] && box) {
      box.boxID = undefined;
      box.roomID = roomId;
      result = this.addUpdateBox(box);
      return result;
    }
    return;
  }

  public clearStorage() {
    localStorage.clear();
  }
  private jsonReplacer(k: any, v: any) {
    return v === undefined ? null : v;
  }
  private initStorage(
    newBoxes: Box[],
    newCats: Cat[],
    newItems: Item[],
    newRooms: Room[]
  ) {
    this.save('boxes', newBoxes);
    this.save('cats', newCats);
    this.save('items', newItems);
    this.save('rooms', newRooms);
  }

  public initializeNewDB(
    boxes: Box[],
    cats: Cat[],
    items: Item[],
    rooms: Room[]
  ) {
    this.clearStorage();

    this.initStorage(boxes, cats, items, rooms);
  }

  public generateNewId() {
    return uuidv4();
  }

  public getTrail(id: string): (Room | Box)[] {
    const trail: (Room | Box)[] = [];
    let currentId = id;

    while (currentId) {
      const object = this.itemLookup[currentId] || this.boxLookup[currentId];

      if (!object) break;

      if (object.roomID) {
        const room = this.roomLookup[object.roomID];
        if (room) {
          trail.push({ ...room, type: 'room' });
          break;
        }
      }

      if (object.boxID) {
        const box = this.boxLookup[object.boxID];
        if (box) {
          trail.push({ ...box, type: 'box' });
          currentId = box.id;
        } else {
          break;
        }
      }
    }

    return trail;
  }
}
