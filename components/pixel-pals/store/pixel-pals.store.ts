import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { createPixelPalsId } from '../utils/pixel-pals-random.utils';
import { isPixelPalsThemeUnlocked, toValidPixelPalsUnlocks, getEmptyPixelPalsUnlocks } from '../utils/pixel-pals-unlock.utils';
import { pixelPalsLocalStorage } from '../utils/pixel-pals-storage.utils';
import { PIXEL_PALS_PETS } from '../constants/pixel-pals-pets.constants';
import { PIXEL_PALS_DEFAULT_THEME_ID } from '../constants/pixel-pals-themes.constants';
import { pixelPalsPetSchema, pixelPalsPersistedStateSchema } from '../schemas/pixel-pals-persisted-state.schema';
import { PIXEL_PALS_MAX_PETS, PIXEL_PALS_STORAGE_KEY, PIXEL_PALS_STORAGE_VERSION } from '../constants/pixel-pals.constants';

import type { PixelPalsPet, PixelPalsNewPet, PixelPalsThemeId, PixelPalsUnlocks, PixelPalsPetType } from '../models/pixel-pals.models';

interface PixelPalsActions {
  /** Adds a pet, unless Pixel Pals is full. Returns the new pet, or null when it was full. */
  addPet: (_newPet: PixelPalsNewPet) => PixelPalsPet | null;
  removePet: (_petId: string) => void;
  setTheme: (_themeId: PixelPalsThemeId) => void;
  /** Opens a pet for this person, e.g. once they earned it. */
  unlockPet: (_type: PixelPalsPetType) => void;
  /** Opens a theme for this person. */
  unlockTheme: (_themeId: PixelPalsThemeId) => void;
}

/**
 * The pets in Pixel Pals, its background and what is unlocked. Saved to local storage, so they are back after a refresh.
 * Where each pet is and what it is doing is not saved, that lives in `PixelPalsEngine`.
 *
 * `skipHydration` is on: the server renders the defaults, and `usePixelPalsStoreHydration` loads the saved
 * state after mount. Reading local storage while rendering would make the first client render differ from
 * the server's.
 */
interface PixelPalsState {
  pets: PixelPalsPet[];
  themeId: PixelPalsThemeId;
  /** Which pets and themes are open, see `PixelPalsUnlocks`. */
  unlocks: PixelPalsUnlocks;

  actions: PixelPalsActions;
}

type PixelPalsPersistedState = Pick<PixelPalsState, 'pets' | 'themeId' | 'unlocks'>;

export const PIXEL_PALS_DEFAULT_PETS: PixelPalsPet[] = [
  { id: 'pixel-pals-default-dog', type: 'dog', color: 'brown', name: PIXEL_PALS_PETS.dog.defaultName },
];

/**
 * Keeps only the saved pets that still exist in the catalog, once per id, up to the cap. The engine and React
 * key each pet by its id, so a repeated id (from a hand-edited value) keeps only its first pet.
 */
function toValidPets(values: unknown[]): PixelPalsPet[] {
  const seenIds = new Set<string>();
  return values
    .map((value: unknown) => {
      return pixelPalsPetSchema.safeParse(value);
    })
    .filter((result) => {
      return result.success;
    })
    .map((result) => {
      return result.data as PixelPalsPet;
    })
    .filter((pet: PixelPalsPet) => {
      if (seenIds.has(pet.id)) {
        return false;
      }
      seenIds.add(pet.id);
      return true;
    })
    .slice(0, PIXEL_PALS_MAX_PETS);
}

export const usePixelPalsStore = create<PixelPalsState>()(
  persist(
    (set, get) => {
      return {
        pets: PIXEL_PALS_DEFAULT_PETS,
        themeId: PIXEL_PALS_DEFAULT_THEME_ID,
        unlocks: getEmptyPixelPalsUnlocks(),

        actions: {
          addPet: (newPet: PixelPalsNewPet) => {
            if (get().pets.length >= PIXEL_PALS_MAX_PETS) {
              return null;
            }
            const pet: PixelPalsPet = { id: createPixelPalsId(), type: newPet.type, color: newPet.color, name: newPet.name.trim() };
            set((state: PixelPalsState) => {
              return { pets: [...state.pets, pet] };
            });
            return pet;
          },
          removePet: (petId: string) => {
            set((state: PixelPalsState) => {
              return {
                pets: state.pets.filter((pet: PixelPalsPet) => {
                  return pet.id !== petId;
                }),
              };
            });
          },
          setTheme: (themeId: PixelPalsThemeId) => {
            set(() => {
              return { themeId };
            });
          },
          unlockPet: (type: PixelPalsPetType) => {
            set((state: PixelPalsState) => {
              return { unlocks: { ...state.unlocks, pets: { ...state.unlocks.pets, [type]: true } } };
            });
          },
          unlockTheme: (themeId: PixelPalsThemeId) => {
            set((state: PixelPalsState) => {
              return { unlocks: { ...state.unlocks, themes: { ...state.unlocks.themes, [themeId]: true } } };
            });
          },
        },
      };
    },
    {
      name: PIXEL_PALS_STORAGE_KEY,
      version: PIXEL_PALS_STORAGE_VERSION,
      storage: createJSONStorage(() => {
        return pixelPalsLocalStorage;
      }),
      skipHydration: true,
      partialize: (state: PixelPalsState): PixelPalsPersistedState => {
        return { pets: state.pets, themeId: state.themeId, unlocks: state.unlocks };
      },
      // runs only when the saved version is not `PIXEL_PALS_STORAGE_VERSION`, before `merge`
      migrate: (persistedState: unknown, version: number): PixelPalsPersistedState => {
        const parsed = pixelPalsPersistedStateSchema.safeParse(persistedState);
        if (!parsed.success) {
          return { pets: PIXEL_PALS_DEFAULT_PETS, themeId: PIXEL_PALS_DEFAULT_THEME_ID, unlocks: getEmptyPixelPalsUnlocks() };
        }
        return {
          pets: toValidPets(parsed.data.pets),
          themeId: parsed.data.themeId,
          // before version 2 the saved unlocks were copies of the master lists, not earned: drop them, the master lists decide
          unlocks: version < 2 ? getEmptyPixelPalsUnlocks() : toValidPixelPalsUnlocks(parsed.data.unlocks),
        };
      },
      merge: (persistedState: unknown, currentState: PixelPalsState): PixelPalsState => {
        const parsed = pixelPalsPersistedStateSchema.safeParse(persistedState);
        if (!parsed.success) {
          return currentState;
        }
        const unlocks: PixelPalsUnlocks = toValidPixelPalsUnlocks(parsed.data.unlocks);
        // a saved theme that is locked now (the master list locked it, and it was not earned) falls back to the default
        const themeId: PixelPalsThemeId = isPixelPalsThemeUnlocked(parsed.data.themeId, unlocks) ? parsed.data.themeId : PIXEL_PALS_DEFAULT_THEME_ID;
        return { ...currentState, pets: toValidPets(parsed.data.pets), themeId, unlocks };
      },
    },
  ),
);

export const usePixelPalsActions = () => {
  return usePixelPalsStore((state: PixelPalsState) => {
    return state.actions;
  });
};
export const usePixelPalsPets = () => {
  return usePixelPalsStore((state: PixelPalsState) => {
    return state.pets;
  });
};
export const usePixelPalsThemeId = () => {
  return usePixelPalsStore((state: PixelPalsState) => {
    return state.themeId;
  });
};
export const usePixelPalsUnlocks = () => {
  return usePixelPalsStore((state: PixelPalsState) => {
    return state.unlocks;
  });
};
export const usePixelPalsPetCount = () => {
  return usePixelPalsStore((state: PixelPalsState) => {
    return state.pets.length;
  });
};
