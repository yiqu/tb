/**
 * Layout, storage and asset settings of Pixel Pals.
 * The art lives in `public/pixel-pals`, change `PIXEL_PALS_ASSET_BASE_URL` if it is served from elsewhere.
 */

export const PIXEL_PALS_ASSET_BASE_URL = '/pixel-pals';

/**
 * Narrower than this, Pixel Pals is hidden (the nav collapsed to icons) or squeezed while the nav opens or closes. The
 * world keeps its last real size then, so the pets keep their places instead of piling up at the left wall.
 */
export const PIXEL_PALS_MIN_WORLD_WIDTH_PX = 120;
/** The height before the person resizes it. */
export const PIXEL_PALS_DEFAULT_HEIGHT_PX = 150;
/** The cap for dragging Pixel Pals taller. Above the art, the theme's fill color takes over. */
export const PIXEL_PALS_MAX_HEIGHT_PX = 420;
/** How much one arrow key press on the resize handle changes the height. */
export const PIXEL_PALS_HEIGHT_KEYBOARD_STEP_PX = 10;

/** The height is kept in a cookie, so the server renders Pixel Pals at the right height and nothing shifts on load. */
export const PIXEL_PALS_HEIGHT_COOKIE_NAME = 'pixel-pals-height';
export const PIXEL_PALS_HEIGHT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** The local storage key of the pets and the theme (Zustand persist). */
export const PIXEL_PALS_STORAGE_KEY = 'pixel-pals-store';
/** 2: the saved unlocks hold only what was earned. Version 1 saved copies of the master lists, which are dropped. */
export const PIXEL_PALS_STORAGE_VERSION = 2;

/** Pets beyond this would not fit in a sidebar, the Spawn button is disabled at the cap. */
export const PIXEL_PALS_MAX_PETS = 10;
export const PIXEL_PALS_PET_NAME_MAX_LENGTH = 20;

/** Every sprite is drawn in a square of this size, like the "nano" size of VS Code Pets, times its kind's `sizeScale`. */
export const PIXEL_PALS_SPRITE_SIZE_PX = 30;
/** The speech bubble font, as in `.pixel-pals-bubble` in `styles/pixel-pals.css`. */
export const PIXEL_PALS_BUBBLE_FONT = "8px 'PixelPalsSilkscreen'";
/**
 * The pixel font of the bubbles and name tags: Silkscreen by Jason Kottke, SIL Open Font License. `PixelPals` renders
 * this instead of the CSS file holding it, so the font is loaded from `PIXEL_PALS_ASSET_BASE_URL` like the art.
 */
export const PIXEL_PALS_FONT_FACE_CSS = `@font-face { font-family: 'PixelPalsSilkscreen'; src: url('${PIXEL_PALS_ASSET_BASE_URL}/fonts/Silkscreen-Regular.ttf') format('truetype'); font-display: swap; }`;

export const PIXEL_PALS_BALL_RADIUS_PX = 3;
/** Unlock dates of locked pets are read and shown in Eastern time. */
export const PIXEL_PALS_TIME_ZONE = 'America/New_York';
export const PIXEL_PALS_BALL_COLOR = '#2ed851';
