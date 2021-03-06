import { collections } from '../../models/Api'

export function getAll<T> (collection: collections, storage: Storage): T[] {
  const store = storage.getItem(collection)
  if (store === null) {
    return []
  }
  return JSON.parse(store)
}

export function addToStorage<T> (collection: collections, elements: T[], storage: Storage): T[] {
  const store = storage.getItem(collection)
  if (store === null) {
    storage.setItem(collection, JSON.stringify(elements))
  } else {
    const parsed = JSON.parse(store)
      .filter((element: any) => !elements.some((e: any) => e.id === element.id))

    const newElements = [...parsed, ...elements]
    storage.setItem(collection, JSON.stringify(newElements))
  }
  return getAll<T>(collection, storage)
}
