import { z } from 'zod';

import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';
import { isPixelPalsColorOf } from '../utils/pixel-pals-pet.utils';
import { PIXEL_PALS_PET_TYPES, PixelPalsPetType } from '../constants/pixel-pals-pets.constants';
import { PIXEL_PALS_THEME_IDS, PixelPalsThemeId } from '../constants/pixel-pals-themes.constants';
import { PIXEL_PALS_PET_NAME_MAX_LENGTH } from '../constants/pixel-pals.constants';

const spawnPetFieldsSchema = z.object({
  type: z.enum(PIXEL_PALS_PET_TYPES, { message: PIXEL_PALS_LABELS.petTypeRequiredError }),
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
 * is unlocked depends on the saved unlocks, so the dialog builds the schema with its check.
 */
export function createPixelPalsSpawnPetSchema(isTypeUnlocked: (_type: PixelPalsPetType) => boolean) {
  return spawnPetFieldsSchema
    .refine(
      (values) => {
        return isTypeUnlocked(values.type);
      },
      { message: PIXEL_PALS_LABELS.petLockedError, path: ['type'] },
    )
    .refine(
      (values) => {
        return isPixelPalsColorOf(values.type, values.color);
      },
      { message: PIXEL_PALS_LABELS.petColorRequiredError, path: ['color'] },
    );
}

export type PixelPalsSpawnPetFormValues = z.infer<typeof spawnPetFieldsSchema>;

/** The Delete pet dialog. */
export const pixelPalsDeletePetSchema = z.object({
  petId: z.string().min(1, { message: PIXEL_PALS_LABELS.deletePetRequiredError }),
});

export type PixelPalsDeletePetFormValues = z.infer<typeof pixelPalsDeletePetSchema>;

const changeThemeFieldsSchema = z.object({
  themeId: z.enum(PIXEL_PALS_THEME_IDS, { message: PIXEL_PALS_LABELS.themeRequiredError }),
});

/** The Change theme dialog. A locked theme is turned down, like a locked pet. */
export function createPixelPalsChangeThemeSchema(isThemeUnlocked: (_themeId: PixelPalsThemeId) => boolean) {
  return changeThemeFieldsSchema.refine(
    (values) => {
      return isThemeUnlocked(values.themeId);
    },
    { message: PIXEL_PALS_LABELS.themeLockedError, path: ['themeId'] },
  );
}

export type PixelPalsChangeThemeFormValues = z.infer<typeof changeThemeFieldsSchema>;
