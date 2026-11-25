import { PIXEL_PALS_BEHAVIOR } from '../models/pixel-pals-runtime.models';
import { PIXEL_PALS_SPRITE_SIZE_PX } from '../constants/pixel-pals.constants';
import { PIXEL_PALS_FOOD_SIZE_PX } from '../constants/pixel-pals-foods.constants';
import { getPixelPetDefinition } from './pixel-pals-pet.utils';
import { PIXEL_PALS_MESSAGES } from '../constants/pixel-pals-messages.constants';
import { randomItem, randomSign, randomChance, randomBetween, randomWeightedKey } from './pixel-pals-random.utils';
import { hasPixelPalsIslands, clampToPixelPalsIsland, findPixelPalsIslandIndex } from './pixel-pals-island.utils';
import {
  PIXEL_PALS_GRAVITY,
  PIXEL_PALS_CLIMB_SPEED,
  PIXEL_PALS_SKIP_CHANCE,
  PIXEL_PALS_CLIMB_CHANCE,
  PIXEL_PALS_HOP_VELOCITY,
  PIXEL_PALS_BUBBLE_SECONDS,
  PIXEL_PALS_BEHAVIOR_DURATION,
  PIXEL_PALS_SPEED_FACTOR_RANGE,
  PIXEL_PALS_SKIP_MIN_VELOCITY,
  PIXEL_PALS_ZOOMIES_SKIP_CHANCE,
  PIXEL_PALS_NEXT_BEHAVIOR_WEIGHTS,
  PIXEL_PALS_RUN_SPEED_MULTIPLIER,
  PIXEL_PALS_HOP_CHANCE_PER_SECOND,
  PIXEL_PALS_ISLAND_CATCH_REACH_PX,
  PIXEL_PALS_SKIP_LANDING_INSET_PX,
  PIXEL_PALS_CHASE_SPEED_MULTIPLIER,
  PIXEL_PALS_ZOOMIES_SPEED_MULTIPLIER,
  PIXEL_PALS_FLY_SPEED_MULTIPLIER,
  PIXEL_PALS_CLIMB_HEIGHT_FACTOR_RANGE,
  PIXEL_PALS_MIN_FLY_HEIGHT_IN_SPRITES,
  PIXEL_PALS_MIN_CLIMB_HEIGHT_IN_SPRITES,
  PIXEL_PALS_CONVERSATION_DISTANCE_IN_SPRITES,
  PIXEL_PALS_APPROACH_FRIEND_MARGIN_SECONDS,
} from '../constants/pixel-pals-behavior.constants';

import type { ResolvedPixelPet } from '../models/pixel-pals.models';
import type {
  PixelPalsFlight,
  PixelPalsBehavior,
  PixelPalsWallSide,
  PixelPalsIslandSpan,
  PixelPalsBallRuntime,
  PixelPalsFoodRuntime,
  PixelPalsPetRuntime,
  PixelPalsWorldBounds,
} from '../models/pixel-pals-runtime.models';

/** What a pet needs to know about the rest of the world while it takes a step. */
export interface PixelPalsSimulationContext {
  bounds: PixelPalsWorldBounds;
  ball: PixelPalsBallRuntime | null;
  /** The food on the ground or falling, oldest first. */
  foods: readonly PixelPalsFoodRuntime[];
  findPet: (id: string) => PixelPalsPetRuntime | undefined;
  catchBall: (runtime: PixelPalsPetRuntime) => void;
  eatFood: (runtime: PixelPalsPetRuntime, food: PixelPalsFoodRuntime) => void;
  startConversation: (initiator: PixelPalsPetRuntime, partner: PixelPalsPetRuntime) => void;
}

/**
 * Where a pet stopped while moving along the ground: at a wall of Pixel Pals, or at the end of its stepping stone,
 * where it can hop to the next one.
 */
interface PixelPalsGroundStop {
  side: PixelPalsWallSide;
  isWall: boolean;
}

/** The part of the ground a pet's left edge can be on right now: the whole width, or its stepping stone. */
interface PixelPalsGroundRange {
  minX: number;
  maxX: number;
  /** The stone it stands on, -1 on solid ground. */
  islandIndex: number;
}

type TimedBehavior = keyof typeof PIXEL_PALS_BEHAVIOR_DURATION;

/** A point a pet goes to: `x` from the left, `y` up from the ground. */
interface PixelPalsPoint {
  x: number;
  y: number;
}

/** Behaviors a pet can be pulled out of to chase a ball, to go for food or to talk. */
const FREE_BEHAVIORS: readonly PixelPalsBehavior[] = [
  PIXEL_PALS_BEHAVIOR.idle,
  PIXEL_PALS_BEHAVIOR.lie,
  PIXEL_PALS_BEHAVIOR.stand,
  PIXEL_PALS_BEHAVIOR.walk,
  PIXEL_PALS_BEHAVIOR.run,
  PIXEL_PALS_BEHAVIOR.fly,
];

/** Behaviors that steer a flight. In any other, a pet in the air flies down and lands first. */
const FLIGHT_BEHAVIORS: readonly PixelPalsBehavior[] = [PIXEL_PALS_BEHAVIOR.fly, PIXEL_PALS_BEHAVIOR.chase, PIXEL_PALS_BEHAVIOR.forage];

/** How close a flying pet's middle gets to a ball or a piece of food to catch it, in sprite sizes. */
const FLY_CATCH_REACH_IN_SPRITES = 0.6;

const ON_WALL_BEHAVIORS: readonly PixelPalsBehavior[] = [PIXEL_PALS_BEHAVIOR.climb, PIXEL_PALS_BEHAVIOR.wallHang, PIXEL_PALS_BEHAVIOR.fall];

export function getPixelPalsPetSize(sizeScale: number): number {
  return Math.round(PIXEL_PALS_SPRITE_SIZE_PX * sizeScale);
}

export function getPixelPalsCenterX(runtime: PixelPalsPetRuntime): number {
  return runtime.x + runtime.size / 2;
}

export function getPixelPalsMaxX(bounds: PixelPalsWorldBounds, size: number): number {
  return Math.max(0, bounds.width - size);
}

/** How high a pet can climb before its head reaches the top of Pixel Pals. */
export function getPixelPalsMaxClimbY(bounds: PixelPalsWorldBounds, size: number): number {
  return Math.max(0, bounds.height - bounds.floor - size - 4);
}

/** A jump's starting speed, lowered when Pixel Pals is too short for the full jump, so the pet never leaves the top. */
export function getPixelPalsJumpVelocity(velocity: number, bounds: PixelPalsWorldBounds, size: number): number {
  // a jump peaks at v² / 2g
  return Math.min(velocity, Math.sqrt(2 * PIXEL_PALS_GRAVITY * getPixelPalsMaxClimbY(bounds, size)));
}

/** Whether two pets are close enough to talk. */
export function arePixelPalsPetsClose(a: PixelPalsPetRuntime, b: PixelPalsPetRuntime): boolean {
  const reach: number = ((a.size + b.size) / 2) * PIXEL_PALS_CONVERSATION_DISTANCE_IN_SPRITES;
  return Math.abs(getPixelPalsCenterX(a) - getPixelPalsCenterX(b)) <= reach;
}

/** How long a pet gets to walk over to a friend: the walk at its own speed, plus a margin. */
export function getPixelPalsApproachSeconds(runtime: PixelPalsPetRuntime, friend: PixelPalsPetRuntime): number {
  const distance: number = Math.abs(getPixelPalsCenterX(friend) - getPixelPalsCenterX(runtime));
  return distance / runtime.speed + PIXEL_PALS_APPROACH_FRIEND_MARGIN_SECONDS;
}

export function isPixelPalsPetFree(runtime: PixelPalsPetRuntime): boolean {
  return FREE_BEHAVIORS.includes(runtime.behavior);
}

export function isPixelPalsPetOnWall(runtime: PixelPalsPetRuntime): boolean {
  return ON_WALL_BEHAVIORS.includes(runtime.behavior);
}

/** On the ground, not in a hop, a jump, a hop between stones or a flight. */
export function isPixelPalsPetOnGround(runtime: PixelPalsPetRuntime): boolean {
  return runtime.y === 0 && runtime.skip === null && runtime.flight === null;
}

export function canPixelPalsPetMove(runtime: PixelPalsPetRuntime): boolean {
  return runtime.speed > 0;
}

function getGroundRange(runtime: PixelPalsPetRuntime, bounds: PixelPalsWorldBounds): PixelPalsGroundRange {
  const maxX: number = getPixelPalsMaxX(bounds, runtime.size);
  const islandIndex: number = findPixelPalsIslandIndex(bounds, getPixelPalsCenterX(runtime));
  const span: PixelPalsIslandSpan | undefined = bounds.islands[islandIndex];
  if (!span) {
    return { minX: 0, maxX, islandIndex: -1 };
  }
  const half: number = runtime.size / 2;
  return { minX: Math.max(0, span.left - half), maxX: Math.min(maxX, span.right - half), islandIndex };
}

/** Puts a pet back on the ground it can stand on: inside Pixel Pals, and on a stone when there are stones. */
export function keepPixelPalsPetOnGround(runtime: PixelPalsPetRuntime, bounds: PixelPalsWorldBounds): void {
  const range: PixelPalsGroundRange = getGroundRange(runtime, bounds);
  runtime.x = Math.min(range.maxX, Math.max(range.minX, runtime.x));
}

/** A random spot on the ground for a pet's left edge, or on a random stone, with the whole pet inside Pixel Pals. */
export function getPixelPalsRandomGroundX(bounds: PixelPalsWorldBounds, size: number): number {
  const maxX: number = getPixelPalsMaxX(bounds, size);
  const span: PixelPalsIslandSpan | undefined = randomItem(bounds.islands);
  if (!span) {
    return Math.random() * maxX;
  }
  return Math.min(maxX, Math.max(0, randomBetween([span.left, span.right]) - size / 2));
}

export function createPixelPalsPetRuntime(pet: ResolvedPixelPet, bounds: PixelPalsWorldBounds): PixelPalsPetRuntime {
  const definition = getPixelPetDefinition(pet.petId);
  const size: number = getPixelPalsPetSize(definition.sizeScale);
  const x: number = getPixelPalsRandomGroundX(bounds, size);
  return {
    pet,
    definition,
    speed: definition.speed * randomBetween(PIXEL_PALS_SPEED_FACTOR_RANGE),
    size,
    x,
    y: 0,
    vy: 0,
    direction: randomSign(),
    behavior: PIXEL_PALS_BEHAVIOR.idle,
    // a random part of an idle, so pets loaded together do not all start walking on the same frame
    behaviorSecondsLeft: Math.random() * randomBetween(PIXEL_PALS_BEHAVIOR_DURATION.idle),
    wall: null,
    climbTargetY: 0,
    skip: null,
    flight: null,
    friendId: null,
    bubbleText: null,
    bubbleSecondsLeft: 0,
    pendingBubble: null,
    clickStreak: 0,
    lastClickAt: Number.NEGATIVE_INFINITY,
  };
}

/** Switches behavior. Without a duration, timed behaviors draw one from their range and the others run until an event ends them. */
export function setPixelPalsBehavior(runtime: PixelPalsPetRuntime, behavior: PixelPalsBehavior, seconds?: number): void {
  runtime.behavior = behavior;
  if (seconds !== undefined) {
    runtime.behaviorSecondsLeft = seconds;
    return;
  }
  runtime.behaviorSecondsLeft =
    behavior in PIXEL_PALS_BEHAVIOR_DURATION ? randomBetween(PIXEL_PALS_BEHAVIOR_DURATION[behavior as TimedBehavior]) : Number.POSITIVE_INFINITY;
}

export function showPixelPalsBubble(runtime: PixelPalsPetRuntime, text: string, seconds: number = PIXEL_PALS_BUBBLE_SECONDS): void {
  runtime.bubbleText = text;
  runtime.bubbleSecondsLeft = seconds;
  runtime.pendingBubble = null;
}

/** Turns a pet toward a point, given as where its middle should go. */
export function facePixelPalsTarget(runtime: PixelPalsPetRuntime, targetCenterX: number): void {
  const centerX: number = getPixelPalsCenterX(runtime);
  if (Math.abs(targetCenterX - centerX) > 0.5) {
    runtime.direction = targetCenterX > centerX ? 1 : -1;
  }
}

/** A pet finished what it was doing: it chases a ball in play, or picks something at random. */
export function pickNextPixelPalsBehavior(runtime: PixelPalsPetRuntime, context: PixelPalsSimulationContext): void {
  runtime.friendId = null;
  runtime.wall = null;

  if (!canPixelPalsPetMove(runtime)) {
    setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.idle);
    return;
  }
  if (context.ball && context.ball.heldByPetId === null) {
    setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.chase);
    return;
  }
  if (context.foods.length > 0) {
    setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.forage);
    return;
  }

  const animations = runtime.definition.animations;
  const next = randomWeightedKey({
    walk: PIXEL_PALS_NEXT_BEHAVIOR_WEIGHTS.walk,
    run: PIXEL_PALS_NEXT_BEHAVIOR_WEIGHTS.run,
    idle: PIXEL_PALS_NEXT_BEHAVIOR_WEIGHTS.idle,
    lie: animations.includes('lie') ? PIXEL_PALS_NEXT_BEHAVIOR_WEIGHTS.lie : 0,
    stand: animations.includes('stand') ? PIXEL_PALS_NEXT_BEHAVIOR_WEIGHTS.stand : 0,
    fly: canFlyAroundIn(runtime, context.bounds) ? PIXEL_PALS_NEXT_BEHAVIOR_WEIGHTS.fly : 0,
  });
  setPixelPalsBehavior(runtime, next ?? PIXEL_PALS_BEHAVIOR.idle);

  // walk away from the wall or the end of the stone it stands at, otherwise any way
  const range: PixelPalsGroundRange = getGroundRange(runtime, context.bounds);
  if (runtime.x <= range.minX + 1) {
    runtime.direction = 1;
  } else if (runtime.x >= range.maxX - 1) {
    runtime.direction = -1;
  } else {
    runtime.direction = randomSign();
  }
}

export function startPixelPalsClimb(runtime: PixelPalsPetRuntime, wall: PixelPalsWallSide, bounds: PixelPalsWorldBounds): void {
  setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.climb);
  runtime.wall = wall;
  runtime.x = wall === 'left' ? 0 : getPixelPalsMaxX(bounds, runtime.size);
  runtime.vy = 0;
  runtime.climbTargetY = randomBetween(PIXEL_PALS_CLIMB_HEIGHT_FACTOR_RANGE) * getPixelPalsMaxClimbY(bounds, runtime.size);
}

/** Lets go of the wall, or of nothing: falls to the ground facing away from the wall. */
export function startPixelPalsFall(runtime: PixelPalsPetRuntime): void {
  if (runtime.wall) {
    runtime.direction = runtime.wall === 'left' ? 1 : -1;
  }
  setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.fall);
  runtime.wall = null;
  runtime.vy = 0;
}

/**
 * Hops from the pet's stone to the stone next to it on `side`, in an arc that lands a little way onto it.
 * A longer gap gets a higher arc, but never higher than Pixel Pals.
 */
function startPixelPalsSkip(runtime: PixelPalsPetRuntime, fromIndex: number, side: PixelPalsWallSide, bounds: PixelPalsWorldBounds): boolean {
  const toIndex: number = side === 'right' ? fromIndex + 1 : fromIndex - 1;
  const target: PixelPalsIslandSpan | undefined = bounds.islands[toIndex];
  if (!target) {
    return false;
  }
  const inset: number = Math.min(PIXEL_PALS_SKIP_LANDING_INSET_PX, (target.right - target.left) / 2);
  const landingCenter: number = side === 'right' ? target.left + inset : target.right - inset;
  const targetX: number = landingCenter - runtime.size / 2;
  const distance: number = Math.abs(targetX - runtime.x);
  // a 45° arc covers the distance at v² / g, half of v goes up
  const velocity: number = Math.max(PIXEL_PALS_SKIP_MIN_VELOCITY, Math.sqrt((PIXEL_PALS_GRAVITY * distance) / 2));
  runtime.vy = Math.max(PIXEL_PALS_SKIP_MIN_VELOCITY / 2, getPixelPalsJumpVelocity(velocity, bounds, runtime.size));
  const airSeconds: number = (2 * runtime.vy) / PIXEL_PALS_GRAVITY;
  runtime.skip = { targetX, vx: (targetX - runtime.x) / airSeconds };
  runtime.direction = side === 'right' ? 1 : -1;
  return true;
}

/** Flies along a hop between stones and lands on the next one. */
function stepPixelPalsSkip(runtime: PixelPalsPetRuntime, seconds: number): void {
  const skip = runtime.skip;
  if (!skip) {
    return;
  }
  runtime.x += skip.vx * seconds;
  if ((skip.vx > 0 && runtime.x > skip.targetX) || (skip.vx < 0 && runtime.x < skip.targetX)) {
    runtime.x = skip.targetX;
  }
  runtime.vy -= PIXEL_PALS_GRAVITY * seconds;
  runtime.y += runtime.vy * seconds;
  if (runtime.y <= 0 && runtime.vy < 0) {
    runtime.y = 0;
    runtime.vy = 0;
    runtime.x = skip.targetX;
    runtime.skip = null;
  }
}

export function startPixelPalsConversation(initiator: PixelPalsPetRuntime, partner: PixelPalsPetRuntime, lines: readonly [string, string], lineSeconds: number): void {
  setPixelPalsBehavior(initiator, PIXEL_PALS_BEHAVIOR.talk);
  setPixelPalsBehavior(partner, PIXEL_PALS_BEHAVIOR.talk, initiator.behaviorSecondsLeft);
  initiator.friendId = partner.pet.id;
  partner.friendId = initiator.pet.id;
  facePixelPalsTarget(initiator, getPixelPalsCenterX(partner));
  facePixelPalsTarget(partner, getPixelPalsCenterX(initiator));
  showPixelPalsBubble(initiator, lines[0], lineSeconds);
  // the answer comes once the first line is gone
  partner.pendingBubble = { text: lines[1], delaySeconds: lineSeconds + 0.2, durationSeconds: lineSeconds };
}

function getFlySpeed(runtime: PixelPalsPetRuntime): number {
  return runtime.speed * PIXEL_PALS_FLY_SPEED_MULTIPLIER;
}

/** Whether a pet takes off to fly around: it can fly, and Pixel Pals is tall enough. */
function canFlyAroundIn(runtime: PixelPalsPetRuntime, bounds: PixelPalsWorldBounds): boolean {
  return runtime.definition.canFly && getPixelPalsMaxClimbY(bounds, runtime.size) >= runtime.size * PIXEL_PALS_MIN_FLY_HEIGHT_IN_SPRITES;
}

/** A point moved to where a pet's middle can be: inside the walls, and its feet between the ground and the top. */
function clampFlightTarget(runtime: PixelPalsPetRuntime, point: PixelPalsPoint, bounds: PixelPalsWorldBounds): PixelPalsPoint {
  const half: number = runtime.size / 2;
  return {
    x: Math.min(Math.max(half, bounds.width - half), Math.max(half, point.x)),
    y: Math.min(getPixelPalsMaxClimbY(bounds, runtime.size), Math.max(0, point.y)),
  };
}

/** A random point in the air for a pet flying around. */
function pickFlightTarget(runtime: PixelPalsPetRuntime, bounds: PixelPalsWorldBounds): PixelPalsPoint {
  const maxY: number = getPixelPalsMaxClimbY(bounds, runtime.size);
  const minY: number = Math.min(maxY, runtime.size * 0.3);
  return clampFlightTarget(runtime, { x: Math.random() * bounds.width, y: randomBetween([minY, maxY]) }, bounds);
}

/** Takes off toward a point, or turns toward it while already in the air. */
function setFlightTarget(runtime: PixelPalsPetRuntime, point: PixelPalsPoint, bounds: PixelPalsWorldBounds): PixelPalsFlight {
  const target: PixelPalsPoint = clampFlightTarget(runtime, point, bounds);
  if (!runtime.flight) {
    runtime.skip = null;
    runtime.vy = 0;
  }
  runtime.flight = { targetX: target.x, targetY: target.y, isLanding: false };
  return runtime.flight;
}

/** Flies in a straight line toward the flight's target. Returns true once it is there. */
function moveAlongFlight(runtime: PixelPalsPetRuntime, flight: PixelPalsFlight, speed: number, seconds: number): boolean {
  const dx: number = flight.targetX - getPixelPalsCenterX(runtime);
  const dy: number = flight.targetY - runtime.y;
  const distance: number = Math.hypot(dx, dy);
  const stepLength: number = speed * seconds;
  if (distance <= stepLength) {
    runtime.x = flight.targetX - runtime.size / 2;
    runtime.y = flight.targetY;
    return true;
  }
  facePixelPalsTarget(runtime, flight.targetX);
  runtime.x += (dx / distance) * stepLength;
  runtime.y += (dy / distance) * stepLength;
  return false;
}

/** Where a pet in the air touches down: a little way ahead of it, or on the lake, the nearest spot on a stone. */
function getLandingX(runtime: PixelPalsPetRuntime, bounds: PixelPalsWorldBounds): number {
  const ahead: number = getPixelPalsCenterX(runtime) + runtime.direction * runtime.size * 0.5;
  const span: PixelPalsIslandSpan | undefined = bounds.islands[findPixelPalsIslandIndex(bounds, ahead)];
  return span ? clampToPixelPalsIsland(span, ahead) : ahead;
}

/** Flies down to the ground, whatever else the pet is up to, and ends the flight there. */
function stepLanding(runtime: PixelPalsPetRuntime, seconds: number, bounds: PixelPalsWorldBounds): void {
  if (!runtime.flight) {
    return;
  }
  if (!runtime.flight.isLanding) {
    setFlightTarget(runtime, { x: getLandingX(runtime, bounds), y: 0 }, bounds).isLanding = true;
  }
  if (runtime.flight && moveAlongFlight(runtime, runtime.flight, getFlySpeed(runtime), seconds)) {
    runtime.flight = null;
    runtime.y = 0;
    runtime.vy = 0;
  }
}

/** Keeps a pet in the air inside Pixel Pals after a resize, its target too. A landing spot is picked again. */
export function keepPixelPalsFlightInside(runtime: PixelPalsPetRuntime, bounds: PixelPalsWorldBounds): void {
  if (!runtime.flight) {
    return;
  }
  runtime.x = Math.min(getPixelPalsMaxX(bounds, runtime.size), Math.max(0, runtime.x));
  if (runtime.flight.isLanding) {
    runtime.flight.isLanding = false;
    return;
  }
  const target: PixelPalsPoint = clampFlightTarget(runtime, { x: runtime.flight.targetX, y: runtime.flight.targetY }, bounds);
  runtime.flight.targetX = target.x;
  runtime.flight.targetY = target.y;
}

/** Flies to a point (a ball, a piece of food), lined up so the pet's middle meets it. Returns true once it is in reach. */
function flyToCatch(runtime: PixelPalsPetRuntime, point: PixelPalsPoint, seconds: number, bounds: PixelPalsWorldBounds): boolean {
  const flight: PixelPalsFlight = setFlightTarget(runtime, { x: point.x, y: point.y - runtime.size / 2 }, bounds);
  moveAlongFlight(runtime, flight, getFlySpeed(runtime) * PIXEL_PALS_CHASE_SPEED_MULTIPLIER, seconds);
  const middleY: number = runtime.y + runtime.size / 2;
  // a ball floating in the lake is lower than a flyer can go: skimming the water over it is close enough
  const reachY: number = Math.max(point.y, runtime.size / 2);
  return Math.hypot(getPixelPalsCenterX(runtime) - point.x, middleY - reachY) <= runtime.size * FLY_CATCH_REACH_IN_SPRITES;
}

function stepFly(runtime: PixelPalsPetRuntime, seconds: number, context: PixelPalsSimulationContext): void {
  // Pixel Pals got too short to fly around in (a resize, or a theme with a taller floor): do something else, which lands it
  if (!canFlyAroundIn(runtime, context.bounds)) {
    pickNextPixelPalsBehavior(runtime, context);
    return;
  }
  const flight: PixelPalsFlight =
    runtime.flight && !runtime.flight.isLanding ? runtime.flight : setFlightTarget(runtime, pickFlightTarget(runtime, context.bounds), context.bounds);
  if (moveAlongFlight(runtime, flight, getFlySpeed(runtime), seconds)) {
    // there: on to another point until the time is up
    setFlightTarget(runtime, pickFlightTarget(runtime, context.bounds), context.bounds);
  }
  if (runtime.behaviorSecondsLeft <= 0) {
    pickNextPixelPalsBehavior(runtime, context);
  }
}

function canClimbIn(runtime: PixelPalsPetRuntime, bounds: PixelPalsWorldBounds): boolean {
  return (
    runtime.definition.canClimb &&
    // the stones are away from the walls
    !hasPixelPalsIslands(bounds) &&
    getPixelPalsMaxClimbY(bounds, runtime.size) >= runtime.size * PIXEL_PALS_MIN_CLIMB_HEIGHT_IN_SPRITES
  );
}

/** Moves along the ground the way it faces. Returns where it stopped, at a wall or at the end of its stone, if it did. */
function moveAlongGround(runtime: PixelPalsPetRuntime, speed: number, seconds: number, bounds: PixelPalsWorldBounds): PixelPalsGroundStop | null {
  const range: PixelPalsGroundRange = getGroundRange(runtime, bounds);
  const isWall: boolean = range.islandIndex === -1;
  runtime.x += runtime.direction * speed * seconds;
  if (runtime.x <= range.minX) {
    runtime.x = range.minX;
    return runtime.direction === -1 ? { side: 'left', isWall } : null;
  }
  if (runtime.x >= range.maxX) {
    runtime.x = range.maxX;
    return runtime.direction === 1 ? { side: 'right', isWall } : null;
  }
  return null;
}

/**
 * Walks toward a point, given as where the pet's middle should end up. On the lake it walks to the end of its stone
 * and hops across, one stone at a time, and stops at the end of the stone nearest the point.
 * Returns true once it is there.
 */
function moveTowardX(runtime: PixelPalsPetRuntime, targetCenterX: number, speed: number, seconds: number, bounds: PixelPalsWorldBounds): boolean {
  const range: PixelPalsGroundRange = getGroundRange(runtime, bounds);
  let goal: number = targetCenterX;
  if (range.islandIndex !== -1) {
    const targetIndex: number = findPixelPalsIslandIndex(bounds, targetCenterX);
    const span: PixelPalsIslandSpan = bounds.islands[range.islandIndex];
    if (targetIndex === range.islandIndex) {
      goal = clampToPixelPalsIsland(span, targetCenterX);
    } else {
      const side: PixelPalsWallSide = targetIndex > range.islandIndex ? 'right' : 'left';
      goal = side === 'right' ? span.right : span.left;
      if (Math.abs(goal - getPixelPalsCenterX(runtime)) <= 0.5) {
        if (runtime.y === 0) {
          startPixelPalsSkip(runtime, range.islandIndex, side, bounds);
        }
        return false;
      }
    }
  }

  const distance: number = goal - getPixelPalsCenterX(runtime);
  if (Math.abs(distance) <= 0.5) {
    return true;
  }
  facePixelPalsTarget(runtime, goal);
  runtime.x += Math.sign(distance) * Math.min(Math.abs(distance), speed * seconds);
  runtime.x = Math.min(range.maxX, Math.max(range.minX, runtime.x));
  return false;
}

/** Hops and jumps: rises, then gravity brings it back to the ground. */
function applyGroundGravity(runtime: PixelPalsPetRuntime, seconds: number): void {
  if (runtime.y <= 0 && runtime.vy <= 0) {
    runtime.y = 0;
    runtime.vy = 0;
    return;
  }
  runtime.vy -= PIXEL_PALS_GRAVITY * seconds;
  runtime.y += runtime.vy * seconds;
  if (runtime.y <= 0) {
    runtime.y = 0;
    runtime.vy = 0;
  }
}

function maybeHop(
  runtime: PixelPalsPetRuntime,
  seconds: number,
  bounds: PixelPalsWorldBounds,
  chancePerSecond: number = PIXEL_PALS_HOP_CHANCE_PER_SECOND,
): void {
  if (runtime.y === 0 && runtime.vy === 0 && randomChance(chancePerSecond * seconds)) {
    runtime.vy = getPixelPalsJumpVelocity(PIXEL_PALS_HOP_VELOCITY, bounds, runtime.size);
  }
}

function updateBubbles(runtime: PixelPalsPetRuntime, seconds: number): void {
  if (runtime.bubbleText !== null) {
    runtime.bubbleSecondsLeft -= seconds;
    if (runtime.bubbleSecondsLeft <= 0) {
      runtime.bubbleText = null;
    }
  }
  if (runtime.pendingBubble) {
    runtime.pendingBubble.delaySeconds -= seconds;
    if (runtime.pendingBubble.delaySeconds <= 0) {
      showPixelPalsBubble(runtime, runtime.pendingBubble.text, runtime.pendingBubble.durationSeconds);
    }
  }
}

/** At the end of a stone: hops to the next one, or returns false when it turns around instead. */
function maybeSkipAtEdge(runtime: PixelPalsPetRuntime, stop: PixelPalsGroundStop, chance: number, bounds: PixelPalsWorldBounds): boolean {
  if (runtime.y !== 0 || !randomChance(chance)) {
    return false;
  }
  return startPixelPalsSkip(runtime, findPixelPalsIslandIndex(bounds, getPixelPalsCenterX(runtime)), stop.side, bounds);
}

function stepWalking(runtime: PixelPalsPetRuntime, seconds: number, context: PixelPalsSimulationContext, speedMultiplier: number): void {
  applyGroundGravity(runtime, seconds);
  maybeHop(runtime, seconds, context.bounds);
  const stop: PixelPalsGroundStop | null = moveAlongGround(runtime, runtime.speed * speedMultiplier, seconds, context.bounds);
  if (stop) {
    if (stop.isWall && runtime.y === 0 && canClimbIn(runtime, context.bounds) && randomChance(PIXEL_PALS_CLIMB_CHANCE)) {
      startPixelPalsClimb(runtime, stop.side, context.bounds);
      return;
    }
    if (!stop.isWall && maybeSkipAtEdge(runtime, stop, PIXEL_PALS_SKIP_CHANCE, context.bounds)) {
      return;
    }
    // turn around, sometimes after a little break
    runtime.direction = stop.side === 'left' ? 1 : -1;
    if (randomChance(0.4)) {
      setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.idle);
    }
    return;
  }
  if (runtime.behaviorSecondsLeft <= 0) {
    pickNextPixelPalsBehavior(runtime, context);
  }
}

function stepZoomies(runtime: PixelPalsPetRuntime, seconds: number, context: PixelPalsSimulationContext): void {
  applyGroundGravity(runtime, seconds);
  maybeHop(runtime, seconds, context.bounds, PIXEL_PALS_HOP_CHANCE_PER_SECOND * 4);
  const stop: PixelPalsGroundStop | null = moveAlongGround(runtime, runtime.speed * PIXEL_PALS_ZOOMIES_SPEED_MULTIPLIER, seconds, context.bounds);
  if (stop && (stop.isWall || !maybeSkipAtEdge(runtime, stop, PIXEL_PALS_ZOOMIES_SKIP_CHANCE, context.bounds))) {
    runtime.direction = stop.side === 'left' ? 1 : -1;
  }
  if (runtime.behaviorSecondsLeft <= 0) {
    setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.idle);
    showPixelPalsBubble(runtime, PIXEL_PALS_MESSAGES.zoomiesDone);
  }
}

function stepApproachFriend(runtime: PixelPalsPetRuntime, seconds: number, context: PixelPalsSimulationContext): void {
  applyGroundGravity(runtime, seconds);
  const friend: PixelPalsPetRuntime | undefined = runtime.friendId ? context.findPet(runtime.friendId) : undefined;
  if (!friend || friend.behavior !== PIXEL_PALS_BEHAVIOR.waitForFriend || runtime.behaviorSecondsLeft <= 0) {
    if (friend && friend.behavior === PIXEL_PALS_BEHAVIOR.waitForFriend) {
      pickNextPixelPalsBehavior(friend, context);
    }
    pickNextPixelPalsBehavior(runtime, context);
    return;
  }
  if (isPixelPalsPetOnGround(runtime) && arePixelPalsPetsClose(runtime, friend)) {
    context.startConversation(runtime, friend);
    return;
  }
  moveTowardX(runtime, getPixelPalsCenterX(friend), runtime.speed, seconds, context.bounds);
}

function stepChase(runtime: PixelPalsPetRuntime, seconds: number, context: PixelPalsSimulationContext): void {
  const ball: PixelPalsBallRuntime | null = context.ball;
  if (!ball || ball.heldByPetId !== null) {
    pickNextPixelPalsBehavior(runtime, context);
    return;
  }
  // a pet that can fly flies straight at it, and can catch it in the air
  if (runtime.definition.canFly) {
    if (flyToCatch(runtime, ball, seconds, context.bounds)) {
      context.catchBall(runtime);
    }
    return;
  }
  applyGroundGravity(runtime, seconds);
  // line the middle of the pet up with the ball, or get as close as the stones allow
  moveTowardX(runtime, ball.x, runtime.speed * PIXEL_PALS_CHASE_SPEED_MULTIPLIER, seconds, context.bounds);
  const reach: number = runtime.size * 0.45 + (hasPixelPalsIslands(context.bounds) ? PIXEL_PALS_ISLAND_CATCH_REACH_PX : 0);
  const isBallLowEnough: boolean = ball.y <= runtime.size * 0.7;
  const isBallUnderPet: boolean = Math.abs(getPixelPalsCenterX(runtime) - ball.x) <= reach;
  if (isBallLowEnough && isBallUnderPet && runtime.skip === null) {
    context.catchBall(runtime);
  }
}

/** The food nearest to a pet's middle. */
function findNearestFood(runtime: PixelPalsPetRuntime, foods: readonly PixelPalsFoodRuntime[]): PixelPalsFoodRuntime | undefined {
  const middleY: number = runtime.y + runtime.size / 2;
  let nearest: PixelPalsFoodRuntime | undefined;
  let nearestDistance: number = Number.POSITIVE_INFINITY;
  foods.forEach((food: PixelPalsFoodRuntime) => {
    const distance: number = Math.hypot(food.x - getPixelPalsCenterX(runtime), food.y - middleY);
    if (distance < nearestDistance) {
      nearest = food;
      nearestDistance = distance;
    }
  });
  return nearest;
}

/** Goes for the nearest food, another one when that one is eaten first, until there is none left. */
function stepForage(runtime: PixelPalsPetRuntime, seconds: number, context: PixelPalsSimulationContext): void {
  const food: PixelPalsFoodRuntime | undefined = findNearestFood(runtime, context.foods);
  if (!food) {
    pickNextPixelPalsBehavior(runtime, context);
    return;
  }
  if (runtime.definition.canFly) {
    if (flyToCatch(runtime, { x: food.x, y: food.y + PIXEL_PALS_FOOD_SIZE_PX / 2 }, seconds, context.bounds)) {
      context.eatFood(runtime, food);
    }
    return;
  }
  applyGroundGravity(runtime, seconds);
  moveTowardX(runtime, food.x, runtime.speed * PIXEL_PALS_CHASE_SPEED_MULTIPLIER, seconds, context.bounds);
  const reach: number = runtime.size * 0.45 + (hasPixelPalsIslands(context.bounds) ? PIXEL_PALS_ISLAND_CATCH_REACH_PX : 0);
  const isFoodLowEnough: boolean = food.y <= runtime.size * 0.7;
  const isFoodUnderPet: boolean = Math.abs(getPixelPalsCenterX(runtime) - food.x) <= reach;
  if (isFoodLowEnough && isFoodUnderPet && runtime.skip === null) {
    context.eatFood(runtime, food);
  }
}

function stepWaitForFriend(runtime: PixelPalsPetRuntime, context: PixelPalsSimulationContext): void {
  const friend: PixelPalsPetRuntime | undefined = runtime.friendId ? context.findPet(runtime.friendId) : undefined;
  if (!friend || friend.behavior !== PIXEL_PALS_BEHAVIOR.approachFriend || runtime.behaviorSecondsLeft <= 0) {
    pickNextPixelPalsBehavior(runtime, context);
    return;
  }
  facePixelPalsTarget(runtime, getPixelPalsCenterX(friend));
}

function stepClimb(runtime: PixelPalsPetRuntime, seconds: number, context: PixelPalsSimulationContext): void {
  runtime.x = runtime.wall === 'right' ? getPixelPalsMaxX(context.bounds, runtime.size) : 0;
  runtime.y += PIXEL_PALS_CLIMB_SPEED * seconds;
  if (runtime.y >= runtime.climbTargetY) {
    runtime.y = runtime.climbTargetY;
    setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.wallHang);
  }
}

function stepFall(runtime: PixelPalsPetRuntime, seconds: number): void {
  runtime.vy -= PIXEL_PALS_GRAVITY * seconds;
  runtime.y += runtime.vy * seconds;
  if (runtime.y <= 0) {
    runtime.y = 0;
    runtime.vy = 0;
    setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.land);
  }
}

/** Advances one pet by `seconds`. */
export function stepPixelPalsPet(runtime: PixelPalsPetRuntime, seconds: number, context: PixelPalsSimulationContext): void {
  updateBubbles(runtime, seconds);
  runtime.behaviorSecondsLeft -= seconds;

  // a hop between stones finishes first, whatever the pet is up to
  if (runtime.skip) {
    stepPixelPalsSkip(runtime, seconds);
    return;
  }
  // and a pet in the air lands first, unless it is flying somewhere; a behavior that ran out meanwhile ends once it lands
  if (runtime.flight && !FLIGHT_BEHAVIORS.includes(runtime.behavior)) {
    stepLanding(runtime, seconds, context.bounds);
    return;
  }

  switch (runtime.behavior) {
    case PIXEL_PALS_BEHAVIOR.walk:
      stepWalking(runtime, seconds, context, 1);
      return;
    case PIXEL_PALS_BEHAVIOR.run:
      stepWalking(runtime, seconds, context, PIXEL_PALS_RUN_SPEED_MULTIPLIER);
      return;
    case PIXEL_PALS_BEHAVIOR.approachFriend:
      stepApproachFriend(runtime, seconds, context);
      return;
    case PIXEL_PALS_BEHAVIOR.zoomies:
      stepZoomies(runtime, seconds, context);
      return;
    case PIXEL_PALS_BEHAVIOR.chase:
      stepChase(runtime, seconds, context);
      return;
    case PIXEL_PALS_BEHAVIOR.forage:
      stepForage(runtime, seconds, context);
      return;
    case PIXEL_PALS_BEHAVIOR.fly:
      stepFly(runtime, seconds, context);
      return;
    case PIXEL_PALS_BEHAVIOR.waitForFriend:
      applyGroundGravity(runtime, seconds);
      stepWaitForFriend(runtime, context);
      return;
    case PIXEL_PALS_BEHAVIOR.climb:
      stepClimb(runtime, seconds, context);
      return;
    case PIXEL_PALS_BEHAVIOR.wallHang:
      if (runtime.behaviorSecondsLeft <= 0) {
        startPixelPalsFall(runtime);
      }
      return;
    case PIXEL_PALS_BEHAVIOR.fall:
      stepFall(runtime, seconds);
      return;
    default:
      // idle, lie, stand, swipe, land, talk, withBall, eat: stay put, finish a jump
      applyGroundGravity(runtime, seconds);
      break;
  }

  if (runtime.behaviorSecondsLeft <= 0) {
    pickNextPixelPalsBehavior(runtime, context);
  }
}
