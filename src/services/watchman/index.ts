import { collections } from "../../models/Api";

const url: string = process.env.backendUrl || 'http://localhost:8080/api/v1';

export async function getAll<T>(collection: collections, limit: number = 100, offset: number = 0, ids?: string[] | number[], idQueryTag = 'ids'): Promise<T[]> {
  const query = ids != null ? `&${idQueryTag}=${ids.join(',')}` : '';
  if (limit < 1) return []
  if (ids?.length === 0) return []  
  const requestUrl = `${url}/${collection}?limit=${limit}&offset=${offset}${query}`;
  const response = await fetch(requestUrl);
  return response.json();
}