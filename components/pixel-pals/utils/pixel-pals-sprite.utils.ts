import { PIXEL_PALS_ANIMATION } from '../models/pixel-pals.models';
import { PIXEL_PALS_ASSET_BASE_URL } from '../constants/pixel-pals.constants';

import type { ResolvedPixelPet, PixelPalsAnimation, PixelPetDefinition } from '../models/pixel-pals.models';

/** What to show when a pet has no sprite for an animation, tried in order. Every pet has `idle`. */
const ANIMATION_FALLBACKS: Record<PixelPalsAnimation, readonly PixelPalsAnimation[]> = {
  idle: [],
  walk: ['run'],
  walk_fast: ['run', 'walk'],
  run: ['walk_fast', 'walk'],
  swipe: [],
  with_ball: [],
  lie: [],
  stand: [],
  fly: ['run', 'walk_fast', 'walk'],
};

/** The animation that has a sprite file for this pet: the one asked for, a close one, or idle. */
export function getPixelPalsSpriteAnimation(definition: PixelPetDefinition, animation: PixelPalsAnimation): PixelPalsAnimation {
  if (definition.animations.includes(animation)) {
    return animation;
  }
  const fallback: PixelPalsAnimation | undefined = ANIMATION_FALLBACKS[animation].find((candidate: PixelPalsAnimation) => {
    return definition.animations.includes(candidate);
  });
  return fallback ?? PIXEL_PALS_ANIMATION.idle;
}

export function getPixelPalsSpriteUrl(pet: Pick<ResolvedPixelPet, 'color'>, definition: PixelPetDefinition, animation: PixelPalsAnimation): string {
  const spriteAnimation: PixelPalsAnimation = getPixelPalsSpriteAnimation(definition, animation);
  return `${PIXEL_PALS_ASSET_BASE_URL}/pets/${definition.spriteFolder}/${pet.color}_${spriteAnimation}_8fps.gif`;
}

/** Every sprite of one pet, to load them before they are needed so a new animation never flashes empty. */
export function getPixelPalsAllSpriteUrls(pet: Pick<ResolvedPixelPet, 'color'>, definition: PixelPetDefinition): string[] {
  return definition.animations.map((animation: PixelPalsAnimation) => {
    return getPixelPalsSpriteUrl(pet, definition, animation);
  });
}
