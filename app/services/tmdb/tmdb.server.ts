/* eslint-disable import/prefer-default-export */
import { ICredit, IMediaList, IVideos, MediaType, TimeWindowType } from './tmdb.types';
import { fetcher, postFetchDataHandler, TMDB } from './utils.server';

export const getTrending = async (
  mediaType: MediaType,
  timeWindow: TimeWindowType,
  page?: number,
): Promise<IMediaList> => {
  const fetched = await fetcher(TMDB.trendingUrl(mediaType, timeWindow, page));
  const result: IMediaList = {
    page: 0,
    totalPages: 0,
    items: [],
  };

  if (fetched.error) {
    console.error(fetched.error);
  }

  if (fetched.data) {
    result.page = fetched.data.page;
    result.totalPages = fetched.data.total_pages;
    result.items.push(...postFetchDataHandler(fetched.data));
  }

  return result;
};

export const getVideos = async (type: 'movie' | 'tv', id: number): Promise<IVideos | null> => {
  const fetched = await fetcher<IVideos>(TMDB.videoUrl(type, id));

  if (fetched.error) {
    console.error(fetched.error);
  }

  if (fetched.data) {
    return fetched.data;
  }

  return null;
};

export const getCredits = async (type: 'movie' | 'tv', id: number): Promise<ICredit | null> => {
  const fetched = await fetcher<ICredit>(TMDB.creditUrl(type, id));
  if (fetched.error) {
    console.error(fetched.error);
  }
  if (fetched.data) return fetched.data;
  return null;
};

export const getSimilar = async (type: 'movie' | 'tv', id: number): Promise<IMediaList> => {
  const fetched = await fetcher(TMDB.similarUrl(type, id));
  if (fetched.error) {
    console.error(fetched.error);
  }

  const result: IMediaList = {
    page: 0,
    totalPages: 0,
    items: [],
  };

  if (fetched.data) {
    result.page = fetched.data.page;
    result.totalPages = fetched.data.total_pages;
    result.items.push(...postFetchDataHandler(fetched.data));
  }
  return result;
};
