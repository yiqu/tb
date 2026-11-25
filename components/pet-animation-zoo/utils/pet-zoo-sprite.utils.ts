import { PET_ZOO_ANIMATION } from '../models/pet-zoo.models';
import { PET_ZOO_ASSET_BASE_URL } from '../constants/pet-zoo.constants';

import type { PetZooPet, PetZooAnimation, PetZooPetDefinition } from '../models/pet-zoo.models';

/** What to show when a pet has no sprite for an animation, tried in order. Every pet has `idle`. */
const ANIMATION_FALLBACKS: Record<PetZooAnimation, readonly PetZooAnimation[]> = {
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
export function getPetZooSpriteAnimation(definition: PetZooPetDefinition, animation: PetZooAnimation): PetZooAnimation {
  if (definition.animations.includes(animation)) {
    return animation;
  }
  const fallback: PetZooAnimation | undefined = ANIMATION_FALLBACKS[animation].find((candidate: PetZooAnimation) => {
    return definition.animations.includes(candidate);
  });
  return fallback ?? PET_ZOO_ANIMATION.idle;
}

export function getPetZooSpriteUrl(pet: Pick<PetZooPet, 'color'>, definition: PetZooPetDefinition, animation: PetZooAnimation): string {
  const spriteAnimation: PetZooAnimation = getPetZooSpriteAnimation(definition, animation);
  return `${PET_ZOO_ASSET_BASE_URL}/pets/${definition.spriteFolder}/${pet.color}_${spriteAnimation}_8fps.gif`;
}

/** Every sprite of one pet, to load them before they are needed so a new animation never flashes empty. */
export function getPetZooAllSpriteUrls(pet: Pick<PetZooPet, 'color'>, definition: PetZooPetDefinition): string[] {
  return definition.animations.map((animation: PetZooAnimation) => {
    return getPetZooSpriteUrl(pet, definition, animation);
  });
}
