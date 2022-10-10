/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Subtitle {
  language: string;
  url: string;
  lang: string;
}

export interface MediaInfo {
  data: any;
  sources: any;
  subtitles: Subtitle[];
}

export interface SearchData {
  id: string;
  name: string;
  releaseTime: string;
  dramaType: {
    code: string;
    name: 'anime' | 'movie' | 'drama';
  };
}
