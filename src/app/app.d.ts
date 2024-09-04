
export type Item = {
  id: number,
  name: string,
  catID: number,
  catName?: string,
  description: string,
  tags: string[],
  boxID: number,
}

export type Box = {
  id: number,
  description: string,
  items: item[]
}

export type Cat = {
  id: number,
  name: string,
}