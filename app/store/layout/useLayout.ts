import { MotionValue } from 'framer-motion';
import { create } from 'zustand';

export interface LayoutState {
  viewportRef: React.RefObject<HTMLDivElement>;
  setViewportRef: (viewportRef: React.RefObject<HTMLDivElement>) => void;
  scrollY: MotionValue<number>;
  setScrollY: (scrollY: MotionValue<number>) => void;
  scrollYProgress: MotionValue<number>;
  setScrollYProgress: (scrollYProgress: MotionValue<number>) => void;
  scrollDirection: 'down' | 'up' | undefined;
  setScrollDirection: (scrollDirection: 'down' | 'up' | undefined) => void;
  isShowOverlay: boolean;
  setIsShowOverlay: (isShowOverlay: boolean) => void;
}

const defaultState = {
  viewportRef: { current: null },
  scrollY: new MotionValue(),
  scrollYProgress: new MotionValue(),
  scrollDirection: undefined,
  isShowOverlay: false,
};

export const useLayout = create<LayoutState>((set) => ({
  ...defaultState,
  setScrollDirection: (scrollDirection: 'down' | 'up' | undefined) => set({ scrollDirection }),
  setViewportRef: (viewportRef: React.RefObject<HTMLDivElement>) => set({ viewportRef }),
  setScrollY: (scrollY: MotionValue<number>) => set({ scrollY }),
  setScrollYProgress: (scrollYProgress: MotionValue<number>) => set({ scrollYProgress }),
  setIsShowOverlay: (isShowOverlay: boolean) => set({ isShowOverlay }),
}));
