import { randomItem, randomBetween } from './pixel-pals-random.utils';
import { PIXEL_PALS_SPRITE_SIZE_PX } from '../constants/pixel-pals.constants';
import { PIXEL_PALS_GRAVITY, PIXEL_PALS_FOOD_LIFETIME_SECONDS } from '../constants/pixel-pals-behavior.constants';
import { clampToPixelPalsIsland, findPixelPalsIslandIndex } from './pixel-pals-island.utils';
import { PIXEL_PALS_FOOD_KINDS, PIXEL_PALS_FOOD_SIZE_PX } from '../constants/pixel-pals-foods.constants';

import type { PixelPalsFoodKind } from '../constants/pixel-pals-foods.constants';
import type { PixelPalsIslandSpan, PixelPalsFoodRuntime, PixelPalsWorldBounds } from '../models/pixel-pals-runtime.models';

/** The highest a piece of food's bottom can be, just under the top of Pixel Pals. */
function getPixelPalsFoodTop(bounds: PixelPalsWorldBounds): number {
  return Math.max(PIXEL_PALS_SPRITE_SIZE_PX, bounds.height - bounds.floor - PIXEL_PALS_FOOD_SIZE_PX - 2);
}

/** A point moved to where food can lie: inside the walls, and on the lake, on a stone. */
function getPixelPalsFoodX(bounds: PixelPalsWorldBounds, x: number): number {
  const half: number = PIXEL_PALS_FOOD_SIZE_PX / 2;
  const span: PixelPalsIslandSpan | undefined = bounds.islands[findPixelPalsIslandIndex(bounds, x)];
  const onGround: number = span ? clampToPixelPalsIsland(span, x) : x;
  return Math.min(Math.max(half, bounds.width - half), Math.max(half, onGround));
}

/** A random food dropped in at the top: anywhere across Pixel Pals, or on the lake, above a stone so it lands on one. */
export function createPixelPalsFood(id: number, bounds: PixelPalsWorldBounds): PixelPalsFoodRuntime {
  const span: PixelPalsIslandSpan | undefined = randomItem(bounds.islands);
  const x: number = span ? randomBetween([span.left, span.right]) : randomBetween([0.1, 0.9]) * bounds.width;
  const kind: PixelPalsFoodKind = randomItem(PIXEL_PALS_FOOD_KINDS) ?? PIXEL_PALS_FOOD_KINDS[0];
  return { id, kind, x: getPixelPalsFoodX(bounds, x), y: getPixelPalsFoodTop(bounds), vy: 0, secondsLeft: PIXEL_PALS_FOOD_LIFETIME_SECONDS };
}

/** Falls to the ground and stays there. */
export function stepPixelPalsFood(food: PixelPalsFoodRuntime, seconds: number): void {
  food.secondsLeft -= seconds;
  if (food.y <= 0 && food.vy === 0) {
    return;
  }
  food.vy -= PIXEL_PALS_GRAVITY * seconds;
  food.y += food.vy * seconds;
  if (food.y <= 0) {
    food.y = 0;
    food.vy = 0;
  }
}

/** After a resize or a theme change: back inside, under the top, and on the lake, onto a stone. */
export function keepPixelPalsFoodInside(food: PixelPalsFoodRuntime, bounds: PixelPalsWorldBounds): void {
  food.x = getPixelPalsFoodX(bounds, food.x);
  food.y = Math.min(food.y, getPixelPalsFoodTop(bounds));
}
