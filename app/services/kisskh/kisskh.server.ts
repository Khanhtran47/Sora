import { lruCache } from '~/services/lru-cache';
import KissKh from './utils.server';
import { ISearchItem, IItemInfo, IEpisodeVideo, IVideoSubtitle } from './kisskh.types';

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

export const getKissKhSearch = async (
  query: string,
  type?: number,
): Promise<ISearchItem[] | undefined> => {
  try {
    const fetched = await fetcher<ISearchItem[]>(KissKh.searchUrl(query, type));
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getKissKhInfo = async (id: number): Promise<IItemInfo | undefined> => {
  try {
    const fetched = await fetcher<IItemInfo>(KissKh.infoUrl(id));
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getKissKhEpisodeStream = async (
  episodeId: number,
): Promise<IEpisodeVideo | undefined> => {
  try {
    const fetched = await fetcher<IEpisodeVideo>(KissKh.episodeUrl(episodeId));
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getKissKhEpisodeSubtitle = async (
  episodeId: number,
): Promise<IVideoSubtitle[] | undefined> => {
  try {
    const fetched = await fetcher<IVideoSubtitle[]>(KissKh.subUrl(episodeId));
    return fetched;
  } catch (error) {
    console.log(error);
  }
};
