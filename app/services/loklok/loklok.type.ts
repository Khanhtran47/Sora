import type { IMovieSource } from '~/services/tmdb/tmdb.types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILoklokSubtitle {
  language: string;
  url: string;
  lang: string;
}

export interface ILoklokSources {
  isM3U8?: boolean;
  quality: number;
  url: string;
}

export interface ILoklokTag {
  id: number;
  name: string;
}

export interface ILoklokLikeItem {
  areaList: {
    id: 37;
    name: 'France';
  }[];
  areaNameList: string[];
  category: number;
  coverHorizontalUrl: string;
  coverVerticalUrl: string;
  drameTypeVo: any;
  id: string;
  name: string;
  score: number;
  tagList: ILoklokTag[];
  tagNameList: string[];
  upImgUrl: string;
  upName: string;
  year: number;
}

export interface ILoklokRefItem {
  category: 0 | 1;
  coverHorizontalUrl: string;
  coverVerticalUrl: string;
  drameTypeVo: any;
  id: string;
  name: string;
  seriesNo: number;
}

export interface ILoklokStarItem {
  image: string;
  localName: string;
  role: string;
  roleName: string;
  starId: number | string;
}
export interface ILoklokInfoData {
  aliasName: string;
  areaList: {
    id: number;
    name: string;
  }[];
  areaNameList: string[];
  category: 0 | 1;
  coverHorizontalUrl: string;
  coverHorizontalUrlJson: string;
  coverVerticalUrl: string;
  drameTypeVo: {
    drameName: string;
    drameType: string;
  };
  episodeCount: number | null;
  episodeRoomListVo: {
    category: 0 | 1;
    episodeId: string;
    episodeName: string;
    number: number;
    roomId: string;
    seasonID: string;
    seasonName: string;
  };
  episodeVo: any[];
  id: string;
  introduction: string;
  likeList: ILoklokLikeItem[];
  name: string;
  nameJson: string;
  refList: ILoklokRefItem[];
  reserved: boolean;
  score: number;
  seriesNo: number;
  showSetName: boolean;
  starList: ILoklokStarItem[];
  tagList: ILoklokTag[];
  tagListName: string[];
  translateType: number;
  upInfo: {
    upId: number;
    upImgUrl: string;
    upName: string;
  };
  updateInfo: any;
  year: number;
}

export interface ILoklokMediaInfo {
  data: ILoklokInfoData;
  sources: IMovieSource[];
  subtitles: ILoklokSubtitle[];
}

export interface ILoklokSearchData {
  areas: {
    id: number;
    name: string;
  }[];
  categoryTag: ILoklokTag[];
  coverHorizontalUrl: string;
  coverVerticalUrl: string;
  domainType: number;
  dramaType: {
    code: string;
    name: string;
  };
  duration: string;
  id: string;
  name: string;
  releaseTime: string;
  sort: string;
  upInfo: {
    enable: boolean;
    upId: number;
    upImgUrl: string;
    upName: string;
    userId: any;
  };
}
