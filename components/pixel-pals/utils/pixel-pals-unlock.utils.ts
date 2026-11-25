import { PIXEL_PALS_PETS, PIXEL_PALS_PET_IDS } from '../constants/pixel-pals-pets.constants';
import { PIXEL_PALS_THEMES, PIXEL_PALS_THEME_IDS } from '../constants/pixel-pals-themes.constants';

import type { PixelPetId, PixelPalsThemeId, PixelPetUnlockedPets, PixelPetUnlockedBackgrounds } from '../models/pixel-pals.models';

/**
 * Locks of the pets and the backgrounds. What the person can pick is `unlockedPets` and `unlockedBackgrounds` in the
 * pixel-pets store: one `true` or `false` per entry of the master lists. A saved value always wins. The master lists'
 * `unlocked` is only the default, for a person with nothing saved yet and for an entry added to a list later.
 */

/** One entry: its saved `true` or `false`, or else its master list default. */
function getUnlockedValue(saved: unknown, masterUnlocked: boolean): boolean {
  return typeof saved === 'boolean' ? saved : masterUnlocked;
}

/**
 * `unlockedPets` rebuilt on the master list, one entry per kind of pet: a saved `true` or `false` is kept, a missing or
 * broken one takes the master list default, and a kind that is no longer in the list is dropped. With nothing saved,
 * these are the defaults.
 */
export function toValidUnlockedPets(saved: Record<string, unknown> = {}): PixelPetUnlockedPets {
  const unlockedPets = {} as PixelPetUnlockedPets;
  PIXEL_PALS_PET_IDS.forEach((petId: PixelPetId) => {
    unlockedPets[petId] = getUnlockedValue(saved[petId], PIXEL_PALS_PETS[petId].unlocked);
  });
  return unlockedPets;
}

/** `unlockedBackgrounds` rebuilt on the master list of themes, like `toValidUnlockedPets`. */
export function toValidUnlockedBackgrounds(saved: Record<string, unknown> = {}): PixelPetUnlockedBackgrounds {
  const unlockedBackgrounds = {} as PixelPetUnlockedBackgrounds;
  PIXEL_PALS_THEME_IDS.forEach((backgroundId: PixelPalsThemeId) => {
    unlockedBackgrounds[backgroundId] = getUnlockedValue(saved[backgroundId], PIXEL_PALS_THEMES[backgroundId].unlocked);
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
