import { pickPixelPalsClickLine } from './pixel-pals-speech.utils';
import { PIXEL_PALS_BEHAVIOR } from '../models/pixel-pals-runtime.models';
import { PIXEL_PALS_MESSAGES } from '../constants/pixel-pals-messages.constants';
import {
  startPixelPalsFall,
  setPixelPalsBehavior,
  showPixelPalsBubble,
  canPixelPalsPetMove,
  isPixelPalsPetOnGround,
  getPixelPalsJumpVelocity,
} from './pixel-pals-behavior.utils';
import {
  PIXEL_PALS_CLICKS_FOR_ZOOMIES,
  PIXEL_PALS_BIG_JUMP_VELOCITY,
  PIXEL_PALS_CLICKS_FOR_BIG_JUMP,
  PIXEL_PALS_CLICK_STREAK_SECONDS,
} from '../constants/pixel-pals-behavior.constants';

import type { PixelPalsBehavior, PixelPalsPetRuntime, PixelPalsWorldBounds, PixelPalsPendingBubble } from '../models/pixel-pals-runtime.models';

/** Behaviors that a click only adds a bubble to, so a conversation or a chase is not broken off. */
const BUBBLE_ONLY_BEHAVIORS: readonly PixelPalsBehavior[] = [
  PIXEL_PALS_BEHAVIOR.talk,
  PIXEL_PALS_BEHAVIOR.approachFriend,
  PIXEL_PALS_BEHAVIOR.waitForFriend,
  PIXEL_PALS_BEHAVIOR.chase,
  PIXEL_PALS_BEHAVIOR.zoomies,
  PIXEL_PALS_BEHAVIOR.fly,
  PIXEL_PALS_BEHAVIOR.forage,
  PIXEL_PALS_BEHAVIOR.eat,
];

/**
 * A click on a pet. Quick clicks build a streak:
 * - most clicks: a paw swipe and a bubble, one of the pet's own lines or a shared one
 * - the 3rd quick click: a big jump with hearts
 * - the 5th quick click: zoomies, running back and forth for a few seconds
 * A pet on a wall lets go and falls.
 */
export function reactToPixelPalsClick(runtime: PixelPalsPetRuntime, nowSeconds: number, bounds: PixelPalsWorldBounds): void {
  runtime.clickStreak = nowSeconds - runtime.lastClickAt <= PIXEL_PALS_CLICK_STREAK_SECONDS ? runtime.clickStreak + 1 : 1;
  runtime.lastClickAt = nowSeconds;

  if (runtime.behavior === PIXEL_PALS_BEHAVIOR.climb || runtime.behavior === PIXEL_PALS_BEHAVIOR.wallHang) {
    startPixelPalsFall(runtime);
    showPixelPalsBubble(runtime, PIXEL_PALS_MESSAGES.fall);
    return;
  }
  if (runtime.behavior === PIXEL_PALS_BEHAVIOR.fall) {
    return;
  }
  if (runtime.behavior === PIXEL_PALS_BEHAVIOR.withBall) {
    showPixelPalsBubble(runtime, PIXEL_PALS_MESSAGES.holdingBall);
    return;
  }

  if (runtime.clickStreak >= PIXEL_PALS_CLICKS_FOR_ZOOMIES && canPixelPalsPetMove(runtime)) {
    runtime.clickStreak = 0;
    runtime.friendId = null;
    setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.zoomies);
    showPixelPalsBubble(runtime, PIXEL_PALS_MESSAGES.zoomies);
    return;
  }
  if (runtime.clickStreak === PIXEL_PALS_CLICKS_FOR_BIG_JUMP && isPixelPalsPetOnGround(runtime)) {
    runtime.vy = getPixelPalsJumpVelocity(PIXEL_PALS_BIG_JUMP_VELOCITY, bounds, runtime.size);
    showPixelPalsBubble(runtime, PIXEL_PALS_MESSAGES.bigJump);
    return;
  }

  const line: string | undefined = pickPixelPalsClickLine(runtime);
  if (line) {
    // a pet in a conversation still says its reply after this bubble
    const pendingReply: PixelPalsPendingBubble | null = runtime.behavior === PIXEL_PALS_BEHAVIOR.talk ? runtime.pendingBubble : null;
    showPixelPalsBubble(runtime, line);
    runtime.pendingBubble = pendingReply;
  }
  if (!BUBBLE_ONLY_BEHAVIORS.includes(runtime.behavior)) {
    setPixelPalsBehavior(runtime, PIXEL_PALS_BEHAVIOR.swipe);
  }
}
