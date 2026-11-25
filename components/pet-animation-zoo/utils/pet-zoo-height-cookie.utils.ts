import { PET_ZOO_HEIGHT_COOKIE_NAME, PET_ZOO_HEIGHT_COOKIE_MAX_AGE_SECONDS } from '../constants/pet-zoo.constants';

/** Saves the zoo height from the browser. The server reads it to render the zoo at that height on the next load. */
export function writePetZooHeightCookie(height: number): void {
  document.cookie = `${PET_ZOO_HEIGHT_COOKIE_NAME}=${Math.round(height)}; path=/; max-age=${PET_ZOO_HEIGHT_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}
