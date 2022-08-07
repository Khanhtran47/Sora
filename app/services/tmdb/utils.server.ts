/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BackdropSize,
  IMedia,
  ListMovieType,
  ListTvShowType,
  MediaType,
  PosterSize,
  TimeWindowType,
  ListPersonType,
} from './tmdb.types';

export class TMDB {
  static readonly API_BASE_URL = 'https://api.themoviedb.org/3/';

  static readonly MEDIA_BASE_URL = 'https://image.tmdb.org/t/p/';

  static readonly key = process.env.TMDB_API_KEY;

  static trendingUrl = (
    mediaType: MediaType,
    timeWindow: TimeWindowType,
    page?: number,
  ): string => {
    let url = `${this.API_BASE_URL}trending/${mediaType}/${timeWindow}?api_key=${this.key}`;
    if (page) {
      url += `&page=${page}`;
    }
    return url;
  };

  static posterUrl = (path: string, size?: PosterSize): string => {
    if (size) {
      return `${this.MEDIA_BASE_URL}${size}/${path}`;
    }
    return `${this.MEDIA_BASE_URL}original/${path}`;
  };

  static backdropUrl = (path: string, size?: BackdropSize): string => {
    if (size) {
      return `${this.MEDIA_BASE_URL}${size}/${path}`;
    }
    return `${this.MEDIA_BASE_URL}${size}/${path}`;
  };

  static listMoviesUrl = (
    type: ListMovieType,
    page?: number,
    language?: string,
    region?: string,
  ): string => {
    let url = `${this.API_BASE_URL}movie/${type}?api_key=${this.key}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (language) {
      url += `&language=${language}`;
    }
    if (region) {
      url += `&region=${region}`;
    }
    return url;
  };

  static movieDetailUrl = (id: number, language?: string): string => {
    let url = `${this.API_BASE_URL}movie/${id}?api_key=${this.key}`;
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };

  static listTvShowsUrl = (type: ListTvShowType, page?: number, language?: string): string => {
    let url = `${this.API_BASE_URL}tv/${type}?api_key=${this.key}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };

  static tvShowDetailUrl = (id: number, language?: string): string => {
    let url = `${this.API_BASE_URL}tv/${id}?api_key=${this.key}`;
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };

  static videoUrl = (type: 'movie' | 'tv', id: number, language?: string): string => {
    let url = `${this.API_BASE_URL}${type}/${id}/videos?api_key=${this.key}`;
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };

  static creditUrl = (type: 'movie' | 'tv', id: number, language?: string): string => {
    let url = `${this.API_BASE_URL}${type}/${id}/credits?api_key=${this.key}`;
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };

  static similarUrl = (
    type: 'movie' | 'tv',
    id: number,
    page?: number,
    language?: string,
  ): string => {
    let url = `${this.API_BASE_URL}${type}/${id}/similar?api_key=${this.key}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };

  static tvExternalIds = (id: number, language?: string): string => {
    let url = `${this.API_BASE_URL}tv/${id}/external_ids?api_key=${this.key}`;
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };

  static listGenre = (type: 'movie' | 'tv', language?: string): string => {
    let url = `${this.API_BASE_URL}genre/${type}/list?api_key=${this.key}`;
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };

  static searchKeyword = (keyword: string, page?: number): string => {
    let url = `${this.API_BASE_URL}search/${keyword}?api_key=${this.key}`;
    if (page) {
      url += `&page=${page}`;
    }
    return url;
  };

  static searchMovies = (
    keyword: string,
    language?: string,
    page?: number,
    include_adult?: boolean,
    region?: string,
    year?: number,
    primary_release_year?: number,
  ): string => {
    let url = `${this.API_BASE_URL}search/movie?api_key=${this.key}&query=${keyword}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (language) {
      url += `&language=${language}`;
    }
    if (include_adult) {
      url += `&include_adult=${include_adult}`;
    }
    if (region) {
      url += `&region=${region}`;
    }
    if (year) {
      url += `&year=${year}`;
    }
    if (primary_release_year) {
      url += `&primary_release_year=${primary_release_year}`;
    }
    return url;
  };

  static searchTv = (
    keyword: string,
    language?: string,
    page?: number,
    include_adult?: boolean,
    first_air_date_year?: number,
  ): string => {
    let url = `${this.API_BASE_URL}search/tv?api_key=${this.key}&query=${keyword}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (language) {
      url += `&language=${language}`;
    }
    if (include_adult) {
      url += `&include_adult=${include_adult}`;
    }
    if (first_air_date_year) {
      url += `&first_air_date_year=${first_air_date_year}`;
    }
    return url;
  };

  static searchPerson = (
    keyword: string,
    page?: number,
    include_adult?: boolean,
    language?: string,
    region?: string,
  ): string => {
    let url = `${this.API_BASE_URL}search/person?api_key=${this.key}&query=${keyword}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (include_adult) {
      url += `&include_adult=${include_adult}`;
    }
    if (language) {
      url += `&language=${language}`;
    }
    if (region) {
      url += `&region=${region}`;
    }
    return url;
  };

  static listPerson = (type: ListPersonType, language?: string, page?: number): string => {
    let url = `${this.API_BASE_URL}person/${type}?api_key=${this.key}`;
    if (page) {
      url += `&page=${page}`;
    }
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };

  static personDetail = (person_id: number, language?: string): string => {
    let url = `${this.API_BASE_URL}person/${person_id}?api_key=${this.key}`;
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };
}

export const fetcher = async <T = any>(url: string): Promise<T> => {
  const res = await fetch(url);
  // throw error here
  if (!res.ok) throw new Error(JSON.stringify(await res.json()));

  return res.json();
};

export const postFetchDataHandler = (data: any, mediaType?: 'movie' | 'tv'): IMedia[] => {
  const result: IMedia[] = [];

  const transform = (item: any): IMedia =>
    mediaType
      ? {
          id: item.id,
          title: mediaType === 'movie' ? item.title : item.name,
          overview: item.overview,
          posterPath: TMDB.posterUrl(item.poster_path, 'w500'),
          backdropPath: TMDB.backdropUrl(item.backdrop_path, 'original'),
          releaseDate: item.release_date || item.first_air_date,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
          mediaType: mediaType ?? item.media_type,
          popularity: item.popularity,
          originalLanguage: item.original_language,
          genreIds: item.genre_ids,
          ...(mediaType && mediaType === 'movie' && { adult: item.adult }),
          ...(mediaType && mediaType === 'movie' && { video: item.video }),
          ...(mediaType && mediaType === 'tv' && { originalCountry: item.original_country }),
          originalTitle: mediaType === 'movie' ? item.original_title : item.original_name,
        }
      : {
          id: item.id,
          title: item.title || item.name,
          overview: item.overview,
          posterPath: TMDB.posterUrl(item.poster_path, 'w500'),
          backdropPath: TMDB.backdropUrl(item.backdrop_path, 'original'),
          releaseDate: item.release_date || item.first_air_date,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
          mediaType: mediaType ?? item.media_type,
          popularity: item.popularity,
          originalLanguage: item.original_language,
          genreIds: item.genre_ids,
          originalTitle: item.original_title || item.original_name,
        };

  if (Array.isArray(data?.results)) {
    data?.results.forEach((item: any) => result.push(transform(item)));
  } else {
    result.push(transform(data));
  }

  return result;
};
