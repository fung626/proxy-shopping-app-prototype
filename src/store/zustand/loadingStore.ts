import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  stacks: Set<string>;
  start: (key?: string, message?: string) => void;
  stop: (key?: string) => void;
  clearAll: () => void;
  setMessage: (message: string) => void;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  isLoading: false,
  message: undefined,
  stacks: new Set(),
  start: (key = 'default', message) => {
    const { stacks } = get();
    const newStacks = new Set(stacks);
    newStacks.add(key);
    set({
      isLoading: true,
      stacks: newStacks,
      message: message || get().message,
    });
  },
  stop: (key = 'default') => {
    const { stacks } = get();
    const newStacks = new Set(stacks);
    newStacks.delete(key);
    set({
      isLoading: newStacks.size > 0,
      stacks: newStacks,
      message: newStacks.size === 0 ? undefined : get().message,
    });
  },
  clearAll: () => {
    set({
      isLoading: false,
      message: undefined,
      stacks: new Set(),
    });
  },
  setMessage: (message: string) => {
    set({ message });
  },
}));
