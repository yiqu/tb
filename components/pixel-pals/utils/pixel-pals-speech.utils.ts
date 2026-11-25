import { formatPixelPalsMessage } from './pixel-pals-pet.utils';
import { randomItem, randomChance } from './pixel-pals-random.utils';
import { PIXEL_PALS_MESSAGES } from '../constants/pixel-pals-messages.constants';

import type { PixelPalsPetRuntime } from '../models/pixel-pals-runtime.models';

/** How often a pet uses one of its own lines rather than a shared one. */
const OWN_LINE_CHANCE = 0.5;

function say(runtime: PixelPalsPetRuntime, template: string): string {
  return formatPixelPalsMessage(template, runtime.pet, runtime.definition);
}

/** What a pet says when it joins Pixel Pals. */
export function getPixelPalsGreeting(runtime: PixelPalsPetRuntime): string {
  return say(runtime, runtime.definition.voice.greeting);
}

/** A line for a click: one of the pet's own, or a shared reaction. */
export function pickPixelPalsClickLine(runtime: PixelPalsPetRuntime): string | undefined {
  const ownLine: string | undefined = randomItem(runtime.definition.voice.lines);
  const template: string | undefined = ownLine && randomChance(OWN_LINE_CHANCE) ? ownLine : randomItem(PIXEL_PALS_MESSAGES.clickReactions);
  return template === undefined ? undefined : say(runtime, template);
}

/**
 * The two lines of a chat. Half the time the first pet opens with one of its own lines and the other answers in
 * its own sound, otherwise they swap a shared pair.
 */
export function pickPixelPalsConversation(initiator: PixelPalsPetRuntime, partner: PixelPalsPetRuntime): readonly [string, string] | undefined {
  const ownLine: string | undefined = randomItem(initiator.definition.voice.lines);
  const reply: string | undefined = randomItem(PIXEL_PALS_MESSAGES.chatReplies);
  if (ownLine && reply && randomChance(OWN_LINE_CHANCE)) {
    return [say(initiator, ownLine), say(partner, reply)];
  }
  const pair: readonly [string, string] | undefined = randomItem(PIXEL_PALS_MESSAGES.conversations);
  return pair ? [say(initiator, pair[0]), say(partner, pair[1])] : undefined;
}

/** What a pet that lost the race to the ball says, sometimes. */
export function pickPixelPalsMissedBallLine(runtime: PixelPalsPetRuntime): string | undefined {
  const line: string | undefined = randomItem(PIXEL_PALS_MESSAGES.missedBall);
  return line === undefined ? undefined : say(runtime, line);
}
