import { PET_ZOO_BEHAVIOR } from '../models/pet-zoo-runtime.models';
import { PET_ZOO_SPRITE_SIZE_PX } from '../constants/pet-zoo.constants';
import { getPetZooPetDefinition } from './pet-zoo-pet.utils';
import { PET_ZOO_ZOOMIES_DONE_MESSAGE } from '../constants/pet-zoo-messages.constants';
import { randomSign, randomChance, randomBetween, randomWeightedKey } from './pet-zoo-random.utils';
import {
  PET_ZOO_GRAVITY,
  PET_ZOO_CLIMB_SPEED,
  PET_ZOO_CLIMB_CHANCE,
  PET_ZOO_HOP_VELOCITY,
  PET_ZOO_BUBBLE_SECONDS,
  PET_ZOO_BEHAVIOR_DURATION,
  PET_ZOO_SPEED_FACTOR_RANGE,
  PET_ZOO_NEXT_BEHAVIOR_WEIGHTS,
  PET_ZOO_RUN_SPEED_MULTIPLIER,
  PET_ZOO_HOP_CHANCE_PER_SECOND,
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

export function getPetZooMaxX(bounds: PetZooWorldBounds): number {
  return Math.max(0, bounds.width - PET_ZOO_SPRITE_SIZE_PX);
}

/** How high a pet can climb before its head reaches the top of the zoo. */
export function getPetZooMaxClimbY(bounds: PetZooWorldBounds): number {
  return Math.max(0, bounds.height - bounds.floor - PET_ZOO_SPRITE_SIZE_PX - 4);
}

/** A jump's starting speed, lowered when the zoo is too short for the full jump, so the pet never leaves the top. */
export function getPetZooJumpVelocity(velocity: number, bounds: PetZooWorldBounds): number {
  // a jump peaks at v² / 2g
  return Math.min(velocity, Math.sqrt(2 * PET_ZOO_GRAVITY * getPetZooMaxClimbY(bounds)));
}

export function isPetZooPetFree(runtime: PetZooPetRuntime): boolean {
  return FREE_BEHAVIORS.includes(runtime.behavior);
}

export function isPetZooPetOnWall(runtime: PetZooPetRuntime): boolean {
  return ON_WALL_BEHAVIORS.includes(runtime.behavior);
}

export function canPetZooPetMove(runtime: PetZooPetRuntime): boolean {
  return runtime.speed > 0;
}

export function createPetZooPetRuntime(pet: PetZooPet, bounds: PetZooWorldBounds): PetZooPetRuntime {
  const definition = getPetZooPetDefinition(pet.type);
  return {
    pet,
    definition,
    speed: definition.speed * randomBetween(PET_ZOO_SPEED_FACTOR_RANGE),
    x: Math.random() * getPetZooMaxX(bounds),
    y: 0,
    vy: 0,
    direction: randomSign(),
    behavior: PET_ZOO_BEHAVIOR.idle,
    // a random part of an idle, so pets loaded together do not all start walking on the same frame
    behaviorSecondsLeft: Math.random() * randomBetween(PET_ZOO_BEHAVIOR_DURATION.idle),
    wall: null,
    climbTargetY: 0,
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

export function facePetZooTarget(runtime: PetZooPetRuntime, targetX: number): void {
  if (Math.abs(targetX - runtime.x) > 0.5) {
    runtime.direction = targetX > runtime.x ? 1 : -1;
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

  // walk away from a wall it is standing at, otherwise any way
  const maxX: number = getPetZooMaxX(context.bounds);
  if (runtime.x <= 1) {
    runtime.direction = 1;
  } else if (runtime.x >= maxX - 1) {
    runtime.direction = -1;
  } else {
    runtime.direction = randomSign();
  }
}

export function startPetZooClimb(runtime: PetZooPetRuntime, wall: PetZooWallSide, bounds: PetZooWorldBounds): void {
  setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.climb);
  runtime.wall = wall;
  runtime.x = wall === 'left' ? 0 : getPetZooMaxX(bounds);
  runtime.vy = 0;
  runtime.climbTargetY = randomBetween(PET_ZOO_CLIMB_HEIGHT_FACTOR_RANGE) * getPetZooMaxClimbY(bounds);
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

export function startPetZooConversation(initiator: PetZooPetRuntime, partner: PetZooPetRuntime, lines: readonly [string, string], lineSeconds: number): void {
  setPetZooBehavior(initiator, PET_ZOO_BEHAVIOR.talk);
  setPetZooBehavior(partner, PET_ZOO_BEHAVIOR.talk, initiator.behaviorSecondsLeft);
  initiator.friendId = partner.pet.id;
  partner.friendId = initiator.pet.id;
  facePetZooTarget(initiator, partner.x);
  facePetZooTarget(partner, initiator.x);
  showPetZooBubble(initiator, lines[0], lineSeconds);
  // the answer comes once the first line is gone
  partner.pendingBubble = { text: lines[1], delaySeconds: lineSeconds + 0.2, durationSeconds: lineSeconds };
}

function canClimbIn(runtime: PetZooPetRuntime, bounds: PetZooWorldBounds): boolean {
  return runtime.definition.canClimb && getPetZooMaxClimbY(bounds) >= PET_ZOO_SPRITE_SIZE_PX * PET_ZOO_MIN_CLIMB_HEIGHT_IN_SPRITES;
}

/** Moves along the ground. Returns the wall it bumped into, if any. */
function moveAlongGround(runtime: PetZooPetRuntime, speed: number, seconds: number, bounds: PetZooWorldBounds): PetZooWallSide | null {
  const maxX: number = getPetZooMaxX(bounds);
  runtime.x += runtime.direction * speed * seconds;
  if (runtime.x <= 0) {
    runtime.x = 0;
    return runtime.direction === -1 ? 'left' : null;
  }
  if (runtime.x >= maxX) {
    runtime.x = maxX;
    return runtime.direction === 1 ? 'right' : null;
  }
  return null;
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
    runtime.vy = getPetZooJumpVelocity(PET_ZOO_HOP_VELOCITY, bounds);
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

function stepWalking(runtime: PetZooPetRuntime, seconds: number, context: PetZooSimulationContext, speedMultiplier: number): void {
  applyGroundGravity(runtime, seconds);
  maybeHop(runtime, seconds, context.bounds);
  const hitWall: PetZooWallSide | null = moveAlongGround(runtime, runtime.speed * speedMultiplier, seconds, context.bounds);
  if (hitWall) {
    if (runtime.y === 0 && canClimbIn(runtime, context.bounds) && randomChance(PET_ZOO_CLIMB_CHANCE)) {
      startPetZooClimb(runtime, hitWall, context.bounds);
      return;
    }
    // turn around, sometimes after a little break
    runtime.direction = hitWall === 'left' ? 1 : -1;
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
  const hitWall: PetZooWallSide | null = moveAlongGround(runtime, runtime.speed * PET_ZOO_ZOOMIES_SPEED_MULTIPLIER, seconds, context.bounds);
  if (hitWall) {
    runtime.direction = hitWall === 'left' ? 1 : -1;
  }
  if (runtime.behaviorSecondsLeft <= 0) {
    setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.idle);
    showPetZooBubble(runtime, PET_ZOO_ZOOMIES_DONE_MESSAGE);
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
  if (Math.abs(friend.x - runtime.x) <= PET_ZOO_SPRITE_SIZE_PX * PET_ZOO_CONVERSATION_DISTANCE_IN_SPRITES) {
    context.startConversation(runtime, friend);
    return;
  }
  facePetZooTarget(runtime, friend.x);
  moveAlongGround(runtime, runtime.speed, seconds, context.bounds);
}

function stepChase(runtime: PetZooPetRuntime, seconds: number, context: PetZooSimulationContext): void {
  applyGroundGravity(runtime, seconds);
  const ball: PetZooBallRuntime | null = context.ball;
  if (!ball || ball.heldByPetId !== null) {
    pickNextPetZooBehavior(runtime, context);
    return;
  }
  // line the middle of the pet up with the ball
  const targetX: number = ball.x - PET_ZOO_SPRITE_SIZE_PX / 2;
  const distance: number = Math.abs(targetX - runtime.x);
  if (distance > 1) {
    facePetZooTarget(runtime, targetX);
    const step: number = Math.min(distance, runtime.speed * PET_ZOO_CHASE_SPEED_MULTIPLIER * seconds);
    runtime.x += runtime.direction * step;
    runtime.x = Math.min(getPetZooMaxX(context.bounds), Math.max(0, runtime.x));
  }
  const isBallLowEnough: boolean = ball.y <= PET_ZOO_SPRITE_SIZE_PX * 0.7;
  const isBallUnderPet: boolean = Math.abs(runtime.x + PET_ZOO_SPRITE_SIZE_PX / 2 - ball.x) <= PET_ZOO_SPRITE_SIZE_PX * 0.45;
  if (isBallLowEnough && isBallUnderPet) {
    context.catchBall(runtime);
  }
}

function stepWaitForFriend(runtime: PetZooPetRuntime, context: PetZooSimulationContext): void {
  const friend: PetZooPetRuntime | undefined = runtime.friendId ? context.findPet(runtime.friendId) : undefined;
  if (!friend || friend.behavior !== PET_ZOO_BEHAVIOR.approachFriend || runtime.behaviorSecondsLeft <= 0) {
    pickNextPetZooBehavior(runtime, context);
    return;
  }
  facePetZooTarget(runtime, friend.x);
}

function stepClimb(runtime: PetZooPetRuntime, seconds: number, context: PetZooSimulationContext): void {
  runtime.x = runtime.wall === 'right' ? getPetZooMaxX(context.bounds) : 0;
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
