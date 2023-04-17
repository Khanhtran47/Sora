import { fetcher, lruCache } from '~/services/lru-cache';

import type { IBilibiliEpisode, IBilibiliInfo, IBilibiliSearch } from './bilibili.types';
import Bilibili from './utils.server';

export const getBilibiliSearch = async (query: string): Promise<IBilibiliSearch | undefined> => {
  try {
    const fetched = await fetcher<IBilibiliSearch>({
      url: Bilibili.animeSearchUrl(query),
      key: `bilibili-search-${query}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
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
    const fetched = await fetcher<IBilibiliInfo>({
      url: Bilibili.animeInfoUrl(id),
      key: `bilibili-info-${id}`,
      ttl: 1000 * 60 * 60 * 24 * 7,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 30,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getBilibiliEpisode = async (
  episodeId: number,
): Promise<IBilibiliEpisode | undefined> => {
  try {
    const fetched = await fetcher<IBilibiliEpisode>({
      url: Bilibili.animeEpisodeUrl(episodeId),
      key: `bilibili-episode-${episodeId}`,
      ttl: 1000 * 60 * 60,
      staleWhileRevalidate: 1000 * 60 * 60 * 24,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};
