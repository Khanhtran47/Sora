import { lruCache } from '~/services/lru-cache';
import Anilist from './utils.server';
import {
  IAnimeSearch,
  IAnimeList,
  IAnimeAdvancedSearch,
  IAnimeInfo,
  IAnimeAiringSchedule,
  IAnimeEpisodeStream,
  IAnimeGenre,
  IRecentAnimeEpisodes,
  IEpisodeInfo,
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

export const getAnimeSearch = async (
  query: string,
  page?: number,
  perPage?: number,
): Promise<IAnimeSearch | undefined> => {
  try {
    const fetched = await fetcher<IAnimeSearch>(Anilist.animeSearchUrl(query, page, perPage));
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getAnimeRecentEpisodes = async (
  provider?: string | undefined,
  page?: number,
  perPage?: number,
): Promise<IRecentAnimeEpisodes | undefined> => {
  try {
    const fetched = await fetcher<IRecentAnimeEpisodes>(
      Anilist.animeRecentEpisodesUrl(provider, page, perPage),
    );
    return fetched;
  } catch (error) {
    console.error(error);
  }
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
): Promise<IAnimeAdvancedSearch | undefined> => {
  try {
    const fetched = await fetcher<IAnimeAdvancedSearch>(
      Anilist.animeAdvancedSearchUrl(
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
      ),
    );
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getAnimeRandom = async (): Promise<IAnimeInfo | undefined> => {
  try {
    const fetched = await fetcher<IAnimeInfo>(Anilist.animeRandomUrl());
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getAnimeTrending = async (
  page?: number,
  perPage?: number,
): Promise<IAnimeList | undefined> => {
  try {
    const fetched = await fetcher<IAnimeList>(Anilist.animeTrendingUrl(page, perPage));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getAnimePopular = async (
  page?: number,
  perPage?: number,
): Promise<IAnimeList | undefined> => {
  try {
    const fetched = await fetcher<IAnimeList>(Anilist.animePopularUrl(page, perPage));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getAnimeGenre = async (genres: string[]): Promise<IAnimeGenre | undefined> => {
  try {
    const fetched = await fetcher<IAnimeGenre>(Anilist.animeGenreUrl(genres));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getAnimeAiringSchedule = async (
  page?: number,
  perPage?: number,
  weekStart?: number | string,
  weekEnd?: number | string,
  notYetAired?: boolean,
): Promise<IAnimeAiringSchedule | undefined> => {
  try {
    const fetched = await fetcher<IAnimeAiringSchedule>(
      Anilist.animeAiringSchedule(page, perPage, weekStart, weekEnd, notYetAired),
    );
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getAnimeInfo = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any,
  dub?: boolean,
  provider?: string,
): Promise<IAnimeInfo | undefined> => {
  try {
    const fetched = await fetcher<IAnimeInfo>(Anilist.animeInfoUrl(id, dub, provider));
    return fetched;
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
