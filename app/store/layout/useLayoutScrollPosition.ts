import { MotionValue } from 'framer-motion';
import { create } from 'zustand';

export interface LayoutScrollPositionState {
  viewportRef: React.RefObject<HTMLDivElement>;
  setViewportRef: (viewportRef: React.RefObject<HTMLDivElement>) => void;
  scrollY: MotionValue<number>;
  setScrollY: (scrollY: MotionValue<number>) => void;
  scrollYProgress: MotionValue<number>;
  setScrollYProgress: (scrollYProgress: MotionValue<number>) => void;
  scrollDirection: 'down' | 'up' | undefined;
  setScrollDirection: (scrollDirection: 'down' | 'up' | undefined) => void;
}

const defaultState = {
  viewportRef: { current: null },
  scrollY: new MotionValue(),
  scrollYProgress: new MotionValue(),
  scrollDirection: undefined,
};

export const useLayoutScrollPosition = create<LayoutScrollPositionState>((set) => ({
  ...defaultState,
  setScrollDirection: (scrollDirection: 'down' | 'up' | undefined) => set({ scrollDirection }),
  setViewportRef: (viewportRef: React.RefObject<HTMLDivElement>) => set({ viewportRef }),
  setScrollY: (scrollY: MotionValue<number>) => set({ scrollY }),
  setScrollYProgress: (scrollYProgress: MotionValue<number>) => set({ scrollYProgress }),
}));
