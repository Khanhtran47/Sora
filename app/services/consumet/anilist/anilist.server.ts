import { fetcher, lruCache } from '~/services/lru-cache';
import { Anilist, fetchAnimeEpisodeHandler, fetchAnimeResultsHandler } from './utils.server';
import {
  IAnimeList,
  IAnimeInfo,
  IAnimeEpisodeStream,
  IEpisodeInfo,
  IAnimeResult,
} from './anilist.types';

const getListFromAnilist = async (url: string, type: 'result' | 'episode'): Promise<IAnimeList> => {
  try {
    const fetched = await fetcher<IAnimeList>({
      url,
      key: `anilist-list-${url}-${type}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    return {
      currentPage: fetched.currentPage,
      hasNextPage: fetched.hasNextPage,
      results:
        type === 'result'
          ? [...fetchAnimeResultsHandler(fetched.results as IAnimeResult[])]
          : [...fetchAnimeEpisodeHandler(fetched.results as IAnimeResult[])],
      ...(fetched.totalPages && { totalPages: fetched.totalPages }),
      ...(fetched.totalResults && { totalResults: fetched.totalResults }),
    } as IAnimeList;
  } catch (error) {
    console.error(error);
    return { currentPage: 0, hasNextPage: false, results: [] };
  }
};

export const getAnimeSearch = async (
  query: string,
  page?: number,
  perPage?: number,
): Promise<IAnimeList | undefined> => {
  const url = Anilist.animeSearchUrl(query, page, perPage);
  return getListFromAnilist(url, 'result');
};

export const getAnimeRecentEpisodes = async (
  provider?: string | undefined,
  page?: number,
  perPage?: number,
): Promise<IAnimeList | undefined> => {
  const url = Anilist.animeRecentEpisodesUrl(provider, page, perPage);
  return getListFromAnilist(url, 'episode');
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
  const url = Anilist.animeAdvancedSearchUrl(
    query,
    type,
    page,
    perPage,
    season,
    format,
    sort,
    genres,
    id,
    year,
    status,
  );
  return getListFromAnilist(url, 'result');
};

export const getAnimeRandom = async (): Promise<IAnimeInfo | undefined> => {
  try {
    const fetched = await fetcher<IAnimeInfo>({
      url: Anilist.animeRandomUrl(),
      key: `anilist-random-${Anilist.animeRandomUrl()}`,
      forceFresh: true,
      ttl: 1000 * 60,
      staleWhileRevalidate: 1000 * 60 * 60 * 24,
      cache: lruCache,
      fallbackToCache: true,
    });
    return {
      ...fetched,
      recommendations: [...fetchAnimeResultsHandler(fetched.recommendations as IAnimeResult[])],
    };
  } catch (error) {
    console.log(error);
  }
};

export const getAnimeTrending = async (
  page?: number,
  perPage?: number,
): Promise<IAnimeList | undefined> => {
  const url = Anilist.animeTrendingUrl(page, perPage);
  return getListFromAnilist(url, 'result');
};

export const getAnimePopular = async (
  page?: number,
  perPage?: number,
): Promise<IAnimeList | undefined> => {
  const url = Anilist.animePopularUrl(page, perPage);
  return getListFromAnilist(url, 'result');
};

export const getAnimeGenre = async (genres: string[]): Promise<IAnimeList | undefined> => {
  const url = Anilist.animeGenreUrl(genres);
  return getListFromAnilist(url, 'result');
};

export const getAnimeAiringSchedule = async (
  page?: number,
  perPage?: number,
  weekStart?: number | string,
  weekEnd?: number | string,
  notYetAired?: boolean,
): Promise<IAnimeList | undefined> => {
  const url = Anilist.animeAiringSchedule(page, perPage, weekStart, weekEnd, notYetAired);
  return getListFromAnilist(url, 'result');
};

export const getAnimeInfo = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any,
  dub?: boolean,
  provider?: string,
): Promise<IAnimeInfo | undefined> => {
  try {
    const fetched = await fetcher<IAnimeInfo>({
      url: Anilist.animeInfoUrl(id, dub, provider),
      key: `anilist-info-${Anilist.animeInfoUrl(id, dub, provider)}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    return {
      ...fetched,
      recommendations: [...fetchAnimeResultsHandler(fetched.recommendations as IAnimeResult[])],
    };
  } catch (error) {
    console.log(error);
  }
};

export const getAnimeEpisodeInfo = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any,
  dub?: boolean,
  provider?: string,
): Promise<IEpisodeInfo[] | undefined> => {
  try {
    const fetched = await fetcher<IEpisodeInfo[]>({
      url: Anilist.animeEpisodeUrl(id, dub, provider),
      key: `anilist-episode-${Anilist.animeEpisodeUrl(id, dub, provider)}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getAnimeEpisodeStream = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  episodeId: any,
  provider?: string,
): Promise<IAnimeEpisodeStream | undefined> => {
  try {
    const fetched = await fetcher<IAnimeEpisodeStream>({
      url: Anilist.animeEpisodeStreamUrl(episodeId, provider),
      key: `anilist-episode-stream-${Anilist.animeEpisodeStreamUrl(episodeId, provider)}`,
      ttl: 1000 * 60 * 60,
      staleWhileRevalidate: 1000 * 60 * 60 * 24,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};
