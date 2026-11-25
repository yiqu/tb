import { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

import { PET_ZOO_ANIMATION } from '../models/pet-zoo.models';
import { getPetZooSpriteUrl } from '../utils/pet-zoo-sprite.utils';
import { getPetZooPetDefinition } from '../utils/pet-zoo-pet.utils';

import type { PetZooPetType } from '../constants/pet-zoo-pets.constants';

interface PetZooPetIconProps {
  type: PetZooPetType;
  color: string;
  className?: string;
  style?: CSSProperties;
}

/** A pet's idle sprite at a small size, for dropdowns and previews. */
export default function PetZooPetIcon({ type, color, className, style }: PetZooPetIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- animated GIF sprite
    <img
      src={ getPetZooSpriteUrl({ color }, getPetZooPetDefinition(type), PET_ZOO_ANIMATION.idle) }
      alt=""
      aria-hidden="true"
      draggable={ false }
      className={ cn('pet-zoo-pixelated size-5 shrink-0 object-contain object-bottom', className) }
      style={ style }
    />
  );
}
