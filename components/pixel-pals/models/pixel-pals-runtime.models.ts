import type { PixelPalsFoodKind } from '../constants/pixel-pals-foods.constants';
import type { ResolvedPixelPet, PixelPetDefinition } from './pixel-pals.models';

/**
 * Types of the running simulation (`PixelPalsEngine`). None of this is saved, it is rebuilt from the saved pets on load.
 * Positions are px: `x` from the left edge of the world, `y` up from the ground of the theme.
 */

/** What a pet is doing right now. */
export const PIXEL_PALS_BEHAVIOR = {
  idle: 'idle',
  lie: 'lie',
  stand: 'stand',
  walk: 'walk',
  run: 'run',
  /** Going up the left or right wall. */
  climb: 'climb',
  /** Holding on to a wall at the top of a climb. */
  wallHang: 'wallHang',
  /** Dropping down from a wall. */
  fall: 'fall',
  land: 'land',
  /** The paw swipe when clicked. */
  swipe: 'swipe',
  chase: 'chase',
  withBall: 'withBall',
  /** Walking up to another pet to talk. */
  approachFriend: 'approachFriend',
  /** Standing still while another pet walks over to talk. */
  waitForFriend: 'waitForFriend',
  talk: 'talk',
  /** Running back and forth after five quick clicks. */
  zoomies: 'zoomies',
  /** Flying around, only pets that can fly. */
  fly: 'fly',
  /** Going to the nearest food. */
  forage: 'forage',
  eat: 'eat',
} as const;

export type PixelPalsBehavior = (typeof PIXEL_PALS_BEHAVIOR)[keyof typeof PIXEL_PALS_BEHAVIOR];

export type PixelPalsWallSide = 'left' | 'right';

/** 1 faces right (how the sprites are drawn), -1 faces left. */
export type PixelPalsDirection = 1 | -1;

/** A hop from one stepping stone to the next: the pet flies sideways and lands at `targetX`. */
export interface PixelPalsSkip {
  targetX: number;
  vx: number;
}

/**
 * A pet that can fly, in the air. It flies to `targetX`, `targetY` in a straight line, no gravity, until it lands.
 * Behaviors that do not steer the flight (anything but `fly`, `chase` and `forage`) make it fly down to the ground first.
 */
export interface PixelPalsFlight {
  /** Where its middle goes, px from the left. */
  targetX: number;
  /** How high its feet go above the ground. */
  targetY: number;
  /** Flying down to land: `targetY` is the ground, and the flight ends there. */
  isLanding: boolean;
}

export interface PixelPalsPendingBubble {
  text: string;
  delaySeconds: number;
  durationSeconds: number;
}

export interface PixelPalsPetRuntime {
  pet: ResolvedPixelPet;
  definition: PixelPetDefinition;
  /** The pet's own walking speed, its kind's speed times a random factor. */
  speed: number;
  /** Width and height of its sprite box in px, `PIXEL_PALS_SPRITE_SIZE_PX` times its kind's size. */
  size: number;
  /** Left edge of its sprite box. */
  x: number;
  y: number;
  /** Vertical speed of a hop, a jump or a fall, up is positive. */
  vy: number;
  direction: PixelPalsDirection;
  behavior: PixelPalsBehavior;
  behaviorSecondsLeft: number;
  wall: PixelPalsWallSide | null;
  climbTargetY: number;
  /** Set while it hops to another stepping stone. */
  skip: PixelPalsSkip | null;
  /** Set while it flies. */
  flight: PixelPalsFlight | null;
  friendId: string | null;
  bubbleText: string | null;
  bubbleSecondsLeft: number;
  pendingBubble: PixelPalsPendingBubble | null;
  clickStreak: number;
  lastClickAt: number;
}

export interface PixelPalsBallRuntime {
  x: number;
  /** Height of the ball's center above the ground. */
  y: number;
  vx: number;
  vy: number;
  heldByPetId: string | null;
  secondsLeft: number;
}

/** A piece of food dropped by the Feed button. It falls to the ground, on the lake onto a stone, and waits to be eaten. */
export interface PixelPalsFoodRuntime {
  id: number;
  kind: PixelPalsFoodKind;
  /** Its middle, px from the left. */
  x: number;
  /** Height of its bottom above the ground. */
  y: number;
  vy: number;
  secondsLeft: number;
}

/** One stepping stone, in px from the left of the world. */
export interface PixelPalsIslandSpan {
  /** Where a pet's middle can stand. */
  left: number;
  right: number;
  /** The sides of the stone. */
  stoneLeft: number;
  stoneRight: number;
}

export interface PixelPalsWorldBounds {
  width: number;
  height: number;
  floor: number;
  /** The theme's stepping stones, left to right. Empty when the whole width is ground. */
  islands: PixelPalsIslandSpan[];
  /** How far below the floor a ball floats between the stones. */
  waterDepth: number;
}

/** The DOM nodes of one pet, written to directly every frame so React does not re-render 60 times a second. */
export interface PixelPalsPetElements {
  root: HTMLElement;
  body: HTMLElement;
  image: HTMLImageElement;
  bubble: HTMLElement;
  /** The name shown on hover. */
  nameTag: HTMLElement;
}

/** What was last written to a pet's DOM nodes, so a frame only touches what changed. */
export interface PixelPalsRenderedPet {
  rootTransform: string;
  bodyTransform: string;
  imageSrc: string;
  bubbleText: string | null;
  /**
   * Measured when the text changes, and again each frame while it is 0 (a hidden Pixel Pals has no layout), not every frame
   * otherwise. Measured again once the pixel font loads, see `PixelPalsEngine.watchBubbleFont`.
   */
  bubbleWidth: number;
  bubbleHeight: number;
  bubbleTransform: string;
  /** Measured on the first frame, and again each frame while it is 0 (a hidden Pixel Pals has no layout). */
  nameTagWidth: number;
  nameTagTransform: string;
}
