import { signal } from '@angular/core';

export class StorageServiceMock {
  private storage: Record<string, any> = {};

  Rooms = signal([
    { id: '1', name: '1. Room' },
    { id: '2', name: '2. Room', description: 'This is a room' },
  ]);

  Boxes = signal([
    {
      id: '1',
      name: '1. Box',
      roomID: '1',
    },
    {
      id: '2',
      name: '2.Box',
      boxID: '1',
    },
    { id: '3', name: '3.Box', boxID: '2' },
  ]);

  Items = signal([
    {
      id: '1',
      name: '1. Item',
      description: 'This is an item',
      roomID: '2',
    },
    {
      id: '2',
      name: '2. Item',
      boxID: '2',
    },
  ]);

  getBox = jasmine
    .createSpy('getBox')
    .and.callFake((id: string) => this.Boxes()[0]);

  getAllRoomsWithBoxes = jasmine
    .createSpy('getAllRoomsWithBoxes')
    .and.callFake(() => [
      {
        id: '2',
        name: '2. Room',
        description: 'This is a room',
        boxes: [{ id: '3', name: '3.Box', boxID: '2' }],
      },
    ]);
}
