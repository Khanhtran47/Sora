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
  scrollDirection: 'down' | 'up' | undefined;
  setScrollDirection: (scrollDirection: 'down' | 'up' | undefined) => void;
  viewportRef: React.RefObject<HTMLDivElement>;
  setViewportRef: (viewportRef: React.RefObject<HTMLDivElement>) => void;
}

const defaultState = {
  scrollPosition: { x: 0, y: 0 },
  scrollHeight: 0,
  scrollDirection: undefined,
  viewportRef: { current: null },
};

export const useLayoutScrollPosition = create<LayoutScrollPositionState>((set) => ({
  ...defaultState,
  setScrollPosition: (scrollPosition: ScrollPosition) => set({ scrollPosition }),
  setScrollHeight: (scrollHeight: number) => set({ scrollHeight }),
  setScrollDirection: (scrollDirection: 'down' | 'up' | undefined) => set({ scrollDirection }),
  setViewportRef: (viewportRef: React.RefObject<HTMLDivElement>) => set({ viewportRef }),
}));
