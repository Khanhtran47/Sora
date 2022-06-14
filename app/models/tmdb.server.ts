/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { IMedia, MediaType, TimeWindowType, TMDB } from './tmdb.types';

interface IFetcherReturnedData<T> {
  data?: T;
  error?: { code: number; message: string };
}

const fetcher = async (url: string): Promise<IFetcherReturnedData<any>> => {
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

export const getTrending = async (
  type: MediaType,
  timeWindow: TimeWindowType,
): Promise<IMedia[]> => {
  const result = await fetcher(TMDB.trendingUrl(type, timeWindow));

  const trendingItems: IMedia[] = [];

  if (result.error) {
    console.error(result.error);
  }

  if (result.data) {
    result.data.results.forEach((item: any) => {
      trendingItems.push({
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
  }

  return trendingItems;
};
