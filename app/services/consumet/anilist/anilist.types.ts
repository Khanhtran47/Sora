import type { IMedia } from '~/types/media';

export interface IAnimeList {
  currentPage: number;
  hasNextPage: boolean;
  results: IAnimeResult[] | IAnimeEpisode[] | IMedia[];
  totalPages?: number;
  totalResults?: number;
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
  episodes: IEpisodeInfo[];
  genres?: string[];
  id?: string;
  image?: string;
  isAdult?: boolean;
  isLicensed?: boolean;
  malId?: number;
  nextAiringEpisode?: IAiring;
  popularity?: number;
  rating?: number;
  recommendations: IAnimeResult[] | IMedia[];
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
  trailer?: ITrailer;
  type?: string;
}

export interface IAnimeEpisodeStream {
  headers: Headers;
  sources: Source[];
}

export interface IAnimeResult {
  color?: string;
  cover?: string;
  description?: string;
  duration?: number;
  episodes?: number;
  genres?: string[];
  id?: string;
  image?: string;
  malId?: number;
  popularity?: number;
  rating?: number;
  relationType?: string;
  releaseDate?: number;
  status?: string;
  title?: Title;
  totalEpisodes?: number;
  trailer?: ITrailer;
  type?: Type;
}

export interface Title {
  english?: null | string;
  native?: string;
  romaji?: string;
  userPreferred?: string;
}

export interface ITrailer {
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

export interface IEpisodeInfo {
  id: string;
  number: number;
  title?: string;
  description?: string;
  isFiller?: boolean;
  url?: string;
  image?: string;
  releaseDate?: string;
  [x: string]: unknown;
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
  isM3U8?: boolean;
  quality: string;
  url: string;
}
