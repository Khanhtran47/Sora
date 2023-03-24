import { create } from 'zustand';

export interface HistoryStackState {
  historyBack: string[];
  historyForward: string[];
  setHistoryBack: (historyBack: string[]) => void;
  setHistoryForward: (historyForward: string[]) => void;
}

const defaultState = {
  historyBack: [],
  historyForward: [],
};

export const useHistoryStack = create<HistoryStackState>((set) => ({
  ...defaultState,
  setHistoryBack: (historyBack: string[]) => set({ historyBack }),
  setHistoryForward: (historyForward: string[]) => set({ historyForward }),
}));
