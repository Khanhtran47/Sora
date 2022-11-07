export interface IMovieSearch {
  currentPage: number;
  hasNextPage: boolean;
  results: IMovieResult[];
}

export interface IMovieResult {
  id: string;
  image: string;
  releaseDate?: string;
  title: string;
  type: 'Movie' | 'TV Series';
  url: string;
}

export interface IMovieInfo {
  casts: string[];
  country: string;
  description: string;
  duration: string;
  episodes: IMovieEpisode[];
  genres: string[];
  id: string;
  image: string;
  production: string;
  rating: number;
  releaseDate: Date;
  tags: string[];
  title: string;
  type: string;
  url: string;
}

export interface IMovieEpisode {
  id: string;
  title: string;
  url: string;
  season?: number;
  number?: number;
}

export interface IMovieEpisodeStreamLink {
  headers: Headers;
  sources: IMovieSource[];
  subtitles: IMovieSubtitle[];
}

export interface Headers {
  Referer: string;
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
