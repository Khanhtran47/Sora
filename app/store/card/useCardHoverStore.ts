import { create } from 'zustand';

interface CardHoverState {
  isCardPlaying: boolean;
  toggleCardPlaying: () => void;
  setIsCardPlaying: (isCardPlaying: boolean) => void;
}

const defaultState = {
  isCardPlaying: false,
};

const useCardHoverStore = create<CardHoverState>((set) => ({
  ...defaultState,
  toggleCardPlaying: () => set((state) => ({ isCardPlaying: !state.isCardPlaying })),
  setIsCardPlaying: (isCardPlaying: boolean) => set({ isCardPlaying }),
}));

export default useCardHoverStore;
