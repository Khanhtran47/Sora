// https://developers.themoviedb.org/3/configuration/get-api-configuration
export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type LogoSize = 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original';
export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';
export type StillSize = 'w92' | 'w185' | 'w300' | 'original';

export type MediaType = 'all' | 'movie' | 'tv' | 'person';
export type TimeWindowType = 'day' | 'week';
export type ListMovieType = 'upcoming' | 'top_rated' | 'popular';
export type ListTvShowType = 'on_the_air' | 'popular' | 'top_rated';
export type ListPersonType = 'popular' | 'latest';

/**
 * Media here means a tv show or a movie
 * Here is just some common fields
 * this could be extended in the future to create more specific interface
 */
export interface IMedia {
  backdropPath: string;
  id: number;
  mediaType: 'movie' | 'tv';
  originalLanguage: string;
  overview: string;
  popularity: number;
  posterPath: string;
  releaseDate: string; // release_date - first-air-date
  title: string; // title - name - original_title - original_name
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  adult?: boolean;
  video?: boolean;
  originalCountry?: string;
  originalTitle: string;
}

export interface IMediaList {
  items: IMedia[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface IMovieDetail {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null | object;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    name: string;
    id: number;
    logo_path: string | null;
    original_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string; // data
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    iso_639_1: string;
    name: string;
  }[];
  status: 'Rumored' | 'Planned' | 'In Production' | 'Post Production' | 'Released' | 'Canceled';
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
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
  cast: {
    adult: boolean;
    gender: number | null;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
  }[];
  crew: {
    adult: boolean;
    gender: number | null;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: string;
    profile_path: string;
    credit_id: string;
    department: string;
    job: string;
  }[];
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
  backdrop_path: string | null;
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  first_air_date: string;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
  };
  name: string;
  next_episode_to_air: null;
  networks: {
    name: string;
    id: number;
    logo_path: string | null;
    origin_country: string;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string[];
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    name: string;
    id: number;
    logo_path: string | null;
    original_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  type: string;
  vote_average: number;
  vote_count: number;
}

export interface IPeople {
  adult: boolean;
  id: number;
  known_for: KnownFor[];
  name: string;
  popularity: number;
  profile_path: string;
}

export interface KnownFor {
  adult?: boolean;
  backdrop_path?: string;
  first_air_date?: Date;
  genre_ids: number[];
  id: number;
  media_type: 'movie' | 'tv';
  name?: string;
  origin_country?: string[];
  original_language: string;
  original_name?: string;
  original_title?: string;
  overview: string;
  poster_path: string;
  release_date?: Date;
  title?: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IListPeople {
  page: number;
  results: IPeople[];
  total_pages: number;
  total_results: number;
}
