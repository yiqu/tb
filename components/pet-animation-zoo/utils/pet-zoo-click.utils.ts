import { pickPetZooClickLine } from './pet-zoo-speech.utils';
import { PET_ZOO_BEHAVIOR } from '../models/pet-zoo-runtime.models';
import { PET_ZOO_MESSAGES } from '../constants/pet-zoo-messages.constants';
import {
  startPetZooFall,
  setPetZooBehavior,
  showPetZooBubble,
  canPetZooPetMove,
  isPetZooPetOnGround,
  getPetZooJumpVelocity,
} from './pet-zoo-behavior.utils';
import {
  PET_ZOO_CLICKS_FOR_ZOOMIES,
  PET_ZOO_BIG_JUMP_VELOCITY,
  PET_ZOO_CLICKS_FOR_BIG_JUMP,
  PET_ZOO_CLICK_STREAK_SECONDS,
} from '../constants/pet-zoo-behavior.constants';

import type { PetZooBehavior, PetZooPetRuntime, PetZooWorldBounds, PetZooPendingBubble } from '../models/pet-zoo-runtime.models';

/** Behaviors that a click only adds a bubble to, so a conversation or a chase is not broken off. */
const BUBBLE_ONLY_BEHAVIORS: readonly PetZooBehavior[] = [
  PET_ZOO_BEHAVIOR.talk,
  PET_ZOO_BEHAVIOR.approachFriend,
  PET_ZOO_BEHAVIOR.waitForFriend,
  PET_ZOO_BEHAVIOR.chase,
  PET_ZOO_BEHAVIOR.zoomies,
  PET_ZOO_BEHAVIOR.fly,
  PET_ZOO_BEHAVIOR.forage,
  PET_ZOO_BEHAVIOR.eat,
];

/**
 * A click on a pet. Quick clicks build a streak:
 * - most clicks: a paw swipe and a bubble, one of the pet's own lines or a shared one
 * - the 3rd quick click: a big jump with hearts
 * - the 5th quick click: zoomies, running back and forth for a few seconds
 * A pet on a wall lets go and falls.
 */
export function reactToPetZooClick(runtime: PetZooPetRuntime, nowSeconds: number, bounds: PetZooWorldBounds): void {
  runtime.clickStreak = nowSeconds - runtime.lastClickAt <= PET_ZOO_CLICK_STREAK_SECONDS ? runtime.clickStreak + 1 : 1;
  runtime.lastClickAt = nowSeconds;

  if (runtime.behavior === PET_ZOO_BEHAVIOR.climb || runtime.behavior === PET_ZOO_BEHAVIOR.wallHang) {
    startPetZooFall(runtime);
    showPetZooBubble(runtime, PET_ZOO_MESSAGES.fall);
    return;
  }
  if (runtime.behavior === PET_ZOO_BEHAVIOR.fall) {
    return;
  }
  if (runtime.behavior === PET_ZOO_BEHAVIOR.withBall) {
    showPetZooBubble(runtime, PET_ZOO_MESSAGES.holdingBall);
    return;
  }

  if (runtime.clickStreak >= PET_ZOO_CLICKS_FOR_ZOOMIES && canPetZooPetMove(runtime)) {
    runtime.clickStreak = 0;
    runtime.friendId = null;
    setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.zoomies);
    showPetZooBubble(runtime, PET_ZOO_MESSAGES.zoomies);
    return;
  }
  if (runtime.clickStreak === PET_ZOO_CLICKS_FOR_BIG_JUMP && isPetZooPetOnGround(runtime)) {
    runtime.vy = getPetZooJumpVelocity(PET_ZOO_BIG_JUMP_VELOCITY, bounds, runtime.size);
    showPetZooBubble(runtime, PET_ZOO_MESSAGES.bigJump);
    return;
  }

  const line: string | undefined = pickPetZooClickLine(runtime);
  if (line) {
    // a pet in a conversation still says its reply after this bubble
    const pendingReply: PetZooPendingBubble | null = runtime.behavior === PET_ZOO_BEHAVIOR.talk ? runtime.pendingBubble : null;
    showPetZooBubble(runtime, line);
    runtime.pendingBubble = pendingReply;
  }
  if (!BUBBLE_ONLY_BEHAVIORS.includes(runtime.behavior)) {
    setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.swipe);
  }
}
