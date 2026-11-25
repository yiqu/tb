/**
 * Layout, storage and asset settings of the pet animation zoo.
 * The art lives in `public/pet-animation-zoo`, change `PET_ZOO_ASSET_BASE_URL` if it is served from elsewhere.
 */

export const PET_ZOO_ASSET_BASE_URL = '/pet-animation-zoo';

/** The smallest height the zoo can be dragged to. */
export const PET_ZOO_MIN_HEIGHT_PX = 80;
/** The height before the person resizes it. */
export const PET_ZOO_DEFAULT_HEIGHT_PX = 150;
/** The cap for dragging the zoo taller. Above the art, the theme's fill color takes over. */
export const PET_ZOO_MAX_HEIGHT_PX = 420;
/** How much one arrow key press on the resize handle changes the height. */
export const PET_ZOO_HEIGHT_KEYBOARD_STEP_PX = 10;

/** The height is kept in a cookie, so the server renders the zoo at the right height and nothing shifts on load. */
export const PET_ZOO_HEIGHT_COOKIE_NAME = 'pet-animation-zoo-height';
export const PET_ZOO_HEIGHT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** The local storage key of the pets and the theme (Zustand persist). */
export const PET_ZOO_STORAGE_KEY = 'pet-animation-zoo-store';
export const PET_ZOO_STORAGE_VERSION = 1;

/** Pets beyond this would not fit in a sidebar, the Spawn button is disabled at the cap. */
export const PET_ZOO_MAX_PETS = 10;
export const PET_ZOO_PET_NAME_MAX_LENGTH = 20;

/** Every sprite is drawn in a square of this size, like the "nano" size of VS Code Pets. */
export const PET_ZOO_SPRITE_SIZE_PX = 30;

export const PET_ZOO_BALL_RADIUS_PX = 3;
export const PET_ZOO_BALL_COLOR = '#2ed851';
