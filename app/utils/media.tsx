/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-bitwise */
import { IMedia } from '~/services/tmdb/tmdb.types';

export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type LogoSize = 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original';
export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';
export type StillSize = 'w92' | 'w185' | 'w300' | 'original';

/* TMDB is a class that has two static methods, posterUrl and backdropUrl, that return a string. */
export default class TMDB {
  static readonly media_base_url = 'https://image.tmdb.org/t/p/';

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
    return `${this.media_base_url}original/${path}`;
  };

  static profileUrl = (path: string, size?: ProfileSize): string => {
    if (size) {
      return `${this.media_base_url}${size}/${path}`;
    }
    return `${this.media_base_url}original/${path}`;
  };

  static logoUrl = (path: string, size?: LogoSize): string => {
    if (size) {
      return `${this.media_base_url}${size}/${path}`;
    }
    return `${this.media_base_url}original/${path}`;
  };

  static postFetchDataHandler = (data: any): IMedia[] => {
    console.log('🚀 ~ file: media.tsx ~ line 45 ~ TMDB ~ data', data);
    const result: IMedia[] = [];

    const transform = (item: any, mediaType?: 'movie' | 'tv'): IMedia => ({
      id: item.id,
      title: item.title || item.name,
      overview: item.overview,
      posterPath: TMDB.posterUrl(item.poster_path, 'w342'),
      backdropPath: TMDB.backdropUrl(item.backdrop_path, 'w780'),
      releaseDate: item.release_date || item.first_air_date,
      voteAverage: item.vote_average,
      voteCount: item.vote_count,
      mediaType: mediaType ?? item.media_type,
      popularity: item.popularity,
      originalLanguage: item.original_language,
      genreIds: item.genre_ids,
      originalTitle: item.original_title || item.original_name,
    });

    if (Array.isArray(data)) {
      data.forEach((item: any) => result.push(transform(item, item.media_type)));
    } else {
      result.push(transform(data));
    }

    return result;
  };
}
