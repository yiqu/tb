import type { PixelPalsPetType } from '../constants/pixel-pals-pets.constants';
import type { PixelPalsThemeId } from '../constants/pixel-pals-themes.constants';

export type { PixelPalsPetType, PixelPalsThemeId };

/** The sprite animations a pet can have. Every file is `<color>_<animation>_8fps.gif`. */
export const PIXEL_PALS_ANIMATION = {
  idle: 'idle',
  walk: 'walk',
  walkFast: 'walk_fast',
  run: 'run',
  swipe: 'swipe',
  withBall: 'with_ball',
  lie: 'lie',
  stand: 'stand',
  /** In the air, only pets that can fly have it. */
  fly: 'fly',
} as const;

export type PixelPalsAnimation = (typeof PIXEL_PALS_ANIMATION)[keyof typeof PIXEL_PALS_ANIMATION];

/** `light` or `dark`, follows the `dark` class on `<html>`. Every theme has an image set and a fill color for each. */
export type PixelPalsColorMode = 'light' | 'dark';

export interface PixelPalsPetColorDefinition {
  /** The color as it is spelled in the sprite file names, e.g. `paint_beige`. */
  value: string;
  label: string;
}

/**
 * How a kind of pet talks. Its lines are mixed with the shared ones in `constants/pixel-pals-messages.constants.ts`.
 * `{name}` is replaced by the pet's name and `{sound}` by its sound.
 */
export interface PixelPalsPetVoice {
  /** The sound it makes, e.g. "Woof". */
  sound: string;
  /** What it says when it joins Pixel Pals. */
  greeting: string;
  /** Its own lines: said when it is clicked, or to start a chat with another pet. */
  lines: readonly string[];
}

/**
 * Whether a kind of pet, or a theme, can be picked. `true`: yes. `false`: locked, it shows in its dialog with a lock
 * but cannot be picked. A number: locked until that time (milliseconds since the epoch), for things earned later on.
 */
export type PixelPalsUnlock = boolean | number;

/**
 * The unlock state saved in the browser, one entry per kind of pet and per theme of the master lists
 * (`PIXEL_PALS_PETS`, `PIXEL_PALS_THEMES`). It holds only what the person earned: every entry starts `false`, and an
 * unlock they earn sets it. Something is unlocked when its master list entry or this entry says so (see
 * `pixel-pals-unlock.utils.ts`), so locking an entry in a master list locks it again for everyone who did not earn it.
 */
export interface PixelPalsUnlocks {
  pets: Record<PixelPalsPetType, PixelPalsUnlock>;
  themes: Record<PixelPalsThemeId, PixelPalsUnlock>;
}

/** Everything about one kind of pet. The catalog is `PIXEL_PALS_PETS`. */
export interface PixelPalsPetDefinition {
  type: PixelPalsPetType;
  label: string;
  /** The name the Spawn dialog starts with. The person can type any other name, which is what is saved. */
  defaultName: string;
  emoji: string;
  unlocked: PixelPalsUnlock;
  /** The folder of its sprites, `public/pixel-pals/pets/<spriteFolder>/`. Kinds can share one, like the pandas. */
  spriteFolder: string;
  /** Its size as a factor of `PIXEL_PALS_SPRITE_SIZE_PX`, 1 for most pets. */
  sizeScale: number;
  /** Walking speed in px per second before the per-pet random factor. 0 never moves. */
  speed: number;
  /** Whether it climbs up the left and right walls. */
  canClimb: boolean;
  /** Whether it flies: it takes off now and then, and flies to a ball or to food instead of walking. Needs a `fly` sprite. */
  canFly: boolean;
  colors: readonly PixelPalsPetColorDefinition[];
  /** The animations that have a sprite file, the others fall back (see `getPixelPalsSpriteAnimation`). */
  animations: readonly PixelPalsAnimation[];
  voice: PixelPalsPetVoice;
}

/** One image layer of a theme. `{mode}` in the file name is replaced by `light` or `dark`. */
export interface PixelPalsThemeLayer {
  fileName: string;
  repeat: 'repeat-x' | 'no-repeat';
}

/**
 * A stepping stone the pets stand on, in a theme without solid ground (the lake). The pets walk on the stones and
 * hop from one to the next. The image's top row is the surface they stand on, placed at the theme's `floorPx`.
 */
export interface PixelPalsThemeIsland {
  /** `{mode}` is replaced by `light` or `dark`. */
  fileName: string;
  /** Where its middle is, as a share of Pixel Pals' width, so the stones spread out with Pixel Pals. */
  centerFraction: number;
  /** Width of the image in px, the stone plus the ripples around it. */
  imageWidthPx: number;
  /** Width of the stone itself. A ball floats in the water up to its sides. */
  stoneWidthPx: number;
  /** Width of the part a pet's middle can stand on, centered on the stone. */
  walkWidthPx: number;
}

export interface PixelPalsThemeDefinition {
  id: PixelPalsThemeId;
  label: string;
  unlocked: PixelPalsUnlock;
  /** Distance in px from the bottom of the world to the ground the pets walk on (the top of the stones on the lake). */
  floorPx: number;
  /**
   * The color behind the images. It fills the sky where the art is transparent and everything above
   * the art when Pixel Pals is taller than the images, so it is picked to blend into each image set.
   */
  fillColor: Record<PixelPalsColorMode, string>;
  /** Drawn behind the pets, first layer on top. */
  backgroundLayers: readonly PixelPalsThemeLayer[];
  /** Drawn in front of the pets, first layer on top. */
  foregroundLayers: readonly PixelPalsThemeLayer[];
  /** Stepping stones. Without them the whole width is ground. */
  islands?: readonly PixelPalsThemeIsland[];
  /** With islands: how far below the floor a ball floats on the water, in px. */
  waterDepthPx?: number;
}

/** One kind of food the Feed button drops. The catalog is `PIXEL_PALS_FOODS`. */
export interface PixelPalsFoodDefinition {
  label: string;
  /** `public/pixel-pals/foods/<fileName>`. */
  fileName: string;
  /** What the pet that eats it says. */
  line: string;
}

/** A pet the person added. This is what is saved to local storage. */
export interface PixelPalsPet {
  id: string;
  type: PixelPalsPetType;
  color: string;
  name: string;
}

export interface PixelPalsNewPet {
  type: PixelPalsPetType;
  color: string;
  name: string;
}
