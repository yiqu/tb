import { z } from 'zod';

import { isPixelPalsColorOf } from '../utils/pixel-pals-pet.utils';
import { PIXEL_PALS_PET_TYPES } from '../constants/pixel-pals-pets.constants';
import { PIXEL_PALS_THEME_IDS, PIXEL_PALS_DEFAULT_THEME_ID } from '../constants/pixel-pals-themes.constants';
import { PIXEL_PALS_PET_NAME_MAX_LENGTH } from '../constants/pixel-pals.constants';

/** One saved pet. A color that does not belong to the pet's kind is rejected. */
export const pixelPalsPetSchema = z
  .object({
    id: z.string().min(1),
    type: z.enum(PIXEL_PALS_PET_TYPES),
    color: z.string().min(1),
    name: z.string().trim().min(1).max(PIXEL_PALS_PET_NAME_MAX_LENGTH),
  })
  .refine(
    (pet) => {
      return isPixelPalsColorOf(pet.type, pet.color);
    },
    { message: 'Unknown color for this pet', path: ['color'] },
  );

/**
 * What local storage holds. It is checked when the store loads, so a value written by an older version,
 * or edited by hand, never breaks Pixel Pals: bad pets are dropped, a bad theme falls back to the default, and the
 * unlocks are rebuilt on the master lists (`toValidPixelPalsUnlocks`).
 */
export const pixelPalsPersistedStateSchema = z.object({
  pets: z.array(z.unknown()).catch([]),
  themeId: z.enum(PIXEL_PALS_THEME_IDS).catch(PIXEL_PALS_DEFAULT_THEME_ID),
  // saved before there were unlocks: nothing earned
  unlocks: z
    .object({
      pets: z.record(z.string(), z.unknown()).catch({}),
      themes: z.record(z.string(), z.unknown()).catch({}),
    })
    .catch({ pets: {}, themes: {} }),
});

export type PixelPalsPersistedPet = z.infer<typeof pixelPalsPetSchema>;
