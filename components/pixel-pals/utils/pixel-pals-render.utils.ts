import { PIXEL_PALS_ANIMATION } from '../models/pixel-pals.models';
import { getPixelPalsSpriteUrl } from './pixel-pals-sprite.utils';
import { PIXEL_PALS_BEHAVIOR } from '../models/pixel-pals-runtime.models';
import { PIXEL_PALS_ASSET_BASE_URL, PIXEL_PALS_BALL_RADIUS_PX } from '../constants/pixel-pals.constants';
import { PIXEL_PALS_FOODS, PIXEL_PALS_FOOD_SIZE_PX } from '../constants/pixel-pals-foods.constants';

import type { PixelPalsAnimation } from '../models/pixel-pals.models';
import type {
  PixelPalsBallRuntime,
  PixelPalsFoodRuntime,
  PixelPalsPetRuntime,
  PixelPalsWorldBounds,
  PixelPalsRenderedPet,
  PixelPalsPetElements,
} from '../models/pixel-pals-runtime.models';

/** The height of a name tag, as in `.pixel-pals-name-tag` in `styles/pixel-pals.css`. */
const NAME_TAG_HEIGHT_PX = 12;
/** Space kept between a speech bubble and the edges of Pixel Pals. */
const BUBBLE_EDGE_GAP_PX = 2;
/** Space between the top of the sprite and its speech bubble or name tag. */
const BUBBLE_GAP_PX = 4;

export const PIXEL_PALS_EMPTY_RENDERED_PET: PixelPalsRenderedPet = {
  rootTransform: '',
  bodyTransform: '',
  imageSrc: '',
  bubbleText: null,
  bubbleWidth: 0,
  bubbleHeight: 0,
  bubbleTransform: '',
  nameTagWidth: 0,
  nameTagTransform: '',
};

export function getPixelPalsPetAnimation(runtime: PixelPalsPetRuntime): PixelPalsAnimation {
  // in the air, whatever it is up to
  if (runtime.flight) {
    return PIXEL_PALS_ANIMATION.fly;
  }
  // a hop from one stone to the next
  if (runtime.skip) {
    return PIXEL_PALS_ANIMATION.run;
  }
  switch (runtime.behavior) {
    case PIXEL_PALS_BEHAVIOR.walk:
    case PIXEL_PALS_BEHAVIOR.approachFriend:
    case PIXEL_PALS_BEHAVIOR.climb:
      return PIXEL_PALS_ANIMATION.walk;
    case PIXEL_PALS_BEHAVIOR.run:
      return PIXEL_PALS_ANIMATION.walkFast;
    case PIXEL_PALS_BEHAVIOR.chase:
    case PIXEL_PALS_BEHAVIOR.zoomies:
    case PIXEL_PALS_BEHAVIOR.fall:
      return PIXEL_PALS_ANIMATION.run;
    case PIXEL_PALS_BEHAVIOR.lie:
      return PIXEL_PALS_ANIMATION.lie;
    case PIXEL_PALS_BEHAVIOR.stand:
      return PIXEL_PALS_ANIMATION.stand;
    case PIXEL_PALS_BEHAVIOR.swipe:
      return PIXEL_PALS_ANIMATION.swipe;
    case PIXEL_PALS_BEHAVIOR.withBall:
      return PIXEL_PALS_ANIMATION.withBall;
    default:
      return PIXEL_PALS_ANIMATION.idle;
  }
}

/**
 * The sprites face right. On a wall the sprite turns so its feet are on the wall and its head points up:
 * left wall, mirrored then turned clockwise; right wall, turned counter clockwise.
 */
export function getPixelPalsBodyTransform(runtime: PixelPalsPetRuntime): string {
  const isOnWall: boolean = runtime.behavior === PIXEL_PALS_BEHAVIOR.climb || runtime.behavior === PIXEL_PALS_BEHAVIOR.wallHang;
  if (isOnWall && runtime.wall === 'left') {
    return 'rotate(90deg) scaleX(-1)';
  }
  if (isOnWall && runtime.wall === 'right') {
    return 'rotate(-90deg)';
  }
  return runtime.direction === 1 ? 'scaleX(1)' : 'scaleX(-1)';
}

/**
 * Keeps a bubble or a name tag inside Pixel Pals: shifts it sideways near the walls, and down when the pet is near the
 * top. Both sit centered above the sprite (`left: 50%`, `bottom: 100% + gap`).
 */
function getAboveSpriteTransform(runtime: PixelPalsPetRuntime, bounds: PixelPalsWorldBounds, width: number, height: number): string {
  const petCenter: number = runtime.x + runtime.size / 2;
  const half: number = width / 2;
  const minCenter: number = half + BUBBLE_EDGE_GAP_PX;
  const maxCenter: number = bounds.width - half - BUBBLE_EDGE_GAP_PX;
  const clampedCenter: number = minCenter > maxCenter ? bounds.width / 2 : Math.min(maxCenter, Math.max(minCenter, petCenter));
  const offsetX: number = Math.round(clampedCenter - petCenter);

  const top: number = bounds.floor + runtime.y + runtime.size + BUBBLE_GAP_PX + height;
  const offsetY: number = Math.round(Math.max(0, top - bounds.height + BUBBLE_EDGE_GAP_PX));
  return `translate(calc(-50% + ${offsetX}px), ${offsetY}px)`;
}

/** Writes one pet's frame to its DOM nodes, touching only what changed since the last frame. */
export function renderPixelPalsPet(
  runtime: PixelPalsPetRuntime,
  elements: PixelPalsPetElements,
  previous: PixelPalsRenderedPet,
  bounds: PixelPalsWorldBounds,
): PixelPalsRenderedPet {
  const next: PixelPalsRenderedPet = {
    rootTransform: `translate3d(${Math.round(runtime.x)}px, ${-Math.round(bounds.floor + runtime.y)}px, 0)`,
    bodyTransform: getPixelPalsBodyTransform(runtime),
    imageSrc: getPixelPalsSpriteUrl(runtime.pet, runtime.definition, getPixelPalsPetAnimation(runtime)),
    bubbleText: runtime.bubbleText,
    bubbleWidth: previous.bubbleWidth,
    bubbleHeight: previous.bubbleHeight,
    bubbleTransform: previous.bubbleTransform,
    // measured on the first frame that has a size, and again once the font loads (`PixelPalsEngine.watchBubbleFont`)
    nameTagWidth: previous.nameTagWidth || elements.nameTag.offsetWidth,
    nameTagTransform: previous.nameTagTransform,
  };

  if (next.rootTransform !== previous.rootTransform) {
    elements.root.style.transform = next.rootTransform;
  }
  if (next.bodyTransform !== previous.bodyTransform) {
    elements.body.style.transform = next.bodyTransform;
  }
  if (next.imageSrc !== previous.imageSrc) {
    elements.image.src = next.imageSrc;
  }
  if (next.bubbleText !== previous.bubbleText) {
    elements.bubble.textContent = next.bubbleText ?? '';
    elements.bubble.style.display = next.bubbleText === null ? 'none' : 'block';
    // the name tag steps aside while the pet talks, see `.pixel-pals-pet` in `styles/pixel-pals.css`
    elements.root.toggleAttribute('data-talking', next.bubbleText !== null);
  }
  // measured when the text changes, and again while the size is 0: hidden, Pixel Pals has no layout, and without an
  // `IntersectionObserver` the engine keeps rendering it (see `usePixelPalsEngine`)
  if (next.bubbleText !== null && (next.bubbleText !== previous.bubbleText || next.bubbleWidth === 0)) {
    next.bubbleWidth = elements.bubble.offsetWidth;
    next.bubbleHeight = elements.bubble.offsetHeight;
  }
  if (next.bubbleText !== null) {
    next.bubbleTransform = getAboveSpriteTransform(runtime, bounds, next.bubbleWidth, next.bubbleHeight);
    if (next.bubbleTransform !== previous.bubbleTransform) {
      elements.bubble.style.transform = next.bubbleTransform;
    }
  }
  next.nameTagTransform = getAboveSpriteTransform(runtime, bounds, next.nameTagWidth, NAME_TAG_HEIGHT_PX);
  if (next.nameTagTransform !== previous.nameTagTransform) {
    elements.nameTag.style.transform = next.nameTagTransform;
  }
  return next;
}

export function renderPixelPalsBall(ball: PixelPalsBallRuntime | null, element: HTMLElement, bounds: PixelPalsWorldBounds): void {
  if (!ball || ball.heldByPetId !== null) {
    element.style.display = 'none';
    return;
  }
  const radius: number = PIXEL_PALS_BALL_RADIUS_PX;
  element.style.display = 'block';
  element.style.transform = `translate3d(${Math.round(ball.x - radius)}px, ${-Math.round(bounds.floor + ball.y - radius)}px, 0)`;
}

export function getPixelPalsFoodUrl(food: Pick<PixelPalsFoodRuntime, 'kind'>): string {
  return `${PIXEL_PALS_ASSET_BASE_URL}/foods/${PIXEL_PALS_FOODS[food.kind].fileName}`;
}

/** Writes the food to its pool of image slots, in order: slot `i` shows the `i`th piece, the rest are hidden. */
export function renderPixelPalsFoods(foods: readonly PixelPalsFoodRuntime[], elements: readonly HTMLImageElement[], bounds: PixelPalsWorldBounds): void {
  const half: number = PIXEL_PALS_FOOD_SIZE_PX / 2;
  elements.forEach((element: HTMLImageElement, index: number) => {
    const food: PixelPalsFoodRuntime | undefined = foods[index];
    if (!food) {
      element.style.display = 'none';
      return;
    }
    const src: string = getPixelPalsFoodUrl(food);
    // `src` reads back as an absolute URL, so compare what was set
    if (element.dataset.src !== src) {
      element.dataset.src = src;
      element.src = src;
    }
    element.style.display = 'block';
    element.style.transform = `translate3d(${Math.round(food.x - half)}px, ${-Math.round(bounds.floor + food.y)}px, 0)`;
  });
}
