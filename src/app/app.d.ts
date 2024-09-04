
export type Item = {
  id: number,
  name: string,
  cat: string,
  description: string,
  tags: string[],
  boxId: number,
}

export type Box = {
  id: number,
  description: string,
  items: item[]
}