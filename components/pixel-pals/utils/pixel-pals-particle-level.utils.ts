import { PIXEL_PALS_THEMES, PIXEL_PALS_THEME_IDS } from '../constants/pixel-pals-themes.constants';
import { pixelPalsParticleLevelSchema } from '../schemas/pixel-pets-persisted-state.schema';
import { PIXEL_PALS_PARTICLE_LEVEL_MAX, PIXEL_PALS_PARTICLE_LEVEL_MIN } from '../constants/pixel-pals-particles.constants';

import type { PixelPalsThemeId, PixelPetParticleLevels, PixelPetSavedParticleLevels } from '../models/pixel-pals.models';

/**
 * How much weather each background has, 0 (none) to 100. Like the locks, the master list's `particles.defaultLevel`
 * decides, except for the backgrounds the person set a level for: `userPixelPetParticleLevels` in the pixel-pets store
 * holds only those. A background with no `particles` is always 0.
 */

/** A level rounded and kept in 0 to 100. */
export function toValidParticleLevel(level: number): number {
  if (!Number.isFinite(level)) {
    return PIXEL_PALS_PARTICLE_LEVEL_MIN;
  }
  return Math.min(PIXEL_PALS_PARTICLE_LEVEL_MAX, Math.max(PIXEL_PALS_PARTICLE_LEVEL_MIN, Math.round(level)));
}

/** Whether this background has weather to turn up. */
export function hasPixelPalsParticles(themeId: PixelPalsThemeId): boolean {
  return PIXEL_PALS_THEMES[themeId].particles !== undefined;
}

/** Every background's level: the one the person set, else the master list's. */
export function getParticleLevels(saved: PixelPetSavedParticleLevels): PixelPetParticleLevels {
  const levels = {} as PixelPetParticleLevels;
  PIXEL_PALS_THEME_IDS.forEach((themeId: PixelPalsThemeId) => {
    const defaultLevel: number = PIXEL_PALS_THEMES[themeId].particles?.defaultLevel ?? PIXEL_PALS_PARTICLE_LEVEL_MIN;
    levels[themeId] = hasPixelPalsParticles(themeId) ? (saved[themeId] ?? defaultLevel) : PIXEL_PALS_PARTICLE_LEVEL_MIN;
  });
  return levels;
}

/** The saved `userPixelPetParticleLevels`, checked on load: only backgrounds with weather, and whole numbers in 0 to 100. */
export function toValidSavedParticleLevels(saved: Record<string, unknown>): PixelPetSavedParticleLevels {
  const levels: PixelPetSavedParticleLevels = {};
  PIXEL_PALS_THEME_IDS.forEach((themeId: PixelPalsThemeId) => {
    const parsed = pixelPalsParticleLevelSchema.safeParse(saved[themeId]);
    if (parsed.success && hasPixelPalsParticles(themeId)) {
      levels[themeId] = parsed.data;
    }
  });
  return levels;
}
