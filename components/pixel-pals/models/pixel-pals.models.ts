import type { PixelPetId } from '../constants/pixel-pals-pets.constants';
import type { PixelPalsThemeId } from '../constants/pixel-pals-themes.constants';
import type { PixelPalsParticleEffectId } from '../constants/pixel-pals-particles.constants';

export type { PixelPetId, PixelPalsThemeId, PixelPalsParticleEffectId };

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

/** Per kind of pet, whether the person can pick it: `true` open, `false` locked (shown with a lock). */
export type PixelPetUnlockedPets = Record<PixelPetId, boolean>;

/** What the store saves: only the kinds of pet a lock action changed. The others follow the master list. */
export type PixelPetSavedUnlockedPets = Partial<PixelPetUnlockedPets>;

/** Per background (theme), whether the person can pick it: `true` open, `false` locked (shown with a lock). */
export type PixelPetUnlockedBackgrounds = Record<PixelPalsThemeId, boolean>;

/** What the store saves: only the backgrounds a lock action changed. The others follow the master list. */
export type PixelPetSavedUnlockedBackgrounds = Partial<PixelPetUnlockedBackgrounds>;

/** Per background (theme), how much of its weather to show, 0 (off) to 100. A theme with no weather is 0. */
export type PixelPetParticleLevels = Record<PixelPalsThemeId, number>;

/** What the store saves: only the backgrounds whose slider the person moved. The others follow the master list. */
export type PixelPetSavedParticleLevels = Partial<PixelPetParticleLevels>;

/** A theme's weather: which effect, and how much of it before the person moves the slider. */
export interface PixelPalsThemeParticles {
  effect: PixelPalsParticleEffectId;
  /** 0 (off) to 100, the slider's starting point. The store's `userPixelPetParticleLevels` wins once the slider moves. */
  defaultLevel: number;
}

/** Everything about one kind of pet, with the defaults of every pet of that kind. The master list is `PIXEL_PALS_PETS`. */
export interface PixelPetDefinition {
  /** Its key in the master list `PIXEL_PALS_PETS`. */
  petId: PixelPetId;
  label: string;
  /** The name a pet of this kind goes by when it has no nickname, and the one the Spawn dialog starts with. */
  defaultName: string;
  emoji: string;
  /**
   * Whether it can be picked, unless a lock action changed it: `unlockedPets` in the pixel-pets store saves only the
   * kinds an action changed, and those win.
   */
  unlocked: boolean;
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
  /** The colors it comes in. The first one is its default color. */
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
  /** Whether it can be picked, unless a lock action changed it (`unlockedBackgrounds` in the pixel-pets store), like a pet's `unlocked`. */
  unlocked: boolean;
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
  /** Weather in front of the scene (snow, leaves, rain...). Without it the Change theme dialog shows no slider. */
  particles?: PixelPalsThemeParticles;
}

/** One kind of food the Feed button drops. The catalog is `PIXEL_PALS_FOODS`. */
export interface PixelPalsFoodDefinition {
  label: string;
  /** `public/pixel-pals/foods/<fileName>`. */
  fileName: string;
  /** What the pet that eats it says. */
  line: string;
}

/**
 * A pet the person spawned, as saved to local storage: only what is theirs. Everything else comes from its master list
 * entry, `PIXEL_PALS_PETS[petId]` (see `getResolvedPixelPet`).
 */
export interface PixelPet {
  /** This pet's own id, so two pets of the same kind can be told apart (to delete one, and for the engine). */
  id: string;
  /** The kind of pet: its key in the master list `PIXEL_PALS_PETS`. */
  petId: PixelPetId;
  /** One of its kind's `colors`. */
  color: string;
  /** The name the person gave it. Without one it goes by its kind's `defaultName`. */
  nickName?: string;
}

/** What the Spawn dialog hands the store: a pet without its own id yet. */
export type NewPixelPet = Omit<PixelPet, 'id'>;

/**
 * A spawned pet as Pixel Pals shows it: its master list entry, with the person's color and the name it goes by (its
 * nickname, or else the kind's default name) on top.
 */
export interface ResolvedPixelPet extends PixelPetDefinition {
  id: string;
  color: string;
  name: string;
}
