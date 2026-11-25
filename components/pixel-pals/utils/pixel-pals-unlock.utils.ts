import { DateTime } from 'luxon';

import { PIXEL_PALS_TIME_ZONE } from '../constants/pixel-pals.constants';
import { PIXEL_PALS_PETS, PIXEL_PALS_PET_IDS } from '../constants/pixel-pals-pets.constants';
import { PIXEL_PALS_THEMES, PIXEL_PALS_THEME_IDS } from '../constants/pixel-pals-themes.constants';

import type {
  PixelPetId,
  PixelPalsUnlock,
  PixelPalsThemeId,
  PixelPetUnlockedPets,
  PixelPetUnlockedBackgrounds,
} from '../models/pixel-pals.models';

/**
 * Locks of the pets and the backgrounds. What the person can pick is `unlockedPets` and `unlockedBackgrounds` in the
 * pixel-pets store: one `true` or `false` per entry of the master lists. The master lists' `unlocked` is only the
 * default, for a person with nothing saved yet and for an entry added to a list later. A master list date is the one
 * exception: from that day on the entry is open, whatever was saved before, like an unlock scheduled for that day.
 */

export function getPixelPalsNow(): DateTime {
  return DateTime.now().setZone(PIXEL_PALS_TIME_ZONE);
}

/** `true`, `false`, or reached when it is a time. */
export function isPixelPalsUnlockReached(unlock: PixelPalsUnlock, now: DateTime): boolean {
  if (typeof unlock === 'boolean') {
    return unlock;
  }
  return now.toMillis() >= unlock;
}

/** One entry: its saved `true` or `false`, or else its master list default. Open once its master list date has come. */
function getUnlockedValue(saved: unknown, masterUnlock: PixelPalsUnlock, now: DateTime): boolean {
  if (typeof masterUnlock === 'number' && isPixelPalsUnlockReached(masterUnlock, now)) {
    return true;
  }
  return typeof saved === 'boolean' ? saved : isPixelPalsUnlockReached(masterUnlock, now);
}

/**
 * `unlockedPets` rebuilt on the master list, one entry per kind of pet: a saved `true` or `false` is kept, a missing or
 * broken one takes the master list default, and a kind that is no longer in the list is dropped. With nothing saved,
 * these are the defaults.
 */
export function toValidUnlockedPets(saved: Record<string, unknown> = {}, now: DateTime = getPixelPalsNow()): PixelPetUnlockedPets {
  const unlockedPets = {} as PixelPetUnlockedPets;
  PIXEL_PALS_PET_IDS.forEach((petId: PixelPetId) => {
    unlockedPets[petId] = getUnlockedValue(saved[petId], PIXEL_PALS_PETS[petId].unlocked, now);
  });
  return unlockedPets;
}

/** `unlockedBackgrounds` rebuilt on the master list of themes, like `toValidUnlockedPets`. */
export function toValidUnlockedBackgrounds(
  saved: Record<string, unknown> = {},
  now: DateTime = getPixelPalsNow(),
): PixelPetUnlockedBackgrounds {
  const unlockedBackgrounds = {} as PixelPetUnlockedBackgrounds;
  PIXEL_PALS_THEME_IDS.forEach((backgroundId: PixelPalsThemeId) => {
    unlockedBackgrounds[backgroundId] = getUnlockedValue(saved[backgroundId], PIXEL_PALS_THEMES[backgroundId].unlocked, now);
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

/** The day a locked pet or background opens, e.g. "Dec 25" in Eastern time, while its master list date is ahead. */
export function getPixelPalsUnlockDateLabel(unlock: PixelPalsUnlock, now: DateTime = getPixelPalsNow()): string | null {
  if (typeof unlock !== 'number' || isPixelPalsUnlockReached(unlock, now)) {
    return null;
  }
  return DateTime.fromMillis(unlock, { zone: PIXEL_PALS_TIME_ZONE }).toFormat('LLL d');
}
