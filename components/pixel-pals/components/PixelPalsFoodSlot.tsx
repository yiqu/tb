import { Ref } from 'react';

import { PIXEL_PALS_FOOD_SIZE_PX } from '../constants/pixel-pals-foods.constants';

interface PixelPalsFoodSlotProps {
  ref: Ref<HTMLImageElement>;
}

/** A hidden image for one piece of food. `PixelPalsEngine` sets its source, shows it and moves it every frame. */
export default function PixelPalsFoodSlot({ ref }: PixelPalsFoodSlotProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny pixel art, its source is set by the engine
    <img
      ref={ ref }
      alt=""
      aria-hidden="true"
      draggable={ false }
      className="pixel-pals-pixelated pointer-events-none absolute bottom-0 left-0 z-10 hidden will-change-transform select-none"
      style={ { width: PIXEL_PALS_FOOD_SIZE_PX, height: PIXEL_PALS_FOOD_SIZE_PX } }
    />
  );
}
