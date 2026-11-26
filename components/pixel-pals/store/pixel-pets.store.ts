import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { createPixelPalsId } from '../utils/pixel-pals-random.utils';
import { pixelPalsLocalStorage } from '../utils/pixel-pals-storage.utils';
import { PIXEL_PALS_DEFAULT_THEME_ID } from '../constants/pixel-pals-themes.constants';
import { pixelPetSchema, pixelPetsPersistedStateSchema } from '../schemas/pixel-pets-persisted-state.schema';
import {
  getUnlockedPets,
  getAllUnlockedPets,
  getUnlockedBackgrounds,
  toValidSavedUnlockedPets,
  getAllUnlockedBackgrounds,
  toValidSavedUnlockedBackgrounds,
} from '../utils/pixel-pals-unlock.utils';
import { getParticleLevels, hasPixelPalsParticles, toValidParticleLevel, toValidSavedParticleLevels } from '../utils/pixel-pals-particle-level.utils';
import {
  PIXEL_PALS_STORAGE_KEY,
  PIXEL_PALS_MAX_PET_COUNT,
  PIXEL_PALS_MIN_PET_COUNT,
  PIXEL_PALS_STORAGE_VERSION,
  PIXEL_PALS_DEFAULT_PET_COUNT,
} from '../constants/pixel-pals.constants';

import type {
  PixelPet,
  PixelPetId,
  NewPixelPet,
  PixelPalsThemeId,
  PixelPetUnlockedPets,
  PixelPetParticleLevels,
  PixelPetSavedUnlockedPets,
  PixelPetSavedParticleLevels,
  PixelPetUnlockedBackgrounds,
  PixelPetSavedUnlockedBackgrounds,
} from '../models/pixel-pals.models';

interface PixelPetsActions {
  /** How many pets can be out at once. Rounded and kept in 1 to 30. Lowering it never removes pets already out. */
  setUserPixelPetCount: (_count: number) => void;
  setUserPixelPetBackground: (_backgroundId: PixelPalsThemeId) => void;
  /** How much weather this background has, rounded and kept in 0 to 100. A background with no `particles` is left as it is. */
  setUserPixelPetParticleLevel: (_backgroundId: PixelPalsThemeId, _level: number) => void;
  /** Replaces every pet. A pet with an unknown kind or color, or an id already used, is left out. */
  setUserPixelPets: (_pets: PixelPet[]) => void;
  /** Adds a pet with a new id. Returns it, or null when `userPixelPetCount` pets are already out or the pet is not valid. */
  addUserPixelPet: (_newPet: NewPixelPet) => PixelPet | null;
  /** Removes the pet with this id (`PixelPet.id`, not its kind). */
  removeUserPixelPet: (_id: string) => void;

  setPetUnlocked: (_petId: PixelPetId, _isUnlocked: boolean) => void;
  unlockAllPets: () => void;
  lockAllPets: () => void;
  setBackgroundUnlocked: (_backgroundId: PixelPalsThemeId, _isUnlocked: boolean) => void;
  unlockAllBackgrounds: () => void;
  lockAllBackgrounds: () => void;
}

/**
 * What Pixel Pals shows, and what the person can pick in its dialogs. Everything but `actions` is saved to local
 * storage, so it is back after a refresh. Where each pet is and what it is doing is not saved, that lives in
 * `PixelPalsEngine`.
 *
 * Locks: the master lists' `unlocked` decides, except for the entries a lock action changed. `unlockedPets` and
 * `unlockedBackgrounds` hold only those, so a later change to a master list still reaches every entry no action
 * touched. `useGetUnlockedPets` and `useGetUnlockedBackgrounds` give the result for every entry.
 *
 * Locks only decide what the Spawn and Change background dialogs offer. The actions do not check them, so code can
 * still give a locked pet, and locking a background or a kind of pet leaves the ones already in use as they are.
 *
 * Weather works the same way: the master list's `particles.defaultLevel` decides, except for the backgrounds whose
 * slider the person moved. `userPixelPetParticleLevels` holds only those, and `useGetParticleLevels` gives every level.
 *
 * `skipHydration` is on: the server renders the defaults, and `usePixelPetsStoreHydration` loads the saved state after
 * mount. Reading local storage while rendering would make the first client render differ from the server's.
 */
interface PixelPetsState {
  /** How many pets can be out at once. The Spawn button is disabled at it. */
  userPixelPetCount: number;
  /** The id of the background (theme) Pixel Pals shows. */
  userPixelPetBackground: PixelPalsThemeId;
  /** The pets out, as the person made them. `getResolvedPixelPets` fills in the rest from the master list. */
  userPixelPets: PixelPet[];
  /** Per background id, whether it can be picked: only the backgrounds a lock action changed. */
  unlockedBackgrounds: PixelPetSavedUnlockedBackgrounds;
  /** Per kind of pet (`petId`), whether it can be picked: only the kinds a lock action changed. */
  unlockedPets: PixelPetSavedUnlockedPets;
  /** Per background id, how much weather (0 to 100): only the backgrounds the person set a level for. */
  userPixelPetParticleLevels: PixelPetSavedParticleLevels;

  actions: PixelPetsActions;
}

type PixelPetsPersistedState = Omit<PixelPetsState, 'actions'>;

export const PIXEL_PALS_DEFAULT_PETS: PixelPet[] = [{ id: 'pixel-pals-default-dog', petId: 'dog', color: 'brown' }];

function toValidPetCount(count: number): number {
  if (!Number.isFinite(count)) {
    return PIXEL_PALS_DEFAULT_PET_COUNT;
  }
  return Math.min(PIXEL_PALS_MAX_PET_COUNT, Math.max(PIXEL_PALS_MIN_PET_COUNT, Math.round(count)));
}

/**
 * Keeps the pets that still exist in the master list with one of their colors, once per id, up to the most there can
 * ever be. The engine and React key each pet by its id, so a repeated id keeps only its first pet.
 */
function toValidPets(values: readonly unknown[]): PixelPet[] {
  const seenIds = new Set<string>();
  const pets: PixelPet[] = [];
  values.forEach((value: unknown) => {
    const parsed = pixelPetSchema.safeParse(value);
    if (!parsed.success || seenIds.has(parsed.data.id)) {
      return;
    }
    seenIds.add(parsed.data.id);
    const { id, petId, color, nickName } = parsed.data;
    pets.push(nickName === undefined ? { id, petId, color } : { id, petId, color, nickName });
  });
  return pets.slice(0, PIXEL_PALS_MAX_PET_COUNT);
}

export const usePixelPetsStore = create<PixelPetsState>()(
  persist(
    (set, get) => {
      return {
        userPixelPetCount: PIXEL_PALS_DEFAULT_PET_COUNT,
        userPixelPetBackground: PIXEL_PALS_DEFAULT_THEME_ID,
        userPixelPets: PIXEL_PALS_DEFAULT_PETS,
        unlockedBackgrounds: {},
        unlockedPets: {},
        userPixelPetParticleLevels: {},

        actions: {
          setUserPixelPetCount: (count: number) => {
            set(() => {
              return { userPixelPetCount: toValidPetCount(count) };
            });
          },
          setUserPixelPetBackground: (backgroundId: PixelPalsThemeId) => {
            set(() => {
              return { userPixelPetBackground: backgroundId };
            });
          },
          setUserPixelPetParticleLevel: (backgroundId: PixelPalsThemeId, level: number) => {
            if (!hasPixelPalsParticles(backgroundId)) {
              return;
            }
            set((state: PixelPetsState) => {
              return { userPixelPetParticleLevels: { ...state.userPixelPetParticleLevels, [backgroundId]: toValidParticleLevel(level) } };
            });
          },
          setUserPixelPets: (pets: PixelPet[]) => {
            set(() => {
              return { userPixelPets: toValidPets(pets) };
            });
          },
          addUserPixelPet: (newPet: NewPixelPet) => {
            const { userPixelPets, userPixelPetCount } = get();
            if (userPixelPets.length >= userPixelPetCount) {
              return null;
            }
            const nickName: string | undefined = newPet.nickName?.trim() || undefined;
            const [pet] = toValidPets([{ id: createPixelPalsId(), petId: newPet.petId, color: newPet.color, nickName }]);
            if (pet === undefined) {
              return null;
            }
            set((state: PixelPetsState) => {
              return { userPixelPets: [...state.userPixelPets, pet] };
            });
            return pet;
          },
          removeUserPixelPet: (id: string) => {
            set((state: PixelPetsState) => {
              return {
                userPixelPets: state.userPixelPets.filter((pet: PixelPet) => {
                  return pet.id !== id;
                }),
              };
            });
          },

          setPetUnlocked: (petId: PixelPetId, isUnlocked: boolean) => {
            set((state: PixelPetsState) => {
              return { unlockedPets: { ...state.unlockedPets, [petId]: isUnlocked } };
            });
          },
          unlockAllPets: () => {
            set(() => {
              return { unlockedPets: getAllUnlockedPets(true) };
            });
          },
          lockAllPets: () => {
            set(() => {
              return { unlockedPets: getAllUnlockedPets(false) };
            });
          },
          setBackgroundUnlocked: (backgroundId: PixelPalsThemeId, isUnlocked: boolean) => {
            set((state: PixelPetsState) => {
              return { unlockedBackgrounds: { ...state.unlockedBackgrounds, [backgroundId]: isUnlocked } };
            });
          },
          unlockAllBackgrounds: () => {
            set(() => {
              return { unlockedBackgrounds: getAllUnlockedBackgrounds(true) };
            });
          },
          lockAllBackgrounds: () => {
            set(() => {
              return { unlockedBackgrounds: getAllUnlockedBackgrounds(false) };
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
      partialize: (state: PixelPetsState): PixelPetsPersistedState => {
        return {
          userPixelPetCount: state.userPixelPetCount,
          userPixelPetBackground: state.userPixelPetBackground,
          userPixelPets: state.userPixelPets,
          unlockedBackgrounds: state.unlockedBackgrounds,
          unlockedPets: state.unlockedPets,
          userPixelPetParticleLevels: state.userPixelPetParticleLevels,
        };
      },
      // version 1 saved every lock, not only the ones an action changed: drop them, so the master lists decide again.
      // `merge` checks the rest.
      migrate: (persistedState: unknown, version: number): PixelPetsPersistedState => {
        const state = (typeof persistedState === 'object' && persistedState !== null ? persistedState : {}) as PixelPetsPersistedState;
        if (version < 2) {
          return { ...state, unlockedPets: {}, unlockedBackgrounds: {} };
        }
        return state;
      },
      // the saved value is checked: a hand edited or older one falls back to the defaults, value by value
      merge: (persistedState: unknown, currentState: PixelPetsState): PixelPetsState => {
        const parsed = pixelPetsPersistedStateSchema.safeParse(persistedState);
        if (!parsed.success) {
          return currentState;
        }
        return {
          ...currentState,
          userPixelPetCount: parsed.data.userPixelPetCount,
          userPixelPetBackground: parsed.data.userPixelPetBackground,
          userPixelPets: toValidPets(parsed.data.userPixelPets),
          unlockedBackgrounds: toValidSavedUnlockedBackgrounds(parsed.data.unlockedBackgrounds),
          unlockedPets: toValidSavedUnlockedPets(parsed.data.unlockedPets),
          userPixelPetParticleLevels: toValidSavedParticleLevels(parsed.data.userPixelPetParticleLevels),
        };
      },
    },
  ),
);

export const usePixelPetStoreActions = () => {
  return usePixelPetsStore((state: PixelPetsState) => {
    return state.actions;
  });
};
export const useGetUserPixelPetCount = () => {
  return usePixelPetsStore((state: PixelPetsState) => {
    return state.userPixelPetCount;
  });
};
export const useGetUserPixelPetBackground = () => {
  return usePixelPetsStore((state: PixelPetsState) => {
    return state.userPixelPetBackground;
  });
};
export const useGetUserPixelPets = () => {
  return usePixelPetsStore((state: PixelPetsState) => {
    return state.userPixelPets;
  });
};
/** Whether every background can be picked: what a lock action set, else the master list. */
export const useGetUnlockedBackgrounds = (): PixelPetUnlockedBackgrounds => {
  const savedUnlockedBackgrounds: PixelPetSavedUnlockedBackgrounds = usePixelPetsStore((state: PixelPetsState) => {
    return state.unlockedBackgrounds;
  });
  return useMemo(() => {
    return getUnlockedBackgrounds(savedUnlockedBackgrounds);
  }, [savedUnlockedBackgrounds]);
};
/** Whether every kind of pet can be picked: what a lock action set, else the master list. */
export const useGetUnlockedPets = (): PixelPetUnlockedPets => {
  const savedUnlockedPets: PixelPetSavedUnlockedPets = usePixelPetsStore((state: PixelPetsState) => {
    return state.unlockedPets;
  });
  return useMemo(() => {
    return getUnlockedPets(savedUnlockedPets);
  }, [savedUnlockedPets]);
};
/** How much weather every background has: the level the person set, else the master list's. */
export const useGetParticleLevels = (): PixelPetParticleLevels => {
  const savedParticleLevels: PixelPetSavedParticleLevels = usePixelPetsStore((state: PixelPetsState) => {
    return state.userPixelPetParticleLevels;
  });
  return useMemo(() => {
    return getParticleLevels(savedParticleLevels);
  }, [savedParticleLevels]);
};
/** How many pets are out now, as opposed to `useGetUserPixelPetCount`, how many can be. */
export const useGetSpawnedPixelPetCount = () => {
  return usePixelPetsStore((state: PixelPetsState) => {
    return state.userPixelPets.length;
  });
};
