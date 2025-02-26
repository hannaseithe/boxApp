import { Signal } from "@angular/core"

export type resetFn = {
  (): void,
  cancel: () => void,
  active: Signal<boolean>,
  message: string
}


export type Item = {
  id: uniqueId,
  name: string,
  catID: uniqueId,
  description: string,
  tags: string[],
  picture?: string,
}& (
  | { boxID?: uniqueId; roomID?: never }
  | { roomID?: uniqueId; boxID?: never } 
)

export type Box = {
  id: uniqueId,
  name: string,
  description?: string,
  boxID?: uniqueId,
  roomID?: uniqueId,
}

export type Room = {
  id: uniqueId,
  name: string,
  description?: string,
}

export type Cat = {
  id: uniqueId,
  name: string,
}

export type uniqueId = `${string}-${string}-${string}-${string}-${string}`