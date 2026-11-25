import { z } from 'zod';

import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';
import { isPetZooColorOf, isPetZooPetUnlocked } from '../utils/pet-zoo-pet.utils';
import { PET_ZOO_PETS, PET_ZOO_PET_TYPES } from '../constants/pet-zoo-pets.constants';
import { PET_ZOO_THEME_IDS } from '../constants/pet-zoo-themes.constants';
import { PET_ZOO_PET_NAME_MAX_LENGTH } from '../constants/pet-zoo.constants';

/** The Spawn pet dialog. A locked pet cannot be picked in the dropdown, and is turned down here too. */
export const petZooSpawnPetSchema = z
  .object({
    type: z.enum(PET_ZOO_PET_TYPES, { message: 'Choose a pet' }),
    color: z.string().min(1, { message: 'Choose a color' }),
    name: z
      .string()
      .trim()
      .min(1, { message: 'Give your pet a name' })
      .max(PET_ZOO_PET_NAME_MAX_LENGTH, { message: `A name can be up to ${PET_ZOO_PET_NAME_MAX_LENGTH} characters` }),
  })
  .refine(
    (values) => {
      return isPetZooPetUnlocked(PET_ZOO_PETS[values.type]);
    },
    { message: PET_ZOO_LABELS.petLockedError, path: ['type'] },
  )
  .refine(
    (values) => {
      return isPetZooColorOf(values.type, values.color);
    },
    { message: 'Choose a color', path: ['color'] },
  );

export type PetZooSpawnPetFormValues = z.infer<typeof petZooSpawnPetSchema>;

/** The Delete pet dialog. */
export const petZooDeletePetSchema = z.object({
  petId: z.string().min(1, { message: 'Choose a pet' }),
});

export type PetZooDeletePetFormValues = z.infer<typeof petZooDeletePetSchema>;

/** The Change theme dialog. */
export const petZooChangeThemeSchema = z.object({
  themeId: z.enum(PET_ZOO_THEME_IDS, { message: 'Choose a theme' }),
});

export type PetZooChangeThemeFormValues = z.infer<typeof petZooChangeThemeSchema>;
