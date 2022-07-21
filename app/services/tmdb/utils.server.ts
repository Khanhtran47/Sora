/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BackdropSize,
  IMedia,
  ListMovieType,
  ListTvShowType,
  MediaListType,
  MediaType,
  PosterSize,
  TimeWindowType,
} from './tmdb.types';

interface IFetcherReturnedData<T> {
  data?: T;
  error?: { code: number; message: string };
}

export class TMDB {
  static readonly api_base_url = 'https://api.themoviedb.org/3/';

  static readonly media_base_url = 'https://image.tmdb.org/t/p/';

  private static key = () => process.env.TMDB_API_KEY;

  static mediaListUrl = (
    mediaType: 'tv' | 'movie',
    listType: MediaListType,
    page?: number,
  ): string =>
    `${this.api_base_url}${mediaType}/${listType}?api_key=${this.key()}${
      page ? `&page=${page}` : ''
    }`;

  static trendingUrl = (
    mediaType: MediaType,
    timeWindow: TimeWindowType,
    page?: number,
  ): string => {
    let url = `${this.api_base_url}trending/${mediaType}/${timeWindow}?api_key=${this.key()}`;
    if (page) {
      url += `&page=${page}`;
    }
    return url;
  };

  static posterUrl = (path: string, size?: PosterSize): string => {
    if (size) {
      return `${this.media_base_url}${size}/${path}`;
    }
    return `${this.media_base_url}original/${path}`;
  };

  static backdropUrl = (path: string, size?: BackdropSize): string => {
    if (size) {
      return `${this.media_base_url}${size}/${path}`;
    }
    return `${this.media_base_url}${size}/${path}`;
  };

  static listMoviesUrl = (type: ListMovieType, page?: number): string => {
    let url = `${this.api_base_url}movie/${type}?api_key=${this.key()}`;
    if (page) {
      url += `&page=${page}`;
    }
    return url;
  };

  static movieDetailUrl = (id: number): string =>
    `${this.api_base_url}movie/${id}?api_key=${this.key()}`;

  static listTvShowsUrl = (type: ListTvShowType, page?: number): string => {
    let url = `${this.api_base_url}tv/${type}?api_key=${this.key()}`;
    if (page) {
      url += `&page=${page}`;
    }
    return url;
  };

  static tvShowDetailUrl = (id: number): string =>
    `${this.api_base_url}tv/${id}?api_key=${this.key()}`;

  static videoUrl = (type: 'movie' | 'tv', id: number): string =>
    `${this.api_base_url}${type}/${id}/videos?api_key=${this.key()}`;

  static creditUrl = (type: 'movie' | 'tv', id: number): string =>
    `${this.api_base_url}${type}/${id}/credits?api_key=${this.key()}`;

  static similarUrl = (type: 'movie' | 'tv', id: number): string =>
    `${this.api_base_url}${type}/${id}/similar?api_key=${this.key()}`;
}

export const fetcher = async <T = any>(url: string): Promise<IFetcherReturnedData<T>> => {
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

export const postFetchDataHandler = (data: any, mediaType?: string): IMedia[] => {
  const result: IMedia[] = [];

  const transform = (item: any): IMedia => ({
    id: item.id,
    title: item.title || item.name || item.original_title || item.original_name,
    overview: item.overview,
    posterPath: TMDB.posterUrl(item.poster_path, 'w500'),
    backdropPath: TMDB.backdropUrl(item.backdrop_path, 'original'),
    releaseDate: item.release_date || item.first_air_date,
    voteAverage: item.vote_average,
    voteCount: item.vote_count,
    mediaType: mediaType ?? item.media_type,
    popularity: item.popularity,
    originalLanguage: item.original_language,
  });

  if (Array.isArray(data?.results)) {
    data?.results.forEach((item: any) => result.push(transform(item)));
  } else {
    result.push(transform(data));
  }

  return result;
};
