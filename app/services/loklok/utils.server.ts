import { lruCache } from '../lru-cache';

export const LOKLOK_URL = process.env.LOKLOK_API_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetcher = async <T = any>(url: string): Promise<T> => {
  if (lruCache) {
    const cached = lruCache.get<T>(url);

    if (cached) {
      console.info('\x1b[32m%s\x1b[0m', '[cached]', url);
      return cached;
    }
  }

  const res = await fetch(url);

  // throw error here
  if (!res.ok)
    throw new Error(`fetcher (loklok-server): ${url}${JSON.stringify(await res.json())}`);

  const data = await res.json();

  if (lruCache) lruCache.set(url, data);

  return data;
};
