// https://developers.themoviedb.org/3/configuration/get-api-configuration
export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type LogoSize = 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original';
export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';
export type StillSize = 'w92' | 'w185' | 'w300' | 'original';

export type MediaType = 'all' | 'movie' | 'tv' | 'person';
export type TimeWindowType = 'day' | 'week';
export type MediaListType = 'latest' | 'popular' | 'top_rated';

/**
 * Media here means a tv show or a movie
 * Here is just some common fields
 * this could be extended in the future to create more specific interface
 */
export interface IMedia {
  id: number;
  title: string; // title - name - original_title - original_name
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string; // release_date - first-air-date
  voteAverage: number;
  voteCount: number;
  mediaType: 'movie' | 'tv';
  popularity: number;
  originalLanguage: string;
}

export interface IMediaList {
  items: IMedia[];
  page: number;
  total_pages: number;
}

export default class TMDB {
  static readonly api_base_url = 'https://api.themoviedb.org/3/';

  static readonly media_base_url = 'https://image.tmdb.org/t/p/';

  static key = () => process.env.TMDB_API_KEY;

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
}
