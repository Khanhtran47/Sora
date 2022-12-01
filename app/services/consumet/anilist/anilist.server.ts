import { lruCache } from '~/services/lru-cache';
import { Anilist, fetchAnimeEpisodeHandler, fetchAnimeResultsHandler } from './utils.server';
import {
  IAnimeList,
  IAnimeInfo,
  IAnimeEpisodeStream,
  IEpisodeInfo,
  IAnimeResult,
} from './anilist.types';

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

const getListFromAnilist = async (url: string, type: 'result' | 'episode'): Promise<IAnimeList> => {
  try {
    const fetched = await fetcher(url);
    return {
      currentPage: fetched.currentPage,
      hasNextPage: fetched.hasNextPage,
      results:
        type === 'result'
          ? [...fetchAnimeResultsHandler(fetched.results)]
          : [...fetchAnimeEpisodeHandler(fetched.results)],
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
    const fetched = await fetcher<IAnimeInfo>(Anilist.animeRandomUrl());
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
    const fetched = await fetcher<IAnimeInfo>(Anilist.animeInfoUrl(id, dub, provider));
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
    const fetched = await fetcher<IEpisodeInfo[]>(Anilist.animeEpisodeUrl(id, dub, provider));
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
    const fetched = await fetcher<IAnimeEpisodeStream>(
      Anilist.animeEpisodeStreamUrl(episodeId, provider),
    );
    return fetched;
  } catch (error) {
    console.log(error);
  }
};
