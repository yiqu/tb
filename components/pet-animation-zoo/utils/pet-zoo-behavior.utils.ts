import { PET_ZOO_BEHAVIOR } from '../models/pet-zoo-runtime.models';
import { PET_ZOO_SPRITE_SIZE_PX } from '../constants/pet-zoo.constants';
import { getPetZooPetDefinition } from './pet-zoo-pet.utils';
import { PET_ZOO_MESSAGES } from '../constants/pet-zoo-messages.constants';
import { randomItem, randomSign, randomChance, randomBetween, randomWeightedKey } from './pet-zoo-random.utils';
import { hasPetZooIslands, clampToPetZooIsland, findPetZooIslandIndex } from './pet-zoo-island.utils';
import {
  PET_ZOO_GRAVITY,
  PET_ZOO_CLIMB_SPEED,
  PET_ZOO_SKIP_CHANCE,
  PET_ZOO_CLIMB_CHANCE,
  PET_ZOO_HOP_VELOCITY,
  PET_ZOO_BUBBLE_SECONDS,
  PET_ZOO_BEHAVIOR_DURATION,
  PET_ZOO_SPEED_FACTOR_RANGE,
  PET_ZOO_SKIP_MIN_VELOCITY,
  PET_ZOO_ZOOMIES_SKIP_CHANCE,
  PET_ZOO_NEXT_BEHAVIOR_WEIGHTS,
  PET_ZOO_RUN_SPEED_MULTIPLIER,
  PET_ZOO_HOP_CHANCE_PER_SECOND,
  PET_ZOO_ISLAND_CATCH_REACH_PX,
  PET_ZOO_SKIP_LANDING_INSET_PX,
  PET_ZOO_CHASE_SPEED_MULTIPLIER,
  PET_ZOO_ZOOMIES_SPEED_MULTIPLIER,
  PET_ZOO_CLIMB_HEIGHT_FACTOR_RANGE,
  PET_ZOO_MIN_CLIMB_HEIGHT_IN_SPRITES,
  PET_ZOO_CONVERSATION_DISTANCE_IN_SPRITES,
} from '../constants/pet-zoo-behavior.constants';

import type { PetZooPet } from '../models/pet-zoo.models';
import type {
  PetZooBehavior,
  PetZooWallSide,
  PetZooIslandSpan,
  PetZooBallRuntime,
  PetZooPetRuntime,
  PetZooWorldBounds,
} from '../models/pet-zoo-runtime.models';

/** What a pet needs to know about the rest of the world while it takes a step. */
export interface PetZooSimulationContext {
  bounds: PetZooWorldBounds;
  ball: PetZooBallRuntime | null;
  findPet: (id: string) => PetZooPetRuntime | undefined;
  catchBall: (runtime: PetZooPetRuntime) => void;
  startConversation: (initiator: PetZooPetRuntime, partner: PetZooPetRuntime) => void;
}

/**
 * Where a pet stopped while moving along the ground: at a wall of the zoo, or at the end of its stepping stone,
 * where it can hop to the next one.
 */
interface PetZooGroundStop {
  side: PetZooWallSide;
  isWall: boolean;
}

/** The part of the ground a pet's left edge can be on right now: the whole width, or its stepping stone. */
interface PetZooGroundRange {
  minX: number;
  maxX: number;
  /** The stone it stands on, -1 on solid ground. */
  islandIndex: number;
}

type TimedBehavior = keyof typeof PET_ZOO_BEHAVIOR_DURATION;

/** Behaviors a pet can be pulled out of to chase a ball or to talk. */
const FREE_BEHAVIORS: readonly PetZooBehavior[] = [
  PET_ZOO_BEHAVIOR.idle,
  PET_ZOO_BEHAVIOR.lie,
  PET_ZOO_BEHAVIOR.stand,
  PET_ZOO_BEHAVIOR.walk,
  PET_ZOO_BEHAVIOR.run,
];

const ON_WALL_BEHAVIORS: readonly PetZooBehavior[] = [PET_ZOO_BEHAVIOR.climb, PET_ZOO_BEHAVIOR.wallHang, PET_ZOO_BEHAVIOR.fall];

export function getPetZooPetSize(sizeScale: number): number {
  return Math.round(PET_ZOO_SPRITE_SIZE_PX * sizeScale);
}

export function getPetZooCenterX(runtime: PetZooPetRuntime): number {
  return runtime.x + runtime.size / 2;
}

export function getPetZooMaxX(bounds: PetZooWorldBounds, size: number): number {
  return Math.max(0, bounds.width - size);
}

/** How high a pet can climb before its head reaches the top of the zoo. */
export function getPetZooMaxClimbY(bounds: PetZooWorldBounds, size: number): number {
  return Math.max(0, bounds.height - bounds.floor - size - 4);
}

/** A jump's starting speed, lowered when the zoo is too short for the full jump, so the pet never leaves the top. */
export function getPetZooJumpVelocity(velocity: number, bounds: PetZooWorldBounds, size: number): number {
  // a jump peaks at v² / 2g
  return Math.min(velocity, Math.sqrt(2 * PET_ZOO_GRAVITY * getPetZooMaxClimbY(bounds, size)));
}

/** Whether two pets are close enough to talk. */
export function arePetZooPetsClose(a: PetZooPetRuntime, b: PetZooPetRuntime): boolean {
  const reach: number = ((a.size + b.size) / 2) * PET_ZOO_CONVERSATION_DISTANCE_IN_SPRITES;
  return Math.abs(getPetZooCenterX(a) - getPetZooCenterX(b)) <= reach;
}

export function isPetZooPetFree(runtime: PetZooPetRuntime): boolean {
  return FREE_BEHAVIORS.includes(runtime.behavior);
}

export function isPetZooPetOnWall(runtime: PetZooPetRuntime): boolean {
  return ON_WALL_BEHAVIORS.includes(runtime.behavior);
}

/** On the ground, not in a hop, a jump or a hop between stones. */
export function isPetZooPetOnGround(runtime: PetZooPetRuntime): boolean {
  return runtime.y === 0 && runtime.skip === null;
}

export function canPetZooPetMove(runtime: PetZooPetRuntime): boolean {
  return runtime.speed > 0;
}

function getGroundRange(runtime: PetZooPetRuntime, bounds: PetZooWorldBounds): PetZooGroundRange {
  const maxX: number = getPetZooMaxX(bounds, runtime.size);
  const islandIndex: number = findPetZooIslandIndex(bounds, getPetZooCenterX(runtime));
  const span: PetZooIslandSpan | undefined = bounds.islands[islandIndex];
  if (!span) {
    return { minX: 0, maxX, islandIndex: -1 };
  }
  const half: number = runtime.size / 2;
  return { minX: Math.max(0, span.left - half), maxX: Math.min(maxX, span.right - half), islandIndex };
}

/** Puts a pet back on the ground it can stand on: inside the zoo, and on a stone when there are stones. */
export function keepPetZooPetOnGround(runtime: PetZooPetRuntime, bounds: PetZooWorldBounds): void {
  const range: PetZooGroundRange = getGroundRange(runtime, bounds);
  runtime.x = Math.min(range.maxX, Math.max(range.minX, runtime.x));
}

export function createPetZooPetRuntime(pet: PetZooPet, bounds: PetZooWorldBounds): PetZooPetRuntime {
  const definition = getPetZooPetDefinition(pet.type);
  const size: number = getPetZooPetSize(definition.sizeScale);
  // a random spot on the ground, or on a random stone
  const span: PetZooIslandSpan | undefined = randomItem(bounds.islands);
  const x: number = span ? randomBetween([span.left, span.right]) - size / 2 : Math.random() * getPetZooMaxX(bounds, size);
  return {
    pet,
    definition,
    speed: definition.speed * randomBetween(PET_ZOO_SPEED_FACTOR_RANGE),
    size,
    x,
    y: 0,
    vy: 0,
    direction: randomSign(),
    behavior: PET_ZOO_BEHAVIOR.idle,
    // a random part of an idle, so pets loaded together do not all start walking on the same frame
    behaviorSecondsLeft: Math.random() * randomBetween(PET_ZOO_BEHAVIOR_DURATION.idle),
    wall: null,
    climbTargetY: 0,
    skip: null,
    friendId: null,
    bubbleText: null,
    bubbleSecondsLeft: 0,
    pendingBubble: null,
    clickStreak: 0,
    lastClickAt: Number.NEGATIVE_INFINITY,
  };
}

/** Switches behavior. Without a duration, timed behaviors draw one from their range and the others run until an event ends them. */
export function setPetZooBehavior(runtime: PetZooPetRuntime, behavior: PetZooBehavior, seconds?: number): void {
  runtime.behavior = behavior;
  if (seconds !== undefined) {
    runtime.behaviorSecondsLeft = seconds;
    return;
  }
  runtime.behaviorSecondsLeft =
    behavior in PET_ZOO_BEHAVIOR_DURATION ? randomBetween(PET_ZOO_BEHAVIOR_DURATION[behavior as TimedBehavior]) : Number.POSITIVE_INFINITY;
}

export function showPetZooBubble(runtime: PetZooPetRuntime, text: string, seconds: number = PET_ZOO_BUBBLE_SECONDS): void {
  runtime.bubbleText = text;
  runtime.bubbleSecondsLeft = seconds;
  runtime.pendingBubble = null;
}

/** Turns a pet toward a point, given as where its middle should go. */
export function facePetZooTarget(runtime: PetZooPetRuntime, targetCenterX: number): void {
  const centerX: number = getPetZooCenterX(runtime);
  if (Math.abs(targetCenterX - centerX) > 0.5) {
    runtime.direction = targetCenterX > centerX ? 1 : -1;
  }
}

/** A pet finished what it was doing: it chases a ball in play, or picks something at random. */
export function pickNextPetZooBehavior(runtime: PetZooPetRuntime, context: PetZooSimulationContext): void {
  runtime.friendId = null;
  runtime.wall = null;

  if (!canPetZooPetMove(runtime)) {
    setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.idle);
    return;
  }
  if (context.ball && context.ball.heldByPetId === null) {
    setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.chase);
    return;
  }

  const animations = runtime.definition.animations;
  const next = randomWeightedKey({
    walk: PET_ZOO_NEXT_BEHAVIOR_WEIGHTS.walk,
    run: PET_ZOO_NEXT_BEHAVIOR_WEIGHTS.run,
    idle: PET_ZOO_NEXT_BEHAVIOR_WEIGHTS.idle,
    lie: animations.includes('lie') ? PET_ZOO_NEXT_BEHAVIOR_WEIGHTS.lie : 0,
    stand: animations.includes('stand') ? PET_ZOO_NEXT_BEHAVIOR_WEIGHTS.stand : 0,
  });
  setPetZooBehavior(runtime, next ?? PET_ZOO_BEHAVIOR.idle);

  // walk away from the wall or the end of the stone it stands at, otherwise any way
  const range: PetZooGroundRange = getGroundRange(runtime, context.bounds);
  if (runtime.x <= range.minX + 1) {
    runtime.direction = 1;
  } else if (runtime.x >= range.maxX - 1) {
    runtime.direction = -1;
  } else {
    runtime.direction = randomSign();
  }
}

export function startPetZooClimb(runtime: PetZooPetRuntime, wall: PetZooWallSide, bounds: PetZooWorldBounds): void {
  setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.climb);
  runtime.wall = wall;
  runtime.x = wall === 'left' ? 0 : getPetZooMaxX(bounds, runtime.size);
  runtime.vy = 0;
  runtime.climbTargetY = randomBetween(PET_ZOO_CLIMB_HEIGHT_FACTOR_RANGE) * getPetZooMaxClimbY(bounds, runtime.size);
}

/** Lets go of the wall, or of nothing: falls to the ground facing away from the wall. */
export function startPetZooFall(runtime: PetZooPetRuntime): void {
  if (runtime.wall) {
    runtime.direction = runtime.wall === 'left' ? 1 : -1;
  }
  setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.fall);
  runtime.wall = null;
  runtime.vy = 0;
}

/**
 * Hops from the pet's stone to the stone next to it on `side`, in an arc that lands a little way onto it.
 * A longer gap gets a higher arc, but never higher than the zoo.
 */
function startPetZooSkip(runtime: PetZooPetRuntime, fromIndex: number, side: PetZooWallSide, bounds: PetZooWorldBounds): boolean {
  const toIndex: number = side === 'right' ? fromIndex + 1 : fromIndex - 1;
  const target: PetZooIslandSpan | undefined = bounds.islands[toIndex];
  if (!target) {
    return false;
  }
  const inset: number = Math.min(PET_ZOO_SKIP_LANDING_INSET_PX, (target.right - target.left) / 2);
  const landingCenter: number = side === 'right' ? target.left + inset : target.right - inset;
  const targetX: number = landingCenter - runtime.size / 2;
  const distance: number = Math.abs(targetX - runtime.x);
  // a 45° arc covers the distance at v² / g, half of v goes up
  const velocity: number = Math.max(PET_ZOO_SKIP_MIN_VELOCITY, Math.sqrt((PET_ZOO_GRAVITY * distance) / 2));
  runtime.vy = Math.max(PET_ZOO_SKIP_MIN_VELOCITY / 2, getPetZooJumpVelocity(velocity, bounds, runtime.size));
  const airSeconds: number = (2 * runtime.vy) / PET_ZOO_GRAVITY;
  runtime.skip = { targetX, vx: (targetX - runtime.x) / airSeconds };
  runtime.direction = side === 'right' ? 1 : -1;
  return true;
}

/** Flies along a hop between stones and lands on the next one. */
function stepPetZooSkip(runtime: PetZooPetRuntime, seconds: number): void {
  const skip = runtime.skip;
  if (!skip) {
    return;
  }
  runtime.x += skip.vx * seconds;
  if ((skip.vx > 0 && runtime.x > skip.targetX) || (skip.vx < 0 && runtime.x < skip.targetX)) {
    runtime.x = skip.targetX;
  }
  runtime.vy -= PET_ZOO_GRAVITY * seconds;
  runtime.y += runtime.vy * seconds;
  if (runtime.y <= 0 && runtime.vy < 0) {
    runtime.y = 0;
    runtime.vy = 0;
    runtime.x = skip.targetX;
    runtime.skip = null;
  }
}

export function startPetZooConversation(initiator: PetZooPetRuntime, partner: PetZooPetRuntime, lines: readonly [string, string], lineSeconds: number): void {
  setPetZooBehavior(initiator, PET_ZOO_BEHAVIOR.talk);
  setPetZooBehavior(partner, PET_ZOO_BEHAVIOR.talk, initiator.behaviorSecondsLeft);
  initiator.friendId = partner.pet.id;
  partner.friendId = initiator.pet.id;
  facePetZooTarget(initiator, getPetZooCenterX(partner));
  facePetZooTarget(partner, getPetZooCenterX(initiator));
  showPetZooBubble(initiator, lines[0], lineSeconds);
  // the answer comes once the first line is gone
  partner.pendingBubble = { text: lines[1], delaySeconds: lineSeconds + 0.2, durationSeconds: lineSeconds };
}

function canClimbIn(runtime: PetZooPetRuntime, bounds: PetZooWorldBounds): boolean {
  return (
    runtime.definition.canClimb &&
    // the stones are away from the walls
    !hasPetZooIslands(bounds) &&
    getPetZooMaxClimbY(bounds, runtime.size) >= PET_ZOO_SPRITE_SIZE_PX * PET_ZOO_MIN_CLIMB_HEIGHT_IN_SPRITES
  );
}

/** Moves along the ground the way it faces. Returns where it stopped, at a wall or at the end of its stone, if it did. */
function moveAlongGround(runtime: PetZooPetRuntime, speed: number, seconds: number, bounds: PetZooWorldBounds): PetZooGroundStop | null {
  const range: PetZooGroundRange = getGroundRange(runtime, bounds);
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
function moveTowardX(runtime: PetZooPetRuntime, targetCenterX: number, speed: number, seconds: number, bounds: PetZooWorldBounds): boolean {
  const range: PetZooGroundRange = getGroundRange(runtime, bounds);
  let goal: number = targetCenterX;
  if (range.islandIndex !== -1) {
    const targetIndex: number = findPetZooIslandIndex(bounds, targetCenterX);
    const span: PetZooIslandSpan = bounds.islands[range.islandIndex];
    if (targetIndex === range.islandIndex) {
      goal = clampToPetZooIsland(span, targetCenterX);
    } else {
      const side: PetZooWallSide = targetIndex > range.islandIndex ? 'right' : 'left';
      goal = side === 'right' ? span.right : span.left;
      if (Math.abs(goal - getPetZooCenterX(runtime)) <= 0.5) {
        if (runtime.y === 0) {
          startPetZooSkip(runtime, range.islandIndex, side, bounds);
        }
        return false;
      }
    }
  }

  const distance: number = goal - getPetZooCenterX(runtime);
  if (Math.abs(distance) <= 0.5) {
    return true;
  }
  facePetZooTarget(runtime, goal);
  runtime.x += Math.sign(distance) * Math.min(Math.abs(distance), speed * seconds);
  runtime.x = Math.min(range.maxX, Math.max(range.minX, runtime.x));
  return false;
}

/** Hops and jumps: rises, then gravity brings it back to the ground. */
function applyGroundGravity(runtime: PetZooPetRuntime, seconds: number): void {
  if (runtime.y <= 0 && runtime.vy <= 0) {
    runtime.y = 0;
    runtime.vy = 0;
    return;
  }
  runtime.vy -= PET_ZOO_GRAVITY * seconds;
  runtime.y += runtime.vy * seconds;
  if (runtime.y <= 0) {
    runtime.y = 0;
    runtime.vy = 0;
  }
}

function maybeHop(
  runtime: PetZooPetRuntime,
  seconds: number,
  bounds: PetZooWorldBounds,
  chancePerSecond: number = PET_ZOO_HOP_CHANCE_PER_SECOND,
): void {
  if (runtime.y === 0 && runtime.vy === 0 && randomChance(chancePerSecond * seconds)) {
    runtime.vy = getPetZooJumpVelocity(PET_ZOO_HOP_VELOCITY, bounds, runtime.size);
  }
}

function updateBubbles(runtime: PetZooPetRuntime, seconds: number): void {
  if (runtime.bubbleText !== null) {
    runtime.bubbleSecondsLeft -= seconds;
    if (runtime.bubbleSecondsLeft <= 0) {
      runtime.bubbleText = null;
    }
  }
  if (runtime.pendingBubble) {
    runtime.pendingBubble.delaySeconds -= seconds;
    if (runtime.pendingBubble.delaySeconds <= 0) {
      showPetZooBubble(runtime, runtime.pendingBubble.text, runtime.pendingBubble.durationSeconds);
    }
  }
}

/** At the end of a stone: hops to the next one, or returns false when it turns around instead. */
function maybeSkipAtEdge(runtime: PetZooPetRuntime, stop: PetZooGroundStop, chance: number, bounds: PetZooWorldBounds): boolean {
  if (runtime.y !== 0 || !randomChance(chance)) {
    return false;
  }
  return startPetZooSkip(runtime, findPetZooIslandIndex(bounds, getPetZooCenterX(runtime)), stop.side, bounds);
}

function stepWalking(runtime: PetZooPetRuntime, seconds: number, context: PetZooSimulationContext, speedMultiplier: number): void {
  applyGroundGravity(runtime, seconds);
  maybeHop(runtime, seconds, context.bounds);
  const stop: PetZooGroundStop | null = moveAlongGround(runtime, runtime.speed * speedMultiplier, seconds, context.bounds);
  if (stop) {
    if (stop.isWall && runtime.y === 0 && canClimbIn(runtime, context.bounds) && randomChance(PET_ZOO_CLIMB_CHANCE)) {
      startPetZooClimb(runtime, stop.side, context.bounds);
      return;
    }
    if (!stop.isWall && maybeSkipAtEdge(runtime, stop, PET_ZOO_SKIP_CHANCE, context.bounds)) {
      return;
    }
    // turn around, sometimes after a little break
    runtime.direction = stop.side === 'left' ? 1 : -1;
    if (randomChance(0.4)) {
      setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.idle);
    }
    return;
  }
  if (runtime.behaviorSecondsLeft <= 0) {
    pickNextPetZooBehavior(runtime, context);
  }
}

function stepZoomies(runtime: PetZooPetRuntime, seconds: number, context: PetZooSimulationContext): void {
  applyGroundGravity(runtime, seconds);
  maybeHop(runtime, seconds, context.bounds, PET_ZOO_HOP_CHANCE_PER_SECOND * 4);
  const stop: PetZooGroundStop | null = moveAlongGround(runtime, runtime.speed * PET_ZOO_ZOOMIES_SPEED_MULTIPLIER, seconds, context.bounds);
  if (stop && (stop.isWall || !maybeSkipAtEdge(runtime, stop, PET_ZOO_ZOOMIES_SKIP_CHANCE, context.bounds))) {
    runtime.direction = stop.side === 'left' ? 1 : -1;
  }
  if (runtime.behaviorSecondsLeft <= 0) {
    setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.idle);
    showPetZooBubble(runtime, PET_ZOO_MESSAGES.zoomiesDone);
  }
}

function stepApproachFriend(runtime: PetZooPetRuntime, seconds: number, context: PetZooSimulationContext): void {
  applyGroundGravity(runtime, seconds);
  const friend: PetZooPetRuntime | undefined = runtime.friendId ? context.findPet(runtime.friendId) : undefined;
  if (!friend || friend.behavior !== PET_ZOO_BEHAVIOR.waitForFriend || runtime.behaviorSecondsLeft <= 0) {
    if (friend && friend.behavior === PET_ZOO_BEHAVIOR.waitForFriend) {
      pickNextPetZooBehavior(friend, context);
    }
    pickNextPetZooBehavior(runtime, context);
    return;
  }
  if (isPetZooPetOnGround(runtime) && arePetZooPetsClose(runtime, friend)) {
    context.startConversation(runtime, friend);
    return;
  }
  moveTowardX(runtime, getPetZooCenterX(friend), runtime.speed, seconds, context.bounds);
}

function stepChase(runtime: PetZooPetRuntime, seconds: number, context: PetZooSimulationContext): void {
  applyGroundGravity(runtime, seconds);
  const ball: PetZooBallRuntime | null = context.ball;
  if (!ball || ball.heldByPetId !== null) {
    pickNextPetZooBehavior(runtime, context);
    return;
  }
  // line the middle of the pet up with the ball, or get as close as the stones allow
  moveTowardX(runtime, ball.x, runtime.speed * PET_ZOO_CHASE_SPEED_MULTIPLIER, seconds, context.bounds);
  const reach: number = runtime.size * 0.45 + (hasPetZooIslands(context.bounds) ? PET_ZOO_ISLAND_CATCH_REACH_PX : 0);
  const isBallLowEnough: boolean = ball.y <= runtime.size * 0.7;
  const isBallUnderPet: boolean = Math.abs(getPetZooCenterX(runtime) - ball.x) <= reach;
  if (isBallLowEnough && isBallUnderPet && runtime.skip === null) {
    context.catchBall(runtime);
  }
}

function stepWaitForFriend(runtime: PetZooPetRuntime, context: PetZooSimulationContext): void {
  const friend: PetZooPetRuntime | undefined = runtime.friendId ? context.findPet(runtime.friendId) : undefined;
  if (!friend || friend.behavior !== PET_ZOO_BEHAVIOR.approachFriend || runtime.behaviorSecondsLeft <= 0) {
    pickNextPetZooBehavior(runtime, context);
    return;
  }
  facePetZooTarget(runtime, getPetZooCenterX(friend));
}

function stepClimb(runtime: PetZooPetRuntime, seconds: number, context: PetZooSimulationContext): void {
  runtime.x = runtime.wall === 'right' ? getPetZooMaxX(context.bounds, runtime.size) : 0;
  runtime.y += PET_ZOO_CLIMB_SPEED * seconds;
  if (runtime.y >= runtime.climbTargetY) {
    runtime.y = runtime.climbTargetY;
    setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.wallHang);
  }
}

function stepFall(runtime: PetZooPetRuntime, seconds: number): void {
  runtime.vy -= PET_ZOO_GRAVITY * seconds;
  runtime.y += runtime.vy * seconds;
  if (runtime.y <= 0) {
    runtime.y = 0;
    runtime.vy = 0;
    setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.land);
  }
}

/** Advances one pet by `seconds`. */
export function stepPetZooPet(runtime: PetZooPetRuntime, seconds: number, context: PetZooSimulationContext): void {
  updateBubbles(runtime, seconds);
  runtime.behaviorSecondsLeft -= seconds;

  // a hop between stones finishes first, whatever the pet is up to
  if (runtime.skip) {
    stepPetZooSkip(runtime, seconds);
    return;
  }

  switch (runtime.behavior) {
    case PET_ZOO_BEHAVIOR.walk:
      stepWalking(runtime, seconds, context, 1);
      return;
    case PET_ZOO_BEHAVIOR.run:
      stepWalking(runtime, seconds, context, PET_ZOO_RUN_SPEED_MULTIPLIER);
      return;
    case PET_ZOO_BEHAVIOR.approachFriend:
      stepApproachFriend(runtime, seconds, context);
      return;
    case PET_ZOO_BEHAVIOR.zoomies:
      stepZoomies(runtime, seconds, context);
      return;
    case PET_ZOO_BEHAVIOR.chase:
      stepChase(runtime, seconds, context);
      return;
    case PET_ZOO_BEHAVIOR.waitForFriend:
      applyGroundGravity(runtime, seconds);
      stepWaitForFriend(runtime, context);
      return;
    case PET_ZOO_BEHAVIOR.climb:
      stepClimb(runtime, seconds, context);
      return;
    case PET_ZOO_BEHAVIOR.wallHang:
      if (runtime.behaviorSecondsLeft <= 0) {
        startPetZooFall(runtime);
      }
      return;
    case PET_ZOO_BEHAVIOR.fall:
      stepFall(runtime, seconds);
      return;
    default:
      // idle, lie, stand, swipe, land, talk, withBall: stay put, finish a jump
      applyGroundGravity(runtime, seconds);
      break;
  }

  if (runtime.behaviorSecondsLeft <= 0) {
    pickNextPetZooBehavior(runtime, context);
  }
}
