import { lruCache } from '~/services/lru-cache';
import Flixhq from './utils.server';
import { IMovieSearch, IMovieInfo, IMovieEpisodeStreamLink } from './flixhq.types';

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

export const getMovieSearch = async (
  query: string,
  page?: number,
): Promise<IMovieSearch | undefined> => {
  try {
    const fetched = await fetcher<IMovieSearch>(Flixhq.movieSearchUrl(query, page));
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getMovieInfo = async (id: string): Promise<IMovieInfo | undefined> => {
  try {
    const fetched = await fetcher<IMovieInfo>(Flixhq.movieInfoUrl(id));
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getMovieEpisodeStreamLink = async (
  episodeId: string,
  mediaId: string,
  server?: string,
): Promise<IMovieEpisodeStreamLink | undefined> => {
  try {
    const fetched = await fetcher<IMovieEpisodeStreamLink>(
      Flixhq.movieEpisodeStreamUrl(episodeId, mediaId, server),
    );
    return fetched;
  } catch (error) {
    console.log(error);
  }
};
