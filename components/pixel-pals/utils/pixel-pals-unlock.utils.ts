import { PIXEL_PALS_PETS, PIXEL_PALS_PET_IDS } from '../constants/pixel-pals-pets.constants';
import { PIXEL_PALS_THEMES, PIXEL_PALS_THEME_IDS } from '../constants/pixel-pals-themes.constants';

import type {
  PixelPetId,
  PixelPalsThemeId,
  PixelPetUnlockedPets,
  PixelPetSavedUnlockedPets,
  PixelPetUnlockedBackgrounds,
  PixelPetSavedUnlockedBackgrounds,
} from '../models/pixel-pals.models';

/**
 * Locks of the pets and the backgrounds. The master lists' `unlocked` decides, except for the entries a lock action
 * changed: `unlockedPets` and `unlockedBackgrounds` in the pixel-pets store hold only those, and they win. So a change
 * to a master list reaches everyone, apart from the entries an action set for them.
 */

/** Whether every kind of pet can be picked: its saved value when a lock action changed it, else its master list one. */
export function getUnlockedPets(saved: PixelPetSavedUnlockedPets): PixelPetUnlockedPets {
  const unlockedPets = {} as PixelPetUnlockedPets;
  PIXEL_PALS_PET_IDS.forEach((petId: PixelPetId) => {
    unlockedPets[petId] = saved[petId] ?? PIXEL_PALS_PETS[petId].unlocked;
  });
  return unlockedPets;
}

/** Whether every background can be picked, like `getUnlockedPets`. */
export function getUnlockedBackgrounds(saved: PixelPetSavedUnlockedBackgrounds): PixelPetUnlockedBackgrounds {
  const unlockedBackgrounds = {} as PixelPetUnlockedBackgrounds;
  PIXEL_PALS_THEME_IDS.forEach((backgroundId: PixelPalsThemeId) => {
    unlockedBackgrounds[backgroundId] = saved[backgroundId] ?? PIXEL_PALS_THEMES[backgroundId].unlocked;
  });
  return unlockedBackgrounds;
}

/** The saved `unlockedPets`, checked on load: an entry for a kind no longer in the master list, or not a boolean, is dropped. */
export function toValidSavedUnlockedPets(saved: Record<string, unknown>): PixelPetSavedUnlockedPets {
  const unlockedPets: PixelPetSavedUnlockedPets = {};
  PIXEL_PALS_PET_IDS.forEach((petId: PixelPetId) => {
    const value: unknown = saved[petId];
    if (typeof value === 'boolean') {
      unlockedPets[petId] = value;
    }
  });
  return unlockedPets;
}

/** The saved `unlockedBackgrounds`, checked on load like `toValidSavedUnlockedPets`. */
export function toValidSavedUnlockedBackgrounds(saved: Record<string, unknown>): PixelPetSavedUnlockedBackgrounds {
  const unlockedBackgrounds: PixelPetSavedUnlockedBackgrounds = {};
  PIXEL_PALS_THEME_IDS.forEach((backgroundId: PixelPalsThemeId) => {
    const value: unknown = saved[backgroundId];
    if (typeof value === 'boolean') {
      unlockedBackgrounds[backgroundId] = value;
    }
  });
  return unlockedBackgrounds;
}

/** Every kind of pet open, or every one locked. */
export function getAllUnlockedPets(isUnlocked: boolean): PixelPetUnlockedPets {
  const unlockedPets = {} as PixelPetUnlockedPets;
  PIXEL_PALS_PET_IDS.forEach((petId: PixelPetId) => {
    unlockedPets[petId] = isUnlocked;
  });
  return unlockedPets;
}

/** Every background open, or every one locked. */
export function getAllUnlockedBackgrounds(isUnlocked: boolean): PixelPetUnlockedBackgrounds {
  const unlockedBackgrounds = {} as PixelPetUnlockedBackgrounds;
  PIXEL_PALS_THEME_IDS.forEach((backgroundId: PixelPalsThemeId) => {
    unlockedBackgrounds[backgroundId] = isUnlocked;
  });
  return unlockedBackgrounds;
}
