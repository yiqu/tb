import { PET_ZOO_ANIMATION } from '../models/pet-zoo.models';
import { getPetZooSpriteUrl } from './pet-zoo-sprite.utils';
import { PET_ZOO_BEHAVIOR } from '../models/pet-zoo-runtime.models';
import { PET_ZOO_SPRITE_SIZE_PX, PET_ZOO_BALL_RADIUS_PX } from '../constants/pet-zoo.constants';

import type { PetZooAnimation } from '../models/pet-zoo.models';
import type { PetZooBallRuntime, PetZooPetRuntime, PetZooWorldBounds, PetZooRenderedPet, PetZooPetElements } from '../models/pet-zoo-runtime.models';

/** Space kept between a speech bubble and the edges of the zoo. */
const BUBBLE_EDGE_GAP_PX = 2;
/** Space between the top of the sprite and its speech bubble. */
const BUBBLE_GAP_PX = 4;

export const PET_ZOO_EMPTY_RENDERED_PET: PetZooRenderedPet = {
  rootTransform: '',
  bodyTransform: '',
  imageSrc: '',
  bubbleText: null,
  bubbleWidth: 0,
  bubbleHeight: 0,
  bubbleTransform: '',
};

export function getPetZooPetAnimation(runtime: PetZooPetRuntime): PetZooAnimation {
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

/** Keeps a bubble inside the zoo: shifts it sideways near the walls, and down when the pet is near the top. */
function getBubbleTransform(runtime: PetZooPetRuntime, bounds: PetZooWorldBounds, bubbleWidth: number, bubbleHeight: number): string {
  const petCenter: number = runtime.x + PET_ZOO_SPRITE_SIZE_PX / 2;
  const half: number = bubbleWidth / 2;
  const minCenter: number = half + BUBBLE_EDGE_GAP_PX;
  const maxCenter: number = bounds.width - half - BUBBLE_EDGE_GAP_PX;
  const clampedCenter: number = minCenter > maxCenter ? bounds.width / 2 : Math.min(maxCenter, Math.max(minCenter, petCenter));
  const offsetX: number = Math.round(clampedCenter - petCenter);

  const bubbleTop: number = bounds.floor + runtime.y + PET_ZOO_SPRITE_SIZE_PX + BUBBLE_GAP_PX + bubbleHeight;
  const offsetY: number = Math.round(Math.max(0, bubbleTop - bounds.height + BUBBLE_EDGE_GAP_PX));
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
    if (next.bubbleText !== null) {
      next.bubbleWidth = elements.bubble.offsetWidth;
      next.bubbleHeight = elements.bubble.offsetHeight;
    }
  }
  if (next.bubbleText !== null) {
    next.bubbleTransform = getBubbleTransform(runtime, bounds, next.bubbleWidth, next.bubbleHeight);
    if (next.bubbleTransform !== previous.bubbleTransform) {
      elements.bubble.style.transform = next.bubbleTransform;
    }
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
