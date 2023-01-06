/* eslint-disable @typescript-eslint/indent */
import create from 'zustand';

import { IMovieSource, IMovieSubtitle } from '~/services/consumet/flixhq/flixhq.types';
import { ITrailer } from '~/services/consumet/anilist/anilist.types';

export type PlayerData =
  | {
      provider?: string;
      idProvider?: number | string;
      sources: IMovieSource[] | undefined;
      subtitles?: IMovieSubtitle[] | undefined;
      hasNextEpisode?: boolean;
      routePlayer: string;
      titlePlayer: string;
      id: number | string;
      posterPlayer: string;
      typeVideo: 'movie' | 'tv' | 'anime';
      trailerAnime?: ITrailer;
      currentEpisode?: number;
      userId?: string;
    }
  | undefined;

export type QualitySelector = {
  html: string;
  url: string;
  default?: boolean;
}[];

export type SubtitleSelector =
  | {
      html: string;
      url: string;
      default?: true;
    }[]
  | undefined;

interface PlayerState {
  shouldShowPlayer: boolean;
  toggleShowPlayer: () => void;
  setShouldShowPlayer: (shouldShowPlayer: boolean) => void;
  isMini: boolean;
  toggleMini: () => void;
  setIsMini: (isMini: boolean) => void;
  routePlayer: string;
  setRoutePlayer: (routePlayer: string) => void;
  titlePlayer: string;
  setTitlePlayer: (titlePlayer: string) => void;
  playerData: PlayerData;
  setPlayerData: (playerData: PlayerData) => void;
  qualitySelector: QualitySelector;
  setQualitySelector: (qualitySelector: QualitySelector) => void;
  subtitleSelector: SubtitleSelector;
  setSubtitleSelector: (subtitleSelector: SubtitleSelector) => void;
}

const defaultState = {
  shouldShowPlayer: false,
  isMini: false,
  routePlayer: '',
  titlePlayer: '',
  playerData: undefined,
  qualitySelector: [],
  subtitleSelector: [],
};

const usePlayerState = create<PlayerState>((set) => ({
  ...defaultState,
  toggleShowPlayer: () => set((state) => ({ shouldShowPlayer: !state.shouldShowPlayer })),
  setShouldShowPlayer: (shouldShowPlayer: boolean) => set({ shouldShowPlayer }),
  toggleMini: () => set((state) => ({ isMini: !state.isMini })),
  setIsMini: (isMini: boolean) => set({ isMini }),
  setRoutePlayer: (routePlayer: string) => set({ routePlayer }),
  setTitlePlayer: (titlePlayer: string) => set({ titlePlayer }),
  setPlayerData: (playerData: PlayerData) => set({ playerData }),
  setQualitySelector: (qualitySelector: QualitySelector) => set({ qualitySelector }),
  setSubtitleSelector: (subtitleSelector: SubtitleSelector) => set({ subtitleSelector }),
}));

export default usePlayerState;
