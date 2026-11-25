import { randomSign, randomBetween } from './pixel-pals-random.utils';
import { PIXEL_PALS_BALL_RADIUS_PX, PIXEL_PALS_SPRITE_SIZE_PX } from '../constants/pixel-pals.constants';
import { hasPixelPalsIslands, isOverPixelPalsStone, getPixelPalsNearestStoneEdge } from './pixel-pals-island.utils';
import {
  PIXEL_PALS_GRAVITY,
  PIXEL_PALS_BALL_DRIFT_SPEED,
  PIXEL_PALS_BALL_LIFETIME_SECONDS,
  PIXEL_PALS_BALL_ROLL_FRICTION,
  PIXEL_PALS_BALL_WALL_DAMPING,
  PIXEL_PALS_BALL_BOUNCE_DAMPING,
  PIXEL_PALS_BALL_THROW_SPEED_RANGE,
} from '../constants/pixel-pals-behavior.constants';

import type { PixelPalsBallRuntime, PixelPalsWorldBounds } from '../models/pixel-pals-runtime.models';

/** Below this vertical speed a bounce stops and the ball rolls. */
const MIN_BOUNCE_SPEED = 40;

/** A ball dropped in near the top of Pixel Pals, flying sideways. */
export function createPixelPalsBall(bounds: PixelPalsWorldBounds): PixelPalsBallRuntime {
  const top: number = Math.max(PIXEL_PALS_SPRITE_SIZE_PX, bounds.height - bounds.floor - PIXEL_PALS_BALL_RADIUS_PX * 3);
  return {
    x: randomBetween([0.15, 0.85]) * bounds.width,
    y: top,
    vx: randomSign() * randomBetween(PIXEL_PALS_BALL_THROW_SPEED_RANGE),
    vy: 0,
    heldByPetId: null,
    secondsLeft: PIXEL_PALS_BALL_LIFETIME_SECONDS,
  };
}

/** Whether the ball is over water: on the lake, between the stones. */
function isOverWater(ball: PixelPalsBallRuntime, bounds: PixelPalsWorldBounds): boolean {
  return hasPixelPalsIslands(bounds) && !isOverPixelPalsStone(bounds, ball.x);
}

/** On the lake, a ball floating in the water drifts to the side of the nearest stone, where a pet can reach it. */
function floatOnWater(ball: PixelPalsBallRuntime, seconds: number, bounds: PixelPalsWorldBounds): void {
  const edge: number | null = getPixelPalsNearestStoneEdge(bounds, ball.x);
  if (edge === null) {
    return;
  }
  // stop just short of the stone, so the ball stays in the water
  const stop: number = ball.x < edge ? edge - PIXEL_PALS_BALL_RADIUS_PX : edge + PIXEL_PALS_BALL_RADIUS_PX;
  const distance: number = stop - ball.x;
  const drift: number = Math.sign(distance) * Math.min(Math.abs(distance), PIXEL_PALS_BALL_DRIFT_SPEED * seconds);
  ball.x += drift;
}

/** Gravity, bounces off the walls, the ground and the top, then rolls to a stop. On the lake, it floats in the water. */
export function stepPixelPalsBall(ball: PixelPalsBallRuntime, seconds: number, bounds: PixelPalsWorldBounds): void {
  ball.secondsLeft -= seconds;
  if (ball.heldByPetId !== null) {
    return;
  }

  const radius: number = PIXEL_PALS_BALL_RADIUS_PX;
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
    ball.vy -= PIXEL_PALS_GRAVITY * seconds;
  }
  ball.x += ball.vx * seconds;
  ball.y += ball.vy * seconds;

  if (ball.x < radius) {
    ball.x = radius;
    ball.vx = Math.abs(ball.vx) * PIXEL_PALS_BALL_WALL_DAMPING;
  } else if (ball.x > bounds.width - radius) {
    ball.x = bounds.width - radius;
    ball.vx = -Math.abs(ball.vx) * PIXEL_PALS_BALL_WALL_DAMPING;
  }

  const top: number = bounds.height - bounds.floor - radius;
  if (ball.y > top) {
    ball.y = top;
    ball.vy = -Math.abs(ball.vy) * PIXEL_PALS_BALL_BOUNCE_DAMPING;
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
    if (hasPixelPalsIslands(bounds) && previousY < radius) {
      ball.x = previousX;
      ball.vx = -ball.vx * PIXEL_PALS_BALL_WALL_DAMPING;
      return;
    }
    ball.y = radius;
    ball.vy = Math.abs(ball.vy) > MIN_BOUNCE_SPEED ? Math.abs(ball.vy) * PIXEL_PALS_BALL_BOUNCE_DAMPING : 0;
  }

  if (ball.y <= radius && ball.vy === 0) {
    ball.vx *= Math.max(0, 1 - PIXEL_PALS_BALL_ROLL_FRICTION * seconds);
  }
}
