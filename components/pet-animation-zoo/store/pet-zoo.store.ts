import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { createPetZooId } from '../utils/pet-zoo-random.utils';
import { petZooLocalStorage } from '../utils/pet-zoo-storage.utils';
import { PET_ZOO_PETS } from '../constants/pet-zoo-pets.constants';
import { PET_ZOO_DEFAULT_THEME_ID } from '../constants/pet-zoo-themes.constants';
import { petZooPetSchema, petZooPersistedStateSchema } from '../schemas/pet-zoo-persisted-state.schema';
import { PET_ZOO_MAX_PETS, PET_ZOO_STORAGE_KEY, PET_ZOO_STORAGE_VERSION } from '../constants/pet-zoo.constants';

import type { PetZooPet, PetZooNewPet, PetZooThemeId } from '../models/pet-zoo.models';

interface PetZooActions {
  /** Adds a pet, unless the zoo is full. Returns the new pet, or null when it was full. */
  addPet: (_newPet: PetZooNewPet) => PetZooPet | null;
  removePet: (_petId: string) => void;
  setTheme: (_themeId: PetZooThemeId) => void;
}

/**
 * The pets in the zoo and its background. Saved to local storage, so both are back after a refresh.
 * Where each pet is and what it is doing is not saved, that lives in `PetZooEngine`.
 *
 * `skipHydration` is on: the server renders the defaults, and `usePetZooStoreHydration` loads the saved
 * state after mount. Reading local storage while rendering would make the first client render differ from
 * the server's.
 */
interface PetZooState {
  pets: PetZooPet[];
  themeId: PetZooThemeId;

  actions: PetZooActions;
}

type PetZooPersistedState = Pick<PetZooState, 'pets' | 'themeId'>;

export const PET_ZOO_DEFAULT_PETS: PetZooPet[] = [
  { id: 'pet-zoo-default-dog', type: 'dog', color: 'brown', name: PET_ZOO_PETS.dog.defaultName },
];

/**
 * Keeps only the saved pets that still exist in the catalog, once per id, up to the cap. The engine and React
 * key each pet by its id, so a repeated id (from a hand-edited value) keeps only its first pet.
 */
function toValidPets(values: unknown[]): PetZooPet[] {
  const seenIds = new Set<string>();
  return values
    .map((value: unknown) => {
      return petZooPetSchema.safeParse(value);
    })
    .filter((result) => {
      return result.success;
    })
    .map((result) => {
      return result.data as PetZooPet;
    })
    .filter((pet: PetZooPet) => {
      if (seenIds.has(pet.id)) {
        return false;
      }
      seenIds.add(pet.id);
      return true;
    })
    .slice(0, PET_ZOO_MAX_PETS);
}

export const usePetZooStore = create<PetZooState>()(
  persist(
    (set, get) => {
      return {
        pets: PET_ZOO_DEFAULT_PETS,
        themeId: PET_ZOO_DEFAULT_THEME_ID,

        actions: {
          addPet: (newPet: PetZooNewPet) => {
            if (get().pets.length >= PET_ZOO_MAX_PETS) {
              return null;
            }
            const pet: PetZooPet = { id: createPetZooId(), type: newPet.type, color: newPet.color, name: newPet.name.trim() };
            set((state: PetZooState) => {
              return { pets: [...state.pets, pet] };
            });
            return pet;
          },
          removePet: (petId: string) => {
            set((state: PetZooState) => {
              return {
                pets: state.pets.filter((pet: PetZooPet) => {
                  return pet.id !== petId;
                }),
              };
            });
          },
          setTheme: (themeId: PetZooThemeId) => {
            set(() => {
              return { themeId };
            });
          },
        },
      };
    },
    {
      name: PET_ZOO_STORAGE_KEY,
      version: PET_ZOO_STORAGE_VERSION,
      storage: createJSONStorage(() => {
        return petZooLocalStorage;
      }),
      skipHydration: true,
      partialize: (state: PetZooState): PetZooPersistedState => {
        return { pets: state.pets, themeId: state.themeId };
      },
      merge: (persistedState: unknown, currentState: PetZooState): PetZooState => {
        const parsed = petZooPersistedStateSchema.safeParse(persistedState);
        if (!parsed.success) {
          return currentState;
        }
        return { ...currentState, pets: toValidPets(parsed.data.pets), themeId: parsed.data.themeId };
      },
    },
  ),
);

export const usePetZooActions = () => {
  return usePetZooStore((state: PetZooState) => {
    return state.actions;
  });
};
export const usePetZooPets = () => {
  return usePetZooStore((state: PetZooState) => {
    return state.pets;
  });
};
export const usePetZooThemeId = () => {
  return usePetZooStore((state: PetZooState) => {
    return state.themeId;
  });
};
export const usePetZooPetCount = () => {
  return usePetZooStore((state: PetZooState) => {
    return state.pets.length;
  });
};
