import { DateTime } from 'luxon';

import { PET_ZOO_TIME_ZONE } from '../constants/pet-zoo.constants';
import { PET_ZOO_PETS, PET_ZOO_PET_TYPES } from '../constants/pet-zoo-pets.constants';
import { PET_ZOO_THEMES, PET_ZOO_THEME_IDS } from '../constants/pet-zoo-themes.constants';

import type { PetZooUnlock, PetZooUnlocks, PetZooPetType, PetZooThemeId } from '../models/pet-zoo.models';

/**
 * Locks of the pets and the themes. Each has a default in its master list (`unlocked` in `PET_ZOO_PETS` and
 * `PET_ZOO_THEMES`) and an entry in the saved `PetZooUnlocks`. It is unlocked when either one says so: a pet the
 * master list opens up is open for everyone, and one the person earned stays open for them.
 */

export function getPetZooNow(): DateTime {
  return DateTime.now().setZone(PET_ZOO_TIME_ZONE);
}

/** `true`, `false`, or reached when it is a time. */
export function isPetZooUnlockReached(unlock: PetZooUnlock, now: DateTime): boolean {
  if (typeof unlock === 'boolean') {
    return unlock;
  }
  return now.toMillis() >= unlock;
}

/** A boolean, or a time Luxon can show (a hand-edited huge number would read "Invalid DateTime" on the lock). */
export function isPetZooUnlockValue(value: unknown): value is PetZooUnlock {
  return typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value) && DateTime.fromMillis(value).isValid);
}

/** The master lists' defaults, the start of the saved unlocks. */
export function getDefaultPetZooUnlocks(): PetZooUnlocks {
  const pets = {} as Record<PetZooPetType, PetZooUnlock>;
  PET_ZOO_PET_TYPES.forEach((type: PetZooPetType) => {
    pets[type] = PET_ZOO_PETS[type].unlocked;
  });
  const themes = {} as Record<PetZooThemeId, PetZooUnlock>;
  PET_ZOO_THEME_IDS.forEach((id: PetZooThemeId) => {
    themes[id] = PET_ZOO_THEMES[id].unlocked;
  });
  return { pets, themes };
}

/**
 * Rebuilds the unlocks read from local storage on the master lists: an entry whose pet or theme is no longer in its
 * list is dropped, a new one starts at its default, and a broken value is replaced by the default.
 */
export function toValidPetZooUnlocks(saved: { pets: Record<string, unknown>; themes: Record<string, unknown> }): PetZooUnlocks {
  const unlocks: PetZooUnlocks = getDefaultPetZooUnlocks();
  PET_ZOO_PET_TYPES.forEach((type: PetZooPetType) => {
    const value: unknown = saved.pets[type];
    if (isPetZooUnlockValue(value)) {
      unlocks.pets[type] = value;
    }
  });
  PET_ZOO_THEME_IDS.forEach((id: PetZooThemeId) => {
    const value: unknown = saved.themes[id];
    if (isPetZooUnlockValue(value)) {
      unlocks.themes[id] = value;
    }
  });
  return unlocks;
}

export function isPetZooPetTypeUnlocked(type: PetZooPetType, unlocks: PetZooUnlocks, now: DateTime = getPetZooNow()): boolean {
  return isPetZooUnlockReached(PET_ZOO_PETS[type].unlocked, now) || isPetZooUnlockReached(unlocks.pets[type], now);
}

export function isPetZooThemeUnlocked(id: PetZooThemeId, unlocks: PetZooUnlocks, now: DateTime = getPetZooNow()): boolean {
  return isPetZooUnlockReached(PET_ZOO_THEMES[id].unlocked, now) || isPetZooUnlockReached(unlocks.themes[id], now);
}

/** The earliest day a locked pet or theme opens, e.g. "Dec 25", in Eastern time. Null when neither value is a date. */
export function getPetZooUnlockDateLabel(...unlocks: readonly PetZooUnlock[]): string | null {
  const times: number[] = unlocks.filter((unlock: PetZooUnlock): unlock is number => {
    return typeof unlock === 'number';
  });
  if (times.length === 0) {
    return null;
  }
  return DateTime.fromMillis(Math.min(...times), { zone: PET_ZOO_TIME_ZONE }).toFormat('LLL d');
}
