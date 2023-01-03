import create from 'zustand';

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
}

const defaultState = {
  shouldShowPlayer: false,
  isMini: false,
  routePlayer: '',
  titlePlayer: '',
};

const usePlayerState = create<PlayerState>((set) => ({
  ...defaultState,
  toggleShowPlayer: () => set((state) => ({ shouldShowPlayer: !state.shouldShowPlayer })),
  setShouldShowPlayer: (shouldShowPlayer: boolean) => set({ shouldShowPlayer }),
  toggleMini: () => set((state) => ({ isMini: !state.isMini })),
  setIsMini: (isMini: boolean) => set({ isMini }),
  setRoutePlayer: (routePlayer: string) => set({ routePlayer }),
  setTitlePlayer: (titlePlayer: string) => set({ titlePlayer }),
}));

export default usePlayerState;
