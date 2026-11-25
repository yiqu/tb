import { randomItem } from './pet-zoo-random.utils';
import { formatPetZooMessage } from './pet-zoo-pet.utils';
import { PET_ZOO_BEHAVIOR } from '../models/pet-zoo-runtime.models';
import { startPetZooFall, setPetZooBehavior, showPetZooBubble, canPetZooPetMove } from './pet-zoo-behavior.utils';
import {
  PET_ZOO_CLICKS_FOR_ZOOMIES,
  PET_ZOO_BIG_JUMP_VELOCITY,
  PET_ZOO_CLICKS_FOR_BIG_JUMP,
  PET_ZOO_CLICK_STREAK_SECONDS,
} from '../constants/pet-zoo-behavior.constants';
import {
  PET_ZOO_FALL_MESSAGE,
  PET_ZOO_CLICK_REACTIONS,
  PET_ZOO_ZOOMIES_MESSAGE,
  PET_ZOO_BIG_JUMP_MESSAGE,
  PET_ZOO_HOLDING_BALL_MESSAGE,
} from '../constants/pet-zoo-messages.constants';

import type { PetZooBehavior, PetZooPetRuntime } from '../models/pet-zoo-runtime.models';

/** Behaviors that a click only adds a bubble to, so a conversation or a chase is not broken off. */
const BUBBLE_ONLY_BEHAVIORS: readonly PetZooBehavior[] = [
  PET_ZOO_BEHAVIOR.talk,
  PET_ZOO_BEHAVIOR.approachFriend,
  PET_ZOO_BEHAVIOR.waitForFriend,
  PET_ZOO_BEHAVIOR.chase,
  PET_ZOO_BEHAVIOR.zoomies,
];

/**
 * A click on a pet. Quick clicks build a streak:
 * - most clicks: a paw swipe and a random bubble
 * - the 3rd quick click: a big jump with hearts
 * - the 5th quick click: zoomies, running back and forth for a few seconds
 * A pet on a wall lets go and falls.
 */
export function reactToPetZooClick(runtime: PetZooPetRuntime, nowSeconds: number): void {
  runtime.clickStreak = nowSeconds - runtime.lastClickAt <= PET_ZOO_CLICK_STREAK_SECONDS ? runtime.clickStreak + 1 : 1;
  runtime.lastClickAt = nowSeconds;

  if (runtime.behavior === PET_ZOO_BEHAVIOR.climb || runtime.behavior === PET_ZOO_BEHAVIOR.wallHang) {
    startPetZooFall(runtime);
    showPetZooBubble(runtime, PET_ZOO_FALL_MESSAGE);
    return;
  }
  if (runtime.behavior === PET_ZOO_BEHAVIOR.fall) {
    return;
  }
  if (runtime.behavior === PET_ZOO_BEHAVIOR.withBall) {
    showPetZooBubble(runtime, PET_ZOO_HOLDING_BALL_MESSAGE);
    return;
  }

  if (runtime.clickStreak >= PET_ZOO_CLICKS_FOR_ZOOMIES && canPetZooPetMove(runtime)) {
    runtime.clickStreak = 0;
    runtime.friendId = null;
    setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.zoomies);
    showPetZooBubble(runtime, PET_ZOO_ZOOMIES_MESSAGE);
    return;
  }
  if (runtime.clickStreak === PET_ZOO_CLICKS_FOR_BIG_JUMP && runtime.y === 0) {
    runtime.vy = PET_ZOO_BIG_JUMP_VELOCITY;
    showPetZooBubble(runtime, PET_ZOO_BIG_JUMP_MESSAGE);
    return;
  }

  showPetZooBubble(runtime, formatPetZooMessage(randomItem(PET_ZOO_CLICK_REACTIONS), runtime.pet.name));
  if (!BUBBLE_ONLY_BEHAVIORS.includes(runtime.behavior)) {
    setPetZooBehavior(runtime, PET_ZOO_BEHAVIOR.swipe);
  }
}
