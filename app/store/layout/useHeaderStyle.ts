import { create } from 'zustand';

export interface HeaderStyleState {
  backgroundColor: string;
  setBackgroundColor: (backgroundColor: string) => void;
  startChangeScrollPosition: number;
  setStartChangeScrollPosition: (startChangeScrollPosition: number) => void;
}

const defaultState = {
  backgroundColor: '',
  startChangeScrollPosition: 0,
};

export const useHeaderStyle = create<HeaderStyleState>((set) => ({
  ...defaultState,
  setBackgroundColor: (backgroundColor: string) => set({ backgroundColor }),
  setStartChangeScrollPosition: (startChangeScrollPosition: number) =>
    set({ startChangeScrollPosition }),
}));
