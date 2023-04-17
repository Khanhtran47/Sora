import type { IMedia } from '~/types/media';

// https://developers.themoviedb.org/3/configuration/get-api-configuration
export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type LogoSize = 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original';
export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';
export type StillSize = 'w92' | 'w185' | 'w300' | 'original';

export type MediaType = 'all' | 'movie' | 'tv' | 'person';
export type TimeWindowType = 'day' | 'week';
export type ListMovieType = 'upcoming' | 'top_rated' | 'popular' | 'now_playing';
export type ListTvShowType = 'on_the_air' | 'popular' | 'top_rated' | 'airing_today';
export type ListPersonType = 'popular' | 'latest';

/**
 * Media here means a tv show or a movie
 * Here is just some common fields
 * this could be extended in the future to create more specific interface
 */

export interface IMediaList {
  items?: IMedia[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface IMovieDetail {
  adult?: boolean;
  backdrop_path?: string | null;
  belongs_to_collection?: null | object;
  budget?: number;
  genres?: {
    id?: number;
    name?: string;
  }[];
  homepage?: string | null;
  id?: number;
  imdb_id?: string | null;
  original_language?: string;
  original_title?: string;
  overview?: string | null;
  popularity?: number;
  poster_path?: string | null;
  production_companies?: {
    name?: string;
    id?: number;
    logo_path?: string | null;
    original_country?: string;
  }[];
  production_countries?: {
    iso_3166_1?: string;
    name?: string;
  }[];
  release_date?: string | number | Date; // data
  revenue?: number;
  runtime?: number | null;
  spoken_languages?: {
    english_name?: string;
    iso_639_1?: string;
    name?: string;
  }[];
  status?: 'Rumored' | 'Planned' | 'In Production' | 'Post Production' | 'Released' | 'Canceled';
  tagline?: string | null;
  title?: string;
  titleEng?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface IListGenre {
  genres: IGenre[];
}

export interface ICredit {
  id: number;
  cast: IPeople[];
  crew: IPeople[];
}

export interface IVideos {
  id: number;
  results: {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string; // https://www.youtube.com/watch?v=${key}
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: string;
  }[];
}

export interface ITvShowDetail {
  backdrop_path?: string | null;
  created_by?: {
    id?: number;
    credit_id?: string;
    name?: string;
    gender?: number;
    profile_path?: string | null;
  }[];
  episode_run_time?: number[];
  first_air_date?: string | number | Date;
  genres?: {
    id?: number;
    name?: string;
  }[];
  homepage?: string;
  id?: number;
  in_production?: boolean;
  languages?: string[];
  last_air_date?: string;
  last_episode_to_air?: {
    air_date?: string;
    episode_number?: number;
    id?: number;
    name?: string;
    overview?: string;
    production_code?: string;
    season_number?: number;
    still_path?: string | null;
    vote_average?: number;
    vote_count?: number;
  };
  name?: string;
  nameEng?: string;
  next_episode_to_air?: null;
  networks?: {
    name?: string;
    id?: number;
    logo_path?: string | null;
    origin_country?: string;
  }[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  origin_country?: string[];
  original_language?: string;
  original_name?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string | null;
  production_companies?: {
    name?: string;
    id?: number;
    logo_path?: string | null;
    original_country?: string;
  }[];
  production_countries?: {
    iso_3166_1?: string;
    name?: string;
  }[];
  seasons?: {
    air_date?: string;
    episode_count?: number;
    id?: number;
    name?: string;
    overview?: string;
    poster_path?: string;
    season_number?: number;
  }[];
  spoken_languages?: {
    english_name?: string;
    iso_639_1?: string;
    name?: string;
  }[];
  status?: string;
  tagline?: string | null;
  type?: string;
  vote_average?: number;
  vote_count?: number;
}

export interface IPeople {
  adult?: boolean;
  id?: number;
  known_for?: IMedia[];
  name?: string;
  popularity?: number;
  profile_path?: string | null;
  gender?: number | null;
  known_for_department?: string;
  character?: string;
  credit_id?: string;
  order?: number;
  cast_id?: number;
  original_name?: string;
  department?: string;
  job?: string;
}

export interface IListPeople {
  page: number;
  results: IMedia[];
  totalPages: number;
  totalResults: number;
}

export interface IPeopleDetail {
  birthday?: string | null;
  known_for_department?: string;
  deathday?: null | string;
  id?: number;
  name?: string;
  also_known_as?: string[];
  gender?: number;
  biography?: string;
  popularity?: number;
  place_of_birth?: string | null;
  profile_path?: string | null;
  adult?: boolean;
  imdb_id?: string;
  homepage?: undefined | string;
}

export interface IPeopleExternalIds {
  imdb_id?: string | null;
  facebook_id?: null | string;
  freebase_mid?: string | null;
  freebase_id?: null | string;
  tvrage_id?: number | null;
  twitter_id?: null | string;
  id?: number;
  instagram_id?: string | null;
}

export interface IPeopleImages {
  id?: number;
  profiles?: IImage[];
}

export interface IPeopleCredits {
  cast: IMedia[];
  // crew: {}[];
  id?: number;
}

export interface IDetailImages {
  id?: number;
  backdrops?: IImage[];
  logos?: IImage[];
  posters?: IImage[];
}

export interface IImage {
  aspect_ratio?: number;
  file_path?: string;
  height?: number;
  iso_639_1?: null | string;
  vote_average?: number;
  vote_count?: number;
  width?: number;
}

export interface IMovieTranslations {
  id: number;
  translations: ITranslation[];
}

export interface ITranslation {
  data: IDataTranslation;
  english_name: string;
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
}

export interface IDataTranslation {
  homepage: string;
  overview: string;
  runtime: number;
  tagline: string;
  title?: string;
  name?: string;
}

export interface ILanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ISeasonDetail {
  _id: string;
  air_date: Date;
  episodes: IEpisode[];
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface IEpisode {
  air_date: Date;
  crew: IPeople[];
  episode_number: number;
  guest_stars: IPeople[];
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface IList {
  created_by: string;
  description: string;
  favorite_count: number;
  id: string;
  iso_639_1: string;
  item_count: number;
  items: IMedia[];
  name: string;
  poster_path: string | null;
}

export interface IMovieSource {
  isM3U8?: boolean;
  isDASH?: boolean;
  quality: string;
  url: string;
}

export interface IMovieSubtitle {
  id?: number;
  default?: boolean;
  lang: string;
  url: string;
}
