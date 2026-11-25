import { PIXEL_PALS_MIN_HEIGHT_PX } from '../constants/pixel-pals-height.constants';
import { PIXEL_PALS_MAX_HEIGHT_PX, PIXEL_PALS_DEFAULT_HEIGHT_PX } from '../constants/pixel-pals.constants';

/** Keeps a height between the min and the max. Safe to use on the server. */
export function clampPixelPalsHeight(height: number): number {
  if (!Number.isFinite(height)) {
    return PIXEL_PALS_DEFAULT_HEIGHT_PX;
  }
  return Math.round(Math.min(PIXEL_PALS_MAX_HEIGHT_PX, Math.max(PIXEL_PALS_MIN_HEIGHT_PX, height)));
}

/**
 * Reads the height cookie's value. A missing or broken value (anything but whole pixels, e.g. `150px`) gives the
 * default height. Safe to use on the server.
 */
export function parsePixelPalsHeight(value: string | undefined | null): number {
  if (!value || !/^\d+$/.test(value)) {
    return PIXEL_PALS_DEFAULT_HEIGHT_PX;
  }
  return clampPixelPalsHeight(Number(value));
}
