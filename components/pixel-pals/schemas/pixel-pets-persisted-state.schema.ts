import { z } from 'zod';

import { isPixelPalsColorOf } from '../utils/pixel-pals-pet.utils';
import { PIXEL_PALS_PET_IDS } from '../constants/pixel-pals-pets.constants';
import { PIXEL_PALS_THEME_IDS, PIXEL_PALS_DEFAULT_THEME_ID } from '../constants/pixel-pals-themes.constants';
import { PIXEL_PALS_PARTICLE_LEVEL_MAX, PIXEL_PALS_PARTICLE_LEVEL_MIN } from '../constants/pixel-pals-particles.constants';
import {
  PIXEL_PALS_MAX_PET_COUNT,
  PIXEL_PALS_MIN_PET_COUNT,
  PIXEL_PALS_DEFAULT_PET_COUNT,
  PIXEL_PALS_PET_NAME_MAX_LENGTH,
} from '../constants/pixel-pals.constants';

/** One saved pet: only what the person picked. A color that does not belong to the pet's kind is rejected. */
export const pixelPetSchema = z
  .object({
    id: z.string().min(1),
    petId: z.enum(PIXEL_PALS_PET_IDS),
    color: z.string().min(1),
    nickName: z.string().trim().min(1).max(PIXEL_PALS_PET_NAME_MAX_LENGTH).optional(),
  })
  .refine(
    (pet) => {
      return isPixelPalsColorOf(pet.petId, pet.color);
    },
    { message: 'Unknown color for this pet', path: ['color'] },
  );

/** `userPixelPetCount`: a whole number in its range. */
export const pixelPetCountSchema = z.number().int().min(PIXEL_PALS_MIN_PET_COUNT).max(PIXEL_PALS_MAX_PET_COUNT);

/** One background's weather level (`userPixelPetParticleLevels`): a whole number in 0 to 100. */
export const pixelPalsParticleLevelSchema = z.number().int().min(PIXEL_PALS_PARTICLE_LEVEL_MIN).max(PIXEL_PALS_PARTICLE_LEVEL_MAX);

/**
 * What local storage holds. It is checked when the store loads, so a value edited by hand, or written by an older
 * version, never breaks Pixel Pals: a bad value falls back to its default, bad pets are dropped one by one, and the
 * saved locks keep only real ids with a boolean (`toValidSavedUnlockedPets`, `toValidSavedUnlockedBackgrounds`), and the
 * weather levels only backgrounds with weather and a level in range (`toValidSavedParticleLevels`).
 */
export const pixelPetsPersistedStateSchema = z.object({
  userPixelPetCount: pixelPetCountSchema.catch(PIXEL_PALS_DEFAULT_PET_COUNT),
  userPixelPetBackground: z.enum(PIXEL_PALS_THEME_IDS).catch(PIXEL_PALS_DEFAULT_THEME_ID),
  userPixelPets: z.array(z.unknown()).catch([]),
  unlockedBackgrounds: z.record(z.string(), z.unknown()).catch({}),
  unlockedPets: z.record(z.string(), z.unknown()).catch({}),
  userPixelPetParticleLevels: z.record(z.string(), z.unknown()).catch({}),
});
