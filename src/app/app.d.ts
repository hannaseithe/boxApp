import { Signal } from '@angular/core';

export type resetFn = {
  (): void;
  cancel: () => void;
  active: Signal<boolean>;
  message: string;
};

export type Item = {
  id: string;
  name: string;
  catID: string;
  description: string;
  tags: string[];
  picture?: string;
  boxID?: string;
  roomID?: string;
};

export type Box = {
  id: string;
  name: string;
  description?: string;
  boxID?: string;
  roomID?: string;
};

export type Room = {
  id: string;
  name: string;
  description?: string;
};

export type Cat = {
  id: string;
  name: string;
};
