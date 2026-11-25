import { randomSign, randomBetween } from './pet-zoo-random.utils';
import { PET_ZOO_BALL_RADIUS_PX, PET_ZOO_SPRITE_SIZE_PX } from '../constants/pet-zoo.constants';
import {
  PET_ZOO_GRAVITY,
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

/** Gravity, bounces off the walls, the ground and the top, then rolls to a stop. */
export function stepPetZooBall(ball: PetZooBallRuntime, seconds: number, bounds: PetZooWorldBounds): void {
  ball.secondsLeft -= seconds;
  if (ball.heldByPetId !== null) {
    return;
  }

  const radius: number = PET_ZOO_BALL_RADIUS_PX;
  const isOnGround: boolean = ball.y <= radius && ball.vy === 0;

  if (!isOnGround) {
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

  if (ball.y <= radius) {
    ball.y = radius;
    ball.vy = Math.abs(ball.vy) > MIN_BOUNCE_SPEED ? Math.abs(ball.vy) * PET_ZOO_BALL_BOUNCE_DAMPING : 0;
  }

  if (ball.y <= radius && ball.vy === 0) {
    ball.vx *= Math.max(0, 1 - PET_ZOO_BALL_ROLL_FRICTION * seconds);
  }
}
