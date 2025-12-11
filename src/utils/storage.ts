import type { StateStorage } from 'zustand/middleware';

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const getStorage = (storage?: StateStorage): StateStorage => {
  if (typeof window === 'undefined') {
    return noopStorage;
  }
  return storage || window.localStorage;
};
