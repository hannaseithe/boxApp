import { Injectable, signal, WritableSignal } from '@angular/core';
import { Box, DraggedItem, Item } from '../app';

@Injectable({
  providedIn: 'root',
})
export class DragStateService {
  dropLists: WritableSignal<string[]> = signal([]);
  private draggedCallback: Function = () => {};

  onDropped() {
    this.draggedCallback();
    this.clearDragged();
  }

  clearDragged() {
    this.draggedCallback = () => {};
  }

  registerDragged(callback: Function) {
    this.draggedCallback = callback;
  }

  registerDropLists(listnames: string[]) {
    this.dropLists.set(listnames);
  }
}
