/** Dragging the right edge of the left nav to resize it. Widths are px. */

/** Holds the width the left nav was dragged to. Read on the server and by the boot script, so a reload never shifts the layout. */
export const SIDE_NAV_WIDTH_COOKIE_NAME = 'sidebar_width';
export const SIDE_NAV_WIDTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** The width before it is resized, the same as shadcn's `16rem`. */
export const SIDE_NAV_DEFAULT_WIDTH_PX = 256;
export const SIDE_NAV_MIN_WIDTH_PX = 200;
export const SIDE_NAV_MAX_WIDTH_PX = 560;
/** Dragged narrower than this, the left nav collapses to its icons. Dragging a collapsed nav past it opens it again. */
export const SIDE_NAV_COLLAPSE_THRESHOLD_PX = 140;
/** How much one arrow key press on the resize handle changes the width. */
export const SIDE_NAV_WIDTH_KEYBOARD_STEP_PX = 16;

/** The CSS variable the boot script sets on `<html>` from the cookie, for the app shell skeleton. */
export const SHELL_SIDE_NAV_WIDTH_CSS_VARIABLE = '--shell-sidenav-width';
