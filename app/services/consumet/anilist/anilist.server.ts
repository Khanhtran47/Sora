import { META, PROVIDERS_LIST } from '@consumet/extensions';

import { cachified, lruCache } from '~/services/lru-cache';

import type { IAnimeInfo, IAnimeList, IAnimeResult, IEpisodeInfo } from './anilist.types';
import { fetchAnimeEpisodeHandler, fetchAnimeResultsHandler } from './utils.server';

const generateAnilistMeta = (provider?: string) => {
  if (provider) {
    const possibleProvider = PROVIDERS_LIST.ANIME.find(
      (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
    );
    if (!possibleProvider) {
      throw new Error(`Provider ${provider} not found`);
    }
    return new META.Anilist(possibleProvider);
  }
  return new META.Anilist();
};

export const getAnimeSearch = async (
  query: string,
  page?: number,
  perPage?: number,
): Promise<IAnimeList | undefined> => {
  const anilist = generateAnilistMeta();
  const results = await cachified({
    key: `anilist-search-${query}-${page}-${perPage}`,
    ttl: 1000 * 60 * 60,
    staleWhileRevalidate: 1000 * 60 * 60 * 24,
    cache: lruCache,
    request: undefined,
    getFreshValue: async () => {
      try {
        const res = await anilist.search(query, page, perPage);
        return res;
      } catch (error) {
        console.error(error);
        return {
          currentPage: 0,
          hasNextPage: false,
          results: [],
        };
      }
    },
  });
  return {
    currentPage: results?.currentPage || 0,
    hasNextPage: results?.hasNextPage || false,
    results: [...fetchAnimeResultsHandler(results.results as IAnimeResult[])],
    ...(results.totalPages && { totalPages: results.totalPages }),
    ...(results.totalResults && { totalResults: results.totalResults }),
  };
};

export const getAnimeRecentEpisodes = async (
  provider?: 'gogoanime' | 'zoro' | undefined,
  page?: number,
  perPage?: number,
): Promise<IAnimeList | undefined> => {
  const anilist = generateAnilistMeta(provider);
  const results = await cachified({
    key: `anilist-recent-episodes-${page}-${perPage}-${provider}`,
    ttl: 1000 * 60 * 60 * 24,
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
    cache: lruCache,
    request: undefined,
    getFreshValue: async () => {
      try {
        const res = await anilist.fetchRecentEpisodes(provider, page, perPage);
        return res;
      } catch (error) {
        console.error(error);
        return {
          currentPage: 0,
          hasNextPage: false,
          results: [],
        };
      }
    },
  });
  return {
    currentPage: results?.currentPage || 0,
    hasNextPage: results?.hasNextPage || false,
    results: [...fetchAnimeEpisodeHandler(results.results as IAnimeResult[])],
    ...(results.totalPages && { totalPages: results.totalPages }),
    ...(results.totalResults && { totalResults: results.totalResults }),
  };
};

export const getAnimeAdvancedSearch = async (
  query?: string,
  type?: 'ANIME' | 'MANGA',
  page?: number,
  perPage?: number,
  season?: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL',
  format?: 'TV' | 'TV_SHORT' | 'OVA' | 'ONA' | 'MOVIE' | 'SPECIAL' | 'MUSIC',
  sort?: string[],
  genres?: string[],
  id?: string,
  year?: number,
  status?: 'RELEASING' | 'NOT_YET_RELEASED' | 'FINISHED' | 'CANCELLED' | 'HIATUS',
): Promise<IAnimeList | undefined> => {
  console.log('🚀 ~ file: anilist.server.ts:104 ~ sort:', sort);
  const anilist = generateAnilistMeta();
  const results = await cachified({
    key: `anilist-advanced-search-${query}-${type}-${page}-${perPage}-${season}-${format}-${sort}-${genres}-${id}-${year}-${status}`,
    ttl: 1000 * 60 * 60 * 4,
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 2,
    cache: lruCache,
    request: undefined,
    getFreshValue: async () => {
      try {
        const res = await anilist.advancedSearch(
          query,
          type,
          page,
          perPage,
          format,
          sort,
          genres,
          id,
          year,
          status,
          season,
        );
        return res;
      } catch (error) {
        console.error(error);
        return {
          currentPage: 0,
          hasNextPage: false,
          results: [],
        };
      }
    },
  });
  return {
    currentPage: results?.currentPage || 0,
    hasNextPage: results?.hasNextPage || false,
    results: [...fetchAnimeResultsHandler(results.results as IAnimeResult[])],
    ...(results.totalPages && { totalPages: results.totalPages }),
    ...(results.totalResults && { totalResults: results.totalResults }),
  };
};

export const getAnimeRandom = async (): Promise<IAnimeInfo | undefined> => {
  const anilist = generateAnilistMeta();
  try {
    const res = (await anilist.fetchRandomAnime()) as IAnimeInfo;
    return {
      ...res,
      recommendations: [...fetchAnimeResultsHandler(res.recommendations as IAnimeResult[])],
    };
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const getAnimeTrending = async (
  page?: number,
  perPage?: number,
): Promise<IAnimeList | undefined> => {
  const anilist = generateAnilistMeta();
  const results = await cachified({
    key: `anilist-trending-${page}-${perPage}`,
    ttl: 1000 * 60 * 60 * 24,
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
    cache: lruCache,
    request: undefined,
    getFreshValue: async () => {
      try {
        const res = await anilist.fetchTrendingAnime(page, perPage);
        return res;
      } catch (error) {
        console.error(error);
        return {
          currentPage: 0,
          hasNextPage: false,
          results: [],
        };
      }
    },
  });
  return {
    currentPage: results?.currentPage || 0,
    hasNextPage: results?.hasNextPage || false,
    results: [...fetchAnimeResultsHandler(results.results as IAnimeResult[])],
    ...(results.totalPages && { totalPages: results.totalPages }),
    ...(results.totalResults && { totalResults: results.totalResults }),
  };
};

export const getAnimePopular = async (
  page?: number,
  perPage?: number,
): Promise<IAnimeList | undefined> => {
  const anilist = generateAnilistMeta();
  const results = await cachified({
    key: `anilist-popular-${page}-${perPage}`,
    ttl: 1000 * 60 * 60 * 24,
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
    cache: lruCache,
    request: undefined,
    getFreshValue: async () => {
      try {
        const res = await anilist.fetchPopularAnime(page, perPage);
        return res;
      } catch (error) {
        console.error(error);
        return {
          currentPage: 0,
          hasNextPage: false,
          results: [],
        };
      }
    },
  });
  return {
    currentPage: results?.currentPage || 0,
    hasNextPage: results?.hasNextPage || false,
    results: [...fetchAnimeResultsHandler(results.results as IAnimeResult[])],
    ...(results.totalPages && { totalPages: results.totalPages }),
    ...(results.totalResults && { totalResults: results.totalResults }),
  };
};

export const getAnimeGenre = async (
  genres: string[],
  page: number,
  perPage: number,
): Promise<IAnimeList | undefined> => {
  const anilist = generateAnilistMeta();
  const results = await cachified({
    key: `anilist-genre-${genres}-${page}-${perPage}`,
    ttl: 1000 * 60 * 60 * 24,
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
    cache: lruCache,
    request: undefined,
    getFreshValue: async () => {
      try {
        const res = await anilist.fetchAnimeGenres(genres, page, perPage);
        return res;
      } catch (error) {
        console.error(error);
        return {
          currentPage: 0,
          hasNextPage: false,
          results: [],
        };
      }
    },
  });
  return {
    currentPage: results?.currentPage || 0,
    hasNextPage: results?.hasNextPage || false,
    results: [...fetchAnimeResultsHandler(results.results as IAnimeResult[])],
    ...(results.totalPages && { totalPages: results.totalPages }),
    ...(results.totalResults && { totalResults: results.totalResults }),
  };
};

export const getAnimeAiringSchedule = async (
  page?: number,
  perPage?: number,
  weekStart?: number | string,
  weekEnd?: number | string,
  notYetAired?: boolean,
): Promise<IAnimeList | undefined> => {
  const anilist = generateAnilistMeta();
  const results = await cachified({
    key: `anilist-airing-schedule-${page}-${perPage}-${weekStart}-${weekEnd}-${notYetAired}`,
    ttl: 1000 * 60 * 60 * 24,
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
    cache: lruCache,
    request: undefined,
    getFreshValue: async () => {
      try {
        const res = await anilist.fetchAiringSchedule(
          page,
          perPage,
          weekStart,
          weekEnd,
          notYetAired,
        );
        return res;
      } catch (error) {
        console.error(error);
        return {
          currentPage: 0,
          hasNextPage: false,
          results: [],
        };
      }
    },
  });
  return {
    currentPage: results?.currentPage || 0,
    hasNextPage: results?.hasNextPage || false,
    results: [...fetchAnimeResultsHandler(results.results as IAnimeResult[])],
    ...(results.totalPages && { totalPages: results.totalPages }),
    ...(results.totalResults && { totalResults: results.totalResults }),
  };
};

export const getAnimeInfo = async (id: string): Promise<IAnimeInfo | undefined> => {
  const anilist = generateAnilistMeta();
  const results = await cachified({
    key: `anilist-info-${id}`,
    ttl: 1000 * 60 * 60 * 24,
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
    cache: lruCache,
    request: undefined,
    getFreshValue: async () => {
      try {
        const res = (await anilist.fetchAnilistInfoById(id)) as IAnimeInfo;
        return {
          ...res,
          recommendations: [...fetchAnimeResultsHandler(res.recommendations as IAnimeResult[])],
        };
      } catch (error) {
        console.error(error);
        return undefined;
      }
    },
  });
  return results;
};

export const getAnimeEpisodeInfo = async (
  id: string,
  dub?: boolean,
  provider?: string,
  fetchFiller?: boolean,
): Promise<IEpisodeInfo[] | undefined> => {
  const anilist = generateAnilistMeta(provider);
  const results = await cachified({
    key: `anilist-episode-${id}-${dub}-${provider}-${fetchFiller}`,
    ttl: 1000 * 60 * 60 * 4,
    staleWhileRevalidate: 1000 * 60 * 60 * 24,
    cache: lruCache,
    request: undefined,
    getFreshValue: async () => {
      try {
        const res = await anilist.fetchEpisodesListById(id, dub, fetchFiller);
        return res;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  });
  return results;
};

export const getAnimeEpisodeStream = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  episodeId: any,
  provider?: string,
  server?: string,
) => {
  const anilist = generateAnilistMeta(provider);
  const results = await cachified({
    key: `anilist-episode-stream-${episodeId}-${provider}-${server}`,
    ttl: 1000 * 60 * 60,
    staleWhileRevalidate: 1000 * 60 * 60 * 3,
    cache: lruCache,
    request: undefined,
    getFreshValue: async () => {
      try {
        const res = await anilist.fetchEpisodeSources(episodeId, server);
        return res;
      } catch (error) {
        console.error(error);
        return undefined;
      }
    },
  });
  return results;
};
