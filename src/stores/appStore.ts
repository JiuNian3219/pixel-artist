import { DEFAULT_THEME } from '@/utils/constants';
import { getStorage } from '@/utils/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme: 'light' | 'dark') => set({ theme }),
    }),
    {
      name: 'app-state-storage',
      storage: createJSONStorage(() => getStorage()),
    }
  )
);
