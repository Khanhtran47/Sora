/* eslint-disable @typescript-eslint/no-explicit-any */
/* =================== Start of Search Media Type =================== */
export interface ISearchMedia {
  __N_SSP: boolean;
  pageProps: PagePropsSearch;
}

export interface PagePropsSearch {
  query: string;
  result: Result[];
}

export interface Result {
  areas: Area[];
  categoryTag: Area[];
  coverHorizontalUrl: string;
  coverVerticalUrl: string;
  domainType: number;
  dramaType: DramaType;
  duration: string;
  id: string;
  name: string;
  releaseTime: string;
  sort: string;
  upInfo: UpInfoSearch;
}

export interface Area {
  id: number;
  name: string;
}

export interface DramaType {
  code: string;
  name: string;
}

export interface UpInfoSearch {
  enable: boolean;
  upId: number;
  upImgUrl: string;
  upName: string;
  userId: null;
}
/* ==================== End of Search Media Type ==================== */

/* =================== Start of Movie Detail Type =================== */
export interface ILokMovieDetail {
  __N_SSG: boolean;
  pageProps: PagePropsMovieDetail;
}

export interface PagePropsMovieDetail {
  info: Info;
}

export interface Info {
  data: Data;
  sources: Source[];
  subtitles: Subtitle[];
}

export interface Data {
  aliasName: string;
  areaList: List[];
  areaNameList: string[];
  category: number;
  collect: boolean;
  contentTagResourceList: any[];
  coverHorizontalUrl: string;
  coverHorizontalUrlJson: string;
  coverVerticalUrl: string;
  drameTypeVo: DrameTypeVo;
  episodeCount: null;
  episodeRoomListVo: EpisodeRoomListVo;
  episodeVo: number;
  id: string;
  introduction: string;
  likeList: LikeList[];
  name: string;
  nameJson: string;
  refList: RefList[];
  reserved: boolean;
  score: number;
  seriesNo: number;
  showSetName: boolean;
  starList: any[];
  tagList: List[];
  tagNameList: string[];
  translateType: number;
  upInfo: UpInfoMovieDetail;
  updateInfo: null;
  year: number;
}

export interface List {
  id: number;
  name: string;
}

export interface DrameTypeVo {
  drameName: string;
  drameType: string;
}

export interface EpisodeRoomListVo {
  category: number;
  episodeId: string;
  episodeName: string;
  number: number;
  roomId: string;
  seasonID: string;
  seasonName: string;
}

export interface LikeList {
  areaList: List[];
  areaNameList: string[];
  category: number;
  coverHorizontalUrl: string;
  coverVerticalUrl: string;
  drameTypeVo: null;
  id: string;
  name: string;
  score: number;
  tagList: List[];
  tagNameList: string[];
  upImgUrl: string;
  upName: string;
  year: number;
}

export interface RefList {
  category: number;
  coverHorizontalUrl: string;
  coverVerticalUrl: string;
  drameTypeVo: null;
  id: string;
  name: string;
  seriesNo: number;
}

export interface UpInfoMovieDetail {
  upId: number;
  upImgUrl: string;
  upName: string;
}

export interface Source {
  quality: number;
  url: string;
}

export interface Subtitle {
  lang: string;
  language: string;
  url: string;
}

/* ==================== End of Movie Detail Type ==================== */
