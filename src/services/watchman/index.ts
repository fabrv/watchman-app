import { collections } from '../../models/Api'

const url: string = process.env.backendUrl || 'http://localhost:8080/api/v1'

interface filters {
  from?: Date
  to?: Date
  textSearch?: {
    field: string
    value: string
  }
}

export async function getAll<T> (collection: collections, limit: number = 100, offset: number = 0, ids?: string[] | number[], idQueryTag = 'ids', filters?: filters): Promise<T[]> {
  const query = ids != null ? `&${idQueryTag}=${ids.join(',')}` : ''
  if (limit < 1) return []
  if (ids?.length === 0) return []

  const querObj: Record<string, string | undefined> = {
    limit: limit.toString(),
    offset: offset.toString(),
    from: filters?.from?.toISOString(),
    to: filters?.to?.toISOString()
  }

  if (filters?.textSearch?.field) {
    querObj[filters.textSearch.field] = filters.textSearch.value
  }

  const queryString = Object.keys(querObj).filter(k => querObj[k] != null).map(key => `${key}=${querObj[key]}`).join('&')

  const requestUrl = `${url}/${collection}?${queryString}${query}`
  const response = await fetch(requestUrl, {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const result = await response.json()
  return result || []
}

export async function post<T> (collection: collections, data: any): Promise<T> {
  const requestUrl = `${url}/${collection}`
  const response = await fetch(requestUrl, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  const result = await response.json()
  return result
}

export async function deleteItem<T> (collection: collections, id?: number): Promise<T> {
  const requestUrl = `${url}/${collection}/${id}`
  const response = await fetch(requestUrl, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const result = await response.json()
  return result
}
