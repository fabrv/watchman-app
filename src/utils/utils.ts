import { collections } from '../models/Api'

export const unique = (id: number, index: number, self: number[]) => self.indexOf(id) === index

export const getUniquesFrom = <T = number>(array: any[], key: string): T[] => {
  return array.map(item => item[key]).filter(unique)
}

export const nonStoredIds = <T = number>(collection: collections, storage: Storage = localStorage) => {
  return (id: T) => {
    const store = storage.getItem(collection)
    if (store === null) {
      return true
    }
    const elements = JSON.parse(store)
    return elements.filter((element: { id: T }) => element.id === id).length === 0
  }
}
