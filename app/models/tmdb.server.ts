/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { IMedia, MediaType, TimeWindowType, TMDB } from './tmdb.types';

interface IFetcherReturnedData<T> {
  data?: T;
  error?: { code: number; message: string };
}

interface IMediaList {
  items: IMedia[];
  page: number;
  totalPages: number;
}

export const fetcher = async (url: string): Promise<IFetcherReturnedData<any>> => {
  const res = await fetch(url);
  if (res.ok) {
    return {
      data: await res.json(),
    };
  }

  return {
    error: {
      code: res.status,
      message: (await res.json())?.status_message || 'Some thing went wrong',
    },
  };
};

const postFetchDataHandler = (data: any): IMedia[] => {
  const result: IMedia[] = [];
  data?.results.forEach((item: any) => {
    result.push({
      id: item.id,
      title: item.title || item.name || item.original_title || item.original_name,
      overview: item.overview,
      posterPath: TMDB.posterUrl(item.poster_path, 'w500'),
      backdropPath: TMDB.backdropUrl(item.backdrop_path),
      releaseDate: item.release_date || item.first_air_date,
      voteAverage: item.vote_average,
      voteCount: item.vote_count,
      mediaType: item.media_type,
      popularity: item.popularity,
      originalLanguage: item.original_language,
    });
  });
  return result;
};

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
