export interface IAnimeSearch {
  currentPage: number;
  hasNextPage: boolean;
  results: IAnimeResult[];
}

export interface IRecentAnimeEpisodes {
  currentPage: number;
  hasNextPage: boolean;
  results: IAnimeEpisode[];
  totalPages: number;
  totalResults: number;
}

export interface IAnimeAdvancedSearch {
  currentPage: number;
  hasNextPage: boolean;
  results: IAnimeResult[];
  totalPages: number;
  totalResults: number;
}

export interface IAnimeGenre {
  currentPage: number;
  hasNextPage: boolean;
  results: IAnimeResult[];
}
export interface IAnimeList {
  currentPage: number;
  hasNextPage: boolean;
  results: IAnimeResult[];
}

export interface IAnimeAiringSchedule {
  currentPage: number;
  hasNextPage: boolean;
  results: IAnimeResult[];
}

export interface IAnimeEpisode {
  color?: string;
  episodeId?: string;
  episodeNumber?: number;
  episodeTitle?: string;
  genres?: string[];
  id?: string;
  image?: string;
  malId?: number;
  rating?: number;
  title?: Title;
  type?: Type;
}

export interface IAnimeInfo {
  characters?: ICharacter[];
  color?: string;
  countryOfOrigin?: string;
  cover?: string;
  description?: string;
  duration?: number;
  endDate?: IDate;
  episodes: IEpisode[];
  genres?: string[];
  id?: string;
  image?: string;
  isAdult?: boolean;
  isLicensed?: boolean;
  malId?: number;
  nextAiringEpisode?: IAiring;
  popularity?: number;
  rating?: number;
  recommendations: IAnimeResult[];
  relations?: IAnimeResult[];
  releaseDate?: number;
  season?: string;
  startDate?: IDate;
  status?: string;
  studios?: string[];
  subOrDub?: 'sub' | 'dub';
  synonyms?: string[];
  title?: Title;
  totalEpisodes?: number;
  type?: string;
}

export interface IAnimeEpisodeStream {
  headers: Headers;
  sources: Source[];
}

export interface IAnimeResult {
  color?: null | string;
  cover?: string;
  description?: string;
  duration?: number | null;
  episodes?: number;
  genres?: string[];
  id?: string;
  image?: string;
  malId?: number;
  popularity?: number;
  rating?: number | null;
  releaseDate?: number | null;
  status?: string;
  title?: Title;
  totalEpisodes?: number | null;
  trailer?: Trailer;
  type?: Type;
}

export interface Title {
  english?: null | string;
  native?: string;
  romaji?: string;
  userPreferred?: string;
}

export interface Trailer {
  id?: string;
  site?: string;
  thumbnail?: string;
}

export enum Type {
  Tv = 'TV',
  TvShort = 'TV_SHORT',
  Ova = 'OVA',
  Ona = 'ONA',
  Movie = 'MOVIE',
  Special = 'SPECIAL',
  Music = 'MUSIC',
}

export interface ICharacter {
  id?: number;
  image?: string;
  name?: IName;
  role?: string;
  voiceActors?: IVoiceActor[];
}

export interface IVoiceActor {
  id?: number;
  image?: string;
  name?: IName;
}

export interface IName {
  first: string;
  full: string;
  last: null | string;
  native: string;
  userPreferred: string;
}

export interface IDate {
  day: number;
  month: number;
  year: number;
}

export interface IEpisode {
  description?: null;
  id?: string;
  image?: string;
  number?: number;
  title?: string;
  url?: string;
}

export interface IAiring {
  airingTime?: number;
  timeUntilAiring?: number;
  episode?: number;
}

export interface Headers {
  Referer: string;
}

export interface Source {
  isM3U8: boolean;
  url: string;
}
