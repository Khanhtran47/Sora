import type { ILoklokMediaInfo, ILoklokSearchData } from './loklok.type';
import { fetcher, LOKLOK_URL } from './utils.server';

/**
 * It takes a string as an argument, and returns a promise that resolves to an array of objects
 * @param {string} title - The title of the TV show you want to search for.
 * @returns An array of objects.
 */
export const loklokSearchOneTv = async (
  title: string,
  orgTitle: string,
  year: number,
  season?: number,
) => {
  try {
    let url = `${LOKLOK_URL}/search/one?title=${title}&orgTitle=${orgTitle}&year=${year}`;
    if (season) url += `&season=${season}`;
    const res = await fetcher<{ data: ILoklokSearchData }>(url);
    if (res) return res;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Get tv/anime episode info by id
 * @param id loklok id
 * @param episodeIndex 0, 1, 2, 3, ...
 * @returns object { data: some movie info, sources: media sources, subtitles}
 */
export const loklokGetTvEpInfo = async (id: string, episodeIndex = 0) => {
  try {
    const info = await fetcher<ILoklokMediaInfo>(
      `${LOKLOK_URL}/tv/detail?id=${id}&episodeId=${episodeIndex}`,
    );

    if (info && info.data) return info;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Search series by title, release year, bla...
 * @param title series's title
 * @param orgTitle another title
 * @param year release year
 * @param season 1, 2, 3, ...
 * @param episodeIndex 0, 1, 2, 3,...
 * @returns object { data: some movie info, sources: media sources, subtitles}
 */
export const loklokSearchTvEpInfo = async (
  title: string,
  orgTitle: string,
  year: number,
  season = 1,
  episodeIndex = 0,
) => {
  try {
    const res = await fetcher<{ data: ILoklokSearchData }>(
      `${LOKLOK_URL}/search/one?title=${title}&orgTitle=${orgTitle}&year=${year}&season=${season}`,
    );

    if (!res || !res.data) return;

    const info = await fetcher<ILoklokMediaInfo>(
      `${LOKLOK_URL}/tv/detail?id=${res.data.id}&episodeId=${episodeIndex}`,
    );

    if (info && info.data) return info;
  } catch (e) {
    console.error(e);
  }
};

/**
 *
 * @param id loklok id
 * @param episodeIndex 0, 1, 2, 3,...
 * @returns
 */
export const loklokGetTvEpSub = async (id: string, episodeIndex = 0) => {
  try {
    const info = await fetcher<ILoklokMediaInfo>(
      `${LOKLOK_URL}/tv/detail?id=${id}&episodeId=${episodeIndex}`,
    );

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
 * Search series episode subtitles
 * @param title series title
 * @param orgTitle another title
 * @param year release year
 * @param season 1, 2, 3, ...
 * @param episodeIndex 0, 1, 2, ...
 * @returns array of { url: string, lang: string }
 */
export const loklokSearchTvEpSub = async (
  title: string,
  orgTitle: string,
  year: number,
  season = 1,
  episodeIndex = 0,
) => {
  try {
    const res = await fetcher<{ data: ILoklokSearchData }>(
      `${LOKLOK_URL}/search/one?title=${title}&orgTitle=${orgTitle}&year=${year}&season=${season}`,
    );

    if (!res || !res.data) return [];

    const info = await fetcher<ILoklokMediaInfo>(
      `${LOKLOK_URL}/tv/detail?id=${res.data.id}&episodeId=${episodeIndex}`,
    );

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
