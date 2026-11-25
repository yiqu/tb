import { SIDE_NAV_MAX_WIDTH_PX, SIDE_NAV_MIN_WIDTH_PX, SIDE_NAV_DEFAULT_WIDTH_PX } from '@/constants/side-nav-resize.constants';

/** Keeps a left nav width between the min and the max. */
export function clampSideNavWidth(width: number): number {
  if (!Number.isFinite(width)) {
    return SIDE_NAV_DEFAULT_WIDTH_PX;
  }
  return Math.round(Math.min(SIDE_NAV_MAX_WIDTH_PX, Math.max(SIDE_NAV_MIN_WIDTH_PX, width)));
}

/** Reads the width cookie's value. A missing or broken value gives the default width. */
export function parseSideNavWidth(value: string | undefined | null): number {
  if (!value) {
    return SIDE_NAV_DEFAULT_WIDTH_PX;
  }
  const parsed: number = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? SIDE_NAV_DEFAULT_WIDTH_PX : clampSideNavWidth(parsed);
}
