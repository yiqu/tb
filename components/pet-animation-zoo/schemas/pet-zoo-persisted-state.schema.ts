import { z } from 'zod';

import { isPetZooColorOf } from '../utils/pet-zoo-pet.utils';
import { PET_ZOO_PET_TYPES } from '../constants/pet-zoo-pets.constants';
import { PET_ZOO_THEME_IDS, PET_ZOO_DEFAULT_THEME_ID } from '../constants/pet-zoo-themes.constants';
import { PET_ZOO_PET_NAME_MAX_LENGTH } from '../constants/pet-zoo.constants';

/** One saved pet. A color that does not belong to the pet's kind is rejected. */
export const petZooPetSchema = z
  .object({
    id: z.string().min(1),
    type: z.enum(PET_ZOO_PET_TYPES),
    color: z.string().min(1),
    name: z.string().trim().min(1).max(PET_ZOO_PET_NAME_MAX_LENGTH),
  })
  .refine(
    (pet) => {
      return isPetZooColorOf(pet.type, pet.color);
    },
    { message: 'Unknown color for this pet', path: ['color'] },
  );

/**
 * What local storage holds. It is checked when the store loads, so a value written by an older version,
 * or edited by hand, never breaks the zoo: bad pets are dropped, a bad theme falls back to the default.
 */
export const petZooPersistedStateSchema = z.object({
  pets: z.array(z.unknown()).catch([]),
  themeId: z.enum(PET_ZOO_THEME_IDS).catch(PET_ZOO_DEFAULT_THEME_ID),
});

export type PetZooPersistedPet = z.infer<typeof petZooPetSchema>;
