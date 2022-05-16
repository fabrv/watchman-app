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

  const queryString = Object.keys(querObj).map(key => `${key}=${querObj[key]}`).join('&')

  const requestUrl = `${url}/${collection}?${queryString}${query}`
  const response = await fetch(requestUrl, {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const result = await response.json()
  return result || []
}
