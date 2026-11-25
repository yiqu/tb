import { randomSign, randomBetween } from './pet-zoo-random.utils';
import { PET_ZOO_BALL_RADIUS_PX, PET_ZOO_SPRITE_SIZE_PX } from '../constants/pet-zoo.constants';
import { hasPetZooIslands, isOverPetZooStone, getPetZooNearestStoneEdge } from './pet-zoo-island.utils';
import {
  PET_ZOO_GRAVITY,
  PET_ZOO_BALL_DRIFT_SPEED,
  PET_ZOO_BALL_LIFETIME_SECONDS,
  PET_ZOO_BALL_ROLL_FRICTION,
  PET_ZOO_BALL_WALL_DAMPING,
  PET_ZOO_BALL_BOUNCE_DAMPING,
  PET_ZOO_BALL_THROW_SPEED_RANGE,
} from '../constants/pet-zoo-behavior.constants';

import type { PetZooBallRuntime, PetZooWorldBounds } from '../models/pet-zoo-runtime.models';

/** Below this vertical speed a bounce stops and the ball rolls. */
const MIN_BOUNCE_SPEED = 40;

/** A ball dropped in near the top of the zoo, flying sideways. */
export function createPetZooBall(bounds: PetZooWorldBounds): PetZooBallRuntime {
  const top: number = Math.max(PET_ZOO_SPRITE_SIZE_PX, bounds.height - bounds.floor - PET_ZOO_BALL_RADIUS_PX * 3);
  return {
    x: randomBetween([0.15, 0.85]) * bounds.width,
    y: top,
    vx: randomSign() * randomBetween(PET_ZOO_BALL_THROW_SPEED_RANGE),
    vy: 0,
    heldByPetId: null,
    secondsLeft: PET_ZOO_BALL_LIFETIME_SECONDS,
  };
}

/** Whether the ball is over water: on the lake, between the stones. */
function isOverWater(ball: PetZooBallRuntime, bounds: PetZooWorldBounds): boolean {
  return hasPetZooIslands(bounds) && !isOverPetZooStone(bounds, ball.x);
}

/** On the lake, a ball floating in the water drifts to the side of the nearest stone, where a pet can reach it. */
function floatOnWater(ball: PetZooBallRuntime, seconds: number, bounds: PetZooWorldBounds): void {
  const edge: number | null = getPetZooNearestStoneEdge(bounds, ball.x);
  if (edge === null) {
    return;
  }
  // stop just short of the stone, so the ball stays in the water
  const stop: number = ball.x < edge ? edge - PET_ZOO_BALL_RADIUS_PX : edge + PET_ZOO_BALL_RADIUS_PX;
  const distance: number = stop - ball.x;
  const drift: number = Math.sign(distance) * Math.min(Math.abs(distance), PET_ZOO_BALL_DRIFT_SPEED * seconds);
  ball.x += drift;
}

/** Gravity, bounces off the walls, the ground and the top, then rolls to a stop. On the lake, it floats in the water. */
export function stepPetZooBall(ball: PetZooBallRuntime, seconds: number, bounds: PetZooWorldBounds): void {
  ball.secondsLeft -= seconds;
  if (ball.heldByPetId !== null) {
    return;
  }

  const radius: number = PET_ZOO_BALL_RADIUS_PX;
  const floatY: number = radius - bounds.waterDepth;
  if (isOverWater(ball, bounds) && ball.y <= floatY && ball.vy === 0) {
    floatOnWater(ball, seconds, bounds);
    return;
  }

  const previousX: number = ball.x;
  const previousY: number = ball.y;
  // resting needs ground under it: a ball that rolls off a stone falls into the water
  const isResting: boolean = !isOverWater(ball, bounds) && ball.y <= radius && ball.vy === 0;
  if (!isResting) {
    ball.vy -= PET_ZOO_GRAVITY * seconds;
  }
  ball.x += ball.vx * seconds;
  ball.y += ball.vy * seconds;

  if (ball.x < radius) {
    ball.x = radius;
    ball.vx = Math.abs(ball.vx) * PET_ZOO_BALL_WALL_DAMPING;
  } else if (ball.x > bounds.width - radius) {
    ball.x = bounds.width - radius;
    ball.vx = -Math.abs(ball.vx) * PET_ZOO_BALL_WALL_DAMPING;
  }

  const top: number = bounds.height - bounds.floor - radius;
  if (ball.y > top) {
    ball.y = top;
    ball.vy = -Math.abs(ball.vy) * PET_ZOO_BALL_BOUNCE_DAMPING;
  }

  if (isOverWater(ball, bounds)) {
    // splash: no bounce, it stops at the water line and floats
    if (ball.y <= floatY) {
      ball.y = floatY;
      ball.vx = 0;
      ball.vy = 0;
    }
    return;
  }

  if (ball.y <= radius) {
    // already lower than the top of the stones: it hit the side of a stone from the water, and goes back
    if (hasPetZooIslands(bounds) && previousY < radius) {
      ball.x = previousX;
      ball.vx = -ball.vx * PET_ZOO_BALL_WALL_DAMPING;
      return;
    }
    ball.y = radius;
    ball.vy = Math.abs(ball.vy) > MIN_BOUNCE_SPEED ? Math.abs(ball.vy) * PET_ZOO_BALL_BOUNCE_DAMPING : 0;
  }

  if (ball.y <= radius && ball.vy === 0) {
    ball.vx *= Math.max(0, 1 - PET_ZOO_BALL_ROLL_FRICTION * seconds);
  }
}
