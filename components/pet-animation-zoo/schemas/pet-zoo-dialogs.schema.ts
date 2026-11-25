import { z } from 'zod';

import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';
import { isPetZooColorOf } from '../utils/pet-zoo-pet.utils';
import { PET_ZOO_PET_TYPES, PetZooPetType } from '../constants/pet-zoo-pets.constants';
import { PET_ZOO_THEME_IDS, PetZooThemeId } from '../constants/pet-zoo-themes.constants';
import { PET_ZOO_PET_NAME_MAX_LENGTH } from '../constants/pet-zoo.constants';

const spawnPetFieldsSchema = z.object({
    type: z.enum(PET_ZOO_PET_TYPES, { message: 'Choose a pet' }),
    color: z.string().min(1, { message: 'Choose a color' }),
    name: z
      .string()
      .trim()
      .min(1, { message: 'Give your pet a name' })
      .max(PET_ZOO_PET_NAME_MAX_LENGTH, { message: `A name can be up to ${PET_ZOO_PET_NAME_MAX_LENGTH} characters` }),
});

/**
 * The Spawn pet dialog. A locked pet cannot be picked in the dropdown, and is turned down here too. Whether a kind
 * is unlocked depends on the saved unlocks, so the dialog builds the schema with its check.
 */
export function createPetZooSpawnPetSchema(isTypeUnlocked: (_type: PetZooPetType) => boolean) {
  return spawnPetFieldsSchema
    .refine(
      (values) => {
        return isTypeUnlocked(values.type);
      },
      { message: PET_ZOO_LABELS.petLockedError, path: ['type'] },
    )
    .refine(
      (values) => {
        return isPetZooColorOf(values.type, values.color);
      },
      { message: 'Choose a color', path: ['color'] },
    );
}

export type PetZooSpawnPetFormValues = z.infer<typeof spawnPetFieldsSchema>;

/** The Delete pet dialog. */
export const petZooDeletePetSchema = z.object({
  petId: z.string().min(1, { message: 'Choose a pet' }),
});

export type PetZooDeletePetFormValues = z.infer<typeof petZooDeletePetSchema>;

const changeThemeFieldsSchema = z.object({
  themeId: z.enum(PET_ZOO_THEME_IDS, { message: 'Choose a theme' }),
});

/** The Change theme dialog. A locked theme is turned down, like a locked pet. */
export function createPetZooChangeThemeSchema(isThemeUnlocked: (_themeId: PetZooThemeId) => boolean) {
  return changeThemeFieldsSchema.refine(
    (values) => {
      return isThemeUnlocked(values.themeId);
    },
    { message: PET_ZOO_LABELS.themeLockedError, path: ['themeId'] },
  );
}

export type PetZooChangeThemeFormValues = z.infer<typeof changeThemeFieldsSchema>;
