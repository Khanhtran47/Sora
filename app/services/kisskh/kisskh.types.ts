/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISearchItem {
  episodesCount: number;
  label: string;
  favoriteID: number;
  thumbnail: string;
  id: number;
  title: string;
}

export interface IItemInfo {
  description: string;
  releaseDate: string;
  trailer: string;
  country: string;
  status: string;
  type: string;
  nextEpDateID: number;
  episodes: Episode[];
  episodesCount: number;
  label?: any;
  favoriteID: number;
  thumbnail: string;
  id: number;
  title: string;
}

interface Episode {
  id: number;
  number: number;
  sub: number;
}

export interface IEpisodeVideo {
  Video: string;
  Video_tmp: string;
  ThirdParty: string;
  Type: number;
  id?: any;
  dataSaver?: any;
  a?: any;
  b?: any;
  dType?: any;
}

export interface IVideoSubtitle {
  src: string;
  label: string;
  land: string;
  default: boolean;
}
