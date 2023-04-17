import { fetcher, lruCache } from '~/services/lru-cache';

import type { IEpisodeVideo, IItemInfo, ISearchItem, IVideoSubtitle } from './kisskh.types';
import KissKh from './utils.server';

export const getKissKhSearch = async (
  query: string,
  type?: number,
): Promise<ISearchItem[] | undefined> => {
  try {
    const fetched = await fetcher<ISearchItem[]>({
      url: KissKh.searchUrl(query, type),
      key: `kisskh-search-${query}-${type}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getKissKhInfo = async (id: number): Promise<IItemInfo | undefined> => {
  try {
    const fetched = await fetcher<IItemInfo>({
      url: KissKh.infoUrl(id),
      key: `kisskh-info-${id}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getKissKhEpisodeStream = async (
  episodeId: number,
): Promise<IEpisodeVideo | undefined> => {
  try {
    const fetched = await fetcher<IEpisodeVideo>({
      url: KissKh.episodeUrl(episodeId),
      key: `kisskh-episode-${episodeId}`,
      ttl: 1000 * 60 * 60,
      staleWhileRevalidate: 1000 * 60 * 60 * 24,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getKissKhEpisodeSubtitle = async (
  episodeId: number,
): Promise<IVideoSubtitle[] | undefined> => {
  try {
    const fetched = await fetcher<IVideoSubtitle[]>({
      url: KissKh.subUrl(episodeId),
      key: `kisskh-subtitle-${episodeId}`,
      ttl: 1000 * 60 * 60,
      staleWhileRevalidate: 1000 * 60 * 60 * 24,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};
