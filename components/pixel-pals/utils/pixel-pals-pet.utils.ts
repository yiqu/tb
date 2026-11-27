import { PIXEL_PALS_PETS, PIXEL_PALS_PET_IDS, PixelPetId } from '../constants/pixel-pals-pets.constants';
import { PIXEL_PALS_PET_NAME_MAX_LENGTH } from '../constants/pixel-pals.constants';

import type { PixelPet, ResolvedPixelPet, PixelPetDefinition, PixelPalsPetColorDefinition } from '../models/pixel-pals.models';

const MESSAGE_PLACEHOLDER_PATTERN = /\{name\}|\{sound\}/g;

export function isPixelPetId(value: unknown): value is PixelPetId {
  return typeof value === 'string' && (PIXEL_PALS_PET_IDS as readonly string[]).includes(value);
}

export function getPixelPetDefinition(type: PixelPetId): PixelPetDefinition {
  return PIXEL_PALS_PETS[type];
}

export function isPixelPalsColorOf(type: PixelPetId, color: string): boolean {
  return PIXEL_PALS_PETS[type].colors.some((definition: PixelPalsPetColorDefinition) => {
    return definition.value === color;
  });
}

export function getPixelPalsDefaultColor(type: PixelPetId): string {
  return PIXEL_PALS_PETS[type].colors[0].value;
}

export function getPixelPalsColorLabel(type: PixelPetId, color: string): string {
  const definition: PixelPalsPetColorDefinition | undefined = PIXEL_PALS_PETS[type].colors.find((item: PixelPalsPetColorDefinition) => {
    return item.value === color;
  });
  return definition?.label ?? color;
}

/**
 * A saved pet as Pixel Pals shows it: its kind's master list entry, with the person's color and nickname on top. A
 * color the kind no longer has falls back to its default color, and without a nickname it goes by the default name.
 */
export function getResolvedPixelPet(pet: PixelPet): ResolvedPixelPet {
  const definition: PixelPetDefinition = PIXEL_PALS_PETS[pet.petId];
  return {
    ...definition,
    id: pet.id,
    color: isPixelPalsColorOf(pet.petId, pet.color) ? pet.color : getPixelPalsDefaultColor(pet.petId),
    name: pet.nickName ?? definition.defaultName,
  };
}

export function getResolvedPixelPets(pets: readonly PixelPet[]): ResolvedPixelPet[] {
  return pets.map((pet: PixelPet) => {
    return getResolvedPixelPet(pet);
  });
}

/** e.g. "Bella, brown dog". Used in the delete dialog and as the tooltip of a pet. */
export function getPixelPalsPetDescription(pet: ResolvedPixelPet): string {
  if (pet.colors.length === 1) {
    return `${pet.name}, ${pet.label.toLowerCase()}`;
  }
  return `${pet.name}, ${getPixelPalsColorLabel(pet.petId, pet.color).toLowerCase()} ${pet.label.toLowerCase()}`;
}

/**
 * The name the Spawn dialog starts with: the kind's default name, or "Biscuit 2", "Biscuit 3"... when a pet in the
 * Pixel Pals already has it.
 */
export function getPixelPalsSuggestedName(type: PixelPetId, takenNames: readonly string[] = []): string {
  const defaultName: string = PIXEL_PALS_PETS[type].defaultName;
  if (!takenNames.includes(defaultName)) {
    return defaultName;
  }
  for (let count = 2; count < 100; count += 1) {
    const suffix = ` ${count}`;
    const name: string = `${defaultName.slice(0, PIXEL_PALS_PET_NAME_MAX_LENGTH - suffix.length)}${suffix}`;
    if (!takenNames.includes(name)) {
      return name;
    }
  }
  return defaultName;
}

/** Fills `{name}` and `{sound}` in a message, in one pass, so a name like `{sound}` is shown as typed. */
export function formatPixelPalsMessage(template: string, pet: Pick<ResolvedPixelPet, 'name'>, definition: PixelPetDefinition): string {
  return template.replaceAll(MESSAGE_PLACEHOLDER_PATTERN, (placeholder: string) => {
    return placeholder === '{name}' ? pet.name : definition.voice.sound;
  });
}
