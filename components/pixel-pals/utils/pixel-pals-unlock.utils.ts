import { DateTime } from 'luxon';

import { PIXEL_PALS_TIME_ZONE } from '../constants/pixel-pals.constants';
import { PIXEL_PALS_PETS, PIXEL_PALS_PET_TYPES } from '../constants/pixel-pals-pets.constants';
import { PIXEL_PALS_THEMES, PIXEL_PALS_THEME_IDS } from '../constants/pixel-pals-themes.constants';

import type { PixelPalsUnlock, PixelPalsUnlocks, PixelPalsPetType, PixelPalsThemeId } from '../models/pixel-pals.models';

/**
 * Locks of the pets and the themes. Each has its lock in its master list (`unlocked` in `PIXEL_PALS_PETS` and
 * `PIXEL_PALS_THEMES`) and an entry in the saved `PixelPalsUnlocks`, which only says what the person earned. It is unlocked
 * when either one says so: a pet the master list opens up is open for everyone, and one the person earned stays open
 * for them. A pet that the master list locks again is locked for everyone who did not earn it, even if it was open
 * when they last came.
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

/** A boolean, or a time Luxon can show (a hand-edited huge number would read "Invalid DateTime" on the lock). */
export function isPixelPalsUnlockValue(value: unknown): value is PixelPalsUnlock {
  return typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value) && DateTime.fromMillis(value).isValid);
}

/** Nothing earned yet: one `false` entry per pet and theme of the master lists, the start of the saved unlocks. */
export function getEmptyPixelPalsUnlocks(): PixelPalsUnlocks {
  const pets = {} as Record<PixelPalsPetType, PixelPalsUnlock>;
  PIXEL_PALS_PET_TYPES.forEach((type: PixelPalsPetType) => {
    pets[type] = false;
  });
  const themes = {} as Record<PixelPalsThemeId, PixelPalsUnlock>;
  PIXEL_PALS_THEME_IDS.forEach((id: PixelPalsThemeId) => {
    themes[id] = false;
  });
  return { pets, themes };
}

/**
 * Rebuilds the earned unlocks read from local storage on the master lists: an entry whose pet or theme is no longer
 * in its list is dropped, a new one starts as not earned, and a broken value counts as not earned.
 */
export function toValidPixelPalsUnlocks(saved: { pets: Record<string, unknown>; themes: Record<string, unknown> }): PixelPalsUnlocks {
  const unlocks: PixelPalsUnlocks = getEmptyPixelPalsUnlocks();
  PIXEL_PALS_PET_TYPES.forEach((type: PixelPalsPetType) => {
    const value: unknown = saved.pets[type];
    if (isPixelPalsUnlockValue(value)) {
      unlocks.pets[type] = value;
    }
  });
  PIXEL_PALS_THEME_IDS.forEach((id: PixelPalsThemeId) => {
    const value: unknown = saved.themes[id];
    if (isPixelPalsUnlockValue(value)) {
      unlocks.themes[id] = value;
    }
  });
  return unlocks;
}

export function isPixelPalsPetTypeUnlocked(type: PixelPalsPetType, unlocks: PixelPalsUnlocks, now: DateTime = getPixelPalsNow()): boolean {
  return isPixelPalsUnlockReached(PIXEL_PALS_PETS[type].unlocked, now) || isPixelPalsUnlockReached(unlocks.pets[type], now);
}

export function isPixelPalsThemeUnlocked(id: PixelPalsThemeId, unlocks: PixelPalsUnlocks, now: DateTime = getPixelPalsNow()): boolean {
  return isPixelPalsUnlockReached(PIXEL_PALS_THEMES[id].unlocked, now) || isPixelPalsUnlockReached(unlocks.themes[id], now);
}

/** The earliest day a locked pet or theme opens, e.g. "Dec 25", in Eastern time. Null when neither value is a date. */
export function getPixelPalsUnlockDateLabel(...unlocks: readonly PixelPalsUnlock[]): string | null {
  const times: number[] = unlocks.filter((unlock: PixelPalsUnlock): unlock is number => {
    return typeof unlock === 'number';
  });
  if (times.length === 0) {
    return null;
  }
  return DateTime.fromMillis(Math.min(...times), { zone: PIXEL_PALS_TIME_ZONE }).toFormat('LLL d');
}
