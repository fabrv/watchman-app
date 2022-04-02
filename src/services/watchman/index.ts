import { collections } from '../../models/Api'

const url: string = process.env.backendUrl || 'http://localhost:8080/api/v1'

export async function getAll<T> (collection: collections, limit: number = 100, offset: number = 0, ids?: string[] | number[], idQueryTag = 'ids', from?: Date, to?:Date): Promise<T[]> {
  const query = ids != null ? `&${idQueryTag}=${ids.join(',')}` : ''
  if (limit < 1) return []
  if (ids?.length === 0) return []

  const querObj: Record<string, string | undefined> = {
    limit: limit.toString(),
    offset: offset.toString(),
    from: from?.toISOString(),
    to: to?.toISOString()
  }
  const queryString = Object.keys(querObj).map(key => `${key}=${querObj[key]}`).join('&')

  const requestUrl = `${url}/${collection}?${queryString}${query}`
  const response = await fetch(requestUrl)

  const result = await response.json()

  return result || []
}
