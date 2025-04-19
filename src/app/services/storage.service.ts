import { Injectable, Signal, WritableSignal } from '@angular/core';
import { Box, Cat, Item, resetFn, Room, RoomWithBoxes } from '../app';

export abstract class StorageService {
  public abstract Boxes: WritableSignal<Box[]>;
  public abstract Cats: WritableSignal<Cat[]>;
  public abstract Items: WritableSignal<Item[]>;
  public abstract Rooms: WritableSignal<Room[]>;
  public abstract UnassignedItems: Signal<Item[]>;
  public abstract UnassignedBoxes: Signal<Box[]>;

  public abstract getItem(id: string): Item | undefined;
  public abstract addUpdateItem(item: Item): {
    item: Item | undefined;
    resetFn?: resetFn;
  };
  public abstract removeItem(id: string): resetFn | void;

  public abstract getBox(id: string): Box | undefined;
  public abstract addUpdateBox(box: Box): Box | undefined;
  public abstract removeBox(id: string): resetFn | void;

  public abstract getRoom(id: string): Room | undefined;
  public abstract addUpdateRoom(room: Room): Room | undefined;
  public abstract removeRoom(id: string): resetFn | void;

  public abstract getCat(id: string): Cat | undefined;
  public abstract addUpdateCat(item: Cat): Cat | undefined;
  public abstract removeCat(id: string): resetFn | void;

  public abstract getItemsByCat(id: string): Signal<Item[]>;
  public abstract getItemsByBox(id: string): Signal<Item[]>;
  public abstract getItemsByTag(tag: string): Signal<Item[]>;
  public abstract getItemsByRoom(id: string): Signal<Item[]>;

  public abstract getAllItemsByBox(id: string): Signal<Item[]>;
  public abstract getAllItemsByRoom(id: string): Signal<Item[]>;

  public abstract getBoxesByBox(id: string): Signal<Box[]>;
  public abstract getBoxesByRoom(id: string): Signal<Box[]>;

  public abstract getAllBoxesByBox(id: string): Signal<Box[]>;
  public abstract getAllBoxesByRoom(id: string): Signal<Box[]>;
  public abstract getAllRoomsWithBoxes(): RoomWithBoxes[];

  public abstract getTrail(id: string): (Room | Box)[];

  public abstract assignItemToBox(
    boxId: string,
    itemId: string
  ): Item | undefined;

  public abstract assignBoxToBox(
    box1Id: string,
    box2Id: string
  ): Box | undefined;

  public abstract assignItemToRoom(
    roomId: string,
    itemId: string
  ): Item | undefined;

  public abstract assignBoxToRoom(
    roomId: string,
    boxId: string
  ): Box | undefined;

  public abstract clearStorage(): void;
  public abstract initializeNewDB(
    boxes: Box[],
    cats: Cat[],
    items: Item[],
    rooms: Room[]
  ): void;
  public abstract generateNewId(): string;
}
