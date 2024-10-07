
export type Item = {
  id: uniqueId,
  name: string,
  catID: uniqueId,
  catName?: string,
  description: string,
  tags: string[],
  boxID: uniqueId,
  boxName?: string
}

export type Box = {
  id: uniqueId,
  name: string,
  description?: string,
  items?: item[]
}

export type Cat = {
  id: uniqueId,
  name: string,
}

export type uniqueId = `${string}-${string}-${string}-${string}-${string}`