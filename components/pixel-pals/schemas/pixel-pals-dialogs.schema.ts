import { z } from 'zod';

import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';
import { isPixelPalsColorOf } from '../utils/pixel-pals-pet.utils';
import { PIXEL_PALS_PET_IDS, PixelPetId } from '../constants/pixel-pals-pets.constants';
import { PIXEL_PALS_THEME_IDS, PixelPalsThemeId } from '../constants/pixel-pals-themes.constants';
import { PIXEL_PALS_PET_NAME_MAX_LENGTH } from '../constants/pixel-pals.constants';
import { PIXEL_PALS_PARTICLE_LEVEL_MAX, PIXEL_PALS_PARTICLE_LEVEL_MIN } from '../constants/pixel-pals-particles.constants';

const spawnPetFieldsSchema = z.object({
  petId: z.enum(PIXEL_PALS_PET_IDS, { message: PIXEL_PALS_LABELS.petTypeRequiredError }),
  color: z.string().min(1, { message: PIXEL_PALS_LABELS.petColorRequiredError }),
  name: z
    .string()
    .trim()
    .min(1, { message: PIXEL_PALS_LABELS.petNameRequiredError })
    .max(PIXEL_PALS_PET_NAME_MAX_LENGTH, {
      message: PIXEL_PALS_LABELS.petNameTooLongError.replace('{max}', String(PIXEL_PALS_PET_NAME_MAX_LENGTH)),
    }),
});

/**
 * The Spawn pet dialog. A locked pet cannot be picked in the dropdown, and is turned down here too. Whether a kind
 * is unlocked is `unlockedPets` in the store, so the dialog builds the schema with its check.
 */
export function createPixelPalsSpawnPetSchema(isPetUnlocked: (_petId: PixelPetId) => boolean) {
  return spawnPetFieldsSchema
    .refine(
      (values) => {
        return isPetUnlocked(values.petId);
      },
      { message: PIXEL_PALS_LABELS.petLockedError, path: ['petId'] },
    )
    .refine(
      (values) => {
        return isPixelPalsColorOf(values.petId, values.color);
      },
      { message: PIXEL_PALS_LABELS.petColorRequiredError, path: ['color'] },
    );
}

export type PixelPalsSpawnPetFormValues = z.infer<typeof spawnPetFieldsSchema>;

/** The Delete pet dialog: the `id` of the pet to remove. */
export const pixelPalsDeletePetSchema = z.object({
  id: z.string().min(1, { message: PIXEL_PALS_LABELS.deletePetRequiredError }),
});

export type PixelPalsDeletePetFormValues = z.infer<typeof pixelPalsDeletePetSchema>;

const changeThemeFieldsSchema = z.object({
  themeId: z.enum(PIXEL_PALS_THEME_IDS, { message: PIXEL_PALS_LABELS.themeRequiredError }),
  /** How much weather the picked background gets, 0 to 100. Only shown, and only saved, for a background with `particles`. */
  particleLevel: z
    .number({ message: PIXEL_PALS_LABELS.particleLevelError })
    .int({ message: PIXEL_PALS_LABELS.particleLevelError })
    .min(PIXEL_PALS_PARTICLE_LEVEL_MIN, { message: PIXEL_PALS_LABELS.particleLevelError })
    .max(PIXEL_PALS_PARTICLE_LEVEL_MAX, { message: PIXEL_PALS_LABELS.particleLevelError }),
});

/**
 * The Change background dialog. A locked background (`unlockedBackgrounds` in the store) is turned down, like a locked
 * pet. `particleLevel` is the weather slider's value.
 */
export function createPixelPalsChangeThemeSchema(isThemeUnlocked: (_themeId: PixelPalsThemeId) => boolean) {
  return changeThemeFieldsSchema.refine(
    (values) => {
      return isThemeUnlocked(values.themeId);
    },
    { message: PIXEL_PALS_LABELS.themeLockedError, path: ['themeId'] },
  );
}

export type PixelPalsChangeThemeFormValues = z.infer<typeof changeThemeFieldsSchema>;
