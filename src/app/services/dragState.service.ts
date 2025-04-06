import { Injectable, signal, WritableSignal } from '@angular/core';
import { Box, DraggedItem, Item } from '../app';

@Injectable({
  providedIn: 'root',
})
export class DragStateService {
  dropLists: WritableSignal<string[]> = signal([]);
  dragging: WritableSignal<boolean> = signal(false);
  private draggedCallback: Function = () => {};

  onDropped() {
    this.dragging.set(false);
    this.draggedCallback();
    this.clearDragged();
  }

  startDragging() {
    this.dragging.set(true);
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
