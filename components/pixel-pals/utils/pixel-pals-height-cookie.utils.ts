import { PIXEL_PALS_HEIGHT_COOKIE_NAME, PIXEL_PALS_HEIGHT_COOKIE_MAX_AGE_SECONDS } from '../constants/pixel-pals.constants';

/** Saves the Pixel Pals height from the browser. The server reads it to render Pixel Pals at that height on the next load. */
export function writePixelPalsHeightCookie(height: number): void {
  document.cookie = `${PIXEL_PALS_HEIGHT_COOKIE_NAME}=${Math.round(height)}; path=/; max-age=${PIXEL_PALS_HEIGHT_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}
