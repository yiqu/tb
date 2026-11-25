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

export interface PetZooPetDefinition {
  type: PetZooPetType;
  label: string;
  emoji: string;
  /** Walking speed in px per second before the per-pet random factor. 0 never moves. */
  speed: number;
  /** Whether it climbs up the left and right walls. */
  canClimb: boolean;
  colors: readonly PetZooPetColorDefinition[];
  /** The animations that have a sprite file, the others fall back (see `getPetZooSpriteAnimation`). */
  animations: readonly PetZooAnimation[];
}

/** One image layer of a theme. `{mode}` in the file name is replaced by `light` or `dark`. */
export interface PetZooThemeLayer {
  fileName: string;
  repeat: 'repeat-x' | 'no-repeat';
}

export interface PetZooThemeDefinition {
  id: PetZooThemeId;
  label: string;
  /** Distance in px from the bottom of the world to the ground the pets walk on. */
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
