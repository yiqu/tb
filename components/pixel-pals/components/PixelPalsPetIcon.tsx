import { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

import { PIXEL_PALS_ANIMATION } from '../models/pixel-pals.models';
import { getPixelPalsSpriteUrl } from '../utils/pixel-pals-sprite.utils';
import { getPixelPetDefinition } from '../utils/pixel-pals-pet.utils';

import type { PixelPetId } from '../constants/pixel-pals-pets.constants';

interface PixelPalsPetIconProps {
  petId: PixelPetId;
  color: string;
  className?: string;
  style?: CSSProperties;
}

/** A pet's idle sprite at a small size, for dropdowns and previews. */
export default function PixelPalsPetIcon({ petId, color, className, style }: PixelPalsPetIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- animated GIF sprite
    <img
      src={ getPixelPalsSpriteUrl({ color }, getPixelPetDefinition(petId), PIXEL_PALS_ANIMATION.idle) }
      alt=""
      aria-hidden="true"
      draggable={ false }
      className={ cn('pixel-pals-pixelated size-5 shrink-0 object-contain object-bottom', className) }
      style={ style }
    />
  );
}
