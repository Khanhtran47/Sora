import { lruCache, fetcher } from '~/services/lru-cache';
import Flixhq from './utils.server';
import { IMovieSearch, IMovieInfo, IMovieEpisodeStreamLink } from './flixhq.types';

export const getMovieSearch = async (
  query: string,
  page?: number,
): Promise<IMovieSearch | undefined> => {
  try {
    const fetched = await fetcher<IMovieSearch>({
      url: Flixhq.movieSearchUrl(query, page),
      key: `flixhq-search-${query}-${page}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getMovieInfo = async (id: string): Promise<IMovieInfo | undefined> => {
  try {
    const fetched = await fetcher<IMovieInfo>({
      url: Flixhq.movieInfoUrl(id),
      key: `flixhq-info-${id}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
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
    const fetched = await fetcher<IMovieEpisodeStreamLink>({
      url: Flixhq.movieEpisodeStreamUrl(episodeId, mediaId, server),
      key: `flixhq-episode-${episodeId}-${mediaId}-${server}`,
      ttl: 1000 * 60 * 60,
      staleWhileRevalidate: 1000 * 60 * 60 * 24,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};
