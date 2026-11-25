import { PET_ZOO_PETS } from './pet-zoo-pets.constants';
import { PET_ZOO_THEMES } from './pet-zoo-themes.constants';
import { PET_ZOO_SPRITE_SIZE_PX } from './pet-zoo.constants';

import type { PetZooPetDefinition, PetZooThemeDefinition } from '../models/pet-zoo.models';

/** The zoo's 1px border, top and bottom. */
const PET_ZOO_BORDER_PX = 2;

const TALLEST_FLOOR_PX: number = Math.max(
  ...Object.values(PET_ZOO_THEMES).map((theme: PetZooThemeDefinition) => {
    return theme.floorPx;
  }),
);

const BIGGEST_PET_PX: number = Math.max(
  ...Object.values(PET_ZOO_PETS).map((pet: PetZooPetDefinition) => {
    return Math.round(PET_ZOO_SPRITE_SIZE_PX * pet.sizeScale);
  }),
);

/**
 * The smallest height the zoo can be dragged to: the biggest pet standing on the tallest ground of any theme, and the
 * border, so no pet is cut off at the top. It grows by itself when a bigger pet or a taller ground is added.
 */
export const PET_ZOO_MIN_HEIGHT_PX: number = TALLEST_FLOOR_PX + BIGGEST_PET_PX + PET_ZOO_BORDER_PX;
