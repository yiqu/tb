import { randomItem, randomBetween } from './pet-zoo-random.utils';
import { PET_ZOO_SPRITE_SIZE_PX } from '../constants/pet-zoo.constants';
import { PET_ZOO_GRAVITY } from '../constants/pet-zoo-behavior.constants';
import { clampToPetZooIsland, findPetZooIslandIndex } from './pet-zoo-island.utils';
import { PET_ZOO_FOOD_KINDS, PET_ZOO_FOOD_SIZE_PX, PET_ZOO_FOOD_LIFETIME_SECONDS } from '../constants/pet-zoo-foods.constants';

import type { PetZooFoodKind } from '../constants/pet-zoo-foods.constants';
import type { PetZooIslandSpan, PetZooFoodRuntime, PetZooWorldBounds } from '../models/pet-zoo-runtime.models';

/** The highest a piece of food's bottom can be, just under the top of the zoo. */
function getPetZooFoodTop(bounds: PetZooWorldBounds): number {
  return Math.max(PET_ZOO_SPRITE_SIZE_PX, bounds.height - bounds.floor - PET_ZOO_FOOD_SIZE_PX - 2);
}

/** A point moved to where food can lie: inside the walls, and on the lake, on a stone. */
function getPetZooFoodX(bounds: PetZooWorldBounds, x: number): number {
  const half: number = PET_ZOO_FOOD_SIZE_PX / 2;
  const span: PetZooIslandSpan | undefined = bounds.islands[findPetZooIslandIndex(bounds, x)];
  const onGround: number = span ? clampToPetZooIsland(span, x) : x;
  return Math.min(Math.max(half, bounds.width - half), Math.max(half, onGround));
}

/** A random food dropped in at the top: anywhere across the zoo, or on the lake, above a stone so it lands on one. */
export function createPetZooFood(id: number, bounds: PetZooWorldBounds): PetZooFoodRuntime {
  const span: PetZooIslandSpan | undefined = randomItem(bounds.islands);
  const x: number = span ? randomBetween([span.left, span.right]) : randomBetween([0.1, 0.9]) * bounds.width;
  const kind: PetZooFoodKind = randomItem(PET_ZOO_FOOD_KINDS) ?? PET_ZOO_FOOD_KINDS[0];
  return { id, kind, x: getPetZooFoodX(bounds, x), y: getPetZooFoodTop(bounds), vy: 0, secondsLeft: PET_ZOO_FOOD_LIFETIME_SECONDS };
}

/** Falls to the ground and stays there. */
export function stepPetZooFood(food: PetZooFoodRuntime, seconds: number): void {
  food.secondsLeft -= seconds;
  if (food.y <= 0 && food.vy === 0) {
    return;
  }
  food.vy -= PET_ZOO_GRAVITY * seconds;
  food.y += food.vy * seconds;
  if (food.y <= 0) {
    food.y = 0;
    food.vy = 0;
  }
}

/** After a resize or a theme change: back inside, under the top, and on the lake, onto a stone. */
export function keepPetZooFoodInside(food: PetZooFoodRuntime, bounds: PetZooWorldBounds): void {
  food.x = getPetZooFoodX(bounds, food.x);
  food.y = Math.min(food.y, getPetZooFoodTop(bounds));
}
