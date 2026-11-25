import { PET_ZOO_MAX_HEIGHT_PX, PET_ZOO_MIN_HEIGHT_PX, PET_ZOO_DEFAULT_HEIGHT_PX } from '../constants/pet-zoo.constants';

/** Keeps a height between the min and the max. Safe to use on the server. */
export function clampPetZooHeight(height: number): number {
  if (!Number.isFinite(height)) {
    return PET_ZOO_DEFAULT_HEIGHT_PX;
  }
  return Math.round(Math.min(PET_ZOO_MAX_HEIGHT_PX, Math.max(PET_ZOO_MIN_HEIGHT_PX, height)));
}

/**
 * Reads the height cookie's value. A missing or broken value (anything but whole pixels, e.g. `150px`) gives the
 * default height. Safe to use on the server.
 */
export function parsePetZooHeight(value: string | undefined | null): number {
  if (!value || !/^\d+$/.test(value)) {
    return PET_ZOO_DEFAULT_HEIGHT_PX;
  }
  return clampPetZooHeight(Number(value));
}
