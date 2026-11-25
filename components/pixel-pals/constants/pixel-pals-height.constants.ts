import { PIXEL_PALS_PETS } from './pixel-pals-pets.constants';
import { PIXEL_PALS_THEMES } from './pixel-pals-themes.constants';
import { PIXEL_PALS_SPRITE_SIZE_PX } from './pixel-pals.constants';

import type { PixelPalsPetDefinition, PixelPalsThemeDefinition } from '../models/pixel-pals.models';

/** Pixel Pals' 1px border, top and bottom. */
const PIXEL_PALS_BORDER_PX = 2;

const TALLEST_FLOOR_PX: number = Math.max(
  ...Object.values(PIXEL_PALS_THEMES).map((theme: PixelPalsThemeDefinition) => {
    return theme.floorPx;
  }),
);

const BIGGEST_PET_PX: number = Math.max(
  ...Object.values(PIXEL_PALS_PETS).map((pet: PixelPalsPetDefinition) => {
    return Math.round(PIXEL_PALS_SPRITE_SIZE_PX * pet.sizeScale);
  }),
);

/**
 * The smallest height Pixel Pals can be dragged to: the biggest pet standing on the tallest ground of any theme, and the
 * border, so no pet is cut off at the top. It grows by itself when a bigger pet or a taller ground is added.
 */
export const PIXEL_PALS_MIN_HEIGHT_PX: number = TALLEST_FLOOR_PX + BIGGEST_PET_PX + PIXEL_PALS_BORDER_PX;
