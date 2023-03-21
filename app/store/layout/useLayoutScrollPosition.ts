import { create } from 'zustand';

export type ScrollPosition = {
  x: number;
  y: number;
};

export interface LayoutScrollPositionState {
  scrollPosition: ScrollPosition;
  setScrollPosition: (scrollPosition: ScrollPosition) => void;
  scrollHeight: number;
  setScrollHeight: (scrollHeight: number) => void;
}

const defaultState = {
  scrollPosition: { x: 0, y: 0 },
  scrollHeight: 0,
};

export const useLayoutScrollPosition = create<LayoutScrollPositionState>((set) => ({
  ...defaultState,
  setScrollPosition: (scrollPosition: ScrollPosition) => set({ scrollPosition }),
  setScrollHeight: (scrollHeight: number) => set({ scrollHeight }),
}));
