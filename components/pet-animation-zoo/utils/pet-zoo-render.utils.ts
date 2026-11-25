import { PET_ZOO_ANIMATION } from '../models/pet-zoo.models';
import { getPetZooSpriteUrl } from './pet-zoo-sprite.utils';
import { PET_ZOO_BEHAVIOR } from '../models/pet-zoo-runtime.models';
import { PET_ZOO_ASSET_BASE_URL, PET_ZOO_BALL_RADIUS_PX } from '../constants/pet-zoo.constants';
import { PET_ZOO_FOODS, PET_ZOO_FOOD_SIZE_PX } from '../constants/pet-zoo-foods.constants';

import type { PetZooAnimation } from '../models/pet-zoo.models';
import type {
  PetZooBallRuntime,
  PetZooFoodRuntime,
  PetZooPetRuntime,
  PetZooWorldBounds,
  PetZooRenderedPet,
  PetZooPetElements,
} from '../models/pet-zoo-runtime.models';

/** The height of a name tag, as in `.pet-zoo-name-tag` in `styles/pet-zoo.css`. */
const NAME_TAG_HEIGHT_PX = 12;
/** Space kept between a speech bubble and the edges of the zoo. */
const BUBBLE_EDGE_GAP_PX = 2;
/** Space between the top of the sprite and its speech bubble or name tag. */
const BUBBLE_GAP_PX = 4;

export const PET_ZOO_EMPTY_RENDERED_PET: PetZooRenderedPet = {
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

export function getPetZooPetAnimation(runtime: PetZooPetRuntime): PetZooAnimation {
  // in the air, whatever it is up to
  if (runtime.flight) {
    return PET_ZOO_ANIMATION.fly;
  }
  // a hop from one stone to the next
  if (runtime.skip) {
    return PET_ZOO_ANIMATION.run;
  }
  switch (runtime.behavior) {
    case PET_ZOO_BEHAVIOR.walk:
    case PET_ZOO_BEHAVIOR.approachFriend:
    case PET_ZOO_BEHAVIOR.climb:
      return PET_ZOO_ANIMATION.walk;
    case PET_ZOO_BEHAVIOR.run:
      return PET_ZOO_ANIMATION.walkFast;
    case PET_ZOO_BEHAVIOR.chase:
    case PET_ZOO_BEHAVIOR.zoomies:
    case PET_ZOO_BEHAVIOR.fall:
      return PET_ZOO_ANIMATION.run;
    case PET_ZOO_BEHAVIOR.lie:
      return PET_ZOO_ANIMATION.lie;
    case PET_ZOO_BEHAVIOR.stand:
      return PET_ZOO_ANIMATION.stand;
    case PET_ZOO_BEHAVIOR.swipe:
      return PET_ZOO_ANIMATION.swipe;
    case PET_ZOO_BEHAVIOR.withBall:
      return PET_ZOO_ANIMATION.withBall;
    default:
      return PET_ZOO_ANIMATION.idle;
  }
}

/**
 * The sprites face right. On a wall the sprite turns so its feet are on the wall and its head points up:
 * left wall, mirrored then turned clockwise; right wall, turned counter clockwise.
 */
export function getPetZooBodyTransform(runtime: PetZooPetRuntime): string {
  const isOnWall: boolean = runtime.behavior === PET_ZOO_BEHAVIOR.climb || runtime.behavior === PET_ZOO_BEHAVIOR.wallHang;
  if (isOnWall && runtime.wall === 'left') {
    return 'rotate(90deg) scaleX(-1)';
  }
  if (isOnWall && runtime.wall === 'right') {
    return 'rotate(-90deg)';
  }
  return runtime.direction === 1 ? 'scaleX(1)' : 'scaleX(-1)';
}

/**
 * Keeps a bubble or a name tag inside the zoo: shifts it sideways near the walls, and down when the pet is near the
 * top. Both sit centered above the sprite (`left: 50%`, `bottom: 100% + gap`).
 */
function getAboveSpriteTransform(runtime: PetZooPetRuntime, bounds: PetZooWorldBounds, width: number, height: number): string {
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
export function renderPetZooPet(
  runtime: PetZooPetRuntime,
  elements: PetZooPetElements,
  previous: PetZooRenderedPet,
  bounds: PetZooWorldBounds,
): PetZooRenderedPet {
  const next: PetZooRenderedPet = {
    rootTransform: `translate3d(${Math.round(runtime.x)}px, ${-Math.round(bounds.floor + runtime.y)}px, 0)`,
    bodyTransform: getPetZooBodyTransform(runtime),
    imageSrc: getPetZooSpriteUrl(runtime.pet, runtime.definition, getPetZooPetAnimation(runtime)),
    bubbleText: runtime.bubbleText,
    bubbleWidth: previous.bubbleWidth,
    bubbleHeight: previous.bubbleHeight,
    bubbleTransform: previous.bubbleTransform,
    // measured on the first frame that has a size, and again once the font loads (`PetZooEngine.watchBubbleFont`)
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
    // the name tag steps aside while the pet talks, see `.pet-zoo-pet` in `styles/pet-zoo.css`
    elements.root.toggleAttribute('data-talking', next.bubbleText !== null);
  }
  // measured when the text changes, and again while the size is 0: a zoo that is hidden has no layout, and without an
  // `IntersectionObserver` the engine keeps rendering it (see `usePetZooEngine`)
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

export function renderPetZooBall(ball: PetZooBallRuntime | null, element: HTMLElement, bounds: PetZooWorldBounds): void {
  if (!ball || ball.heldByPetId !== null) {
    element.style.display = 'none';
    return;
  }
  const radius: number = PET_ZOO_BALL_RADIUS_PX;
  element.style.display = 'block';
  element.style.transform = `translate3d(${Math.round(ball.x - radius)}px, ${-Math.round(bounds.floor + ball.y - radius)}px, 0)`;
}

export function getPetZooFoodUrl(food: Pick<PetZooFoodRuntime, 'kind'>): string {
  return `${PET_ZOO_ASSET_BASE_URL}/foods/${PET_ZOO_FOODS[food.kind].fileName}`;
}

/** Writes the food to its pool of image slots, in order: slot `i` shows the `i`th piece, the rest are hidden. */
export function renderPetZooFoods(foods: readonly PetZooFoodRuntime[], elements: readonly HTMLImageElement[], bounds: PetZooWorldBounds): void {
  const half: number = PET_ZOO_FOOD_SIZE_PX / 2;
  elements.forEach((element: HTMLImageElement, index: number) => {
    const food: PetZooFoodRuntime | undefined = foods[index];
    if (!food) {
      element.style.display = 'none';
      return;
    }
    const src: string = getPetZooFoodUrl(food);
    // `src` reads back as an absolute URL, so compare what was set
    if (element.dataset.src !== src) {
      element.dataset.src = src;
      element.src = src;
    }
    element.style.display = 'block';
    element.style.transform = `translate3d(${Math.round(food.x - half)}px, ${-Math.round(bounds.floor + food.y)}px, 0)`;
  });
}
