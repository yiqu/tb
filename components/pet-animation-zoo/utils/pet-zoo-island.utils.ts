import type { PetZooThemeIsland } from '../models/pet-zoo.models';
import type { PetZooIslandSpan, PetZooWorldBounds } from '../models/pet-zoo-runtime.models';

/**
 * Stepping stones (the lake theme). A theme places each stone by a share of the zoo's width, so where the pets can
 * stand is worked out again whenever the zoo is resized.
 */

/** The stones of a theme at this zoo width, left to right. Empty for a theme with solid ground. */
export function getPetZooIslandSpans(islands: readonly PetZooThemeIsland[] | undefined, width: number): PetZooIslandSpan[] {
  if (!islands || width <= 0) {
    return [];
  }
  return islands
    .map((island: PetZooThemeIsland) => {
      const center: number = island.centerFraction * width;
      return {
        left: center - island.walkWidthPx / 2,
        right: center + island.walkWidthPx / 2,
        stoneLeft: center - island.stoneWidthPx / 2,
        stoneRight: center + island.stoneWidthPx / 2,
      };
    })
    .sort((a: PetZooIslandSpan, b: PetZooIslandSpan) => {
      return a.left - b.left;
    });
}

export function hasPetZooIslands(bounds: PetZooWorldBounds): boolean {
  return bounds.islands.length > 0;
}

/** The stone a point stands over, or else the nearest one. -1 when there are no stones. */
export function findPetZooIslandIndex(bounds: PetZooWorldBounds, x: number): number {
  let nearest = -1;
  let nearestDistance: number = Number.POSITIVE_INFINITY;
  bounds.islands.forEach((span: PetZooIslandSpan, index: number) => {
    const distance: number = x < span.left ? span.left - x : x > span.right ? x - span.right : 0;
    if (distance < nearestDistance) {
      nearest = index;
      nearestDistance = distance;
    }
  });
  return nearest;
}

/** The point moved onto the walkable part of a stone. */
export function clampToPetZooIsland(span: PetZooIslandSpan, x: number): number {
  return Math.min(span.right, Math.max(span.left, x));
}

/** Whether a point is over a stone rather than the water. */
export function isOverPetZooStone(bounds: PetZooWorldBounds, x: number): boolean {
  return bounds.islands.some((span: PetZooIslandSpan) => {
    return x >= span.stoneLeft && x <= span.stoneRight;
  });
}

/** The side of the nearest stone, for a ball floating in the water to drift to. Null when there are no stones. */
export function getPetZooNearestStoneEdge(bounds: PetZooWorldBounds, x: number): number | null {
  let nearest: number | null = null;
  bounds.islands.forEach((span: PetZooIslandSpan) => {
    [span.stoneLeft, span.stoneRight].forEach((edge: number) => {
      if (nearest === null || Math.abs(edge - x) < Math.abs(nearest - x)) {
        nearest = edge;
      }
    });
  });
  return nearest;
}
