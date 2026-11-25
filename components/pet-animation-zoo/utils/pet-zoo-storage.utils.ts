import type { StateStorage } from 'zustand/middleware';

/**
 * Local storage for the zoo's store, made safe to fail:
 * - a saved value that is not JSON (corrupt, or edited by hand) reads as nothing saved, so the zoo starts with
 *   the defaults instead of never finishing hydration
 * - a write that fails (storage full or blocked) is skipped, the zoo keeps working, it just is not saved
 */
export const petZooLocalStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      const value: string | null = localStorage.getItem(name);
      if (value !== null) {
        JSON.parse(value);
      }
      return value;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // full or blocked, nothing to do
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch {
      // blocked, nothing to do
    }
  },
};
