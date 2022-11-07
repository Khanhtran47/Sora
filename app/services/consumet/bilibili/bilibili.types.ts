/* eslint-disable @typescript-eslint/no-explicit-any */
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
  success: boolean;
  sources: Source[];
  fonts: any[];
  thumbnail?: any;
  subtitles: Subtitle[];
}

interface Subtitle {
  file: string;
  lang: string;
  language: string;
}

interface Source {
  file: string;
  type: string;
  proxy: Proxy;
}

interface Proxy {
  redirectWithProxy: boolean;
  followRedirect: boolean;
  appendReqHeaders: any;
}
