import { IMovieSource, IMovieSubtitle } from '../flixhq/flixhq.types';

export interface IBilibiliSearch {
  totalResults: number;
  results: IBilibiliResult[];
}

export interface IBilibiliResult {
  id: number;
  title: string;
  image?: string;
  genres?: string[];
  rating?: number;
  view?: string;
}

export interface IBilibiliInfo {
  id: string;
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  seasons: any[];
  recommendations: IBilibiliResult[];
  subOrDub: string;
  episodes: Episode[];
  totalEpisodes: number;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  image: string;
}

export interface IBilibiliEpisode {
  sources: IMovieSource[];
  subtitles: IMovieSubtitle[];
}
