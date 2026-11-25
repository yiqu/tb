import type { PetZooPetType } from '../constants/pet-zoo-pets.constants';
import type { PetZooThemeId } from '../constants/pet-zoo-themes.constants';

export type { PetZooPetType, PetZooThemeId };

/** The sprite animations a pet can have. Every file is `<color>_<animation>_8fps.gif`. */
export const PET_ZOO_ANIMATION = {
  idle: 'idle',
  walk: 'walk',
  walkFast: 'walk_fast',
  run: 'run',
  swipe: 'swipe',
  withBall: 'with_ball',
  lie: 'lie',
  stand: 'stand',
} as const;

export type PetZooAnimation = (typeof PET_ZOO_ANIMATION)[keyof typeof PET_ZOO_ANIMATION];

/** `light` or `dark`, follows the `dark` class on `<html>`. Every theme has an image set and a fill color for each. */
export type PetZooColorMode = 'light' | 'dark';

export interface PetZooPetColorDefinition {
  /** The color as it is spelled in the sprite file names, e.g. `paint_beige`. */
  value: string;
  label: string;
}

/**
 * How a kind of pet talks. Its lines are mixed with the shared ones in `constants/pet-zoo-messages.constants.ts`.
 * `{name}` is replaced by the pet's name and `{sound}` by its sound.
 */
export interface PetZooPetVoice {
  /** The sound it makes, e.g. "Woof". */
  sound: string;
  /** What it says when it joins the zoo. */
  greeting: string;
  /** Its own lines: said when it is clicked, or to start a chat with another pet. */
  lines: readonly string[];
}

/**
 * Whether a kind of pet can be spawned. `true`: yes. `false`: locked, it shows in the Spawn dialog with a lock but
 * cannot be picked. A number: locked until that time (milliseconds since the epoch), for pets earned later on.
 */
export type PetZooUnlock = boolean | number;

/** Everything about one kind of pet. The catalog is `PET_ZOO_PETS`. */
export interface PetZooPetDefinition {
  type: PetZooPetType;
  label: string;
  /** The name the Spawn dialog starts with. The person can type any other name, which is what is saved. */
  defaultName: string;
  emoji: string;
  unlocked: PetZooUnlock;
  /** The folder of its sprites, `public/pet-animation-zoo/pets/<spriteFolder>/`. Kinds can share one, like the pandas. */
  spriteFolder: string;
  /** Its size as a factor of `PET_ZOO_SPRITE_SIZE_PX`, 1 for most pets. */
  sizeScale: number;
  /** Walking speed in px per second before the per-pet random factor. 0 never moves. */
  speed: number;
  /** Whether it climbs up the left and right walls. */
  canClimb: boolean;
  colors: readonly PetZooPetColorDefinition[];
  /** The animations that have a sprite file, the others fall back (see `getPetZooSpriteAnimation`). */
  animations: readonly PetZooAnimation[];
  voice: PetZooPetVoice;
}

/** One image layer of a theme. `{mode}` in the file name is replaced by `light` or `dark`. */
export interface PetZooThemeLayer {
  fileName: string;
  repeat: 'repeat-x' | 'no-repeat';
}

/**
 * A stepping stone the pets stand on, in a theme without solid ground (the lake). The pets walk on the stones and
 * hop from one to the next. The image's top row is the surface they stand on, placed at the theme's `floorPx`.
 */
export interface PetZooThemeIsland {
  /** `{mode}` is replaced by `light` or `dark`. */
  fileName: string;
  /** Where its middle is, as a share of the zoo's width, so the stones spread out with the zoo. */
  centerFraction: number;
  /** Width of the image in px, the stone plus the ripples around it. */
  imageWidthPx: number;
  /** Width of the stone itself. A ball floats in the water up to its sides. */
  stoneWidthPx: number;
  /** Width of the part a pet's middle can stand on, centered on the stone. */
  walkWidthPx: number;
}

export interface PetZooThemeDefinition {
  id: PetZooThemeId;
  label: string;
  /** Distance in px from the bottom of the world to the ground the pets walk on (the top of the stones on the lake). */
  floorPx: number;
  /**
   * The color behind the images. It fills the sky where the art is transparent and everything above
   * the art when the zoo is taller than the images, so it is picked to blend into each image set.
   */
  fillColor: Record<PetZooColorMode, string>;
  /** Drawn behind the pets, first layer on top. */
  backgroundLayers: readonly PetZooThemeLayer[];
  /** Drawn in front of the pets, first layer on top. */
  foregroundLayers: readonly PetZooThemeLayer[];
  /** Stepping stones. Without them the whole width is ground. */
  islands?: readonly PetZooThemeIsland[];
  /** With islands: how far below the floor a ball floats on the water, in px. */
  waterDepthPx?: number;
}

/** A pet the person added. This is what is saved to local storage. */
export interface PetZooPet {
  id: string;
  type: PetZooPetType;
  color: string;
  name: string;
}

export interface PetZooNewPet {
  type: PetZooPetType;
  color: string;
  name: string;
}
