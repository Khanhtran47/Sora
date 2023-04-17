import { fetcher, lruCache } from '../lru-cache';
import type { ILoklokMediaInfo, ILoklokSearchData } from './loklok.type';
import { LOKLOK_URL } from './utils.server';

/**
 * Get movie info by id
 * @param id loklok id
 * @returns object { data: some movie info, sources: media sources, subtitles}
 */
export const loklokGetMovieInfo = async (id: string) => {
  try {
    const info = await fetcher<ILoklokMediaInfo>({
      url: `${LOKLOK_URL}/movie/detail?id=${id}`,
      key: `loklok-movie-info-${id}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });

    if (info && info.data) return info;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Search movie info by name
 * @param title movie's title
 * @param orgTitle movie's another title
 * @param year release year
 * @returns array [{ movie info }]
 */
export const loklokSearchMovie = async (title: string, orgTitle: string, year: number) => {
  try {
    const res = await fetcher<{ data: ILoklokSearchData }>({
      url: `${LOKLOK_URL}/search/one?title=${title}&orgTitle=${orgTitle}&year=${year}&season=`,
      key: `loklok-search-one-movie-${title}-${orgTitle}-${year}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });

    if (res && res.data) return res;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Search movie info by name
 * @param title movie's title
 * @param orgTitle movie's another title
 * @param year release year
 * @returns object { data: some movie info, sources: media sources, subtitles}
 */
export const loklokSearchMovieInfo = async (title: string, orgTitle: string, year: number) => {
  try {
    const res = await fetcher<{ data: ILoklokSearchData }>({
      url: `${LOKLOK_URL}/search/one?title=${title}&orgTitle=${orgTitle}&year=${year}&season=`,
      key: `loklok-search-one-movie-${title}-${orgTitle}-${year}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });

    if (!res || !res.data) return;

    const info = await fetcher<ILoklokMediaInfo>({
      url: `${LOKLOK_URL}/movie/detail?id=${res.data.id}`,
      key: `loklok-movie-info-${res.data.id}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });

    if (info && info.data) return info;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Get movie subtitles by id
 * @param id movie's title
 * @returns array of { url: string, lang: string }
 */
export const loklokGetMovieSub = async (id: string) => {
  try {
    const info = await fetcher<ILoklokMediaInfo>({
      url: `${LOKLOK_URL}/movie/detail?id=${id}`,
      key: `loklok-movie-info-${id}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });

    if (info && info.data) {
      return info.subtitles.map((sub) => ({
        lang: `${sub.language} (${sub.lang})`,
        url: `${LOKLOK_URL}/subtitle?url=${sub.url}`,
      }));
    }

    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * Search movie subtitles
 * @param title movie's title
 * @param orgTitle movie's another title
 * @param year release year
 * @returns array of { url: string, lang: string}
 */
export const loklokSearchMovieSub = async (title: string, orgTitle: string, year: number) => {
  try {
    const res = await fetcher<{ data: ILoklokSearchData }>({
      url: `${LOKLOK_URL}/search/one?title=${title}&orgTitle=${orgTitle}&year=${year}&season=`,
      key: `loklok-search-one-movie-${title}-${orgTitle}-${year}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });

    if (!res || !res.data) return [];

    const info = await fetcher<ILoklokMediaInfo>({
      url: `${LOKLOK_URL}/movie/detail?id=${res.data.id}`,
      key: `loklok-movie-info-${res.data.id}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });

    if (info && info.data) {
      return info.subtitles.map((sub) => ({
        lang: `${sub.language} (${sub.lang})`,
        url: `${LOKLOK_URL}/subtitle?url=${sub.url}`,
      }));
    }

    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};
