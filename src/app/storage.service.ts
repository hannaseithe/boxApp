import { Injectable, Signal, WritableSignal } from '@angular/core';
import { Box, Cat, Item, resetFn, Room, uniqueId } from './app';

export abstract class StorageService {
  public abstract Boxes: WritableSignal<Box[]>;
  public abstract Cats: WritableSignal<Cat[]>;
  public abstract Items: WritableSignal<Item[]>;
  public abstract Rooms: WritableSignal<Box[]>;
  public abstract UnassignedItems: Signal<Item[]>;

  public abstract getItem(id: uniqueId): Signal<Item | undefined>;
  public abstract addUpdateItem(item: Item): {
    item: Signal<Item | undefined>;
    resetFn?: resetFn;
  };
  public abstract removeItem(id: uniqueId): resetFn | void;

  public abstract getBox(id: uniqueId): Signal<Box | undefined>;
  public abstract addUpdateBox(box: Box): Signal<Box | undefined>;
  public abstract removeBox(id: uniqueId): resetFn | void;

  public abstract getRoom(id: uniqueId): Signal<Room | undefined>;
  public abstract addUpdateRoom(room: Room): Signal<Room | undefined>;
  public abstract removeRoom(id: uniqueId): resetFn | void;

  public abstract getCat(id: uniqueId): Signal<Cat | undefined>;
  public abstract addUpdateCat(item: Cat): Signal<Cat | undefined>;
  public abstract removeCat(id: uniqueId): resetFn | void;

  public abstract getItemsByCat(id: uniqueId): Signal<Item[]>;
  public abstract getItemsByBox(id: uniqueId): Signal<Item[]>;
  public abstract getItemsByTag(tag: string): Signal<Item[]>;
  public abstract getItemsByRoom(id: uniqueId): Signal<Item[]>;

  public abstract getAllItemsByBox(id: uniqueId): Signal<Item[]>;
  public abstract getAllItemsByRoom(id: uniqueId): Signal<Item[]>;

  public abstract getBoxesByBox(id: uniqueId): Signal<Box[]>;
  public abstract getBoxesByRoom(id: uniqueId): Signal<Box[]>;

  public abstract getAllBoxesByBox(id: uniqueId): Signal<Box[]>;
  public abstract getAllBoxesByRoom(id: uniqueId): Signal<Box[]>;

  public abstract assignItemToBox(
    boxId: uniqueId,
    itemId: uniqueId
  ): Signal<Item | undefined> | undefined;

  public abstract assignBoxToBox(
    box1Id: uniqueId,
    box2Id: uniqueId
  ): Signal<Box | undefined> | undefined;

  public abstract assignItemToRoom(
    itemId: uniqueId,
    roomId: uniqueId
  ): Signal<Item | undefined> | undefined;

  public abstract assignBoxToRoom(
    boxId: uniqueId,
    roomId: uniqueId
  ): Signal<Box | undefined> | undefined;

  public abstract clearStorage(): void;
  public abstract initializeNewDB(
    boxes: Box[],
    cats: Cat[],
    items: Item[],
    rooms: Room[]
  ): void;
  public abstract generateNewId(): uniqueId;
}
