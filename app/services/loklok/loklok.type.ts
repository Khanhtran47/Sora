/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LoklokSubtitle {
  language: string;
  url: string;
  lang: string;
}

export interface LoklokMediaInfo {
  data: any;
  sources: any;
  subtitles: LoklokSubtitle[];
}

export interface LoklokSearchData {
  id: string;
  name: string;
  releaseTime: string;
  dramaType: {
    code: string;
    name: 'anime' | 'movie' | 'drama';
  };
}
