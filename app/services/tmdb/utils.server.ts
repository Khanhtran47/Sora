import { env } from 'process';

import type { IMedia } from '~/types/media';

import type {
  BackdropSize,
  ListMovieType,
  ListPersonType,
  ListTvShowType,
  MediaType,
  PosterSize,
  ProfileSize,
  TimeWindowType,
} from './tmdb.types';

export class TMDB {
  static readonly API_BASE_URL = 'https://api.themoviedb.org/3/';

  static readonly IMDB_API_BASE_URL = env.IMDB_API_URL;

  static readonly MEDIA_BASE_URL = 'https://image.tmdb.org/t/p/';

  static readonly key = process.env.TMDB_API_KEY;

  static trendingUrl = (
    mediaType: MediaType,
    timeWindow: TimeWindowType,
    language?: string,
    page?: number,
  ): string => {
    let url = `${this.API_BASE_URL}trending/${mediaType}/${timeWindow}?api_key=${this.key}`;

    if (language) url += `&language=${language}`;
    if (page) url += `&page=${page}`;

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

  static profileUrl = (path: string | undefined, size?: ProfileSize): string => {
    if (size) {
      return `${this.MEDIA_BASE_URL}${size}/${path}`;
    }
    return `${this.MEDIA_BASE_URL}original/${path}`;
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

  static movieDetailUrl = (id: number, language?: string): string =>
    `${this.API_BASE_URL}movie/${id}?api_key=${this.key}&language=${language}`;

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

  static imagesUrl = (type: 'movie' | 'tv', id: number, language?: string): string => {
    let url = `${this.API_BASE_URL}${type}/${id}/images?api_key=${this.key}`;
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

  static recommendationUrl = (
    type: 'movie' | 'tv',
    id: number,
    page?: number,
    language?: string,
  ): string => {
    let url = `${this.API_BASE_URL}${type}/${id}/recommendations?api_key=${this.key}`;
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

  static peopleExternalIds = (person_id: number, language?: string): string => {
    let url = `${this.API_BASE_URL}person/${person_id}/external_ids?api_key=${this.key}`;
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };

  static peopleImages = (person_id: number, language?: string): string => {
    let url = `${this.API_BASE_URL}person/${person_id}/images?api_key=${this.key}`;
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };

  static peopleCredits = (
    person_id: number,
    type: 'movie' | 'tv' | 'combined' = 'combined',
    language?: string,
  ): string => {
    let url = `${this.API_BASE_URL}person/${person_id}/${type}_credits?api_key=${this.key}`;
    if (language) {
      url += `&language=${language}`;
    }
    return url;
  };

  static discoverUrl = (
    type: 'movie' | 'tv',
    with_genres?: string,
    sort_by?: string,
    language?: string,
    page?: number,
    releaseDateGte?: string,
    releaseDateLte?: string,
    firstAirDateGte?: string,
    firstAirDateLte?: string,
    withOriginalLanguage?: string,
    voteCountGte?: number,
    voteAverageGte?: number,
    voteAverageLte?: number,
    withCast?: string,
    withCrew?: string,
    withPeople?: string,
    withCompanies?: string,
    withNetworks?: string,
    withKeywords?: string,
    withRuntimeGte?: number,
    withRuntimeLte?: number,
    withStatus?: string,
    withType?: string,
    airDateGte?: string,
    airDateLte?: string,
  ) => {
    let url = `${this.API_BASE_URL}discover/${type}?api_key=${this.key}`;

    if (with_genres) url += `&with_genres=${with_genres}`;
    if (sort_by) url += `&sort_by=${sort_by}`;
    if (language) url += `&language=${language}`;
    if (page) url += `&page=${page}`;
    if (withOriginalLanguage) url += `&with_original_language=${withOriginalLanguage}`;
    if (releaseDateGte) url += `&release_date.gte=${releaseDateGte}`;
    if (releaseDateLte) url += `&release_date.lte=${releaseDateLte}`;
    if (firstAirDateGte) url += `&first_air_date.gte=${firstAirDateGte}`;
    if (firstAirDateLte) url += `&first_air_date.lte=${firstAirDateLte}`;
    if (voteCountGte) url += `&vote_count.gte=${voteCountGte}`;
    if (voteAverageGte) url += `&vote_average.gte=${voteAverageGte}`;
    if (voteAverageLte) url += `&vote_average.lte=${voteAverageLte}`;
    if (withCast) url += `&with_cast=${withCast}`;
    if (withCrew) url += `&with_crew=${withCrew}`;
    if (withPeople) url += `&with_people=${withPeople}`;
    if (withCompanies) url += `&with_companies=${withCompanies}`;
    if (withNetworks) url += `&with_networks=${withNetworks}`;
    if (withKeywords) url += `&with_keywords=${withKeywords}`;
    if (withRuntimeGte) url += `&with_runtime.gte=${withRuntimeGte}`;
    if (withRuntimeLte) url += `&with_runtime.lte=${withRuntimeLte}`;
    if (withStatus) url += `&with_status=${withStatus}`;
    if (withType) url += `&with_type=${withType}`;
    if (airDateGte) url += `&air_date.gte=${airDateGte}`;
    if (airDateLte) url += `&air_date.lte=${airDateLte}`;
    return url;
  };

  static translationsUrl = (type: 'movie' | 'tv', id: number) =>
    `${this.API_BASE_URL}${type}/${id}/translations?api_key=${this.key}`;

  static languagesUrl = () => `${this.API_BASE_URL}configuration/languages?api_key=${this.key}`;

  static tvSeasonDetailUrl = (tv_id: number, season_number: number, language?: string) => {
    let url = `${this.API_BASE_URL}tv/${tv_id}/season/${season_number}?api_key=${this.key}`;
    if (language) url += `&language=${language}`;
    return url;
  };

  static tvSeasonCreditsUrl = (tv_id: number, season_number: number, language?: string) => {
    let url = `${this.API_BASE_URL}tv/${tv_id}/season/${season_number}/credits?api_key=${this.key}`;
    if (language) url += `&language=${language}`;
    return url;
  };

  static tvSeasonImagesUrl = (tv_id: number, season_number: number, language?: string) => {
    let url = `${this.API_BASE_URL}tv/${tv_id}/season/${season_number}/images?api_key=${this.key}`;
    if (language) url += `&language=${language}`;
    return url;
  };

  static tvSeasonVideosUrl = (tv_id: number, season_number: number, language?: string) => {
    let url = `${this.API_BASE_URL}tv/${tv_id}/season/${season_number}/videos?api_key=${this.key}`;
    if (language) url += `&language=${language}`;
    return url;
  };

  static listUrl = (list_id: number, language?: string) => {
    let url = `${this.API_BASE_URL}list/${list_id}?api_key=${this.key}`;
    if (language) url += `&language=${language}`;
    return url;
  };

  static imdbDetailUrl = (id: string) => `${this.IMDB_API_BASE_URL}title/${id}`;
}

export const postFetchDataHandler = (
  data: any,
  mediaType?: 'movie' | 'tv' | 'people',
): IMedia[] => {
  const result: IMedia[] = [];

  const transform = (item: any): IMedia =>
    mediaType && mediaType !== 'people'
      ? {
          ...(mediaType && mediaType === 'movie' && { adult: item.adult }),
          ...(mediaType && mediaType === 'movie' && { video: item.video }),
          ...(mediaType && mediaType === 'tv' && { originalCountry: item.original_country }),
          backdropPath: item.backdrop_path
            ? TMDB.backdropUrl(item.backdrop_path, 'w1280')
            : undefined,
          genreIds: item.genre_ids,
          id: item.id,
          mediaType: mediaType || item.media_type,
          originalLanguage: item.original_language,
          originalTitle: mediaType === 'movie' ? item.original_title : item.original_name,
          overview: item.overview,
          popularity: item.popularity,
          posterPath: item.poster_path ? TMDB.posterUrl(item.poster_path, 'w342') : undefined,
          releaseDate: item.release_date || item.first_air_date,
          title: mediaType === 'movie' ? item.title : item.name,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
        }
      : mediaType === 'people'
      ? {
          adult: item.adult,
          castId: item.cast_id,
          character: item.character,
          creditId: item.credit_id,
          department: item.department,
          gender: item.gender,
          id: item.id,
          job: item.job,
          knownFor: item.known_for,
          knownForDepartment: item.known_for_department,
          mediaType: mediaType || item.media_type,
          title: item.name,
          order: item.order,
          originalName: item.original_name,
          popularity: item.popularity,
          posterPath: item.profile_path ? TMDB?.profileUrl(item?.profile_path, 'w185') : undefined,
        }
      : {
          backdropPath: item.backdrop_path
            ? TMDB.backdropUrl(item.backdrop_path, 'w1280')
            : undefined,
          genreIds: item.genre_ids,
          id: item.id,
          mediaType: mediaType || item.media_type,
          originalLanguage: item.original_language,
          originalTitle: item.original_title || item.original_name,
          overview: item.overview,
          popularity: item.popularity,
          posterPath: item.poster_path ? TMDB.posterUrl(item.poster_path, 'w342') : undefined,
          releaseDate: item.release_date || item.first_air_date,
          title: item.title || item.name,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
        };

  if (Array.isArray(data?.results)) {
    data?.results.forEach((item: any) => result.push(transform(item)));
  } else if (Array.isArray(data)) {
    data.forEach((item: any) => result.push(transform(item)));
  } else {
    result.push(transform(data));
  }

  return result;
};
