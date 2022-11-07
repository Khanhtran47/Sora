import { lruCache } from '~/services/lru-cache';
import Bilibili from './utils.server';
import { IBilibiliSearch, IBilibiliInfo, IBilibiliEpisode } from './bilibili.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetcher = async <T = any>(url: string): Promise<T> => {
  if (lruCache) {
    const cached = lruCache.get<T>(url);
    if (cached) {
      console.info('\x1b[32m%s\x1b[0m', '[cached]', url);
      return cached;
    }
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(JSON.stringify(await res.json()));
  const data = await res.json();

  if (lruCache) lruCache.set(url, data);

  return data;
};

export const getBilibiliSearch = async (query: string): Promise<IBilibiliSearch | undefined> => {
  try {
    const fetched = await fetcher<IBilibiliSearch>(Bilibili.animeSearchUrl(query));
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getBilibiliInfo = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: number,
): Promise<IBilibiliInfo | undefined> => {
  try {
    const fetched = await fetcher<IBilibiliInfo>(Bilibili.animeInfoUrl(id));
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getBilibiliEpisode = async (
  episodeId: number,
): Promise<IBilibiliEpisode | undefined> => {
  try {
    const fetched = await fetcher<IBilibiliEpisode>(Bilibili.animeEpisodeUrl(episodeId));
    return fetched;
  } catch (error) {
    console.log(error);
  }
};
