import { lruCache } from '../lru-cache';

export const LOKLOK_URL = 'https://loklok.vercel.app/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetcher = async <T = any>(url: string): Promise<T> => {
  const cached = lruCache.get<T>(url);

  if (cached) return cached;

  const res = await fetch(url);

  // throw error here
  if (!res.ok)
    throw new Error(`fetcher (loklok-server): ${url}${JSON.stringify(await res.json())}`);

  const data = await res.json();

  lruCache.set(url, data);

  return data;
};
